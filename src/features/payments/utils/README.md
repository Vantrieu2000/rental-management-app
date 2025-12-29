# Fee Calculation Utilities

This module provides utilities for calculating monthly fees, managing utility rates, and generating itemized bills for rental properties.

## Features

### 1. Monthly Fee Calculation

Calculate total monthly fees for a room including rent and all utility fees:

```typescript
import { calculateMonthlyFees } from './feeCalculation';

const room = {
  rentalPrice: 3_000_000,
  electricityFee: 200_000,
  waterFee: 100_000,
  garbageFee: 50_000,
  parkingFee: 150_000,
  // ... other room properties
};

const fees = calculateMonthlyFees(room);
// Result: { rentalAmount, electricityAmount, waterAmount, garbageAmount, parkingAmount, adjustments, totalAmount }
```

### 2. Custom Fee Adjustments

Apply custom adjustments (positive or negative) to fee calculations:

```typescript
import { applyFeeAdjustment } from './feeCalculation';

const baseFees = calculateMonthlyFees(room);
const adjustedFees = applyFeeAdjustment(baseFees, 100_000); // Add 100,000 VND
```

### 3. Itemized Bill Generation

Generate detailed bills with line items for each fee component:

```typescript
import { generateItemizedBill } from './feeCalculation';

const bill = generateItemizedBill(
  room,
  tenant,
  feeCalculation,
  12, // December
  2024,
  new Date('2024-12-05') // Due date
);

// Result includes:
// - roomCode, roomName, tenantName
// - billingPeriod (e.g., "December 2024")
// - items array with description and amount for each fee
// - adjustments and totalAmount
```

### 4. Historical Rate Management

Preserve historical utility rates for accurate billing:

```typescript
import { createRateHistory, getApplicableRates, calculateFeesWithHistoricalRates } from './feeCalculation';

// Create a rate history record when rates change
const rateHistory = createRateHistory(roomId, propertyId, room, new Date('2024-01-01'));

// Get applicable rates for a specific billing period
const applicableRates = getApplicableRates(rateHistories, 3, 2024); // March 2024

// Calculate fees using historical rates
const fees = calculateFeesWithHistoricalRates(room, applicableRates);
```

## Requirements Validation

This module implements the following requirements:

- **Requirement 6.1**: Calculate total fees by summing rental price and all utility fees
- **Requirement 6.2**: Apply new rates to subsequent billing periods without affecting historical records
- **Requirement 6.3**: Include itemized breakdown of rent and each utility fee
- **Requirement 6.4**: Support custom fee adjustments for individual rooms

## Testing

The module includes comprehensive testing:

### Unit Tests
- Specific examples and edge cases
- Located in `__tests__/feeCalculation.test.ts`

### Property-Based Tests
- Universal properties verified across 100+ random inputs
- Located in `__tests__/feeCalculation.pbt.test.ts`
- Validates:
  - **Property 22**: Fee calculation sums correctly
  - **Property 23**: Rate changes preserve history
  - **Property 24**: Bills include itemized breakdown
  - **Property 25**: Custom adjustments apply correctly

Run tests:
```bash
npm test -- feeCalculation
```

## API Reference

### `calculateMonthlyFees(room: Room, adjustments?: number): FeeCalculation`
Calculates total monthly fees for a room.

### `applyFeeAdjustment(baseCalculation: FeeCalculation, adjustment: number): FeeCalculation`
Applies a custom adjustment to a fee calculation.

### `generateItemizedBill(room: Room, tenant: Tenant, feeCalculation: FeeCalculation, billingMonth: number, billingYear: number, dueDate: Date): ItemizedBill`
Generates an itemized bill with detailed breakdown.

### `createRateHistory(roomId: string, propertyId: string, room: Room, effectiveDate?: Date): RateHistory`
Creates a rate history record for preserving historical rates.

### `getApplicableRates(rateHistories: RateHistory[], billingMonth: number, billingYear: number): RateHistory | null`
Gets the applicable rates for a specific billing period.

### `calculateFeesWithHistoricalRates(room: Room, rateHistory: RateHistory, adjustments?: number): FeeCalculation`
Calculates fees using historical rates.

### `validateFeeCalculation(feeCalculation: FeeCalculation): boolean`
Validates that a fee calculation is correct.
