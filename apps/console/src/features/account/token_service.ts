// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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

// Token refresh state
let refreshingPromise: Promise<TokenResponse> | null = null;
const REFRESH_BUFFER_TIME = 5 * 60 * 1000; // 5 minutes

export const tokenService = {
  getTokenExpiration: (token: string): number | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000;
    } catch {
      return null;
    }
  },

  isTokenExpired: (token: string): boolean => {
    const expiration = tokenService.getTokenExpiration(token);
    if (!expiration) return true;
    return Date.now() > expiration - REFRESH_BUFFER_TIME;
  },

  isValidToken: (token: string): boolean => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return !!(decoded.payload && decoded.exp);
    } catch {
      return false;
    }
  },

  getUserIdFromToken: (token: string): string | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.payload?.user_id || null;
    } catch {
      return null;
    }
  }
};

export const clearTokens = (): void => {
  locals.remove(ACCESS_TOKEN_KEY);
  locals.remove(REFRESH_TOKEN_KEY);
  refreshingPromise = null;
};

export const refreshAccessToken = async (): Promise<TokenResponse> => {
  // Return existing promise if refresh is already in progress
  if (refreshingPromise) {
    return refreshingPromise;
  }

  const refreshToken = locals.get(REFRESH_TOKEN_KEY);

  if (!refreshToken || !tokenService.isValidToken(refreshToken)) {
    throw new Error('No valid refresh token available');
  }

  try {
    refreshingPromise = request.post(
      '/refresh-token',
      { refresh_token: refreshToken },
      { timeout: 10000 }
    );

    const tokens = await refreshingPromise;

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid token response from server');
    }

    // Validate new tokens
    if (
      !tokenService.isValidToken(tokens.access_token) ||
      !tokenService.isValidToken(tokens.refresh_token)
    ) {
      throw new Error('Received invalid tokens from server');
    }

    // Store new tokens
    locals.set(ACCESS_TOKEN_KEY, tokens.access_token);
    locals.set(REFRESH_TOKEN_KEY, tokens.refresh_token);

    return tokens;
  } catch (error: ExplicitAny) {
    console.error('Token refresh failed:', error);

    // Clear tokens on certain errors
    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error['message']?.includes('invalid')
    ) {
      clearTokens();
    }

    throw error;
  } finally {
    refreshingPromise = null;
  }
};

export const checkAndRefreshToken = async (): Promise<string | null> => {
  const accessToken = locals.get(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return null;
  }

  if (!tokenService.isValidToken(accessToken)) {
    clearTokens();
    return null;
  }

  if (!tokenService.isTokenExpired(accessToken)) {
    return accessToken;
  }

  try {
    const newTokens = await refreshAccessToken();
    return newTokens.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    return null;
  }
};
