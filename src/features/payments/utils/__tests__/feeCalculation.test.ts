/**
 * Unit Tests for Fee Calculation
 *
 * These tests verify specific examples and edge cases for the fee calculation system.
 */

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

describe('Fee Calculation Unit Tests', () => {
  const mockRoom: Room = {
    id: 'room-1',
    propertyId: 'property-1',
    roomCode: 'R101',
    roomName: 'Room 101',
    status: 'occupied',
    rentalPrice: 3_000_000,
    electricityFee: 200_000,
    waterFee: 100_000,
    garbageFee: 50_000,
    parkingFee: 150_000,
    currentTenantId: 'tenant-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockTenant: Tenant = {
    id: 'tenant-1',
    name: 'John Doe',
    phone: '0123456789',
    email: 'john@example.com',
    roomId: 'room-1',
    moveInDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  describe('calculateMonthlyFees', () => {
    it('should calculate total fees correctly', () => {
      const result = calculateMonthlyFees(mockRoom);

      expect(result.rentalAmount).toBe(3_000_000);
      expect(result.electricityAmount).toBe(200_000);
      expect(result.waterAmount).toBe(100_000);
      expect(result.garbageAmount).toBe(50_000);
      expect(result.parkingAmount).toBe(150_000);
      expect(result.adjustments).toBe(0);
      expect(result.totalAmount).toBe(3_500_000);
    });

    it('should handle adjustments', () => {
      const result = calculateMonthlyFees(mockRoom, 100_000);

      expect(result.adjustments).toBe(100_000);
      expect(result.totalAmount).toBe(3_600_000);
    });

    it('should handle negative adjustments', () => {
      const result = calculateMonthlyFees(mockRoom, -50_000);

      expect(result.adjustments).toBe(-50_000);
      expect(result.totalAmount).toBe(3_450_000);
    });

    it('should handle zero fees', () => {
      const zeroFeeRoom: Room = {
        ...mockRoom,
        electricityFee: 0,
        waterFee: 0,
        garbageFee: 0,
        parkingFee: 0,
      };

      const result = calculateMonthlyFees(zeroFeeRoom);

      expect(result.totalAmount).toBe(3_000_000);
    });
  });

  describe('applyFeeAdjustment', () => {
    it('should apply positive adjustment', () => {
      const baseCalculation = calculateMonthlyFees(mockRoom);
      const result = applyFeeAdjustment(baseCalculation, 50_000);

      expect(result.adjustments).toBe(50_000);
      expect(result.totalAmount).toBe(3_550_000);
    });

    it('should apply negative adjustment', () => {
      const baseCalculation = calculateMonthlyFees(mockRoom);
      const result = applyFeeAdjustment(baseCalculation, -100_000);

      expect(result.adjustments).toBe(-100_000);
      expect(result.totalAmount).toBe(3_400_000);
    });

    it('should accumulate multiple adjustments', () => {
      const baseCalculation = calculateMonthlyFees(mockRoom, 50_000);
      const result = applyFeeAdjustment(baseCalculation, 25_000);

      expect(result.adjustments).toBe(75_000);
      expect(result.totalAmount).toBe(3_575_000);
    });
  });

  describe('generateItemizedBill', () => {
    it('should generate bill with all items', () => {
      const feeCalculation = calculateMonthlyFees(mockRoom);
      const bill = generateItemizedBill(
        mockRoom,
        mockTenant,
        feeCalculation,
        12,
        2024,
        new Date('2024-12-05')
      );

      expect(bill.roomCode).toBe('R101');
      expect(bill.roomName).toBe('Room 101');
      expect(bill.tenantName).toBe('John Doe');
      expect(bill.billingPeriod).toBe('December 2024');
      expect(bill.items).toHaveLength(5);
      expect(bill.totalAmount).toBe(3_500_000);
    });

    it('should exclude zero-value utility fees', () => {
      const zeroFeeRoom: Room = {
        ...mockRoom,
        electricityFee: 0,
        waterFee: 0,
        garbageFee: 0,
        parkingFee: 0,
      };

      const feeCalculation = calculateMonthlyFees(zeroFeeRoom);
      const bill = generateItemizedBill(
        zeroFeeRoom,
        mockTenant,
        feeCalculation,
        1,
        2024,
        new Date('2024-01-05')
      );

      expect(bill.items).toHaveLength(1); // Only rental fee
      expect(bill.items[0].description).toBe('Rental Fee');
    });

    it('should include adjustments in bill', () => {
      const feeCalculation = calculateMonthlyFees(mockRoom, 100_000);
      const bill = generateItemizedBill(
        mockRoom,
        mockTenant,
        feeCalculation,
        6,
        2024,
        new Date('2024-06-05')
      );

      expect(bill.adjustments).toBe(100_000);
      expect(bill.totalAmount).toBe(3_600_000);
    });
  });

  describe('createRateHistory', () => {
    it('should create rate history record', () => {
      const effectiveDate = new Date('2024-01-01');
      const rateHistory = createRateHistory('room-1', 'property-1', mockRoom, effectiveDate);

      expect(rateHistory.roomId).toBe('room-1');
      expect(rateHistory.propertyId).toBe('property-1');
      expect(rateHistory.effectiveDate).toBe(effectiveDate);
      expect(rateHistory.electricityRate).toBe(200_000);
      expect(rateHistory.waterRate).toBe(100_000);
      expect(rateHistory.garbageRate).toBe(50_000);
      expect(rateHistory.parkingRate).toBe(150_000);
    });

    it('should use current date if not provided', () => {
      const before = Date.now();
      const rateHistory = createRateHistory('room-1', 'property-1', mockRoom);
      const after = Date.now();

      const effectiveTime = rateHistory.effectiveDate.getTime();
      expect(effectiveTime).toBeGreaterThanOrEqual(before);
      expect(effectiveTime).toBeLessThanOrEqual(after);
    });
  });

  describe('getApplicableRates', () => {
    it('should return most recent rate before billing date', () => {
      const rateHistories: RateHistory[] = [
        {
          id: 'rate-1',
          roomId: 'room-1',
          propertyId: 'property-1',
          effectiveDate: new Date('2024-01-01'),
          electricityRate: 200_000,
          waterRate: 100_000,
          garbageRate: 50_000,
          parkingRate: 150_000,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'rate-2',
          roomId: 'room-1',
          propertyId: 'property-1',
          effectiveDate: new Date('2024-06-01'),
          electricityRate: 250_000,
          waterRate: 120_000,
          garbageRate: 60_000,
          parkingRate: 180_000,
          createdAt: new Date('2024-06-01'),
        },
      ];

      // Billing for March 2024 should use rate-1
      const marchRate = getApplicableRates(rateHistories, 3, 2024);
      expect(marchRate?.id).toBe('rate-1');

      // Billing for August 2024 should use rate-2
      const augustRate = getApplicableRates(rateHistories, 8, 2024);
      expect(augustRate?.id).toBe('rate-2');
    });

    it('should return oldest rate if billing date is before all rates', () => {
      const rateHistories: RateHistory[] = [
        {
          id: 'rate-1',
          roomId: 'room-1',
          propertyId: 'property-1',
          effectiveDate: new Date('2024-06-01'),
          electricityRate: 200_000,
          waterRate: 100_000,
          garbageRate: 50_000,
          parkingRate: 150_000,
          createdAt: new Date('2024-06-01'),
        },
      ];

      // Billing for January 2024 (before any rate) should use rate-1
      const januaryRate = getApplicableRates(rateHistories, 1, 2024);
      expect(januaryRate?.id).toBe('rate-1');
    });

    it('should return null for empty rate histories', () => {
      const result = getApplicableRates([], 1, 2024);
      expect(result).toBeNull();
    });
  });

  describe('calculateFeesWithHistoricalRates', () => {
    it('should use historical rates for calculation', () => {
      const rateHistory: RateHistory = {
        id: 'rate-1',
        roomId: 'room-1',
        propertyId: 'property-1',
        effectiveDate: new Date('2024-01-01'),
        electricityRate: 180_000,
        waterRate: 90_000,
        garbageRate: 45_000,
        parkingRate: 135_000,
        createdAt: new Date('2024-01-01'),
      };

      const result = calculateFeesWithHistoricalRates(mockRoom, rateHistory);

      expect(result.rentalAmount).toBe(3_000_000);
      expect(result.electricityAmount).toBe(180_000);
      expect(result.waterAmount).toBe(90_000);
      expect(result.garbageAmount).toBe(45_000);
      expect(result.parkingAmount).toBe(135_000);
      expect(result.totalAmount).toBe(3_450_000);
    });
  });

  describe('validateFeeCalculation', () => {
    it('should validate correct fee calculation', () => {
      const feeCalculation = calculateMonthlyFees(mockRoom);
      expect(validateFeeCalculation(feeCalculation)).toBe(true);
    });

    it('should reject negative rental amount', () => {
      const invalidCalculation = {
        rentalAmount: -1000,
        electricityAmount: 200_000,
        waterAmount: 100_000,
        garbageAmount: 50_000,
        parkingAmount: 150_000,
        adjustments: 0,
        totalAmount: 499_000,
      };

      expect(validateFeeCalculation(invalidCalculation)).toBe(false);
    });

    it('should reject incorrect total', () => {
      const invalidCalculation = {
        rentalAmount: 3_000_000,
        electricityAmount: 200_000,
        waterAmount: 100_000,
        garbageAmount: 50_000,
        parkingAmount: 150_000,
        adjustments: 0,
        totalAmount: 9_999_999, // Wrong total
      };

      expect(validateFeeCalculation(invalidCalculation)).toBe(false);
    });

    it('should allow small floating point errors', () => {
      const calculationWithRoundingError = {
        rentalAmount: 3_000_000,
        electricityAmount: 200_000,
        waterAmount: 100_000,
        garbageAmount: 50_000,
        parkingAmount: 150_000,
        adjustments: 0,
        totalAmount: 3_500_000.005, // Small rounding error
      };

      expect(validateFeeCalculation(calculationWithRoundingError)).toBe(true);
    });
  });
});
