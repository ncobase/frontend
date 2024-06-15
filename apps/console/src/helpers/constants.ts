// --- header
// AuthorizationKey - Authorization header key
export const AuthorizationKey = 'Authorization';
// BearerKey - Bearer token prefix
export const BearerKey = 'Bearer ';
// XMdUserKey - global user id
export const XMdUserKey = 'x-md-uid';
// XMdUsernameKey - global username
export const XMdUsernameKey = 'x-md-uname';
// XMdTokenKey - global token
export const XMdTokenKey = 'x-md-token';
// XMdTenantKey - global tenant id
// XMdTenantKey = XMdDomainKey
export const XMdTenantKey = 'x-md-tid';
// XMdDomainKey - global domain id
// XMdDomainKey = XMdTenantKey
export const XMdDomainKey = 'x-md-did';
// XMdTotalKey - result total with response
export const XMdTotalKey = 'x-md-total';

// --- i18n
export const STORAGE_LANGUAGE_KEY = '_LOCALE';

interface Language {
  key: string;
  name?: string;
  flag?: string;
  dir?: 'ltr' | 'rtl';
  fontScale?: number;
}

export const DEFAULT_LANGUAGE_KEY: Language['key'] = 'en';

// Reference: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export const AVAILABLE_LANGUAGES: Language[] = [
  {
    key: 'zh',
    name: '中文',
    dir: 'ltr'
  },
  {
    key: 'en',
    name: 'English',
    dir: 'ltr'
  },
  {
    key: 'ja',
    name: '日本語',
    dir: 'ltr'
  },
  {
    key: 'ko',
    name: '한국어',
    dir: 'ltr'
  },
  {
    key: 'ru',
    name: 'Русский',
    dir: 'ltr'
  },
  {
    key: 'es',
    name: 'Español',
    dir: 'ltr'
  },
  {
    key: 'fr',
    name: 'Français',
    dir: 'ltr'
  },
  {
    key: 'de',
    name: 'Deutsch',
    dir: 'ltr'
  },
  {
    key: 'it',
    name: 'Italiano',
    dir: 'ltr'
  },
  {
    key: 'pt',
    name: 'Português',
    dir: 'ltr'
  }
];
