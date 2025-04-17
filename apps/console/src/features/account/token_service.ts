import { locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './context';

import { request } from '@/apis/request';

// Token payload interface
interface TokenPayload {
  exp: number;
  jti: string;
  payload: {
    user_id: string;
  };
  sub: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

// Keep track of refresh requests to prevent multiple simultaneous refreshes
let refreshingPromise: Promise<TokenResponse> | null = null;

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
   * Check if token is expired
   */
  isTokenExpired: (token: string): boolean => {
    const expiration = tokenService.getTokenExpiration(token);
    if (!expiration) return true;
    // Add 5-minute buffer for token refresh
    return Date.now() > expiration - 5 * 60 * 1000;
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
  }
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken = async (): Promise<TokenResponse> => {
  // If already refreshing, return the same promise
  if (refreshingPromise) {
    return refreshingPromise;
  }

  const refreshToken = locals.get(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    // Create a new refresh request and store the promise
    refreshingPromise = request.post('/iam/refresh-token', { refresh_token: refreshToken });
    const tokens = await refreshingPromise;

    // Update tokens in local storage
    if (tokens.access_token) {
      locals.set(ACCESS_TOKEN_KEY, tokens.access_token);
    }
    if (tokens.refresh_token) {
      locals.set(REFRESH_TOKEN_KEY, tokens.refresh_token);
    }

    return tokens;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Don't clear tokens on failure, let the calling code decide what to do
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

  if (!accessToken) return null;

  try {
    // Only refresh if the token is actually expired
    // if (tokenService.isTokenExpired(accessToken)) {
    console.log('Token expired, refreshing...');
    const newTokens = await refreshAccessToken();
    return newTokens.access_token;
    // }
    // return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Don't clear tokens here, let auth context handle this decision
    return accessToken; // Return the existing token even if refresh failed
  }
};
