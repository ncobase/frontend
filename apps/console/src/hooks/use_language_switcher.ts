import { useState, useCallback, useEffect } from 'react';

import i18n from 'i18next';

import { AVAILABLE_LANGUAGES, LANGUAGE_CONFIG, LanguageOption } from '@/lib/constants';

/**
 * Language switcher hook
 * Manages application language state and switching logic
 */
export const useLanguageSwitcher = () => {
  /**
   * Get current language
   * Priority: Local storage > Browser language > Default language
   */
  const getCurrentLanguage = useCallback((): string => {
    // Try to get language from local storage
    const storedLang = localStorage.getItem(LANGUAGE_CONFIG.STORAGE_KEY);
    if (storedLang) return storedLang;

    // Get browser language
    const browserLang = navigator.language.split('-')[0];

    // Match available languages
    const matchedLang = AVAILABLE_LANGUAGES.find(lang => lang.key === browserLang);

    return matchedLang?.key || LANGUAGE_CONFIG.DEFAULT_LANGUAGE;
  }, []);

  /**
   * Initialize current language state
   */
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(() => {
    const langKey = getCurrentLanguage();
    return (
      AVAILABLE_LANGUAGES.find(lang => lang.key === langKey) ||
      AVAILABLE_LANGUAGES.find(lang => lang.key === LANGUAGE_CONFIG.DEFAULT_LANGUAGE)!
    );
  });

  /**
   * Update document language properties
   * Set document language, direction and font scaling
   */
  const updateDocumentLanguageProperties = useCallback((language: LanguageOption) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language.key.toLowerCase();
      document.documentElement.dir = language.dir || 'ltr';
      document.documentElement.style.fontSize = `${(language.fontScale || 1) * 100}%`;
    }
  }, []);

  /**
   * Switch language
   * Update i18n, local storage and document properties
   */
  const switchLanguage = useCallback(
    (languageKey: string) => {
      const newLanguage = AVAILABLE_LANGUAGES.find(lang => lang.key === languageKey);

      if (newLanguage) {
        // Update i18n language
        i18n.changeLanguage(languageKey);

        // Update local storage
        localStorage.setItem(LANGUAGE_CONFIG.STORAGE_KEY, languageKey);

        // Update current language state
        setCurrentLanguage(newLanguage);

        // Update document properties
        updateDocumentLanguageProperties(newLanguage);
      }
    },
    [updateDocumentLanguageProperties]
  );

  /**
   * Update document language properties on initialization
   */
  useEffect(() => {
    updateDocumentLanguageProperties(currentLanguage);
  }, [currentLanguage, updateDocumentLanguageProperties]);

  return {
    currentLanguage,
    switchLanguage,
    availableLanguages: AVAILABLE_LANGUAGES
  };
};
