import { useState, useCallback, useEffect } from 'react';

import { AVAILABLE_LANGUAGES, LANGUAGE_CONFIG, LanguageOption } from '@/lib/constants';
import { i18n } from '@/lib/i18n';

/**
 * Language switcher hook
 * Manages application language state and switching logic
 */
export const useLanguage = () => {
  /**
   * Initialize current language state
   */
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(() => {
    const langKey = i18n.language || LANGUAGE_CONFIG.DEFAULT_LANGUAGE;
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
   * Update i18n and document properties
   */
  const switchLanguage = useCallback((languageKey: string) => {
    const newLanguage = AVAILABLE_LANGUAGES.find(lang => lang.key === languageKey);

    if (newLanguage) {
      // Update i18n language
      i18n.changeLanguage(languageKey);

      // No need to update localStorage here as it's handled by i18n event listener
    }
  }, []);

  /**
   * Listen for language changes from i18n
   */
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const newLanguage = AVAILABLE_LANGUAGES.find(lang => lang.key === lng);
      if (newLanguage) {
        setCurrentLanguage(newLanguage);
        updateDocumentLanguageProperties(newLanguage);
      }
    };

    // Set initial document properties
    updateDocumentLanguageProperties(currentLanguage);

    // Listen for language change events
    i18n.on('languageChanged', handleLanguageChanged);

    // Cleanup function
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [currentLanguage, updateDocumentLanguageProperties]);

  return {
    currentLanguage,
    switchLanguage,
    availableLanguages: AVAILABLE_LANGUAGES
  };
};
