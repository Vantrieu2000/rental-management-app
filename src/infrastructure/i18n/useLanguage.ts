import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import type { SupportedLanguage } from './config';

/**
 * Custom hook for managing language preferences
 * Provides access to current language and function to change it
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as SupportedLanguage;

  const changeLanguage = useCallback(
    async (language: SupportedLanguage) => {
      try {
        await i18n.changeLanguage(language);
      } catch (error) {
        console.error('Error changing language:', error);
        throw error;
      }
    },
    [i18n]
  );

  return {
    currentLanguage,
    changeLanguage,
  };
};
