import fc from 'fast-check';

/**
 * Property-Based Testing Utilities
 *
 * This file contains custom arbitraries (generators) for property-based testing
 * using fast-check. Each arbitrary generates random valid data for testing.
 */

// Common arbitraries

/**
 * Generates a valid room code (alphanumeric, 3-10 characters)
 */
export const roomCodeArbitrary = () => fc.stringMatching(/^[A-Z0-9]{3,10}$/);

/**
 * Generates a valid room name
 */
export const roomNameArbitrary = () => fc.string({ minLength: 1, maxLength: 100 });

/**
 * Generates a valid phone number (Vietnamese format)
 */
export const phoneNumberArbitrary = () => fc.stringMatching(/^(0|\+84)[0-9]{9}$/);

/**
 * Generates a valid email address
 */
export const emailArbitrary = () => fc.emailAddress();

/**
 * Generates a positive monetary amount (0 to 100,000,000 VND)
 */
export const monetaryAmountArbitrary = () => fc.integer({ min: 0, max: 100_000_000 });

/**
 * Generates a valid date in the past year
 */
export const pastDateArbitrary = () => fc.date({ max: new Date() });

/**
 * Generates a valid future date (up to 1 year ahead)
 */
export const futureDateArbitrary = () => {
  const now = new Date();
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  return fc.date({ min: now, max: oneYearFromNow });
};

/**
 * Generates a valid billing month (1-12)
 */
export const billingMonthArbitrary = () => fc.integer({ min: 1, max: 12 });

/**
 * Generates a valid billing year (2020-2030)
 */
export const billingYearArbitrary = () => fc.integer({ min: 2020, max: 2030 });

/**
 * Generates a room status
 */
export const roomStatusArbitrary = () => fc.constantFrom('vacant', 'occupied', 'maintenance');

/**
 * Generates a payment status
 */
export const paymentStatusArbitrary = () => fc.constantFrom('unpaid', 'partial', 'paid', 'overdue');

/**
 * Generates a payment method
 */
export const paymentMethodArbitrary = () => fc.constantFrom('cash', 'bank_transfer', 'e_wallet');

/**
 * Generates a maintenance priority
 */
export const maintenancePriorityArbitrary = () =>
  fc.constantFrom('low', 'medium', 'high', 'urgent');

/**
 * Generates a maintenance status
 */
export const maintenanceStatusArbitrary = () =>
  fc.constantFrom('pending', 'in_progress', 'completed', 'cancelled');

/**
 * Generates a valid UUID
 */
export const uuidArbitrary = () => fc.uuid();

/**
 * Helper function to run property tests with standard configuration
 * Runs 100 iterations by default as specified in the design document
 */
export const runPropertyTest = <T>(
  arbitrary: fc.Arbitrary<T>,
  predicate: (value: T) => boolean | Promise<boolean>,
  options?: fc.Parameters<[T]>
) => {
  return fc.assert(
    fc.asyncProperty(arbitrary, async (value) => {
      const result = await Promise.resolve(predicate(value));
      return result;
    }),
    { numRuns: 100, ...options }
  );
};
