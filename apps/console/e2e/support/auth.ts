import type { Page } from '@playwright/test';

export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.refresh.token';
export const SPACE_KEY = 'app.space.id';
export const LANGUAGE_KEY = 'app.language';

export const permissions = [
  'read:content',
  'manage:content',
  'read:cms',
  'manage:cms',
  'read:resources',
  'manage:resources',
  'admin:resources',
  'read:ai',
  'use:ai',
  'manage:ai',
  'admin:ai',
  'read:spaces',
  'manage:spaces',
  'read:system',
  'manage:system',
  'read:roles',
  'manage:roles',
  'manage:menu',
  'read:users',
  'manage:users'
];

const base64UrlEncode = (value: unknown) =>
  Buffer.from(JSON.stringify(value), 'utf8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

export const createTestToken = (
  spaceId: string,
  overrides: Partial<{
    userId: string;
    roles: string[];
    permissions: string[];
    isAdmin: boolean;
    expiresAt: number;
  }> = {}
) => {
  const exp = overrides.expiresAt || Math.floor(Date.now() / 1000) + 60 * 60;
  const payload = {
    exp,
    jti: `e2e-${spaceId}-${exp}`,
    sub: overrides.userId || 'user-admin',
    payload: {
      user_id: overrides.userId || 'user-admin',
      roles: overrides.roles || ['admin'],
      permissions: overrides.permissions || permissions,
      space_id: spaceId,
      is_admin: overrides.isAdmin ?? true
    }
  };

  return `${base64UrlEncode({ alg: 'HS256', typ: 'JWT' })}.${base64UrlEncode(payload)}.e2e`;
};

export const seedAuthenticatedSession = async (page: Page, spaceId = 'space-alpha') => {
  const accessToken = createTestToken(spaceId);
  const refreshToken = createTestToken(spaceId);

  await page.addInitScript(
    ({ accessToken, refreshToken, spaceId, keys }) => {
      window.localStorage.setItem(keys.access, accessToken);
      window.localStorage.setItem(keys.refresh, refreshToken);
      window.localStorage.setItem(keys.space, spaceId);
      window.localStorage.setItem(keys.language, 'en');
    },
    {
      accessToken,
      refreshToken,
      spaceId,
      keys: {
        access: ACCESS_TOKEN_KEY,
        refresh: REFRESH_TOKEN_KEY,
        space: SPACE_KEY,
        language: LANGUAGE_KEY
      }
    }
  );

  return { accessToken, refreshToken };
};
