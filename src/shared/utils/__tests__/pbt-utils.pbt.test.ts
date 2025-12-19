import {
  roomCodeArbitrary,
  phoneNumberArbitrary,
  emailArbitrary,
  monetaryAmountArbitrary,
  roomStatusArbitrary,
  paymentStatusArbitrary,
  runPropertyTest,
} from '../pbt-utils';

describe('Property-Based Testing Utilities', () => {
  /**
   * Feature: rental-management-app, Property Test: Room code generator produces valid codes
   */
  it('should generate valid room codes', async () => {
    await runPropertyTest(roomCodeArbitrary(), (roomCode) => {
      // Room codes should be 3-10 alphanumeric characters
      return /^[A-Z0-9]{3,10}$/.test(roomCode);
    });
  });

  /**
   * Feature: rental-management-app, Property Test: Phone number generator produces valid numbers
   */
  it('should generate valid phone numbers', async () => {
    await runPropertyTest(phoneNumberArbitrary(), (phone) => {
      // Phone numbers should match Vietnamese format
      return /^(0|\+84)[0-9]{9}$/.test(phone);
    });
  });

  /**
   * Feature: rental-management-app, Property Test: Email generator produces valid emails
   */
  it('should generate valid email addresses', async () => {
    await runPropertyTest(emailArbitrary(), (email) => {
      // Emails should contain @ and domain
      return email.includes('@') && email.includes('.');
    });
  });

  /**
   * Feature: rental-management-app, Property Test: Monetary amount generator produces non-negative values
   */
  it('should generate non-negative monetary amounts', async () => {
    await runPropertyTest(monetaryAmountArbitrary(), (amount) => {
      return amount >= 0 && amount <= 100_000_000;
    });
  });

  /**
   * Feature: rental-management-app, Property Test: Room status generator produces valid statuses
   */
  it('should generate valid room statuses', async () => {
    await runPropertyTest(roomStatusArbitrary(), (status) => {
      return ['vacant', 'occupied', 'maintenance'].includes(status);
    });
  });

  /**
   * Feature: rental-management-app, Property Test: Payment status generator produces valid statuses
   */
  it('should generate valid payment statuses', async () => {
    await runPropertyTest(paymentStatusArbitrary(), (status) => {
      return ['unpaid', 'partial', 'paid', 'overdue'].includes(status);
    });
  });
});
