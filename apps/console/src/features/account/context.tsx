import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { ExplicitAny as _ExplicitAny } from '@ncobase/types';
import { isBrowser, locals } from '@ncobase/utils';

import { tokenService } from './token_service';

import { TenantProvider } from '@/features/system/tenant/context';

// Keys for local storage
export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.access.refresh';

// Authentication context interface
interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  updateTokens: (accessToken?: string, refreshToken?: string) => void;
}

// Create context with default values
const AuthContext = React.createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  updateTokens: () => undefined
});

// Update tokens in storage
const updateTokens = (accessToken?: string, refreshToken?: string) => {
  if (!isBrowser) return; // Skip if not in browser environment

  if (accessToken) {
    locals.set(ACCESS_TOKEN_KEY, accessToken);
  } else {
    locals.remove(ACCESS_TOKEN_KEY);
  }

  if (refreshToken) {
    locals.set(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    locals.remove(REFRESH_TOKEN_KEY);
  }
};

// Authentication provider component
export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // Initialize state with token from localStorage if available
  const [accessToken, setAccessToken] = useState<string | undefined>(
    isBrowser ? locals.get(ACCESS_TOKEN_KEY) : undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  // Validate token on initial load and setup automatic revalidation
  useEffect(() => {
    const validateToken = () => {
      if (!accessToken) {
        setIsTokenValid(false);
        setIsLoading(false);
        return;
      }

      try {
        // Simple client-side validation
        const isExpired = tokenService.isTokenExpired(accessToken);
        setIsTokenValid(!isExpired);
        setIsLoading(false);
      } catch (error) {
        console.error('Token validation failed:', error);
        setIsTokenValid(false);
        setIsLoading(false);
      }
    };

    validateToken();

    // Revalidate periodically
    const interval = setInterval(validateToken, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [accessToken]);

  // Handle token updates
  const handleTokens = useCallback((newAccessToken?: string, newRefreshToken?: string) => {
    setAccessToken(newAccessToken);
    updateTokens(newAccessToken, newRefreshToken);

    if (newAccessToken) {
      try {
        setIsTokenValid(!tokenService.isTokenExpired(newAccessToken));
      } catch (error: _ExplicitAny) {
        console.error('Token validation failed:', error);
        setIsTokenValid(false);
      }
    } else {
      setIsTokenValid(false);
    }

    setIsLoading(false);
  }, []);

  // Context value
  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!accessToken && isTokenValid,
      isLoading,
      updateTokens: handleTokens
    }),
    [accessToken, isTokenValid, isLoading, handleTokens]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      <TenantProvider>{children}</TenantProvider>
    </AuthContext.Provider>
  );
};

// Hook to access authentication context
export const useAuthContext = (): AuthContextValue => useContext(AuthContext);
