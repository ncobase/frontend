import { ExplicitAny } from '@ncobase/types';
import { locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './context';

import { request } from '@/lib/api/request';

export interface TokenPayload {
  exp: number;
  jti: string;
  payload: {
    user_id: string;
    roles: string[];
    permissions: string[];
    tenant_id: string;
    is_admin: boolean;
  };
  sub: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

let refreshingPromise: Promise<TokenResponse> | null = null;
let lastRefreshAttempt = 0;
let refreshFailureCount = 0;
const MAX_REFRESH_FAILURES = 3;
const REFRESH_COOLDOWN_TIME = 5000; // 5 seconds
const REFRESH_BUFFER_TIME = 5 * 60 * 1000; // 5 minutes

export const tokenService = {
  getTokenExpiration: (token: string): number | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  isTokenExpired: (token: string): boolean => {
    const expiration = tokenService.getTokenExpiration(token);
    if (!expiration) return true;
    return Date.now() > expiration - REFRESH_BUFFER_TIME;
  },

  isTokenCompletlyExpired: (token: string): boolean => {
    const expiration = tokenService.getTokenExpiration(token);
    if (!expiration) return true;
    return Date.now() > expiration;
  },

  getUserIdFromToken: (token: string): string | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.payload?.user_id || null;
    } catch (error) {
      console.error('Failed to get user ID from token:', error);
      return null;
    }
  },

  isValidToken: (token: string): boolean => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return !!(decoded.payload && decoded.exp);
    } catch (error) {
      return false;
    }
  }
};

export const clearTokens = (): void => {
  locals.remove(ACCESS_TOKEN_KEY);
  locals.remove(REFRESH_TOKEN_KEY);
  refreshingPromise = null;
  refreshFailureCount = 0;
  lastRefreshAttempt = 0;
};

export const refreshAccessToken = async (): Promise<TokenResponse> => {
  const now = Date.now();

  if (refreshingPromise) {
    console.debug('Token refresh already in progress, waiting...');
    return refreshingPromise;
  }

  if (
    refreshFailureCount >= MAX_REFRESH_FAILURES &&
    now - lastRefreshAttempt < REFRESH_COOLDOWN_TIME
  ) {
    throw new Error('Too many refresh failures, please wait before trying again');
  }

  const accessToken = locals.get(ACCESS_TOKEN_KEY);
  const refreshToken = locals.get(REFRESH_TOKEN_KEY);
  lastRefreshAttempt = now;

  // Check if we have any tokens to work with
  if (!accessToken && !refreshToken) {
    throw new Error('No tokens available for refresh');
  }

  try {
    console.debug('Starting token refresh...');

    // Try refresh token first if available and valid
    if (
      refreshToken &&
      tokenService.isValidToken(refreshToken) &&
      !tokenService.isTokenCompletlyExpired(refreshToken)
    ) {
      refreshingPromise = request.post(
        '/iam/refresh-token',
        { refresh_token: refreshToken },
        { timestamp: false, timeout: 10000 }
      );
    } else {
      // Try session-based refresh
      console.debug('No valid refresh token, attempting session-based refresh...');
      refreshingPromise = request.post(
        '/iam/refresh-token',
        {},
        { timestamp: false, timeout: 10000 }
      );
    }

    const tokens = await refreshingPromise;

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid token response from server');
    }

    if (
      !tokenService.isValidToken(tokens.access_token) ||
      !tokenService.isValidToken(tokens.refresh_token)
    ) {
      throw new Error('Received invalid tokens from server');
    }

    locals.set(ACCESS_TOKEN_KEY, tokens.access_token);
    locals.set(REFRESH_TOKEN_KEY, tokens.refresh_token);

    refreshFailureCount = 0;
    console.debug('Token refresh successful');
    return tokens;
  } catch (error: ExplicitAny) {
    console.error('Failed to refresh token:', error);
    refreshFailureCount++;

    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.message?.includes('invalid') ||
      error.message?.includes('expired')
    ) {
      console.warn('Clearing tokens due to auth error:', error.response?.status);
      clearTokens();
    }

    if (refreshFailureCount >= MAX_REFRESH_FAILURES) {
      console.error('Max refresh failures exceeded, clearing tokens');
      clearTokens();
    }

    throw error;
  } finally {
    refreshingPromise = null;
  }
};

export const checkAndRefreshToken = async (): Promise<string | null> => {
  const accessToken = locals.get(ACCESS_TOKEN_KEY);
  const refreshToken = locals.get(REFRESH_TOKEN_KEY);

  // If no tokens at all, don't attempt refresh
  if (!accessToken && !refreshToken) {
    console.debug('No tokens available, skipping refresh');
    return null;
  }

  // If we have an access token, validate it
  if (accessToken) {
    if (!tokenService.isValidToken(accessToken)) {
      console.warn('Invalid access token format, clearing tokens');
      clearTokens();
      return null;
    }

    if (!tokenService.isTokenExpired(accessToken)) {
      return accessToken;
    }
  }

  // Try to refresh if we have refresh token or valid session
  try {
    console.debug('Token needs refresh, attempting refresh...');
    const newTokens = await refreshAccessToken();
    return newTokens.access_token;
  } catch (error: ExplicitAny) {
    console.error('Token refresh failed:', error);

    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.message?.includes('No refresh token') ||
      error.message?.includes('expired')
    ) {
      clearTokens();
    }

    return null;
  }
};

export const forceRefreshToken = async (): Promise<TokenResponse | null> => {
  try {
    return await refreshAccessToken();
  } catch (error) {
    console.error('Force refresh failed:', error);
    return null;
  }
};

export const getRefreshState = () => ({
  isRefreshing: !!refreshingPromise,
  failureCount: refreshFailureCount,
  lastAttempt: lastRefreshAttempt,
  cooldownRemaining: Math.max(0, REFRESH_COOLDOWN_TIME - (Date.now() - lastRefreshAttempt))
});
