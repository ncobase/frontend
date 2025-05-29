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
// XMdTotalKey - result total
export const XMdTotalKey = 'x-md-total';

// --- i18n
export const LANGUAGE_CONFIG = {
  /** Language key stored in local storage */
  STORAGE_KEY: 'app.language',
  /** Default language */
  DEFAULT_LANGUAGE: 'en'
};

/**
 * Language option
 */
export interface LanguageOption {
  /** Language unique identifier */
  key: string;
  /** Language display name */
  name: string;
  /** Language flag emoji or icon */
  flag?: string;
  /** Text direction */
  dir?: 'ltr' | 'rtl';
  /** Font scale ratio */
  fontScale?: number;
}
/**
 * Available languages
 * @reference https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    key: 'en',
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    fontScale: 1
  },
  {
    key: 'zh',
    name: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
    fontScale: 1
  },
  {
    key: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    fontScale: 1.1
  }
];
