/**
 * Fee Calculation Utilities
 *
 * This module provides utilities for calculating monthly fees, managing utility rates,
 * and generating itemized bills for rental properties.
 */

import { Room } from '../../rooms/types';
import { Tenant } from '../../tenants/types';
import { FeeCalculation, ItemizedBill, BillItem, RateHistory } from '../types';

/**
 * Calculate total monthly fees for a room
 *
 * Requirement 6.1: Calculate total fees by summing rental price and all utility fees
 *
 * @param room - The room with pricing information
 * @param adjustments - Optional custom adjustments (positive or negative)
 * @returns FeeCalculation object with itemized amounts
 */
export function calculateMonthlyFees(room: Room, adjustments: number = 0): FeeCalculation {
  const rentalAmount = room.rentalPrice;
  const electricityAmount = room.electricityFee;
  const waterAmount = room.waterFee;
  const garbageAmount = room.garbageFee;
  const parkingAmount = room.parkingFee;

  const totalAmount =
    rentalAmount +
    electricityAmount +
    waterAmount +
    garbageAmount +
    parkingAmount +
    adjustments;

  return {
    rentalAmount,
    electricityAmount,
    waterAmount,
    garbageAmount,
    parkingAmount,
    adjustments,
    totalAmount,
  };
}

/**
 * Apply custom fee adjustments to a fee calculation
 *
 * Requirement 6.4: Support custom fee adjustments for individual rooms
 *
 * @param baseCalculation - The base fee calculation
 * @param adjustment - The adjustment amount (can be positive or negative)
 * @returns Updated FeeCalculation with adjustment applied
 */
export function applyFeeAdjustment(
  baseCalculation: FeeCalculation,
  adjustment: number
): FeeCalculation {
  return {
    ...baseCalculation,
    adjustments: baseCalculation.adjustments + adjustment,
    totalAmount: baseCalculation.totalAmount + adjustment,
  };
}

/**
 * Generate an itemized bill for a room
 *
 * Requirement 6.3: Include itemized breakdown of rent and each utility fee
 *
 * @param room - The room information
 * @param tenant - The tenant information
 * @param feeCalculation - The calculated fees
 * @param billingMonth - The billing month (1-12)
 * @param billingYear - The billing year
 * @param dueDate - The payment due date
 * @returns ItemizedBill with detailed breakdown
 */
