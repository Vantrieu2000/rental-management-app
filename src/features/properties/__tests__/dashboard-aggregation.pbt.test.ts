/**
 * Property-Based Tests for Dashboard Aggregation
 * Feature: rental-management-app, Property 46: Dashboard aggregates across properties
 * Validates: Requirements 13.3
 */

import fc from 'fast-check';
import { Property, PropertyStatistics } from '../types';

// Mock PaymentRecord interface based on design document
interface PaymentRecord {
  id: string;
  roomId: string;
  tenantId: string;
  propertyId: string;
  billingMonth: number;
  billingYear: number;
  dueDate: Date;
  rentalAmount: number;
  electricityAmount: number;
  waterAmount: number;
  garbageAmount: number;
  parkingAmount: number;
  adjustments: number;
  totalAmount: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  paidAmount: number;
  paidDate?: Date;
  paymentMethod?: 'cash' | 'bank_transfer' | 'e_wallet';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
 * Calculate aggregated statistics across multiple properties
 */
function calculateAggregatedStatistics(
  properties: Property[],
  rooms: Room[],
  payments: PaymentRecord[]
): {
  totalRooms: number;
  totalOccupied: number;
  totalVacant: number;
  totalRevenue: number;
  totalUnpaid: number;
} {
  const propertyIds = new Set(properties.map((p) => p.id));

  // Filter rooms and payments for these properties
  const relevantRooms = rooms.filter((r) => propertyIds.has(r.propertyId));
  const relevantPayments = payments.filter((p) => propertyIds.has(p.propertyId));

  const totalRooms = relevantRooms.length;
  const totalOccupied = relevantRooms.filter((r) => r.status === 'occupied').length;
  const totalVacant = relevantRooms.filter((r) => r.status === 'vacant').length;

  const totalRevenue = relevantPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.paidAmount, 0);

  const totalUnpaid = relevantPayments
    .filter((p) => p.status === 'unpaid' || p.status === 'overdue')
    .reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);

  return {
    totalRooms,
    totalOccupied,
    totalVacant,
    totalRevenue,
    totalUnpaid,
  };
}

