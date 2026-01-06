import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// Get device locale, default to 'vi' (Vietnamese) if not supported
const locales = getLocales();
const deviceLocale = locales && locales.length > 0 ? locales[0].languageCode : 'vi';
const supportedLocales = ['en', 'vi'];
const initialLocale = supportedLocales.includes(deviceLocale || 'vi') ? deviceLocale : 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLocale,
    fallbackLng: 'vi', // Changed from 'en' to 'vi'
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    compatibilityJSON: 'v3', // For compatibility with older i18next versions
  });

export default i18n;
