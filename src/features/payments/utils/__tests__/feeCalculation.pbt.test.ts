/**
 * Property-Based Tests for Fee Calculation
 *
 * These tests verify the correctness properties of the fee calculation system
 * using property-based testing with fast-check.
 */

import fc from 'fast-check';
import {
  calculateMonthlyFees,
  applyFeeAdjustment,
  generateItemizedBill,
  createRateHistory,
  getApplicableRates,
  calculateFeesWithHistoricalRates,
  validateFeeCalculation,
} from '../feeCalculation';
import { Room } from '../../../rooms/types';
import { Tenant } from '../../../tenants/types';
import { RateHistory } from '../../types';
import {
  monetaryAmountArbitrary,
  roomCodeArbitrary,
  roomNameArbitrary,
  uuidArbitrary,
  billingMonthArbitrary,
  billingYearArbitrary,
  pastDateArbitrary,
  futureDateArbitrary,
} from '../../../../shared/utils/pbt-utils';

// Custom arbitraries for fee calculation tests

const roomArbitrary = (): fc.Arbitrary<Room> =>
  fc.record({
    id: uuidArbitrary(),
    propertyId: uuidArbitrary(),
    roomCode: roomCodeArbitrary(),
    roomName: roomNameArbitrary(),
    status: fc.constantFrom('vacant', 'occupied', 'maintenance'),
    rentalPrice: monetaryAmountArbitrary(),
    electricityFee: monetaryAmountArbitrary(),
    waterFee: monetaryAmountArbitrary(),
    garbageFee: monetaryAmountArbitrary(),
    parkingFee: monetaryAmountArbitrary(),
    currentTenantId: fc.option(uuidArbitrary(), { nil: undefined }),
    createdAt: pastDateArbitrary(),
    updatedAt: pastDateArbitrary(),
  });

const tenantArbitrary = (): fc.Arbitrary<Tenant> =>
  fc.record({
    id: uuidArbitrary(),
    name: fc.string({ minLength: 1, maxLength: 100 }),
    phone: fc.string({ minLength: 10, maxLength: 15 }),
    email: fc.option(fc.emailAddress(), { nil: undefined }),
    idNumber: fc.option(fc.string({ minLength: 9, maxLength: 12 }), { nil: undefined }),
    roomId: uuidArbitrary(),
    moveInDate: pastDateArbitrary(),
    moveOutDate: fc.option(pastDateArbitrary(), { nil: undefined }),
    emergencyContact: fc.option(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 100 }),
        phone: fc.string({ minLength: 10, maxLength: 15 }),
        relationship: fc.string({ minLength: 1, maxLength: 50 }),
      }),
      { nil: undefined }
    ),
    createdAt: pastDateArbitrary(),
    updatedAt: pastDateArbitrary(),
  });

const adjustmentArbitrary = () => fc.integer({ min: -10_000_000, max: 10_000_000 });

const rateHistoryArbitrary = (roomId: string, propertyId: string): fc.Arbitrary<RateHistory> =>
  fc.record({
    id: fc.string(),
    roomId: fc.constant(roomId),
    propertyId: fc.constant(propertyId),
    effectiveDate: pastDateArbitrary(),
    electricityRate: monetaryAmountArbitrary(),
    waterRate: monetaryAmountArbitrary(),
    garbageRate: monetaryAmountArbitrary(),
    parkingRate: monetaryAmountArbitrary(),
    createdAt: pastDateArbitrary(),
  });

