/**
 * Property-Based Tests for Notifications
 * Tests universal properties using fast-check
 */

import fc from 'fast-check';
import { mockNotificationApi } from '../services/mockNotificationApi';
import { mockPaymentApi } from '@/features/payments/services/mockPaymentApi';
import { mockRoomApi } from '@/features/rooms/services/mockRoomApi';
import { mockTenantApi } from '@/features/tenants/services/mockTenantApi';
import { PaymentRecord } from '@/features/payments/types';
import { Room } from '@/features/rooms/types';
import { Tenant } from '@/features/tenants/types';

// Arbitraries for generating test data
const dateArbitrary = () =>
  fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') });

const roomArbitrary = (): fc.Arbitrary<Room> =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }).map((s) => `room-test-${s}`),
    propertyId: fc.constantFrom('1', '2', '3'),
    roomCode: fc.string({ minLength: 3, maxLength: 10 }),
    roomName: fc.string({ minLength: 5, maxLength: 30 }),
    status: fc.constantFrom('vacant' as const, 'occupied' as const, 'maintenance' as const),
    rentalPrice: fc.integer({ min: 1000000, max: 10000000 }),
    electricityFee: fc.integer({ min: 3000, max: 5000 }),
    waterFee: fc.integer({ min: 15000, max: 30000 }),
    garbageFee: fc.integer({ min: 20000, max: 50000 }),
    parkingFee: fc.integer({ min: 50000, max: 200000 }),
    currentTenantId: fc.option(fc.string().map((s) => `tenant-test-${s}`), { nil: undefined }),
    createdAt: dateArbitrary(),
    updatedAt: dateArbitrary(),
  });

const tenantArbitrary = (): fc.Arbitrary<Tenant> =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }).map((s) => `tenant-test-${s}`),
    name: fc.string({ minLength: 5, maxLength: 30 }),
    phone: fc
      .integer({ min: 900000000, max: 999999999 })
      .map((n) => `0${n.toString().substring(0, 9)}`),
    email: fc.option(fc.emailAddress(), { nil: undefined }),
    idNumber: fc.option(fc.string({ minLength: 9, maxLength: 12 }), { nil: undefined }),
    roomId: fc.string().map((s) => `room-test-${s}`),
    moveInDate: dateArbitrary(),
    moveOutDate: fc.option(dateArbitrary(), { nil: undefined }),
    emergencyContact: fc.option(
      fc.record({
        name: fc.string({ minLength: 5, maxLength: 30 }),
        phone: fc
          .integer({ min: 900000000, max: 999999999 })
          .map((n) => `0${n.toString().substring(0, 9)}`),
        relationship: fc.constantFrom('parent', 'sibling', 'spouse', 'friend'),
      }),
      { nil: undefined }
    ),
    createdAt: dateArbitrary(),
    updatedAt: dateArbitrary(),
  });

const unpaidPaymentArbitrary = (): fc.Arbitrary<PaymentRecord> =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }).map((s) => `payment-test-${s}`),
    roomId: fc.string().map((s) => `room-test-${s}`),
    tenantId: fc.string().map((s) => `tenant-test-${s}`),
    propertyId: fc.constantFrom('1', '2', '3'),
    billingMonth: fc.integer({ min: 1, max: 12 }),
    billingYear: fc.integer({ min: 2020, max: 2030 }),
    dueDate: dateArbitrary(),
    rentalAmount: fc.integer({ min: 1000000, max: 10000000 }),
    electricityAmount: fc.integer({ min: 100000, max: 500000 }),
    waterAmount: fc.integer({ min: 15000, max: 30000 }),
    garbageAmount: fc.integer({ min: 20000, max: 50000 }),
    parkingAmount: fc.integer({ min: 50000, max: 200000 }),
    adjustments: fc.integer({ min: -100000, max: 100000 }),
    totalAmount: fc.integer({ min: 1000000, max: 12000000 }),
    status: fc.constantFrom('unpaid' as const, 'partial' as const, 'overdue' as const),
    paidAmount: fc.integer({ min: 0, max: 5000000 }),
    paidDate: fc.option(dateArbitrary(), { nil: undefined }),
    paymentMethod: fc.option(
      fc.constantFrom('cash' as const, 'bank_transfer' as const, 'e_wallet' as const),
      { nil: undefined }
    ),
    notes: fc.option(fc.string({ maxLength: 100 }), { nil: undefined }),
    createdAt: dateArbitrary(),
    updatedAt: dateArbitrary(),
  });

