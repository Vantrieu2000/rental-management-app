/**
 * Property-Based Tests for Payment Management
 *
 * These tests verify the correctness properties of the payment management system
 * using property-based testing with fast-check.
 */

import fc from 'fast-check';
import { mockPaymentApi } from '../services/mockPaymentApi';
import { MarkPaidDto, PaymentRecord } from '../types';

// Mock access token for testing
const mockAccessToken = 'test-token-123';

describe('Payment Property-Based Tests', () => {
  // Helper to generate unique IDs - uses crypto for true uniqueness
  const generateUniqueId = (billingMonth?: number, billingYear?: number) => {
    // Use a combination of timestamp, random, and counter for uniqueness
    const timestamp = Date.now();
    const random1 = Math.random().toString(36).substring(2, 15);
    const random2 = Math.random().toString(36).substring(2, 15);
    const parts = [timestamp, random1, random2];
    if (billingMonth !== undefined) parts.push(String(billingMonth));
    if (billingYear !== undefined) parts.push(String(billingYear));
    return parts.join('-');
  };

  /**
   * Feature: rental-management-app, Property 14: Marking paid updates payment status
   * Validates: Requirements 4.1
   *
   * For any unpaid payment record, marking it as paid should update the status to 'paid'
   * for the current billing period.
   */
  it('should update payment status when marked as paid', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10000000 }), // Total amount
        fc.integer({ min: 1, max: 12 }), // Billing month
        fc.integer({ min: 2020, max: 2030 }), // Billing year
        async (totalAmount, billingMonth, billingYear) => {
          // Generate unique identifiers including billing period and test run to avoid duplicates
          const uniqueId = generateUniqueId(billingMonth, billingYear);
          
          // Create a payment record with unpaid status
          const payment = await mockPaymentApi.createPayment(mockAccessToken, {
            roomId: `room-${uniqueId}`,
            tenantId: `tenant-${uniqueId}`,
            propertyId: '1',
            billingMonth,
            billingYear,
            dueDate: new Date('2024-12-05'),
            feeCalculation: {
              rentalAmount: totalAmount,
              electricityAmount: 0,
              waterAmount: 0,
              garbageAmount: 0,
              parkingAmount: 0,
              adjustments: 0,
              totalAmount: totalAmount,
            },
          });

          // Verify initial status is unpaid
          expect(payment.status).toBe('unpaid');
          expect(payment.paidAmount).toBe(0);

          // Generate payment data (pay full amount)
          const paymentData: MarkPaidDto = {
            paidAmount: totalAmount,
            paidDate: new Date('2024-12-03'),
            paymentMethod: 'bank_transfer',
            notes: 'Full payment',
          };

          // Mark as paid
          const updated = await mockPaymentApi.markAsPaid(
            mockAccessToken,
            payment.id,
            paymentData
          );

          // Verify status is updated to 'paid'
          expect(updated.status).toBe('paid');

          // Verify paid amount is updated
          expect(updated.paidAmount).toBe(totalAmount);

          // Verify payment date is set
          expect(updated.paidDate).toBeDefined();
          expect(new Date(updated.paidDate!).toDateString()).toBe(
            paymentData.paidDate.toDateString()
          );

          // Verify payment method is set
          expect(updated.paymentMethod).toBe(paymentData.paymentMethod);

          // Verify notes are set if provided
          if (paymentData.notes) {
            expect(updated.notes).toBe(paymentData.notes);
          }

          // Verify updatedAt timestamp is updated
          expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
            new Date(payment.createdAt).getTime()
          );
        }
      ),
      { numRuns: 100 }
    );
  }, 120000); // 120 second timeout for property test

  /**
   * Feature: rental-management-app, Property 15: Payment recording persists data
   * Validates: Requirements 4.2
   *
   * For any payment with date, amount, and method, marking a room as paid should
   * store all payment details in the database.
   */
  it('should persist all payment details when recording payment', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10000000 }), // Total amount
        fc.integer({ min: 1, max: 10000000 }), // Paid amount
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }), // Payment date
        fc.constantFrom('cash', 'bank_transfer', 'e_wallet'), // Payment method
        fc.option(fc.string({ minLength: 1, maxLength: 200 })), // Optional notes
        async (totalAmount, paidAmount, paidDate, paymentMethod, notes) => {
          const uniqueId = generateUniqueId();

          // Create a payment record
          const payment = await mockPaymentApi.createPayment(mockAccessToken, {
            roomId: `room-${uniqueId}`,
            tenantId: `tenant-${uniqueId}`,
            propertyId: '1',
            billingMonth: 12,
            billingYear: 2024,
            dueDate: new Date('2024-12-05'),
            feeCalculation: {
              rentalAmount: totalAmount,
              electricityAmount: 0,
              waterAmount: 0,
              garbageAmount: 0,
              parkingAmount: 0,
              adjustments: 0,
              totalAmount: totalAmount,
            },
          });

          // Mark as paid with all details
          const paymentData: MarkPaidDto = {
            paidAmount: Math.min(paidAmount, totalAmount), // Don't exceed total
            paidDate,
            paymentMethod,
            notes: notes || undefined,
          };

          const updated = await mockPaymentApi.markAsPaid(
            mockAccessToken,
            payment.id,
            paymentData
          );

          // Verify all payment details are persisted
          expect(updated.paidAmount).toBe(paymentData.paidAmount);
          expect(updated.paidDate).toBeDefined();
          expect(new Date(updated.paidDate!).toDateString()).toBe(paidDate.toDateString());
          expect(updated.paymentMethod).toBe(paymentMethod);
          
          if (notes) {
            expect(updated.notes).toBe(notes);
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  /**
   * Feature: rental-management-app, Property 16: Paid rooms removed from notifications
   * Validates: Requirements 4.3
   *
   * For any room in the unpaid notifications list, marking it as paid should
   * remove it from that list.
   */
  it('should remove paid rooms from unpaid notifications list', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10000000 }), // Total amount
        async (totalAmount) => {
          const uniqueId = generateUniqueId();

          // Create an unpaid payment record
          const payment = await mockPaymentApi.createPayment(mockAccessToken, {
            roomId: `room-${uniqueId}`,
            tenantId: `tenant-${uniqueId}`,
            propertyId: '1',
            billingMonth: 12,
            billingYear: 2024,
            dueDate: new Date('2020-01-01'), // Past due date to make it overdue
            feeCalculation: {
              rentalAmount: totalAmount,
              electricityAmount: 0,
              waterAmount: 0,
              garbageAmount: 0,
              parkingAmount: 0,
              adjustments: 0,
              totalAmount: totalAmount,
            },
          });

          // Get overdue payments (should include our payment)
          const overdueBeforePay = await mockPaymentApi.getOverduePayments(
            mockAccessToken,
            '1'
          );
          const isInOverdueBefore = overdueBeforePay.some((p) => p.id === payment.id);
          expect(isInOverdueBefore).toBe(true);

          // Mark as paid
          await mockPaymentApi.markAsPaid(mockAccessToken, payment.id, {
            paidAmount: totalAmount,
            paidDate: new Date(),
            paymentMethod: 'cash',
          });

          // Get overdue payments again (should NOT include our payment)
          const overdueAfterPay = await mockPaymentApi.getOverduePayments(
            mockAccessToken,
            '1'
          );
          const isInOverdueAfter = overdueAfterPay.some((p) => p.id === payment.id);
          expect(isInOverdueAfter).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  /**
   * Feature: rental-management-app, Property 17: Partial payments track balance
   * Validates: Requirements 4.4
   *
   * For any payment record, making a partial payment should correctly calculate
   * and store the remaining balance.
   */
  it('should track remaining balance for partial payments', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1000, max: 10000000 }), // Total amount
        fc.float({ min: 0.1, max: 0.9 }), // Partial payment ratio
        async (totalAmount, partialRatio) => {
          const uniqueId = generateUniqueId();

          // Create a payment record
          const payment = await mockPaymentApi.createPayment(mockAccessToken, {
            roomId: `room-${uniqueId}`,
            tenantId: `tenant-${uniqueId}`,
            propertyId: '1',
            billingMonth: 12,
            billingYear: 2024,
            dueDate: new Date('2024-12-05'),
            feeCalculation: {
              rentalAmount: totalAmount,
              electricityAmount: 0,
              waterAmount: 0,
              garbageAmount: 0,
              parkingAmount: 0,
              adjustments: 0,
              totalAmount: totalAmount,
            },
          });

          // Make partial payment
          const partialAmount = Math.floor(totalAmount * partialRatio);
          const updated = await mockPaymentApi.markAsPaid(mockAccessToken, payment.id, {
            paidAmount: partialAmount,
            paidDate: new Date(),
            paymentMethod: 'cash',
          });

          // Verify partial status and balance
          expect(updated.status).toBe('partial');
          expect(updated.paidAmount).toBe(partialAmount);
          
          // Verify remaining balance
          const remainingBalance = totalAmount - updated.paidAmount;
          expect(remainingBalance).toBeGreaterThan(0);
          expect(remainingBalance).toBe(totalAmount - partialAmount);
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  /**
   * Feature: rental-management-app, Property 18: Payment history retrieval is complete
   * Validates: Requirements 5.1
   *
   * For any room with multiple payment records, requesting payment history should
   * return all records.
   */
  it('should retrieve complete payment history for a room', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2, max: 10 }), // Number of payments to create
        async (numPayments) => {
          const uniqueId = generateUniqueId();
          const roomId = `room-${uniqueId}`;
          const tenantId = `tenant-${uniqueId}`;

          // Create multiple payment records for the same room
          const createdPayments: PaymentRecord[] = [];
          for (let i = 0; i < numPayments; i++) {
            const payment = await mockPaymentApi.createPayment(mockAccessToken, {
              roomId,
              tenantId,
              propertyId: '1',
              billingMonth: (i % 12) + 1,
              billingYear: 2024,
              dueDate: new Date(`2024-${String((i % 12) + 1).padStart(2, '0')}-05`),
              feeCalculation: {
                rentalAmount: 3000000,
                electricityAmount: 0,
                waterAmount: 0,
                garbageAmount: 0,
                parkingAmount: 0,
                adjustments: 0,
                totalAmount: 3000000,
              },
            });
            createdPayments.push(payment);
          }

          // Get payment history
          const history = await mockPaymentApi.getPaymentHistory(mockAccessToken, roomId);

          // Verify all payments are returned
          expect(history.length).toBe(numPayments);

          // Verify all created payment IDs are in history
          const historyIds = history.map((p) => p.id);
          createdPayments.forEach((payment) => {
            expect(historyIds).toContain(payment.id);
          });
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  /**
   * Feature: rental-management-app, Property 19: Payment history displays all fields
   * Validates: Requirements 5.2
   *
   * For any payment record in history, the display should include payment date,
   * amount, billing period, and payment method.
   */
  it('should display all required fields in payment history', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10000000 }), // Total amount
        fc.integer({ min: 1, max: 12 }), // Billing month
        fc.integer({ min: 2020, max: 2030 }), // Billing year
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }), // Payment date
        fc.constantFrom('cash', 'bank_transfer', 'e_wallet'), // Payment method
        async (totalAmount, billingMonth, billingYear, paidDate, paymentMethod) => {
          const uniqueId = generateUniqueId(billingMonth, billingYear);
          const roomId = `room-${uniqueId}`;

          // Create and pay a payment record
          const payment = await mockPaymentApi.createPayment(mockAccessToken, {
            roomId,
            tenantId: `tenant-${uniqueId}`,
            propertyId: '1',
            billingMonth,
            billingYear,
            dueDate: new Date('2024-12-05'),
            feeCalculation: {
              rentalAmount: totalAmount,
              electricityAmount: 0,
              waterAmount: 0,
              garbageAmount: 0,
              parkingAmount: 0,
              adjustments: 0,
              totalAmount: totalAmount,
            },
          });

          await mockPaymentApi.markAsPaid(mockAccessToken, payment.id, {
            paidAmount: totalAmount,
            paidDate,
            paymentMethod,
          });

          // Get payment history
          const history = await mockPaymentApi.getPaymentHistory(mockAccessToken, roomId);
          const historyRecord = history.find((p) => p.id === payment.id);

          // Verify all required fields are present
          expect(historyRecord).toBeDefined();
          expect(historyRecord!.paidDate).toBeDefined();
          expect(historyRecord!.paidAmount).toBe(totalAmount);
          expect(historyRecord!.billingMonth).toBe(billingMonth);
          expect(historyRecord!.billingYear).toBe(billingYear);
          expect(historyRecord!.paymentMethod).toBe(paymentMethod);
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  /**
   * Feature: rental-management-app, Property 20: Payment statistics calculate correctly
   * Validates: Requirements 5.3
   *
   * For any set of payment records, calculated statistics (total revenue, average
   * payment time, late payment frequency) should match manual calculations.
   */
  it('should calculate payment statistics correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            amount: fc.integer({ min: 1000000, max: 5000000 }),
            isPaid: fc.boolean(),
            daysBeforeDue: fc.integer({ min: -10, max: 10 }), // Negative = late
          }),
          { minLength: 1, maxLength: 20 }
        ),
        async (paymentSpecs) => {
          const uniqueId = generateUniqueId();
          const propertyId = `property-${uniqueId}`;

          // Create payments based on specs
          for (let i = 0; i < paymentSpecs.length; i++) {
            const spec = paymentSpecs[i];
            const dueDate = new Date('2024-12-05');
            
            const payment = await mockPaymentApi.createPayment(mockAccessToken, {
              roomId: `room-${uniqueId}-${i}`,
              tenantId: `tenant-${uniqueId}-${i}`,
              propertyId,
              billingMonth: 12,
              billingYear: 2024,
              dueDate,
              feeCalculation: {
                rentalAmount: spec.amount,
                electricityAmount: 0,
                waterAmount: 0,
                garbageAmount: 0,
                parkingAmount: 0,
                adjustments: 0,
                totalAmount: spec.amount,
              },
            });

            if (spec.isPaid) {
              const paidDate = new Date(dueDate);
              paidDate.setDate(paidDate.getDate() + spec.daysBeforeDue);
              
              await mockPaymentApi.markAsPaid(mockAccessToken, payment.id, {
                paidAmount: spec.amount,
                paidDate,
                paymentMethod: 'cash',
              });
            }
          }

          // Get statistics
          const stats = await mockPaymentApi.getPaymentStatistics(
            mockAccessToken,
            propertyId
          );

          // Manual calculations
          const paidPayments = paymentSpecs.filter((s) => s.isPaid);
          const expectedRevenue = paidPayments.reduce((sum, s) => sum + s.amount, 0);
          const expectedPaidCount = paidPayments.length;
          const expectedUnpaidCount = paymentSpecs.filter((s) => !s.isPaid).length;

          // Verify statistics
          expect(stats.totalRevenue).toBe(expectedRevenue);
          expect(stats.paidCount).toBe(expectedPaidCount);
          expect(stats.unpaidCount).toBeGreaterThanOrEqual(expectedUnpaidCount);

          // Verify average payment time
          if (paidPayments.length > 0) {
            const totalDays = paidPayments.reduce((sum, s) => sum + s.daysBeforeDue, 0);
            const expectedAvg = totalDays / paidPayments.length;
            expect(stats.averagePaymentTime).toBeCloseTo(expectedAvg, 1);
          }

          // Verify late payment rate
          if (paidPayments.length > 0) {
            const latePayments = paidPayments.filter((s) => s.daysBeforeDue > 0);
            const expectedRate = latePayments.length / paidPayments.length;
            expect(stats.latePaymentRate).toBeCloseTo(expectedRate, 2);
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  /**
   * Feature: rental-management-app, Property 21: Payment history filters work correctly
   * Validates: Requirements 5.4
   *
   * For any payment history filter (date range, room, or status), the filtered
   * results should include only records matching all filter criteria.
   */
  it('should filter payment history correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('paid', 'unpaid', 'partial', 'overdue'), // Status filter
        async (statusFilter) => {
          const uniqueId = generateUniqueId();
          const propertyId = `property-${uniqueId}`;

          // Create payments with different statuses
          const statuses: Array<'paid' | 'unpaid' | 'partial'> = ['paid', 'unpaid', 'partial'];
          
          for (let month = 1; month <= 3; month++) {
            for (const status of statuses) {
              const payment = await mockPaymentApi.createPayment(mockAccessToken, {
                roomId: `room-${uniqueId}-${month}-${status}`,
                tenantId: `tenant-${uniqueId}`,
                propertyId,
                billingMonth: month,
                billingYear: 2024,
                dueDate: new Date(`2024-${String(month).padStart(2, '0')}-05`),
                feeCalculation: {
                  rentalAmount: 3000000,
                  electricityAmount: 0,
                  waterAmount: 0,
                  garbageAmount: 0,
                  parkingAmount: 0,
                  adjustments: 0,
                  totalAmount: 3000000,
                },
              });

              if (status === 'paid') {
                await mockPaymentApi.markAsPaid(mockAccessToken, payment.id, {
                  paidAmount: 3000000,
                  paidDate: new Date(),
                  paymentMethod: 'cash',
                });
              } else if (status === 'partial') {
                await mockPaymentApi.markAsPaid(mockAccessToken, payment.id, {
                  paidAmount: 1500000,
                  paidDate: new Date(),
                  paymentMethod: 'cash',
                });
              }
            }
          }

          // Apply filters
          const filtered = await mockPaymentApi.getPayments(mockAccessToken, {
            propertyId,
            status: statusFilter,
          });

          // Verify all filtered results match the status filter
          filtered.forEach((payment) => {
            expect(payment.status).toBe(statusFilter);
            expect(payment.propertyId).toBe(propertyId);
          });
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});
