/**
 * i18n Configuration
 * Internationalization setup using react-i18next
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { env } from '../config/env';

// Import translations
import vi from './locales/vi.json';
import en from './locales/en.json';

// Storage key for language preference
const LANGUAGE_KEY = 'app_language';

/**
 * Get stored language preference
 */
const getStoredLanguage = async (): Promise<string> => {
  try {
    const stored = await SecureStore.getItemAsync(LANGUAGE_KEY);
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
    await SecureStore.setItemAsync(LANGUAGE_KEY, language);
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
      compatibilityJSON: 'v3',
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

export default i18n;
