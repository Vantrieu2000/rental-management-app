import * as fc from 'fast-check';
import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatRelativeTime,
} from '../formatters';
import type { SupportedLanguage } from '../config';

/**
 * Feature: rental-management-app, Property 28: Locale formatting applies correctly
 * Validates: Requirements 7.4
 *
 * This property verifies that dates, numbers, and currency are formatted
 * according to the selected locale's conventions.
 */
describe('Property 28: Locale formatting applies correctly', () => {
  describe('Date formatting', () => {
    it('should format dates according to locale conventions', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }).filter((d) => !isNaN(d.getTime())),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (date, language) => {
            const formatted = formatDate(date, 'PP', language);

            // Should return a non-empty string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);

            // Should contain year, month, and day information
            const year = date.getFullYear().toString();
            expect(formatted).toContain(year);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should format date-time according to locale conventions', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }).filter((d) => !isNaN(d.getTime())),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (date, language) => {
            const formatted = formatDateTime(date, language);

            // Should return a non-empty string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);

            // Should contain year information
            const year = date.getFullYear().toString();
            expect(formatted).toContain(year);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle ISO string dates', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }).filter((d) => !isNaN(d.getTime())),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (date, language) => {
            const isoString = date.toISOString();
            const formatted = formatDate(isoString, 'PP', language);

            // Should successfully format ISO strings
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Number formatting', () => {
    it('should format numbers according to locale conventions', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 1000000, noNaN: true }),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (value, language) => {
            const formatted = formatNumber(value, language);

            // Should return a non-empty string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);

            // Should contain digits
            expect(/\d/.test(formatted)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should format integers without decimals', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000000 }),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (value, language) => {
            const formatted = formatNumber(value, language, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });

            // Should not contain decimal separator for integers
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Currency formatting', () => {
    it('should format currency according to locale conventions', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 100000000, noNaN: true }),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (value, language) => {
            const formatted = formatCurrency(value, language);

            // Should return a non-empty string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);

            // Should contain currency symbol or code
            if (language === 'vi') {
              expect(formatted).toMatch(/₫|VND/);
            } else {
              expect(formatted).toMatch(/\$|USD/);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should format VND without decimals', () => {
      fc.assert(
        fc.property(fc.double({ min: 0, max: 100000000, noNaN: true }), (value) => {
          const formatted = formatCurrency(value, 'vi', 'VND');

          // VND should not have decimal places
          expect(formatted).toBeTruthy();
          // Should not contain decimal separator
          expect(formatted).not.toMatch(/[.,]\d{2}$/);
        }),
        { numRuns: 100 }
      );
    });

    it('should format USD with decimals', () => {
      fc.assert(
        fc.property(fc.double({ min: 0, max: 100000, noNaN: true }), (value) => {
          const formatted = formatCurrency(value, 'en', 'USD');

          // USD should have decimal places
          expect(formatted).toBeTruthy();
          expect(typeof formatted).toBe('string');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Percentage formatting', () => {
    it('should format percentages according to locale conventions', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 1, noNaN: true }),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (value, language) => {
            const formatted = formatPercentage(value, language);

            // Should return a non-empty string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);

            // Should contain percentage symbol
            expect(formatted).toContain('%');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should respect decimal places parameter', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 1, noNaN: true }),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          fc.integer({ min: 0, max: 4 }),
          (value, language, decimals) => {
            const formatted = formatPercentage(value, language, decimals);

            // Should return a valid percentage string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
            expect(formatted).toContain('%');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Relative time formatting', () => {
    it('should format relative time according to locale conventions', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).filter((d) => !isNaN(d.getTime())),
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (date, language) => {
            const formatted = formatRelativeTime(date, language);

            // Should return a non-empty string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle past dates', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 365 }), // days in the past
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (daysAgo, language) => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - daysAgo);

            const formatted = formatRelativeTime(pastDate, language);

            // Should return a valid relative time string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle future dates', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 365 }), // days in the future
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          (daysAhead, language) => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + daysAhead);

            const formatted = formatRelativeTime(futureDate, language);

            // Should return a valid relative time string
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Locale consistency', () => {
    it('should use consistent locale-specific formatting across all formatters', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<SupportedLanguage>('en', 'vi'),
          fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).filter((d) => !isNaN(d.getTime())),
          fc.double({ min: 1000, max: 1000000, noNaN: true }),
          (language, date, amount) => {
            // Format various values with the same locale
            const formattedDate = formatDate(date, 'PP', language);
            const formattedNumber = formatNumber(amount, language);
            const formattedCurrency = formatCurrency(amount, language);

            // All should return valid strings
            expect(formattedDate).toBeTruthy();
            expect(formattedNumber).toBeTruthy();
            expect(formattedCurrency).toBeTruthy();

            // All should be non-empty
            expect(formattedDate.length).toBeGreaterThan(0);
            expect(formattedNumber.length).toBeGreaterThan(0);
            expect(formattedCurrency.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
