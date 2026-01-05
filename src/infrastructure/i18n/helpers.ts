/**
 * i18n Helper Functions
 * Utility functions for language management
 */

import i18n from './config';

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'vi'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Change language
 */
export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language);
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

/**
 * Get available languages
 */
export const getAvailableLanguages = () => [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

/**
 * Custom hook for managing language preferences
 */
export const useLanguage = () => {
  const currentLanguage = i18n.language as SupportedLanguage;

  const changeLanguageCallback = async (language: SupportedLanguage) => {
    try {
      await changeLanguage(language);
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  };

  return {
    currentLanguage,
    changeLanguage: changeLanguageCallback,
  };
};
