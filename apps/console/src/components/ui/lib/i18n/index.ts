export type Locale = 'en' | 'zh-CN' | string;

export interface LocaleConfig {
  locale: Locale;
  direction?: 'ltr' | 'rtl';
  label: string;
}

// Type for messages
export interface Messages {
  [key: string]: string | Messages;
}

// Language mapping
export const LOCALE_MAPPING: Record<string, Locale> = {
  zh: 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-CN': 'zh-CN',
  en: 'en',
  'en-US': 'en',
  'en-GB': 'en'
};

// All supported locales
export const SUPPORTED_LOCALES: Record<Locale, LocaleConfig> = {
  en: { locale: 'en', direction: 'ltr', label: 'English' },
  'zh-CN': { locale: 'zh-CN', direction: 'ltr', label: '简体中文' }
};

// Normalize the locale to a standard format
export function normalizeLocale(locale: string): Locale {
  return LOCALE_MAPPING[locale] || locale;
}

// Detect user's preferred language
export function detectUserLocale(): Locale {
  let userLocale: Locale = 'en';

  try {
    // Try to get from localStorage first (for returning users)
    const savedLocale = localStorage.getItem('nco-editor-locale');
    if (savedLocale && Object.keys(SUPPORTED_LOCALES).includes(savedLocale)) {
      return savedLocale as Locale;
    }

    // Try to get from browser settings
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang) {
      // Check if we have an exact match
      if (Object.keys(SUPPORTED_LOCALES).includes(browserLang)) {
        userLocale = browserLang as Locale;
      } else {
        // Check for language match without region (e.g., 'en-US' -> 'en')
        const langCode = browserLang.split('-')[0];
        const match = Object.keys(SUPPORTED_LOCALES).find(
          locale => locale === langCode || locale.startsWith(`${langCode}-`)
        );
        if (match) {
          userLocale = match as Locale;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to detect user locale:', e);
  }

  return userLocale;
}

export * from './provider';
