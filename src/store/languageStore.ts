import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import i18n from '../infrastructure/i18n/config';

export type Language = 'en' | 'vi';

interface LanguageStore {
  language: Language;
  isLoading: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  loadLanguage: () => Promise<void>;
}

const LANGUAGE_STORAGE_KEY = 'user_language_preference';

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: 'en',
  isLoading: false,

  setLanguage: async (lang: Language) => {
    try {
      set({ isLoading: true });
      
      // Save to secure storage
      await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, lang);
      
      // Change i18n language
      await i18n.changeLanguage(lang);
      
      // Update store
      set({ language: lang, isLoading: false });
      
      console.log(`Language changed to: ${lang}`);
    } catch (error) {
      console.error('Failed to set language:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  loadLanguage: async () => {
    try {
      set({ isLoading: true });
      
      // Load from secure storage
      const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
      
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
        // Change i18n language
        await i18n.changeLanguage(savedLanguage);
        
        // Update store
        set({ language: savedLanguage, isLoading: false });
        
        console.log(`Loaded saved language: ${savedLanguage}`);
      } else {
        // Use current i18n language (device default)
        const currentLang = i18n.language as Language;
        set({ language: currentLang, isLoading: false });
        
        console.log(`Using device language: ${currentLang}`);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
      set({ isLoading: false });
    }
  },
}));
