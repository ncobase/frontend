import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { ExplicitAny } from '@ncobase/types';
import { isBrowser, locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { Permission } from './permissions';
import { TokenPayload, tokenService } from './token_service';

import { TenantProvider } from '@/features/system/tenant/context';

// Keys for local storage
export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.access.refresh';

// Authentication context interface with permission info
interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  roles: string[];
  permissions: string[];
  updateTokens: (_accessToken?: string, _refreshToken?: string) => void;
  hasPermission: (_permission: string) => boolean;
  hasRole: (_role: string | string[]) => boolean;
  canAccess: (_options: {
    permission?: string;
    role?: string;
    any?: boolean;
    permissions?: string[];
    roles?: string[];
  }) => boolean;
}

// Create context with default values
const AuthContext = React.createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  roles: [],
  permissions: [],
  updateTokens: () => undefined,
  hasPermission: () => false,
  hasRole: () => false,
  canAccess: () => false
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

// Parse token and extract permission info
const parseToken = (
  token: string
): {
  isAdmin: boolean;
  roles: string[];
  permissions: string[];
  tenantId: string;
} => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return {
      isAdmin: decoded.payload.is_admin || false,
      roles: decoded.payload.roles || [],
      permissions: decoded.payload.permissions || [],
      tenantId: decoded.payload.tenant_id || ''
    };
  } catch (error) {
    console.error('Failed to parse token:', error);
    return {
      isAdmin: false,
      roles: [],
      permissions: [],
      tenantId: ''
    };
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
  const [tokenInfo, setTokenInfo] = useState<{
    isAdmin: boolean;
    roles: string[];
    permissions: string[];
    tenantId: string;
  }>({
    isAdmin: false,
    roles: [],
    permissions: [],
    tenantId: ''
  });

  // Validate token on initial load and setup automatic revalidation
  useEffect(() => {
    const validateToken = () => {
      if (!accessToken) {
        setIsTokenValid(false);
        setTokenInfo({
          isAdmin: false,
          roles: [],
          permissions: [],
          tenantId: ''
        });
        setIsLoading(false);
        return;
      }

      try {
        // Simple client-side validation
        const isExpired = tokenService.isTokenExpired(accessToken);
        setIsTokenValid(!isExpired);
        if (!isExpired) {
          setTokenInfo(parseToken(accessToken));
        }
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
        const isExpired = tokenService.isTokenExpired(newAccessToken);
        setIsTokenValid(!isExpired);
        if (!isExpired) {
          setTokenInfo(parseToken(newAccessToken));
        }
      } catch (error: ExplicitAny) {
        console.error('Token validation failed:', error);
        setIsTokenValid(false);
      }
    } else {
      setIsTokenValid(false);
      setTokenInfo({
        isAdmin: false,
        roles: [],
        permissions: [],
        tenantId: ''
      });
    }

    setIsLoading(false);

    // Notify the Permission Service about token changes
    Permission.refreshState();
  }, []);

  // Create memoized context value to avoid unnecessary re-renders
  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!accessToken && isTokenValid,
      isLoading,
      isAdmin: tokenInfo.isAdmin,
      roles: tokenInfo.roles,
      permissions: tokenInfo.permissions,
      updateTokens: handleTokens,
      // Use the Permission methods directly
      hasPermission: (permission: string): boolean => {
        if (!isTokenValid) return false;
        return Permission.hasPermission(permission);
      },
      hasRole: (role: string | string[]): boolean => {
        if (!isTokenValid) return false;
        return Permission.hasRole(role);
      },
      canAccess: (options: {
        permission?: string;
        role?: string;
        any?: boolean;
        permissions?: string[];
        roles?: string[];
      }): boolean => {
        if (!isTokenValid) return false;
        return Permission.canAccess(options);
      }
    }),
    [accessToken, isTokenValid, isLoading, tokenInfo, handleTokens]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      <TenantProvider>{children}</TenantProvider>
    </AuthContext.Provider>
  );
};

// Hook to access authentication context
export const useAuthContext = (): AuthContextValue => useContext(AuthContext);