export function generateItemizedBill(
  room: Room,
  tenant: Tenant,
  feeCalculation: FeeCalculation,
  billingMonth: number,
  billingYear: number,
  dueDate: Date
): ItemizedBill {
  const items: BillItem[] = [];

  // Add rental fee
  items.push({
    description: 'Rental Fee',
    amount: feeCalculation.rentalAmount,
  });

  // Add electricity fee if applicable
  if (feeCalculation.electricityAmount > 0) {
    items.push({
      description: 'Electricity Fee',
      amount: feeCalculation.electricityAmount,
    });
  }

  // Add water fee if applicable
  if (feeCalculation.waterAmount > 0) {
    items.push({
      description: 'Water Fee',
      amount: feeCalculation.waterAmount,
    });
  }

  // Add garbage fee if applicable
  if (feeCalculation.garbageAmount > 0) {
    items.push({
      description: 'Garbage Collection Fee',
      amount: feeCalculation.garbageAmount,
    });
  }

  // Add parking fee if applicable
  if (feeCalculation.parkingAmount > 0) {
    items.push({
      description: 'Vehicle Parking Fee',
      amount: feeCalculation.parkingAmount,
    });
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return {
    roomCode: room.roomCode,
    roomName: room.roomName,
    tenantName: tenant.name,
    billingPeriod: `${monthNames[billingMonth - 1]} ${billingYear}`,
    dueDate,
    items,
    adjustments: feeCalculation.adjustments,
    totalAmount: feeCalculation.totalAmount,
  };
}

/**
 * Create a rate history record for preserving historical rates
 *
 * Requirement 6.2: Apply new rates to subsequent billing periods without affecting historical records
 *
 * @param roomId - The room ID
 * @param propertyId - The property ID
 * @param room - The room with current rates
 * @param effectiveDate - The date when these rates become effective
 * @returns RateHistory record
 */
export function createRateHistory(
  roomId: string,
  propertyId: string,
  room: Room,
  effectiveDate: Date = new Date()
): RateHistory {
  return {
    id: `rate_${roomId}_${effectiveDate.getTime()}`,
    roomId,
    propertyId,
    effectiveDate,
    electricityRate: room.electricityFee,
    waterRate: room.waterFee,
    garbageRate: room.garbageFee,
    parkingRate: room.parkingFee,
    createdAt: new Date(),
  };
}

/**
 * Get applicable rates for a specific billing period
 *
 * Requirement 6.2: Historical rates should be preserved and used for past billing periods
 *
 * @param rateHistories - Array of rate history records for a room
 * @param billingMonth - The billing month
 * @param billingYear - The billing year
 * @returns The applicable rates for the billing period
 */
export function getApplicableRates(
  rateHistories: RateHistory[],
  billingMonth: number,
  billingYear: number
): RateHistory | null {
  if (rateHistories.length === 0) {
    return null;
  }

  // Create a date for the billing period (first day of the month)
  const billingDate = new Date(billingYear, billingMonth - 1, 1);

  // Sort rate histories by effective date (newest first)
  const sortedHistories = [...rateHistories].sort(
    (a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime()
  );

  // Find the most recent rate history that was effective before or on the billing date
  for (const history of sortedHistories) {
    if (history.effectiveDate <= billingDate) {
      return history;
    }
  }

  // If no applicable rate found, return the oldest rate
  return sortedHistories[sortedHistories.length - 1];
}

/**
 * Calculate fees using historical rates
 *
 * Requirement 6.2: Use historical rates for past billing periods
 *
 * @param room - The room information (for rental price and room details)
 * @param rateHistory - The applicable rate history for the billing period
 * @param adjustments - Optional custom adjustments
 * @returns FeeCalculation with historical rates applied
 */
export function calculateFeesWithHistoricalRates(
  room: Room,
  rateHistory: RateHistory,
  adjustments: number = 0
): FeeCalculation {
  const rentalAmount = room.rentalPrice;
  const electricityAmount = rateHistory.electricityRate;
  const waterAmount = rateHistory.waterRate;
  const garbageAmount = rateHistory.garbageRate;
  const parkingAmount = rateHistory.parkingRate;

  const totalAmount =
    rentalAmount +
    electricityAmount +
    waterAmount +
    garbageAmount +
    parkingAmount +
    adjustments;

  return {
    rentalAmount,
    electricityAmount,
    waterAmount,
    garbageAmount,
    parkingAmount,
    adjustments,
    totalAmount,
  };
}

/**
 * Validate fee calculation
 *
 * @param feeCalculation - The fee calculation to validate
 * @returns true if valid, false otherwise
 */
export function validateFeeCalculation(feeCalculation: FeeCalculation): boolean {
  // All amounts should be non-negative (except adjustments which can be negative)
  if (
    feeCalculation.rentalAmount < 0 ||
    feeCalculation.electricityAmount < 0 ||
    feeCalculation.waterAmount < 0 ||
    feeCalculation.garbageAmount < 0 ||
    feeCalculation.parkingAmount < 0
  ) {
    return false;
  }

  // Total should equal sum of all components
  const expectedTotal =
    feeCalculation.rentalAmount +
    feeCalculation.electricityAmount +
    feeCalculation.waterAmount +
    feeCalculation.garbageAmount +
    feeCalculation.parkingAmount +
    feeCalculation.adjustments;

  // Allow for small floating point errors
  return Math.abs(feeCalculation.totalAmount - expectedTotal) < 0.01;
}
