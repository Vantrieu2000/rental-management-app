/**
 * i18n Configuration
 * Internationalization setup using react-i18next
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '../config/env';

// Import translations
import vi from './locales/vi.json';
import en from './locales/en.json';

// Storage key for language preference
const LANGUAGE_KEY = 'app_language';

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'vi'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Get stored language preference
 */
const getStoredLanguage = async (): Promise<string> => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    return stored || env.defaultLanguage;
  } catch (error) {
    console.error('Failed to get stored language:', error);
    return env.defaultLanguage;
  }
};

/**
 * Store language preference
 */
export const setStoredLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to store language:', error);
  }
};

/**
 * Initialize i18n
 */
export const initI18n = async (): Promise<void> => {
  const storedLanguage = await getStoredLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        vi: { translation: vi },
        en: { translation: en },
      },
      lng: storedLanguage,
      fallbackLng: 'vi',
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

/**
 * Change language
 */
export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language);
  await setStoredLanguage(language);
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language || env.defaultLanguage;
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

export default i18n;