describe('Fee Calculation Property-Based Tests', () => {
  /**
   * Feature: rental-management-app, Property 22: Fee calculation sums correctly
   * Validates: Requirements 6.1
   *
   * For any room with rental price and utility fees, the total calculated fee
   * should equal the sum of all individual fees.
   */
  it('should calculate total fees as sum of all components', async () => {
    await fc.assert(
      fc.asyncProperty(roomArbitrary(), adjustmentArbitrary(), async (room, adjustment) => {
        const feeCalculation = calculateMonthlyFees(room, adjustment);

        // Verify each component matches the room's fees
        expect(feeCalculation.rentalAmount).toBe(room.rentalPrice);
        expect(feeCalculation.electricityAmount).toBe(room.electricityFee);
        expect(feeCalculation.waterAmount).toBe(room.waterFee);
        expect(feeCalculation.garbageAmount).toBe(room.garbageFee);
        expect(feeCalculation.parkingAmount).toBe(room.parkingFee);
        expect(feeCalculation.adjustments).toBe(adjustment);

        // Verify total is the sum of all components
        const expectedTotal =
          room.rentalPrice +
          room.electricityFee +
          room.waterFee +
          room.garbageFee +
          room.parkingFee +
          adjustment;

        expect(feeCalculation.totalAmount).toBe(expectedTotal);

        // Verify the calculation is valid
        expect(validateFeeCalculation(feeCalculation)).toBe(true);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 22: Fee calculation sums correctly (zero fees)
   * Validates: Requirements 6.1
   *
   * Edge case: Verify calculation works correctly when all utility fees are zero
   */
  it('should handle rooms with zero utility fees', async () => {
    await fc.assert(
      fc.asyncProperty(monetaryAmountArbitrary(), async (rentalPrice) => {
        const room: Room = {
          id: 'test-room',
          propertyId: 'test-property',
          roomCode: 'R001',
          roomName: 'Test Room',
          status: 'vacant',
          rentalPrice,
          electricityFee: 0,
          waterFee: 0,
          garbageFee: 0,
          parkingFee: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const feeCalculation = calculateMonthlyFees(room);

        expect(feeCalculation.totalAmount).toBe(rentalPrice);
        expect(validateFeeCalculation(feeCalculation)).toBe(true);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 25: Custom adjustments apply correctly
   * Validates: Requirements 6.4
   *
   * For any room with a custom fee adjustment, the total amount should include
   * the adjustment value.
   */
  it('should apply custom adjustments correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        roomArbitrary(),
        adjustmentArbitrary(),
        async (room, initialAdjustment) => {
          const baseCalculation = calculateMonthlyFees(room, initialAdjustment);
          const additionalAdjustment = Math.floor(Math.random() * 1_000_000) - 500_000;

          const adjustedCalculation = applyFeeAdjustment(baseCalculation, additionalAdjustment);

          // Verify adjustment is added
          expect(adjustedCalculation.adjustments).toBe(
            baseCalculation.adjustments + additionalAdjustment
          );

          // Verify total is updated correctly
          expect(adjustedCalculation.totalAmount).toBe(
            baseCalculation.totalAmount + additionalAdjustment
          );

          // Verify other components remain unchanged
          expect(adjustedCalculation.rentalAmount).toBe(baseCalculation.rentalAmount);
          expect(adjustedCalculation.electricityAmount).toBe(baseCalculation.electricityAmount);
          expect(adjustedCalculation.waterAmount).toBe(baseCalculation.waterAmount);
          expect(adjustedCalculation.garbageAmount).toBe(baseCalculation.garbageAmount);
          expect(adjustedCalculation.parkingAmount).toBe(baseCalculation.parkingAmount);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 24: Bills include itemized breakdown
   * Validates: Requirements 6.3
   *
   * For any generated bill, it should contain separate line items for rent and
   * each utility fee (electricity, water, garbage, parking).
   */
  it('should generate bills with itemized breakdown', async () => {
    await fc.assert(
      fc.asyncProperty(
        roomArbitrary(),
        tenantArbitrary(),
        billingMonthArbitrary(),
        billingYearArbitrary(),
        futureDateArbitrary(),
        async (room, tenant, billingMonth, billingYear, dueDate) => {
          const feeCalculation = calculateMonthlyFees(room);
          const bill = generateItemizedBill(
            room,
            tenant,
            feeCalculation,
            billingMonth,
            billingYear,
            dueDate
          );

          // Verify bill contains room and tenant information
          expect(bill.roomCode).toBe(room.roomCode);
          expect(bill.roomName).toBe(room.roomName);
          expect(bill.tenantName).toBe(tenant.name);

          // Verify bill has items array
          expect(Array.isArray(bill.items)).toBe(true);
          expect(bill.items.length).toBeGreaterThan(0);

          // Verify rental fee is always included
          const rentalItem = bill.items.find((item) => item.description === 'Rental Fee');
          expect(rentalItem).toBeDefined();
          expect(rentalItem?.amount).toBe(room.rentalPrice);

          // Verify utility fees are included when non-zero
          if (room.electricityFee > 0) {
            const electricityItem = bill.items.find(
              (item) => item.description === 'Electricity Fee'
            );
            expect(electricityItem).toBeDefined();
            expect(electricityItem?.amount).toBe(room.electricityFee);
          }

          if (room.waterFee > 0) {
            const waterItem = bill.items.find((item) => item.description === 'Water Fee');
            expect(waterItem).toBeDefined();
            expect(waterItem?.amount).toBe(room.waterFee);
          }

          if (room.garbageFee > 0) {
            const garbageItem = bill.items.find(
              (item) => item.description === 'Garbage Collection Fee'
            );
            expect(garbageItem).toBeDefined();
            expect(garbageItem?.amount).toBe(room.garbageFee);
          }

          if (room.parkingFee > 0) {
            const parkingItem = bill.items.find(
              (item) => item.description === 'Vehicle Parking Fee'
            );
            expect(parkingItem).toBeDefined();
            expect(parkingItem?.amount).toBe(room.parkingFee);
          }

          // Verify total amount matches fee calculation
          expect(bill.totalAmount).toBe(feeCalculation.totalAmount);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 23: Rate changes preserve history
   * Validates: Requirements 6.2
   *
   * For any room, changing utility rates should apply new rates to future billing
   * periods while leaving historical payment records unchanged.
   */
  it('should preserve historical rates when rates change', async () => {
    await fc.assert(
      fc.asyncProperty(
        uuidArbitrary(),
        uuidArbitrary(),
        roomArbitrary(),
        roomArbitrary(),
        async (roomId, propertyId, oldRoom, newRoom) => {
          // Create rate history for old rates (effective 6 months ago)
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          sixMonthsAgo.setDate(1); // Set to first day of month
          const oldRateHistory = createRateHistory(roomId, propertyId, oldRoom, sixMonthsAgo);

          // Create rate history for new rates (effective 1 month ago)
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          oneMonthAgo.setDate(1); // Set to first day of month
          const newRateHistory = createRateHistory(roomId, propertyId, newRoom, oneMonthAgo);

          const rateHistories = [oldRateHistory, newRateHistory];

          // Calculate fees for a billing period 3 months ago (should use old rates)
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          const pastMonth = threeMonthsAgo.getMonth() + 1;
          const pastYear = threeMonthsAgo.getFullYear();

          const applicableRatesForPast = getApplicableRates(rateHistories, pastMonth, pastYear);
          expect(applicableRatesForPast).toBeDefined();
          expect(applicableRatesForPast?.id).toBe(oldRateHistory.id);

          // Calculate fees for current month (should use new rates)
          const now = new Date();
          const currentMonth = now.getMonth() + 1;
          const currentYear = now.getFullYear();

          const applicableRatesForCurrent = getApplicableRates(
            rateHistories,
            currentMonth,
            currentYear
          );
          expect(applicableRatesForCurrent).toBeDefined();
          expect(applicableRatesForCurrent?.id).toBe(newRateHistory.id);

          // Verify historical calculation uses old rates
          const historicalFees = calculateFeesWithHistoricalRates(
            oldRoom,
            oldRateHistory,
            0
          );
          expect(historicalFees.electricityAmount).toBe(oldRoom.electricityFee);
          expect(historicalFees.waterAmount).toBe(oldRoom.waterFee);
          expect(historicalFees.garbageAmount).toBe(oldRoom.garbageFee);
          expect(historicalFees.parkingAmount).toBe(oldRoom.parkingFee);

          // Verify current calculation uses new rates
          const currentFees = calculateFeesWithHistoricalRates(newRoom, newRateHistory, 0);
          expect(currentFees.electricityAmount).toBe(newRoom.electricityFee);
          expect(currentFees.waterAmount).toBe(newRoom.waterFee);
          expect(currentFees.garbageAmount).toBe(newRoom.garbageFee);
          expect(currentFees.parkingAmount).toBe(newRoom.parkingFee);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 23: Rate changes preserve history (multiple changes)
   * Validates: Requirements 6.2
   *
   * Verify that multiple rate changes over time are correctly preserved and applied
   */
  it('should handle multiple rate changes over time', async () => {
    await fc.assert(
      fc.asyncProperty(
        uuidArbitrary(),
        uuidArbitrary(),
        fc.array(roomArbitrary(), { minLength: 2, maxLength: 5 }),
        async (roomId, propertyId, rooms) => {
          // Create rate histories with different effective dates
          const rateHistories: RateHistory[] = [];
          const baseDate = new Date('2023-01-01');

          rooms.forEach((room, index) => {
            const effectiveDate = new Date(baseDate);
            effectiveDate.setMonth(baseDate.getMonth() + index * 2); // Every 2 months
            const history = createRateHistory(roomId, propertyId, room, effectiveDate);
            rateHistories.push(history);
          });

          // For each billing period, verify the correct rate history is used
          for (let i = 0; i < rooms.length; i++) {
            const testDate = new Date(baseDate);
            testDate.setMonth(baseDate.getMonth() + i * 2 + 1); // 1 month after each rate change
            const testMonth = testDate.getMonth() + 1;
            const testYear = testDate.getFullYear();

            const applicableRate = getApplicableRates(rateHistories, testMonth, testYear);
            expect(applicableRate).toBeDefined();

            // The applicable rate should be the one from the current or previous period
            const expectedHistory = rateHistories[i];
            expect(applicableRate?.electricityRate).toBe(expectedHistory.electricityRate);
            expect(applicableRate?.waterRate).toBe(expectedHistory.waterRate);
            expect(applicableRate?.garbageRate).toBe(expectedHistory.garbageRate);
            expect(applicableRate?.parkingRate).toBe(expectedHistory.parkingRate);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
