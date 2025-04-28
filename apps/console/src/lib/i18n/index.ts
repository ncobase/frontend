import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { LANGUAGE_CONFIG, AVAILABLE_LANGUAGES } from '../constants';

import versionInfo from '@/../version.json';

/**
 * Get initial language
 * Priority: Local Storage > Browser Language > Default Language
 */
const getInitialLanguage = (): string => {
  // Try to get language from local storage
  const storedLang = localStorage.getItem(LANGUAGE_CONFIG.STORAGE_KEY);
  if (storedLang) return storedLang;

  // Get browser language
  const browserLang = navigator.language.split('-')[0];

  // Match available languages
  const matchedLang = AVAILABLE_LANGUAGES.find(lang => lang.key === browserLang);

  return matchedLang?.key || LANGUAGE_CONFIG.DEFAULT_LANGUAGE;
};

/**
 * i18n Configuration
 * Handle language resource loading and initialization
 */

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    // Initial language
    lng: getInitialLanguage(),

    // Fallback language
    fallbackLng: LANGUAGE_CONFIG.DEFAULT_LANGUAGE,

    // Language resource loading configuration
    backend: {
      // TODO: change to api url
      // Language resource path
      // loadPath: `${request.config.baseURL}/locales/{{lng}}.json`,
      loadPath: '/assets/locales/{{lng}}.json',

      // Add version control
      queryStringParams: {
        v: versionInfo?.commit || 'latest'
      }
    },

    // Interpolation configuration
    interpolation: {
      // Prevent XSS attacks, disable by default
      escapeValue: false
    },

    // Handle missing keys
    returnNull: false,

    // Debug mode (disabled in production)
    debug: false // process.env.NODE_ENV === 'development'
  });

// Update local storage when language changes
i18n.on('languageChanged', lng => {
  localStorage.setItem(LANGUAGE_CONFIG.STORAGE_KEY, lng);
});

export { i18n };

export { I18nextProvider as I18nProvider, useTranslation } from 'react-i18next';
