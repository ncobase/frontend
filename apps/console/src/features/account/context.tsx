import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { isBrowser, locals } from '@ncobase/utils';

import { tokenService } from './token_service';

import { TenantProvider } from '@/features/system/tenant/context';

// Define the shape of authentication context value
interface AuthContextValue {
  isAuthenticated: boolean;
  // eslint-disable-next-line no-unused-vars
  updateTokens(accessToken?: string, refreshToken?: string): void;
}

// Keys for local storage
export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.access.refresh';

// Create authentication context with initial default values
const AuthContext = React.createContext<AuthContextValue>({
  isAuthenticated: false,
  updateTokens: () => undefined
});

// Function to update tokens in local storage
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
  const [accessToken, setAccessToken] = useState<string | undefined>(
    isBrowser ? locals.get(ACCESS_TOKEN_KEY) : undefined
  );
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  // Validate token on initial load
  useEffect(() => {
    const validateToken = () => {
      if (!accessToken) {
        setIsTokenValid(false);
        return;
      }

      try {
        const isExpired = tokenService.isTokenExpired(accessToken);
        setIsTokenValid(!isExpired);
      } catch (error) {
        console.error('Token validation failed:', error);
        setIsTokenValid(false);
      }
    };

    validateToken();

    // Set up interval to check token validity
    const interval = setInterval(validateToken, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [accessToken]);

  // Callback to handle token updates
  const handleTokens = useCallback((newAccessToken?: string, newRefreshToken?: string) => {
    setAccessToken(newAccessToken);
    updateTokens(newAccessToken, newRefreshToken);

    if (newAccessToken) {
      setIsTokenValid(!tokenService.isTokenExpired(newAccessToken));
    } else {
      setIsTokenValid(false);
    }
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!accessToken && isTokenValid,
      updateTokens: handleTokens
    }),
    [accessToken, isTokenValid, handleTokens]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      <TenantProvider>{children}</TenantProvider>
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context
export const useAuthContext = (): AuthContextValue => useContext(AuthContext);
