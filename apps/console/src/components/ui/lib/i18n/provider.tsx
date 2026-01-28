import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useEffect
} from 'react';

import enMessages from './locales/en.json';
import zhMessages from './locales/zh.json';

import { Locale, Messages, SUPPORTED_LOCALES, detectUserLocale, normalizeLocale } from './index';

// Message bundles for all supported locales
const messageBundles: Record<Locale, Messages> = {
  en: enMessages,
  'zh-CN': zhMessages
};

interface I18nContextType {
  locale: Locale;
  messages: Messages;
  setLocale: (_locale: Locale | string) => void;
  t: (_key: string, _values?: Record<string, string>) => string;
}

const defaultContext: I18nContextType = {
  locale: 'en',
  messages: enMessages,
  setLocale: () => {},
  t: key => key
};

const I18nContext = createContext<I18nContextType>(defaultContext);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale | string;
  direction?: 'ltr' | 'rtl';
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLocale,
  direction
}) => {
  const normalizedInitialLocale = initialLocale
    ? normalizeLocale(initialLocale)
    : detectUserLocale();
  const [locale, setLocale] = useState<Locale>(normalizedInitialLocale);
  const [messages, setMessages] = useState<Messages>(
    messageBundles[normalizedInitialLocale] || enMessages
  );

  useEffect(() => {
    if (initialLocale) {
      const normalized = normalizeLocale(initialLocale);
      setLocale(normalized);
      setMessages(messageBundles[normalized] || enMessages);
    }
  }, [initialLocale]);

  useEffect(() => {
    const dir = direction || SUPPORTED_LOCALES[locale]?.direction || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;

    document.documentElement.setAttribute('data-language', locale);
  }, [locale, direction]);

  const handleSetLocale = useCallback(
    (newLocale: Locale | string) => {
      const normalizedLocale = normalizeLocale(newLocale);
      const localeToUse = Object.keys(messageBundles).includes(normalizedLocale)
        ? normalizedLocale
        : 'en';

      setLocale(localeToUse);
      setMessages(messageBundles[localeToUse] || messageBundles['en']);

      const dir = direction || SUPPORTED_LOCALES[localeToUse]?.direction || 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = localeToUse;

      try {
        localStorage.setItem('nco-editor-locale', localeToUse);
      } catch (e) {
        console.warn('Could not save locale preference', e);
      }
    },
    [direction]
  );

  const translate = useCallback(
    (key: string, values?: Record<string, string>): string => {
      const getValueByPath = (obj: any, path: string): any => {
        if (obj && typeof obj === 'object' && path in obj) {
          return obj[path];
        }
        const keys = path.split('.');
        let result = obj;
        for (const k of keys) {
          if (result && typeof result === 'object' && k in result) {
            result = result[k];
          } else {
            return undefined;
          }
        }
        return result;
      };
      let message = getValueByPath(messages, key);
      if (message === undefined && messages !== enMessages) {
        const fallbackMessage = getValueByPath(enMessages, key);

        if (typeof fallbackMessage === 'string') {
          message = fallbackMessage;
        } else {
          return key;
        }
      }
      if (typeof message === 'string') {
        if (values) {
          return Object.entries(values).reduce(
            (result, [placeholder, value]) =>
              result.replace(new RegExp(`{${placeholder}}`, 'g'), value),
            message
          );
        }
        return message;
      }
      return key;
    },
    [messages]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      messages,
      setLocale: handleSetLocale,
      t: translate
    }),
    [locale, messages, handleSetLocale, translate]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  return context;
};
