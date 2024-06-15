import { isBrowser, locals } from '@ncobase/utils';
import i18n from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import versionInfo from '@/../version.json';
import { request } from '@/apis/request';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE_KEY,
  STORAGE_LANGUAGE_KEY
} from '@/helpers/constants';

const setHtmlProperties = (lang: string) => {
  const language = AVAILABLE_LANGUAGES.find(({ key }) => key === lang);
  if (!language) return;
  document.documentElement.lang = lang.toLocaleLowerCase();
  document.documentElement.dir = language.dir ?? 'ltr';
  document.documentElement.style.fontSize = `${(language.fontScale ?? 1) * 100}%`;
};

export const getStoredLanguage = () => {
  if (!isBrowser) return;
  const storedLang = locals.get(STORAGE_LANGUAGE_KEY);
  if (storedLang && AVAILABLE_LANGUAGES.map(lang => lang.key).includes(storedLang)) {
    return storedLang;
  }
};

export const setStoredLanguage = (lang: string) => {
  if (!isBrowser) return;
  locals.set(STORAGE_LANGUAGE_KEY, lang);
  setHtmlProperties(lang);
};

export const getNavigatorLanguage = () => {
  if (!isBrowser) return DEFAULT_LANGUAGE_KEY;
  const lang = window.navigator.language;
  const availableLangKeys = AVAILABLE_LANGUAGES.map(lang => lang.key);
  const normalizedLang = lang.split('-')[0];
  return availableLangKeys.find(key => key === normalizedLang) || DEFAULT_LANGUAGE_KEY;
};

const backendOptions: HttpBackendOptions = {
  // TODO: change to api url
  // loadPath: `${request.config.baseURL}/locales/{{lng}}.json?ver=${versionInfo?.commit}`,
  loadPath: `/assets/locales/{{lng}}.json?ver=${versionInfo?.commit}`,
  customHeaders: {
    ...request.getHeaders()
  }
};

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: getStoredLanguage() || getNavigatorLanguage(),
    fallbackLng: DEFAULT_LANGUAGE_KEY,
    backend: backendOptions,
    interpolation: {
      escapeValue: false
    },
    returnNull: false
  });

i18n.on('languageChanged', lang => {
  if (isBrowser) {
    setStoredLanguage(lang);
  }
});

export { i18n };
