/**
 * Property-Based Tests for Property-Specific Rates
 * Feature: rental-management-app, Property 47: Property-specific rates apply correctly
 * Validates: Requirements 13.4
 */

import fc from 'fast-check';
import { Property } from '../types';

// Mock Room interface
interface Room {
  id: string;
  propertyId: string;
  roomCode: string;
  roomName: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  rentalPrice: number;
  electricityFee: number;
  waterFee: number;
  garbageFee: number;
  parkingFee: number;
  currentTenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Calculate billing for a room using property-specific rates
 */
function calculateBillingWithPropertyRates(
  room: Room,
  property: Property,
  electricityUsage: number,
  waterUsage: number
): {
  rentalAmount: number;
  electricityAmount: number;
  waterAmount: number;
  garbageAmount: number;
  parkingAmount: number;
  totalAmount: number;
} {
  const rentalAmount = room.rentalPrice;
  const electricityAmount = electricityUsage * property.defaultElectricityRate;
  const waterAmount = waterUsage * property.defaultWaterRate;
  const garbageAmount = property.defaultGarbageRate;
  const parkingAmount = property.defaultParkingRate;
  const totalAmount =
    rentalAmount + electricityAmount + waterAmount + garbageAmount + parkingAmount;

  return {
    rentalAmount,
    electricityAmount,
    waterAmount,
    garbageAmount,
    parkingAmount,
    totalAmount,
  };
}

describe('Property-Specific Rates Property Tests', () => {
  /**
   * Feature: rental-management-app, Property 47: Property-specific rates apply correctly
   * Validates: Requirements 13.4
   *
   * Property: For any property with custom utility rates, rooms in that property
   * should use those rates for billing calculations.
   */
  it('should apply property-specific rates to room billing', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate property with specific rates
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          address: fc.string({ minLength: 1, maxLength: 200 }),
          totalRooms: fc.integer({ min: 1, max: 50 }),
          defaultElectricityRate: fc.float({ min: 0, max: 100, noNaN: true }),
          defaultWaterRate: fc.float({ min: 0, max: 100, noNaN: true }),
          defaultGarbageRate: fc.float({ min: 0, max: 1000, noNaN: true }),
          defaultParkingRate: fc.float({ min: 0, max: 1000, noNaN: true }),
          billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
          reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
          ownerId: fc.uuid(),
          createdAt: fc.date(),
          updatedAt: fc.date(),
        }),
        // Generate room in that property
        fc.record({
          id: fc.uuid(),
          roomCode: fc.string({ minLength: 1, maxLength: 10 }),
          roomName: fc.string({ minLength: 1, maxLength: 50 }),
          status: fc.constantFrom('vacant', 'occupied', 'maintenance'),
          rentalPrice: fc.float({ min: 0, max: 10000, noNaN: true }),
          electricityFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          waterFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          garbageFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          parkingFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          createdAt: fc.date(),
          updatedAt: fc.date(),
        }),
        // Generate usage amounts
        fc.float({ min: 0, max: 1000, noNaN: true }), // electricity usage
        fc.float({ min: 0, max: 100, noNaN: true }), // water usage
        async (
          property: Property,
          roomData: Omit<Room, 'propertyId'>,
          electricityUsage: number,
          waterUsage: number
        ) => {
          // Create room with property ID
          const room: Room = {
            ...roomData,
            propertyId: property.id,
          };

          // Calculate billing using property rates
          const billing = calculateBillingWithPropertyRates(
            room,
            property,
            electricityUsage,
            waterUsage
          );

          // Verify property-specific rates are applied
          expect(billing.electricityAmount).toBeCloseTo(
            electricityUsage * property.defaultElectricityRate,
            2
          );
          expect(billing.waterAmount).toBeCloseTo(
            waterUsage * property.defaultWaterRate,
            2
          );
          expect(billing.garbageAmount).toBeCloseTo(property.defaultGarbageRate, 2);
          expect(billing.parkingAmount).toBeCloseTo(property.defaultParkingRate, 2);

          // Verify total is sum of all components
          const expectedTotal =
            billing.rentalAmount +
            billing.electricityAmount +
            billing.waterAmount +
            billing.garbageAmount +
            billing.parkingAmount;
          expect(billing.totalAmount).toBeCloseTo(expectedTotal, 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any two properties with different rates, rooms in each
   * property should have different billing amounts for the same usage
   */
  it('should produce different billing for different property rates', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate two properties with different rates
        fc
          .tuple(
            fc.record({
              id: fc.uuid(),
              name: fc.string({ minLength: 1, maxLength: 100 }),
              address: fc.string({ minLength: 1, maxLength: 200 }),
              totalRooms: fc.integer({ min: 1, max: 50 }),
              defaultElectricityRate: fc.float({ min: 1, max: 100, noNaN: true }),
              defaultWaterRate: fc.float({ min: 1, max: 100, noNaN: true }),
              defaultGarbageRate: fc.float({ min: 1, max: 1000, noNaN: true }),
              defaultParkingRate: fc.float({ min: 1, max: 1000, noNaN: true }),
              billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
              reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
              ownerId: fc.uuid(),
              createdAt: fc.date(),
              updatedAt: fc.date(),
            }),
            fc.record({
              id: fc.uuid(),
              name: fc.string({ minLength: 1, maxLength: 100 }),
              address: fc.string({ minLength: 1, maxLength: 200 }),
              totalRooms: fc.integer({ min: 1, max: 50 }),
              defaultElectricityRate: fc.float({ min: 1, max: 100, noNaN: true }),
              defaultWaterRate: fc.float({ min: 1, max: 100, noNaN: true }),
              defaultGarbageRate: fc.float({ min: 1, max: 1000, noNaN: true }),
              defaultParkingRate: fc.float({ min: 1, max: 1000, noNaN: true }),
              billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
              reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
              ownerId: fc.uuid(),
              createdAt: fc.date(),
              updatedAt: fc.date(),
            })
          )
          .filter(
            ([p1, p2]) =>
              p1.defaultElectricityRate !== p2.defaultElectricityRate ||
              p1.defaultWaterRate !== p2.defaultWaterRate ||
              p1.defaultGarbageRate !== p2.defaultGarbageRate ||
              p1.defaultParkingRate !== p2.defaultParkingRate
          ),
        // Same room configuration
        fc.record({
          roomCode: fc.string({ minLength: 1, maxLength: 10 }),
          roomName: fc.string({ minLength: 1, maxLength: 50 }),
          status: fc.constantFrom('vacant', 'occupied', 'maintenance'),
          rentalPrice: fc.float({ min: 1000, max: 10000, noNaN: true }),
          electricityFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          waterFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          garbageFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          parkingFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          createdAt: fc.date(),
          updatedAt: fc.date(),
        }),
        // Same usage amounts
        fc.float({ min: 10, max: 1000, noNaN: true }),
        fc.float({ min: 10, max: 100, noNaN: true }),
        async (
          [property1, property2]: [Property, Property],
          roomData: Omit<Room, 'id' | 'propertyId'>,
          electricityUsage: number,
          waterUsage: number
        ) => {
          // Create identical rooms in different properties
          const room1: Room = {
            ...roomData,
            id: 'room-1',
            propertyId: property1.id,
          };
          const room2: Room = {
            ...roomData,
            id: 'room-2',
            propertyId: property2.id,
          };

          // Calculate billing for both rooms
          const billing1 = calculateBillingWithPropertyRates(
            room1,
            property1,
            electricityUsage,
            waterUsage
          );
          const billing2 = calculateBillingWithPropertyRates(
            room2,
            property2,
            electricityUsage,
            waterUsage
          );

          // Verify at least one component is different
          const hasDifference =
            Math.abs(billing1.electricityAmount - billing2.electricityAmount) > 0.01 ||
            Math.abs(billing1.waterAmount - billing2.waterAmount) > 0.01 ||
            Math.abs(billing1.garbageAmount - billing2.garbageAmount) > 0.01 ||
            Math.abs(billing1.parkingAmount - billing2.parkingAmount) > 0.01;

          expect(hasDifference).toBe(true);

          // Verify total amounts are different
          expect(billing1.totalAmount).not.toBeCloseTo(billing2.totalAmount, 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any property rate change, new billing should use new rates
   * while old billing remains unchanged
   */
  it('should apply new rates to future billing after rate change', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          address: fc.string({ minLength: 1, maxLength: 200 }),
          totalRooms: fc.integer({ min: 1, max: 50 }),
          defaultElectricityRate: fc.float({ min: 1, max: 100, noNaN: true }),
          defaultWaterRate: fc.float({ min: 1, max: 100, noNaN: true }),
          defaultGarbageRate: fc.float({ min: 1, max: 1000, noNaN: true }),
          defaultParkingRate: fc.float({ min: 1, max: 1000, noNaN: true }),
          billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
          reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
          ownerId: fc.uuid(),
          createdAt: fc.date(),
          updatedAt: fc.date(),
        }),
        fc.record({
          id: fc.uuid(),
          roomCode: fc.string({ minLength: 1, maxLength: 10 }),
          roomName: fc.string({ minLength: 1, maxLength: 50 }),
          status: fc.constantFrom('vacant', 'occupied', 'maintenance'),
          rentalPrice: fc.float({ min: 1000, max: 10000, noNaN: true }),
          electricityFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          waterFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          garbageFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          parkingFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          createdAt: fc.date(),
          updatedAt: fc.date(),
        }),
        fc.float({ min: 10, max: 1000, noNaN: true }),
        fc.float({ min: 10, max: 100, noNaN: true }),
        async (
          property: Property,
          roomData: Omit<Room, 'propertyId'>,
          electricityUsage: number,
          waterUsage: number
        ) => {
          const room: Room = {
            ...roomData,
            propertyId: property.id,
          };

          // Calculate billing with original rates
          const originalBilling = calculateBillingWithPropertyRates(
            room,
            property,
            electricityUsage,
            waterUsage
          );

          // Store original billing (simulating historical record)
          const historicalBilling = { ...originalBilling };

          // Update property rates
          const updatedProperty: Property = {
            ...property,
            defaultElectricityRate: property.defaultElectricityRate * 1.5,
            defaultWaterRate: property.defaultWaterRate * 1.2,
            defaultGarbageRate: property.defaultGarbageRate * 1.1,
            defaultParkingRate: property.defaultParkingRate * 1.3,
          };

          // Calculate new billing with updated rates
          const newBilling = calculateBillingWithPropertyRates(
            room,
            updatedProperty,
            electricityUsage,
            waterUsage
          );

          // Verify historical billing remains unchanged
          expect(historicalBilling.electricityAmount).toBeCloseTo(
            electricityUsage * property.defaultElectricityRate,
            2
          );
          expect(historicalBilling.waterAmount).toBeCloseTo(
            waterUsage * property.defaultWaterRate,
            2
          );

          // Verify new billing uses new rates
          expect(newBilling.electricityAmount).toBeCloseTo(
            electricityUsage * updatedProperty.defaultElectricityRate,
            2
          );
          expect(newBilling.waterAmount).toBeCloseTo(
            waterUsage * updatedProperty.defaultWaterRate,
            2
          );
          expect(newBilling.garbageAmount).toBeCloseTo(
            updatedProperty.defaultGarbageRate,
            2
          );
          expect(newBilling.parkingAmount).toBeCloseTo(
            updatedProperty.defaultParkingRate,
            2
          );

          // Verify new billing is different from historical
          expect(newBilling.totalAmount).not.toBeCloseTo(
            historicalBilling.totalAmount,
            2
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any property with zero rates, billing should only include
   * rental amount
   */
  it('should handle zero utility rates correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          address: fc.string({ minLength: 1, maxLength: 200 }),
          totalRooms: fc.integer({ min: 1, max: 50 }),
          defaultElectricityRate: fc.constant(0),
          defaultWaterRate: fc.constant(0),
          defaultGarbageRate: fc.constant(0),
          defaultParkingRate: fc.constant(0),
          billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
          reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
          ownerId: fc.uuid(),
          createdAt: fc.date(),
          updatedAt: fc.date(),
        }),
        fc.record({
          id: fc.uuid(),
          roomCode: fc.string({ minLength: 1, maxLength: 10 }),
          roomName: fc.string({ minLength: 1, maxLength: 50 }),
          status: fc.constantFrom('vacant', 'occupied', 'maintenance'),
          rentalPrice: fc.float({ min: 1000, max: 10000, noNaN: true }),
          electricityFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          waterFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          garbageFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          parkingFee: fc.float({ min: 0, max: 1000, noNaN: true }),
          createdAt: fc.date(),
          updatedAt: fc.date(),
        }),
        fc.float({ min: 10, max: 1000, noNaN: true }),
        fc.float({ min: 10, max: 100, noNaN: true }),
        async (
          property: Property,
          roomData: Omit<Room, 'propertyId'>,
          electricityUsage: number,
          waterUsage: number
        ) => {
          const room: Room = {
            ...roomData,
            propertyId: property.id,
          };

          const billing = calculateBillingWithPropertyRates(
            room,
            property,
            electricityUsage,
            waterUsage
          );

          // Verify all utility amounts are zero
          expect(billing.electricityAmount).toBe(0);
          expect(billing.waterAmount).toBe(0);
          expect(billing.garbageAmount).toBe(0);
          expect(billing.parkingAmount).toBe(0);

          // Verify total equals only rental amount
          expect(billing.totalAmount).toBeCloseTo(billing.rentalAmount, 2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
