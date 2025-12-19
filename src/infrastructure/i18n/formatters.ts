import { format as dateFnsFormat, parseISO } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import type { SupportedLanguage } from './config';

// Locale mapping for date-fns
const localeMap = {
  en: enUS,
  vi: vi,
};

/**
 * Format a date according to the current locale
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param formatString - Format string (default: 'PP' for localized date)
 * @param language - Language code (default: 'en')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  formatString: string = 'PP',
  language: SupportedLanguage = 'en'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    const locale = localeMap[language];
    return dateFnsFormat(dateObj, formatString, { locale });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Format a date and time according to the current locale
 * @param date - Date to format
 * @param language - Language code (default: 'en')
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date: Date | string | number,
  language: SupportedLanguage = 'en'
): string => {
  return formatDate(date, 'PPp', language);
};

/**
 * Format a number according to the current locale
 * @param value - Number to format
 * @param language - Language code (default: 'en')
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  language: SupportedLanguage = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  try {
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(value);
  }
};

/**
 * Format a currency value according to the current locale
 * @param value - Amount to format
 * @param language - Language code (default: 'en')
 * @param currency - Currency code (default: 'VND' for Vietnamese, 'USD' for English)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  language: SupportedLanguage = 'en',
  currency?: string
): string => {
  try {
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    const currencyCode = currency || (language === 'vi' ? 'VND' : 'USD');

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'VND' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'VND' ? 0 : 2,
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return String(value);
  }
};

/**
 * Format a percentage according to the current locale
 * @param value - Value to format (0-1 range, e.g., 0.15 for 15%)
 * @param language - Language code (default: 'en')
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  language: SupportedLanguage = 'en',
  decimals: number = 0
): string => {
  try {
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return String(value);
  }
};

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to format
 * @param language - Language code (default: 'en')
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (
  date: Date | string | number,
  language: SupportedLanguage = 'en'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    // Determine the appropriate unit
    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'week', seconds: 604800 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 },
    ];

    for (const { unit, seconds } of units) {
      const value = Math.floor(diffInSeconds / seconds);
      if (Math.abs(value) >= 1) {
        return rtf.format(-value, unit);
      }
    }

    return rtf.format(0, 'second');
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return String(date);
  }
};
