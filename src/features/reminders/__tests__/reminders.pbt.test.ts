/**
 * Property-Based Tests for Reminder System
 * Feature: rental-management-app
 */

import fc from 'fast-check';
import { addDays, differenceInDays, isBefore } from 'date-fns';
import { reminderScheduler } from '../services/reminderScheduler';
import { mockReminderApi } from '../services/mockReminderApi';
import { PaymentRecord } from '../../payments/types';
import { Reminder, ReminderLog } from '../types';

// Arbitraries for generating test data
const paymentRecordArbitrary = (): fc.Arbitrary<PaymentRecord> =>
  fc.record({
    id: fc.string({ minLength: 1 }),
    roomId: fc.string({ minLength: 1 }),
    tenantId: fc.string({ minLength: 1 }),
    propertyId: fc.string({ minLength: 1 }),
    billingMonth: fc.integer({ min: 1, max: 12 }),
    billingYear: fc.integer({ min: 2024, max: 2030 }),
    dueDate: fc.date({ min: addDays(new Date(), 31), max: addDays(new Date(), 365) }), // At least 31 days in future
    rentalAmount: fc.integer({ min: 1000000, max: 10000000 }),
    electricityAmount: fc.integer({ min: 0, max: 500000 }),
    waterAmount: fc.integer({ min: 0, max: 200000 }),
    garbageAmount: fc.integer({ min: 0, max: 100000 }),
    parkingAmount: fc.integer({ min: 0, max: 300000 }),
    adjustments: fc.integer({ min: -500000, max: 500000 }),
    totalAmount: fc.integer({ min: 1000000, max: 15000000 }),
    status: fc.constantFrom('unpaid', 'partial', 'paid', 'overdue') as fc.Arbitrary<
      'unpaid' | 'partial' | 'paid' | 'overdue'
    >,
    paidAmount: fc.integer({ min: 0, max: 15000000 }),
    createdAt: fc.date(),
    updatedAt: fc.date(),
  });

