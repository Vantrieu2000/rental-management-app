/**
 * Currency Formatting Utility
 * Formats currency amounts based on locale
 */

/**
 * Format currency amount based on locale
 * @param amount - The amount to format
 * @param locale - The locale ('vi' for Vietnamese, 'en' for English)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, locale: 'vi' | 'en' = 'vi'): string {
  if (locale === 'vi') {
    // Vietnamese format: 3.000.000 ₫
    return `${amount.toLocaleString('vi-VN')} ₫`;
  } else {
    // English format: $3,000.00
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

/**
 * Parse currency string to number
 * @param currencyString - The currency string to parse
 * @param locale - The locale ('vi' for Vietnamese, 'en' for English)
 * @returns Parsed number
 */
export function parseCurrency(currencyString: string, locale: 'vi' | 'en' = 'vi'): number {
  // Remove currency symbols and spaces
  let cleaned = currencyString.replace(/[₫$\s]/g, '');

  if (locale === 'vi') {
    // Remove dots (thousand separators in Vietnamese)
    cleaned = cleaned.replace(/\./g, '');
  } else {
    // Remove commas (thousand separators in English)
    cleaned = cleaned.replace(/,/g, '');
  }

  return parseFloat(cleaned) || 0;
}
