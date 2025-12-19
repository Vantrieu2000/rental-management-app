/**
 * Custom Jest Matchers
 *
 * This file contains custom matchers for Jest to improve test readability
 * and provide domain-specific assertions.
 */

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidRoomCode(): R;
      toBeValidPhoneNumber(): R;
      toBeValidEmail(): R;
      toBePositiveAmount(): R;
      toBeValidDate(): R;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export const customMatchers = {
  /**
   * Checks if a string is a valid room code
   */
  toBeValidRoomCode(received: string) {
    const pass = /^[A-Z0-9]{3,10}$/.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid room code`
          : `expected ${received} to be a valid room code (3-10 alphanumeric characters)`,
    };
  },

  /**
   * Checks if a string is a valid phone number (Vietnamese format)
   */
  toBeValidPhoneNumber(received: string) {
    const pass = /^(0|\+84)[0-9]{9}$/.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid phone number`
          : `expected ${received} to be a valid Vietnamese phone number`,
    };
  },

  /**
   * Checks if a string is a valid email
   */
  toBeValidEmail(received: string) {
    const pass = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid email`
          : `expected ${received} to be a valid email address`,
    };
  },

  /**
   * Checks if a number is a positive amount
   */
  toBePositiveAmount(received: number) {
    const pass = typeof received === 'number' && received >= 0 && isFinite(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a positive amount`
          : `expected ${received} to be a positive number`,
    };
  },

  /**
   * Checks if a value is a valid date
   */
  toBeValidDate(received: unknown) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid date`
          : `expected ${received} to be a valid Date object`,
    };
  },
};

// Export a function to register the matchers
export const setupCustomMatchers = () => {
  expect.extend(customMatchers);
};
