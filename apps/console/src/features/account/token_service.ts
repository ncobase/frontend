// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { ExplicitAny } from '@ncobase/types';
import { locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './context';

import { request } from '@/lib/api/request';

// Token payload interface
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

// Global state to prevent multiple simultaneous refreshes
let refreshingPromise: Promise<TokenResponse> | null = null;
let lastRefreshAttempt = 0;
let refreshFailureCount = 0;
const MAX_REFRESH_FAILURES = 3;
const REFRESH_COOLDOWN_TIME = 5000; // 5 seconds
const REFRESH_BUFFER_TIME = 5 * 60 * 1000; // 5 minutes

export const tokenService = {
  /**
   * Get token expiration time from JWT payload
   */
  getTokenExpiration: (token: string): number | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  /**
   * Check if token is expired or will expire soon
   */
  isTokenExpired: (token: string): boolean => {
    const expiration = tokenService.getTokenExpiration(token);
    if (!expiration) return true;

    // Consider token expired if it expires within the buffer time
    return Date.now() > expiration - REFRESH_BUFFER_TIME;
  },

  /**
   * Check if token is completely expired (past exp time)
   */
  isTokenCompletlyExpired: (token: string): boolean => {
    const expiration = tokenService.getTokenExpiration(token);
    if (!expiration) return true;

    return Date.now() > expiration;
  },

  /**
   * Get user ID from token
   */
  getUserIdFromToken: (token: string): string | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.payload?.user_id || null;
    } catch (error) {
      console.error('Failed to get user ID from token:', error);
      return null;
    }
  },

  /**
   * Validate token format and structure
   */
  isValidToken: (token: string): boolean => {
    if (!token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return !!(decoded.payload && decoded.exp);
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
};

/**
 * Clear all tokens and reset refresh state
 */
export const clearTokens = (): void => {
  locals.remove(ACCESS_TOKEN_KEY);
  locals.remove(REFRESH_TOKEN_KEY);
  refreshingPromise = null;
  refreshFailureCount = 0;
  lastRefreshAttempt = 0;
};

/**
 * Refresh the access token
 */
export const refreshAccessToken = async (): Promise<TokenResponse> => {
  const now = Date.now();

  // If already refreshing, return the same promise
  if (refreshingPromise) {
    console.debug('Token refresh already in progress, waiting...');
    return refreshingPromise;
  }

  // Check cooldown period after failures
  if (
    refreshFailureCount >= MAX_REFRESH_FAILURES &&
    now - lastRefreshAttempt < REFRESH_COOLDOWN_TIME
  ) {
    throw new Error('Too many refresh failures, please wait before trying again');
  }

  const refreshToken = locals.get(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Validate refresh token format
  if (!tokenService.isValidToken(refreshToken)) {
    console.error('Invalid refresh token format');
    clearTokens();
    throw new Error('Invalid refresh token');
  }

  // Check if refresh token is completely expired
  if (tokenService.isTokenCompletlyExpired(refreshToken)) {
    console.error('Refresh token is expired');
    clearTokens();
    throw new Error('Refresh token expired');
  }

  lastRefreshAttempt = now;

  try {
    console.debug('Starting token refresh...');

    // Create a new refresh request and store the promise
    refreshingPromise = request.post(
      '/iam/refresh-token',
      {
        refresh_token: refreshToken
      },
      {
        timestamp: false, // Don't add timestamp to avoid infinite loops
        timeout: 10000 // Shorter timeout for refresh requests
      }
    );

    const tokens = await refreshingPromise;

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid token response from server');
    }

    // Validate the new tokens
    if (
      !tokenService.isValidToken(tokens.access_token) ||
      !tokenService.isValidToken(tokens.refresh_token)
    ) {
      throw new Error('Received invalid tokens from server');
    }

    // Update tokens in local storage
    locals.set(ACCESS_TOKEN_KEY, tokens.access_token);
    locals.set(REFRESH_TOKEN_KEY, tokens.refresh_token);

    // Reset failure count on success
    refreshFailureCount = 0;

    console.debug('Token refresh successful');
    return tokens;
  } catch (error: ExplicitAny) {
    console.error('Failed to refresh token:', error);

    refreshFailureCount++;

    // Clear tokens on specific error conditions
    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.message?.includes('invalid') ||
      error.message?.includes('expired')
    ) {
      console.warn('Clearing tokens due to auth error:', error.response?.status);
      clearTokens();
    }

    // If we've exceeded max failures, clear tokens
    if (refreshFailureCount >= MAX_REFRESH_FAILURES) {
      console.error('Max refresh failures exceeded, clearing tokens');
      clearTokens();
    }

    throw error;
  } finally {
    refreshingPromise = null;
  }
};

/**
 * Check if token needs refresh and refresh if needed
 */
export const checkAndRefreshToken = async (): Promise<string | null> => {
  const accessToken = locals.get(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return null;
  }

  // Validate token format first
  if (!tokenService.isValidToken(accessToken)) {
    console.warn('Invalid access token format, clearing tokens');
    clearTokens();
    return null;
  }

  try {
    // Check if token needs refresh
    if (tokenService.isTokenExpired(accessToken)) {
      console.debug('Token needs refresh, attempting refresh...');
      const newTokens = await refreshAccessToken();
      return newTokens.access_token;
    }

    return accessToken;
  } catch (error: ExplicitAny) {
    console.error('Token refresh failed:', error);

    // Only clear tokens for authentication errors
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

/**
 * Force refresh token
 */
export const forceRefreshToken = async (): Promise<TokenResponse | null> => {
  try {
    return await refreshAccessToken();
  } catch (error) {
    console.error('Force refresh failed:', error);
    return null;
  }
};

/**
 * Get current refresh state for debugging
 */
export const getRefreshState = () => ({
  isRefreshing: !!refreshingPromise,
  failureCount: refreshFailureCount,
  lastAttempt: lastRefreshAttempt,
  cooldownRemaining: Math.max(0, REFRESH_COOLDOWN_TIME - (Date.now() - lastRefreshAttempt))
});