describe('Reminder System Property-Based Tests', () => {
  beforeEach(() => {
    mockReminderApi.reset();
  });

  /**
   * Feature: rental-management-app, Property 48: Reminders fire at correct time
   * Validates: Requirements 14.1
   */
  describe('Property 48: Reminders fire at correct time', () => {
    it('should schedule reminders 3 days before due date', async () => {
      await fc.assert(
        fc.asyncProperty(paymentRecordArbitrary(), async (payment) => {
          // Precondition: ensure due date is valid
          fc.pre(!isNaN(new Date(payment.dueDate).getTime()));
          
          const reminder = await reminderScheduler.scheduleDueDateReminder(payment);

          // Calculate expected scheduled date (3 days before due date)
          const expectedDate = addDays(new Date(payment.dueDate), -3);
          const actualDate = new Date(reminder.scheduledDate);

          // Check that the reminder is scheduled 3 days before
          const daysDifference = differenceInDays(
            new Date(payment.dueDate),
            actualDate
          );

          expect(daysDifference).toBe(3);
          expect(reminder.type).toBe('due_date');
          expect(reminder.status).toBe('scheduled');
          expect(reminder.paymentId).toBe(payment.id);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly identify when reminders should fire', async () => {
      await fc.assert(
        fc.asyncProperty(
          paymentRecordArbitrary(),
          async (payment) => {
            const reminder = await reminderScheduler.scheduleDueDateReminder(payment);

            // The reminder should not fire immediately since it's scheduled for the future
            const shouldFireNow = reminderScheduler.shouldFireReminder(reminder);
            expect(shouldFireNow).toBe(false);

            // Verify the reminder is scheduled and in the future
            expect(reminder.status).toBe('scheduled');
            expect(new Date(reminder.scheduledDate).getTime()).toBeGreaterThan(
              new Date().getTime()
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: rental-management-app, Property 49: Custom reminder intervals work
   * Validates: Requirements 14.2
   */
  describe('Property 49: Custom reminder intervals work', () => {
    it('should schedule reminders at custom intervals before due date', async () => {
      await fc.assert(
        fc.asyncProperty(
          paymentRecordArbitrary(),
          fc.integer({ min: 1, max: 30 }),
          async (payment, daysBefore) => {
            const reminder = await reminderScheduler.scheduleCustomReminder(
              payment,
              daysBefore
            );

            // Calculate expected scheduled date
            const expectedDate = addDays(new Date(payment.dueDate), -daysBefore);
            const actualDate = new Date(reminder.scheduledDate);

            // Check that the reminder is scheduled at the custom interval
            const daysDifference = differenceInDays(
              new Date(payment.dueDate),
              actualDate
            );

            expect(daysDifference).toBe(daysBefore);
            expect(reminder.type).toBe('custom');
            expect(reminder.status).toBe('scheduled');
            expect(reminder.paymentId).toBe(payment.id);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle various custom interval configurations', async () => {
      await fc.assert(
        fc.asyncProperty(
          paymentRecordArbitrary(),
          fc.array(fc.integer({ min: 1, max: 30 }), { minLength: 1, maxLength: 5 }),
          async (payment, intervals) => {
            const reminders = await Promise.all(
              intervals.map((interval) =>
                reminderScheduler.scheduleCustomReminder(payment, interval)
              )
            );

            // All reminders should be for the same payment
            reminders.forEach((reminder) => {
              expect(reminder.paymentId).toBe(payment.id);
              expect(reminder.type).toBe('custom');
              expect(reminder.status).toBe('scheduled');
            });

            // Each reminder should have the correct interval
            reminders.forEach((reminder, index) => {
              const daysDifference = differenceInDays(
                new Date(payment.dueDate),
                new Date(reminder.scheduledDate)
              );
              expect(daysDifference).toBe(intervals[index]);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: rental-management-app, Property 50: Reminders are logged
   * Validates: Requirements 14.3
   */
  describe('Property 50: Reminders are logged', () => {
    it('should create a log entry when a reminder is logged', async () => {
      await fc.assert(
        fc.asyncProperty(
          paymentRecordArbitrary(),
          fc.string({ minLength: 1 }),
          fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          async (payment, recipientId, notificationId) => {
            const reminder = await reminderScheduler.scheduleDueDateReminder(payment);

            const log = await reminderScheduler.logReminder(
              reminder,
              recipientId,
              notificationId
            );

            // Verify log contains all required fields
            expect(log.id).toBeDefined();
            expect(log.reminderId).toBe(reminder.id);
            expect(log.paymentId).toBe(reminder.paymentId);
            expect(log.roomId).toBe(reminder.roomId);
            expect(log.recipientId).toBe(recipientId);
            expect(log.sentAt).toBeInstanceOf(Date);
            expect(log.delivered).toBe(true);
            expect(log.createdAt).toBeInstanceOf(Date);

            if (notificationId) {
              expect(log.notificationId).toBe(notificationId);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain log history for multiple reminder sends', async () => {
      await fc.assert(
        fc.asyncProperty(
          paymentRecordArbitrary(),
          fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
          async (payment, recipientIds) => {
            const reminder = await reminderScheduler.scheduleDueDateReminder(payment);

            const logs = await Promise.all(
              recipientIds.map((recipientId) =>
                reminderScheduler.logReminder(reminder, recipientId)
              )
            );

            // All logs should be for the same reminder
            logs.forEach((log, index) => {
              expect(log.reminderId).toBe(reminder.id);
              expect(log.recipientId).toBe(recipientIds[index]);
              expect(log.delivered).toBe(true);
            });

            // Each log should have a unique ID
            const logIds = logs.map((log) => log.id);
            const uniqueIds = new Set(logIds);
            expect(uniqueIds.size).toBe(logs.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: rental-management-app, Property 51: Recurring reminders repeat correctly
   * Validates: Requirements 14.4
   */
  describe('Property 51: Recurring reminders repeat correctly', () => {
    it('should schedule recurring reminders at specified intervals', async () => {
      await fc.assert(
        fc.asyncProperty(
          paymentRecordArbitrary(),
          fc.integer({ min: 1, max: 30 }),
          async (payment, intervalDays) => {
            const reminder = await reminderScheduler.scheduleRecurringReminder(
              payment,
              intervalDays
            );

            // Verify reminder properties
            expect(reminder.type).toBe('recurring');
            expect(reminder.intervalDays).toBe(intervalDays);
            expect(reminder.status).toBe('scheduled');
            expect(reminder.paymentId).toBe(payment.id);

            // Verify scheduled date is in the future
            const now = new Date();
            const scheduledDate = new Date(reminder.scheduledDate);
            expect(scheduledDate.getTime()).toBeGreaterThan(now.getTime());

            // Verify interval is correct
            const daysDifference = differenceInDays(scheduledDate, now);
            expect(daysDifference).toBeGreaterThanOrEqual(intervalDays - 1);
            expect(daysDifference).toBeLessThanOrEqual(intervalDays + 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain interval information for recurring reminders', async () => {
      await fc.assert(
        fc.asyncProperty(
          paymentRecordArbitrary(),
          fc.array(fc.integer({ min: 1, max: 30 }), { minLength: 1, maxLength: 5 }),
          async (payment, intervals) => {
            const reminders = await Promise.all(
              intervals.map((interval) =>
                reminderScheduler.scheduleRecurringReminder(payment, interval)
              )
            );

            // All reminders should be recurring type
            reminders.forEach((reminder, index) => {
              expect(reminder.type).toBe('recurring');
              expect(reminder.intervalDays).toBe(intervals[index]);
              expect(reminder.status).toBe('scheduled');
              expect(reminder.paymentId).toBe(payment.id);
            });

            // Each reminder should have a unique ID
            const reminderIds = reminders.map((r) => r.id);
            const uniqueIds = new Set(reminderIds);
            expect(uniqueIds.size).toBe(reminders.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle recurring reminders for overdue payments', async () => {
      await fc.assert(
        fc.asyncProperty(
          paymentRecordArbitrary(),
          fc.integer({ min: 7, max: 30 }),
          async (payment, intervalDays) => {
            // Simulate overdue payment
            const overduePayment: PaymentRecord = {
              ...payment,
              status: 'overdue',
              dueDate: addDays(new Date(), -10), // 10 days overdue
            };

            const reminder = await reminderScheduler.scheduleRecurringReminder(
              overduePayment,
              intervalDays
            );

            // Verify reminder is scheduled for future
            const now = new Date();
            const scheduledDate = new Date(reminder.scheduledDate);
            expect(scheduledDate.getTime()).toBeGreaterThan(now.getTime());

            // Verify it's a recurring reminder
            expect(reminder.type).toBe('recurring');
            expect(reminder.intervalDays).toBe(intervalDays);
            expect(reminder.paymentId).toBe(overduePayment.id);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
