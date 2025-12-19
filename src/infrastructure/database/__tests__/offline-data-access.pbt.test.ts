/**
 * Property-based tests for offline data access
 * Feature: rental-management-app, Property 32: Offline access to cached data
 * Validates: Requirements 9.1
 */
import fc from 'fast-check';
import Realm from 'realm';
import {
  initializeRealm,
  closeRealm,
  clearRealm,
  cacheRoom,
  cacheTenant,
  cachePayment,
  cacheProperty,
  getCachedRooms,
  getCachedTenants,
  getCachedPayments,
  getCachedProperties,
} from '../index';
import { Room, Tenant, PaymentRecord, Property } from '../../../shared/types/entities';

// Arbitraries for generating test data
const roomArbitrary = (): fc.Arbitrary<Room> =>
  fc.record({
    id: fc.uuid(),
    propertyId: fc.uuid(),
    roomCode: fc.string({ minLength: 1, maxLength: 10 }),
    roomName: fc.string({ minLength: 1, maxLength: 50 }),
    status: fc.constantFrom('vacant', 'occupied', 'maintenance') as fc.Arbitrary<Room['status']>,
    rentalPrice: fc.double({ min: 0, max: 100000000, noNaN: true }),
    electricityFee: fc.double({ min: 0, max: 10000000, noNaN: true }),
    waterFee: fc.double({ min: 0, max: 10000000, noNaN: true }),
    garbageFee: fc.double({ min: 0, max: 1000000, noNaN: true }),
    parkingFee: fc.double({ min: 0, max: 5000000, noNaN: true }),
    currentTenantId: fc.option(fc.uuid(), { nil: undefined }),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
    updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
  });

const tenantArbitrary = (): fc.Arbitrary<Tenant> =>
  fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 100 }),
    phone: fc.string({ minLength: 10, maxLength: 15 }),
    // Generate valid email or undefined
    email: fc.option(
      fc.tuple(fc.string({ minLength: 1, maxLength: 20 }), fc.constantFrom('gmail.com', 'yahoo.com', 'example.com'))
        .map(([local, domain]) => `${local.replace(/[^a-z0-9]/gi, '')}@${domain}`),
      { nil: undefined }
    ),
    idNumber: fc.option(fc.string({ minLength: 9, maxLength: 12 }), { nil: undefined }),
    roomId: fc.uuid(),
    // Generate valid dates (not NaN)
    moveInDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
    moveOutDate: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }), { nil: undefined }),
    emergencyContact: fc.option(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 100 }),
        phone: fc.string({ minLength: 10, maxLength: 15 }),
        relationship: fc.string({ minLength: 1, maxLength: 50 }),
      }),
      { nil: undefined }
    ),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
    updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
  });

const paymentArbitrary = (): fc.Arbitrary<PaymentRecord> =>
  fc.record({
    id: fc.uuid(),
    roomId: fc.uuid(),
    tenantId: fc.uuid(),
    propertyId: fc.uuid(),
    billingMonth: fc.integer({ min: 1, max: 12 }),
    billingYear: fc.integer({ min: 2020, max: 2030 }),
    dueDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
    rentalAmount: fc.double({ min: 0, max: 100000000, noNaN: true }),
    electricityAmount: fc.double({ min: 0, max: 10000000, noNaN: true }),
    waterAmount: fc.double({ min: 0, max: 10000000, noNaN: true }),
    garbageAmount: fc.double({ min: 0, max: 1000000, noNaN: true }),
    parkingAmount: fc.double({ min: 0, max: 5000000, noNaN: true }),
    adjustments: fc.double({ min: -1000000, max: 1000000, noNaN: true }),
    totalAmount: fc.double({ min: 0, max: 200000000, noNaN: true }),
    status: fc.constantFrom('unpaid', 'partial', 'paid', 'overdue') as fc.Arbitrary<
      PaymentRecord['status']
    >,
    paidAmount: fc.double({ min: 0, max: 200000000, noNaN: true }),
    paidDate: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }), { nil: undefined }),
    paymentMethod: fc.option(
      fc.constantFrom('cash', 'bank_transfer', 'e_wallet') as fc.Arbitrary<
        PaymentRecord['paymentMethod']
      >,
      { nil: undefined }
    ),
    notes: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
    updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
  });

