import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { canSetStorage } from './lib/cookieUtils';

import en from './locales/en.json';
import de from './locales/de.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      de: de
    },
    fallbackLng: 'en',
    detection: {
      // Only cache language if user has given consent
      caches: canSetStorage() ? ['cookie', 'localStorage'] : [],
      cookieMinutes: 365 * 24 * 60,
      lookupCookie: 'i18next',
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