describe('Dashboard Aggregation Property Tests', () => {
  /**
   * Feature: rental-management-app, Property 46: Dashboard aggregates across properties
   * Validates: Requirements 13.3
   *
   * Property: For any set of properties with payment data, dashboard statistics
   * should correctly aggregate totals across all properties.
   */
  it('should aggregate statistics across all properties', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate multiple properties
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            address: fc.string({ minLength: 1, maxLength: 200 }),
            totalRooms: fc.integer({ min: 1, max: 50 }),
            defaultElectricityRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultWaterRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultGarbageRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultParkingRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
            reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
            ownerId: fc.uuid(),
            createdAt: fc.date(),
            updatedAt: fc.date(),
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (properties: Property[]) => {
          // Generate rooms for each property
          const allRooms: Room[] = [];
          for (const property of properties) {
            const roomCount = Math.floor(Math.random() * 10) + 1;
            for (let i = 0; i < roomCount; i++) {
              allRooms.push({
                id: `room-${property.id}-${i}`,
                propertyId: property.id,
                roomCode: `R${i + 1}`,
                roomName: `Room ${i + 1}`,
                status: ['vacant', 'occupied', 'maintenance'][
                  Math.floor(Math.random() * 3)
                ] as Room['status'],
                rentalPrice: Math.random() * 5000,
                electricityFee: Math.random() * 500,
                waterFee: Math.random() * 200,
                garbageFee: Math.random() * 100,
                parkingFee: Math.random() * 300,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }

          // Generate payments for rooms
          const allPayments: PaymentRecord[] = [];
          for (const room of allRooms) {
            const paymentCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < paymentCount; i++) {
              const totalAmount = Math.random() * 10000;
              const isPaid = Math.random() > 0.3;
              const paidAmount = isPaid ? totalAmount : Math.random() * totalAmount;

              allPayments.push({
                id: `payment-${room.id}-${i}`,
                roomId: room.id,
                tenantId: `tenant-${room.id}`,
                propertyId: room.propertyId,
                billingMonth: Math.floor(Math.random() * 12) + 1,
                billingYear: 2024,
                dueDate: new Date(),
                rentalAmount: totalAmount * 0.7,
                electricityAmount: totalAmount * 0.1,
                waterAmount: totalAmount * 0.1,
                garbageAmount: totalAmount * 0.05,
                parkingAmount: totalAmount * 0.05,
                adjustments: 0,
                totalAmount,
                status: isPaid ? 'paid' : Math.random() > 0.5 ? 'unpaid' : 'overdue',
                paidAmount,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }

          // Calculate aggregated statistics
          const aggregated = calculateAggregatedStatistics(
            properties,
            allRooms,
            allPayments
          );

          // Verify total rooms equals sum of all rooms across properties
          const expectedTotalRooms = allRooms.filter((r) =>
            properties.some((p) => p.id === r.propertyId)
          ).length;
          expect(aggregated.totalRooms).toBe(expectedTotalRooms);

          // Verify occupied count
          const expectedOccupied = allRooms.filter(
            (r) =>
              r.status === 'occupied' &&
              properties.some((p) => p.id === r.propertyId)
          ).length;
          expect(aggregated.totalOccupied).toBe(expectedOccupied);

          // Verify vacant count
          const expectedVacant = allRooms.filter(
            (r) =>
              r.status === 'vacant' && properties.some((p) => p.id === r.propertyId)
          ).length;
          expect(aggregated.totalVacant).toBe(expectedVacant);

          // Verify total revenue
          const expectedRevenue = allPayments
            .filter(
              (p) =>
                p.status === 'paid' && properties.some((prop) => prop.id === p.propertyId)
            )
            .reduce((sum, p) => sum + p.paidAmount, 0);
          expect(aggregated.totalRevenue).toBeCloseTo(expectedRevenue, 2);

          // Verify total unpaid
          const expectedUnpaid = allPayments
            .filter(
              (p) =>
                (p.status === 'unpaid' || p.status === 'overdue') &&
                properties.some((prop) => prop.id === p.propertyId)
            )
            .reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);
          expect(aggregated.totalUnpaid).toBeCloseTo(expectedUnpaid, 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any subset of properties, aggregated totals should equal
   * the sum of individual property statistics
   */
  it('should maintain sum consistency across property subsets', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            address: fc.string({ minLength: 1, maxLength: 200 }),
            totalRooms: fc.integer({ min: 1, max: 50 }),
            defaultElectricityRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultWaterRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultGarbageRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultParkingRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
            reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
            ownerId: fc.uuid(),
            createdAt: fc.date(),
            updatedAt: fc.date(),
          }),
          { minLength: 3, maxLength: 5 }
        ),
        async (properties: Property[]) => {
          // Generate rooms and payments
          const allRooms: Room[] = [];
          const allPayments: PaymentRecord[] = [];

          for (const property of properties) {
            const roomCount = 5;
            for (let i = 0; i < roomCount; i++) {
              const room: Room = {
                id: `room-${property.id}-${i}`,
                propertyId: property.id,
                roomCode: `R${i + 1}`,
                roomName: `Room ${i + 1}`,
                status: i % 2 === 0 ? 'occupied' : 'vacant',
                rentalPrice: 1000,
                electricityFee: 100,
                waterFee: 50,
                garbageFee: 25,
                parkingFee: 75,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              allRooms.push(room);

              // Add payment for each room
              allPayments.push({
                id: `payment-${room.id}`,
                roomId: room.id,
                tenantId: `tenant-${room.id}`,
                propertyId: property.id,
                billingMonth: 1,
                billingYear: 2024,
                dueDate: new Date(),
                rentalAmount: 1000,
                electricityAmount: 100,
                waterAmount: 50,
                garbageAmount: 25,
                parkingAmount: 75,
                adjustments: 0,
                totalAmount: 1250,
                status: i % 3 === 0 ? 'paid' : 'unpaid',
                paidAmount: i % 3 === 0 ? 1250 : 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }

          // Calculate aggregated statistics for all properties
          const allPropertiesStats = calculateAggregatedStatistics(
            properties,
            allRooms,
            allPayments
          );

          // Calculate sum of individual property statistics
          let sumTotalRooms = 0;
          let sumOccupied = 0;
          let sumVacant = 0;
          let sumRevenue = 0;
          let sumUnpaid = 0;

          for (const property of properties) {
            const propertyStats = calculateAggregatedStatistics(
              [property],
              allRooms,
              allPayments
            );
            sumTotalRooms += propertyStats.totalRooms;
            sumOccupied += propertyStats.totalOccupied;
            sumVacant += propertyStats.totalVacant;
            sumRevenue += propertyStats.totalRevenue;
            sumUnpaid += propertyStats.totalUnpaid;
          }

          // Verify aggregated equals sum of individuals
          expect(allPropertiesStats.totalRooms).toBe(sumTotalRooms);
          expect(allPropertiesStats.totalOccupied).toBe(sumOccupied);
          expect(allPropertiesStats.totalVacant).toBe(sumVacant);
          expect(allPropertiesStats.totalRevenue).toBeCloseTo(sumRevenue, 2);
          expect(allPropertiesStats.totalUnpaid).toBeCloseTo(sumUnpaid, 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any empty property set, aggregated statistics should be zero
   */
  it('should return zero statistics for empty property set', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            propertyId: fc.uuid(),
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
          { minLength: 1, maxLength: 10 }
        ),
        async (rooms: Room[]) => {
          // Calculate with empty property set
          const stats = calculateAggregatedStatistics([], rooms, []);

          // Verify all statistics are zero
          expect(stats.totalRooms).toBe(0);
          expect(stats.totalOccupied).toBe(0);
          expect(stats.totalVacant).toBe(0);
          expect(stats.totalRevenue).toBe(0);
          expect(stats.totalUnpaid).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any properties, total rooms should equal occupied + vacant + maintenance
   */
  it('should maintain room status count consistency', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            address: fc.string({ minLength: 1, maxLength: 200 }),
            totalRooms: fc.integer({ min: 1, max: 50 }),
            defaultElectricityRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultWaterRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultGarbageRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultParkingRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
            reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
            ownerId: fc.uuid(),
            createdAt: fc.date(),
            updatedAt: fc.date(),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (properties: Property[]) => {
          // Generate rooms with all statuses
          const allRooms: Room[] = [];
          for (const property of properties) {
            const roomCount = 9; // Divisible by 3 for even distribution
            for (let i = 0; i < roomCount; i++) {
              allRooms.push({
                id: `room-${property.id}-${i}`,
                propertyId: property.id,
                roomCode: `R${i + 1}`,
                roomName: `Room ${i + 1}`,
                status: ['vacant', 'occupied', 'maintenance'][i % 3] as Room['status'],
                rentalPrice: 1000,
                electricityFee: 100,
                waterFee: 50,
                garbageFee: 25,
                parkingFee: 75,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }

          const stats = calculateAggregatedStatistics(properties, allRooms, []);

          // Count maintenance rooms
          const maintenanceCount = allRooms.filter(
            (r) =>
              r.status === 'maintenance' &&
              properties.some((p) => p.id === r.propertyId)
          ).length;

          // Verify total equals sum of all statuses
          expect(stats.totalRooms).toBe(
            stats.totalOccupied + stats.totalVacant + maintenanceCount
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
