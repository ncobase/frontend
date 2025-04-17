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
  // eslint-disable-next-line no-unused-vars
  updateTokens: (accessToken?: string, refreshToken?: string) => void;
  // eslint-disable-next-line no-unused-vars
  hasPermission: (permission: string) => boolean;
  // eslint-disable-next-line no-unused-vars
  hasRole: (role: string | string[]) => boolean;
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
  hasRole: () => false
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
  }, []);

  // Permission checking functions
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!isTokenValid) return false;
      if (tokenInfo.isAdmin) return true;

      // Check for exact match
      if (tokenInfo.permissions.includes(permission)) return true;

      // Check for wildcard permissions
      const [action, resource] = permission.split(':');

      // Action wildcard (e.g. "*:users")
      if (tokenInfo.permissions.includes(`*:${resource}`)) return true;

      // Resource wildcard (e.g. "read:*")
      if (tokenInfo.permissions.includes(`${action}:*`)) return true;

      // Full wildcard
      if (tokenInfo.permissions.includes('*')) return true;

      return false;
    },
    [isTokenValid, tokenInfo]
  );

  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (Array.isArray(role)) {
        return role.some(r => hasRole(r));
      }
      if (!isTokenValid) return false;
      return tokenInfo.roles.includes(role);
    },
    [isTokenValid, tokenInfo]
  );

  // Context value
  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!accessToken && isTokenValid,
      isLoading,
      isAdmin: tokenInfo.isAdmin,
      roles: tokenInfo.roles,
      permissions: tokenInfo.permissions,
      updateTokens: handleTokens,
      hasPermission,
      hasRole
    }),
    [accessToken, isTokenValid, isLoading, tokenInfo, handleTokens, hasPermission, hasRole]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      <TenantProvider>{children}</TenantProvider>
    </AuthContext.Provider>
  );
};

// Hook to access authentication context
export const useAuthContext = (): AuthContextValue => useContext(AuthContext);