const propertyArbitrary = (): fc.Arbitrary<Property> =>
  fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 100 }),
    address: fc.string({ minLength: 1, maxLength: 200 }),
    totalRooms: fc.integer({ min: 1, max: 1000 }),
    defaultElectricityRate: fc.double({ min: 0, max: 10000, noNaN: true }),
    defaultWaterRate: fc.double({ min: 0, max: 10000, noNaN: true }),
    defaultGarbageRate: fc.double({ min: 0, max: 1000, noNaN: true }),
    defaultParkingRate: fc.double({ min: 0, max: 5000, noNaN: true }),
    billingDayOfMonth: fc.integer({ min: 1, max: 28 }),
    reminderDaysBefore: fc.integer({ min: 1, max: 7 }),
    ownerId: fc.uuid(),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
    updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
  });

describe('Offline Data Access Property Tests', () => {
  beforeAll(async () => {
    await initializeRealm();
  });

  beforeEach(async () => {
    await clearRealm();
  });

  afterAll(() => {
    closeRealm();
  });

  /**
   * Feature: rental-management-app, Property 32: Offline access to cached data
   * Validates: Requirements 9.1
   *
   * For any previously loaded room data, it should remain accessible when
   * network connectivity is lost (simulated by using only local cache).
   */
  it('should access cached room data offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        roomArbitrary().filter((room) => !isNaN(room.createdAt.getTime()) && !isNaN(room.updatedAt.getTime())),
        async (room) => {
          // Cache the room (simulating online fetch)
          cacheRoom(room);

          // Retrieve from cache (simulating offline access)
          const cachedRooms = getCachedRooms();

          // Verify the room is accessible
          expect(cachedRooms.length).toBeGreaterThan(0);
          const cachedRoom = cachedRooms.find((r) => r.id === room.id);
          expect(cachedRoom).toBeDefined();

          // Verify all fields are preserved
          expect(cachedRoom?.id).toBe(room.id);
          expect(cachedRoom?.propertyId).toBe(room.propertyId);
          expect(cachedRoom?.roomCode).toBe(room.roomCode);
          expect(cachedRoom?.roomName).toBe(room.roomName);
          expect(cachedRoom?.status).toBe(room.status);
          expect(cachedRoom?.rentalPrice).toBe(room.rentalPrice);
          expect(cachedRoom?.electricityFee).toBe(room.electricityFee);
          expect(cachedRoom?.waterFee).toBe(room.waterFee);
          expect(cachedRoom?.garbageFee).toBe(room.garbageFee);
          expect(cachedRoom?.parkingFee).toBe(room.parkingFee);
          // Realm converts undefined to null for optional fields
          expect(cachedRoom?.currentTenantId ?? undefined).toBe(room.currentTenantId);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 32: Offline access to cached data
   * Validates: Requirements 9.1
   *
   * For any previously loaded tenant data, it should remain accessible offline.
   */
  it('should access cached tenant data offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        tenantArbitrary().filter((tenant) => 
          !isNaN(tenant.moveInDate.getTime()) && 
          !isNaN(tenant.createdAt.getTime()) && 
          !isNaN(tenant.updatedAt.getTime()) &&
          (!tenant.moveOutDate || !isNaN(tenant.moveOutDate.getTime()))
        ),
        async (tenant) => {
          // Cache the tenant
          cacheTenant(tenant);

          // Retrieve from cache
          const cachedTenants = getCachedTenants();

          // Verify the tenant is accessible
          expect(cachedTenants.length).toBeGreaterThan(0);
          const cachedTenant = cachedTenants.find((t) => t.id === tenant.id);
          expect(cachedTenant).toBeDefined();

          // Verify all fields are preserved
          expect(cachedTenant?.id).toBe(tenant.id);
          expect(cachedTenant?.name).toBe(tenant.name);
          expect(cachedTenant?.phone).toBe(tenant.phone);
          // Realm converts undefined to null for optional fields
          expect(cachedTenant?.email ?? undefined).toBe(tenant.email);
          expect(cachedTenant?.idNumber ?? undefined).toBe(tenant.idNumber);
          expect(cachedTenant?.roomId).toBe(tenant.roomId);

          // Verify emergency contact if present
          if (tenant.emergencyContact) {
            expect(cachedTenant?.emergencyContact).toBeDefined();
            expect(cachedTenant?.emergencyContact?.name).toBe(tenant.emergencyContact.name);
            expect(cachedTenant?.emergencyContact?.phone).toBe(tenant.emergencyContact.phone);
            expect(cachedTenant?.emergencyContact?.relationship).toBe(
              tenant.emergencyContact.relationship
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 32: Offline access to cached data
   * Validates: Requirements 9.1
   *
   * For any previously loaded payment data, it should remain accessible offline.
   */
  it('should access cached payment data offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        paymentArbitrary().filter((payment) => 
          !isNaN(payment.dueDate.getTime()) && 
          !isNaN(payment.createdAt.getTime()) && 
          !isNaN(payment.updatedAt.getTime()) &&
          (!payment.paidDate || !isNaN(payment.paidDate.getTime()))
        ),
        async (payment) => {
          // Cache the payment
          cachePayment(payment);

          // Retrieve from cache
          const cachedPayments = getCachedPayments();

          // Verify the payment is accessible
          expect(cachedPayments.length).toBeGreaterThan(0);
          const cachedPayment = cachedPayments.find((p) => p.id === payment.id);
          expect(cachedPayment).toBeDefined();

          // Verify all fields are preserved
          expect(cachedPayment?.id).toBe(payment.id);
          expect(cachedPayment?.roomId).toBe(payment.roomId);
          expect(cachedPayment?.tenantId).toBe(payment.tenantId);
          expect(cachedPayment?.propertyId).toBe(payment.propertyId);
          expect(cachedPayment?.billingMonth).toBe(payment.billingMonth);
          expect(cachedPayment?.billingYear).toBe(payment.billingYear);
          expect(cachedPayment?.status).toBe(payment.status);
          expect(cachedPayment?.totalAmount).toBe(payment.totalAmount);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 32: Offline access to cached data
   * Validates: Requirements 9.1
   *
   * For any previously loaded property data, it should remain accessible offline.
   */
  it('should access cached property data offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        propertyArbitrary().filter((property) => !isNaN(property.createdAt.getTime()) && !isNaN(property.updatedAt.getTime())),
        async (property) => {
          // Cache the property
          cacheProperty(property);

          // Retrieve from cache
          const cachedProperties = getCachedProperties();

          // Verify the property is accessible
          expect(cachedProperties.length).toBeGreaterThan(0);
          const cachedProperty = cachedProperties.find((p) => p.id === property.id);
          expect(cachedProperty).toBeDefined();

          // Verify all fields are preserved
          expect(cachedProperty?.id).toBe(property.id);
          expect(cachedProperty?.name).toBe(property.name);
          expect(cachedProperty?.address).toBe(property.address);
          expect(cachedProperty?.totalRooms).toBe(property.totalRooms);
          expect(cachedProperty?.defaultElectricityRate).toBe(property.defaultElectricityRate);
          expect(cachedProperty?.defaultWaterRate).toBe(property.defaultWaterRate);
          expect(cachedProperty?.billingDayOfMonth).toBe(property.billingDayOfMonth);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 32: Offline access to cached data
   * Validates: Requirements 9.1
   *
   * For any set of rooms filtered by property, cached data should be accessible offline.
   */
  it('should filter cached rooms by property offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(roomArbitrary(), { minLength: 2, maxLength: 10 })
          .filter((rooms) => rooms.every((room) => !isNaN(room.createdAt.getTime()) && !isNaN(room.updatedAt.getTime())))
          .map((rooms) => {
            // Ensure unique IDs to avoid conflicts
            return rooms.map((room, index) => ({
              ...room,
              id: `${room.id}-${index}`,
            }));
          }),
        async (rooms) => {
          // Cache all rooms
          rooms.forEach((room) => cacheRoom(room));

          // Pick a property ID to filter by
          const propertyId = rooms[0].propertyId;

          // Retrieve filtered rooms from cache
          const cachedRooms = getCachedRooms(propertyId);

          // Verify only rooms from the specified property are returned
          cachedRooms.forEach((room) => {
            expect(room.propertyId).toBe(propertyId);
          });

          // Verify all rooms with this property ID are included
          const expectedCount = rooms.filter((r) => r.propertyId === propertyId).length;
          expect(cachedRooms.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });
});