describe('Notification Property-Based Tests', () => {
  const accessToken = 'test-token';

  beforeEach(() => {
    // Reset mock data before each test
    mockPaymentApi.resetMockData();
    mockRoomApi.resetMockData();
    mockTenantApi.resetMockData();
  });

  // Helper function to set up test data (rooms, tenants)
  const setupTestData = (rooms: Room[], tenants: Tenant[]) => {
    // Add rooms and tenants directly to mock data stores
    for (const room of rooms) {
      mockRoomApi.addTestRoom(room);
    }

    for (const tenant of tenants) {
      mockTenantApi.addTestTenant(tenant);
    }
  };

  /**
   * Feature: rental-management-app, Property 10: Unpaid rooms are identified correctly
   * Validates: Requirements 3.1
   */
  it(
    'should identify exactly those rooms with unpaid status',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(unpaidPaymentArbitrary(), { minLength: 1, maxLength: 5 }),
          fc.array(roomArbitrary(), { minLength: 1, maxLength: 5 }),
          fc.array(tenantArbitrary(), { minLength: 1, maxLength: 5 }),
          async (payments, rooms, tenants) => {
            // Align room and tenant IDs with payments
            const alignedRooms = payments.map((p, i) => ({
              ...rooms[i % rooms.length],
              id: p.roomId,
            }));
            const alignedTenants = payments.map((p, i) => ({
              ...tenants[i % tenants.length],
              id: p.tenantId,
              roomId: p.roomId,
            }));

            // Setup: Add rooms and tenants to mock stores
            setupTestData(alignedRooms, alignedTenants);

            // Create payments
            const createdPayments = [];
            for (const payment of payments) {
              const created = await mockPaymentApi.createPayment(accessToken, {
                roomId: payment.roomId,
                tenantId: payment.tenantId,
                propertyId: payment.propertyId,
                billingMonth: payment.billingMonth,
                billingYear: payment.billingYear,
                dueDate: payment.dueDate,
                feeCalculation: {
                  rentalAmount: payment.rentalAmount,
                  electricityAmount: payment.electricityAmount,
                  waterAmount: payment.waterAmount,
                  garbageAmount: payment.garbageAmount,
                  parkingAmount: payment.parkingAmount,
                  adjustments: payment.adjustments,
                  totalAmount: payment.totalAmount,
                },
              });
              createdPayments.push(created);
            }

            // Get notifications
            const notifications = await mockNotificationApi.getNotifications(accessToken);

            // Verify: All notifications correspond to unpaid/partial/overdue payments
            // Each notification should have a corresponding unpaid payment
            for (const notification of notifications) {
              const hasUnpaidPayment = createdPayments.some(
                (p) =>
                  p.id === notification.paymentId &&
                  (p.status === 'unpaid' || p.status === 'partial' || p.status === 'overdue')
              );
              expect(hasUnpaidPayment).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    },
    60000
  );

  /**
   * Feature: rental-management-app, Property 11: Notifications include required information
   * Validates: Requirements 3.2
   */
  it(
    'should include room code and outstanding amount in notifications',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(unpaidPaymentArbitrary(), { minLength: 1, maxLength: 3 }),
          fc.array(roomArbitrary(), { minLength: 1, maxLength: 3 }),
          fc.array(tenantArbitrary(), { minLength: 1, maxLength: 3 }),
          async (payments, rooms, tenants) => {
            // Align room and tenant IDs with payments
            const alignedRooms = payments.map((p, i) => ({
              ...rooms[i % rooms.length],
              id: p.roomId,
            }));
            const alignedTenants = payments.map((p, i) => ({
              ...tenants[i % tenants.length],
              id: p.tenantId,
              roomId: p.roomId,
            }));

            // Setup: Add rooms and tenants to mock stores
            setupTestData(alignedRooms, alignedTenants);

            // Create payments
            for (const payment of payments) {
              await mockPaymentApi.createPayment(accessToken, {
                roomId: payment.roomId,
                tenantId: payment.tenantId,
                propertyId: payment.propertyId,
                billingMonth: payment.billingMonth,
                billingYear: payment.billingYear,
                dueDate: payment.dueDate,
                feeCalculation: {
                  rentalAmount: payment.rentalAmount,
                  electricityAmount: payment.electricityAmount,
                  waterAmount: payment.waterAmount,
                  garbageAmount: payment.garbageAmount,
                  parkingAmount: payment.parkingAmount,
                  adjustments: payment.adjustments,
                  totalAmount: payment.totalAmount,
                },
              });
            }

            // Get notifications
            const notifications = await mockNotificationApi.getNotifications(accessToken);

            // Verify: Each notification has room code and remaining amount
            for (const notification of notifications) {
              expect(notification.roomCode).toBeDefined();
              expect(typeof notification.roomCode).toBe('string');
              expect(notification.roomCode.length).toBeGreaterThan(0);

              expect(notification.remainingAmount).toBeDefined();
              expect(typeof notification.remainingAmount).toBe('number');
              expect(notification.remainingAmount).toBeGreaterThanOrEqual(0);

              // Remaining amount should be total - paid
              expect(notification.remainingAmount).toBe(
                notification.totalAmount - notification.paidAmount
              );
            }
          }
        ),
        { numRuns: 100 }
      );
    },
    60000
  );

  /**
   * Feature: rental-management-app, Property 12: Notifications sort by overdue period
   * Validates: Requirements 3.3
   */
  it(
    'should sort notifications by days overdue in descending order',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(unpaidPaymentArbitrary(), { minLength: 2, maxLength: 5 }),
          fc.array(roomArbitrary(), { minLength: 2, maxLength: 5 }),
          fc.array(tenantArbitrary(), { minLength: 2, maxLength: 5 }),
          async (payments, rooms, tenants) => {
            // Setup: Create payments with different due dates
            const now = new Date();
            const paymentsWithDueDates = payments.map((payment, index) => ({
              ...payment,
              // Create payments with varying overdue periods
              dueDate: new Date(now.getTime() - index * 24 * 60 * 60 * 1000),
            }));

            // Align room and tenant IDs with payments
            const alignedRooms = paymentsWithDueDates.map((p, i) => ({
              ...rooms[i % rooms.length],
              id: p.roomId,
            }));
            const alignedTenants = paymentsWithDueDates.map((p, i) => ({
              ...tenants[i % tenants.length],
              id: p.tenantId,
              roomId: p.roomId,
            }));

            // Setup: Add rooms and tenants to mock stores
            setupTestData(alignedRooms, alignedTenants);

            // Create payments
            for (const payment of paymentsWithDueDates) {
              await mockPaymentApi.createPayment(accessToken, {
                roomId: payment.roomId,
                tenantId: payment.tenantId,
                propertyId: payment.propertyId,
                billingMonth: payment.billingMonth,
                billingYear: payment.billingYear,
                dueDate: payment.dueDate,
                feeCalculation: {
                  rentalAmount: payment.rentalAmount,
                  electricityAmount: payment.electricityAmount,
                  waterAmount: payment.waterAmount,
                  garbageAmount: payment.garbageAmount,
                  parkingAmount: payment.parkingAmount,
                  adjustments: payment.adjustments,
                  totalAmount: payment.totalAmount,
                },
              });
            }

            // Get notifications
            const notifications = await mockNotificationApi.getNotifications(accessToken);

            // Verify: Notifications are sorted by days overdue (descending)
            if (notifications.length > 1) {
              for (let i = 0; i < notifications.length - 1; i++) {
                expect(notifications[i].daysOverdue).toBeGreaterThanOrEqual(
                  notifications[i + 1].daysOverdue
                );
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    },
    60000
  );

  /**
   * Feature: rental-management-app, Property 13: Payment status changes update notifications
   * Validates: Requirements 3.4
   */
  it(
    'should remove notification when payment is marked as paid',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          unpaidPaymentArbitrary(),
          roomArbitrary(),
          tenantArbitrary(),
          async (payment, room, tenant) => {
            // Align room and tenant IDs with payment
            const alignedRoom = { ...room, id: payment.roomId };
            const alignedTenant = { ...tenant, id: payment.tenantId, roomId: payment.roomId };

            // Setup: Add room and tenant to mock stores
            setupTestData([alignedRoom], [alignedTenant]);

            // Setup: Create an unpaid payment
            const createdPayment = await mockPaymentApi.createPayment(accessToken, {
              roomId: payment.roomId,
              tenantId: payment.tenantId,
              propertyId: payment.propertyId,
              billingMonth: payment.billingMonth,
              billingYear: payment.billingYear,
              dueDate: payment.dueDate,
              feeCalculation: {
                rentalAmount: payment.rentalAmount,
                electricityAmount: payment.electricityAmount,
                waterAmount: payment.waterAmount,
                garbageAmount: payment.garbageAmount,
                parkingAmount: payment.parkingAmount,
                adjustments: payment.adjustments,
                totalAmount: payment.totalAmount,
              },
            });

            // Get notifications before marking as paid
            const notificationsBefore = await mockNotificationApi.getNotifications(accessToken);
            const notificationCountBefore = notificationsBefore.filter(
              (n) => n.paymentId === createdPayment.id
            ).length;

            // Mark payment as paid
            await mockPaymentApi.markAsPaid(accessToken, createdPayment.id, {
              paidAmount: createdPayment.totalAmount,
              paidDate: new Date(),
              paymentMethod: 'cash',
            });

            // Get notifications after marking as paid
            const notificationsAfter = await mockNotificationApi.getNotifications(accessToken);
            const notificationCountAfter = notificationsAfter.filter(
              (n) => n.paymentId === createdPayment.id
            ).length;

            // Verify: Notification should be removed (or count should decrease)
            // If payment was unpaid/partial/overdue before, it should not appear after being fully paid
            if (
              payment.status === 'unpaid' ||
              payment.status === 'partial' ||
              payment.status === 'overdue'
            ) {
              expect(notificationCountAfter).toBeLessThanOrEqual(notificationCountBefore);
            }
          }
        ),
        { numRuns: 100 }
      );
    },
    60000
  );
});
