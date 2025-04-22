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

// Keys for local storage
export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.access.refresh';
export const TENANT_KEY = 'app.tenant.id';

import { eventEmitter } from '@/lib/events';

// Authentication context interface with permission and tenant info
interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  roles: string[];
  permissions: string[];
  tenantId: string;
  tokenTenantId: string;
  updateTokens: (_accessToken?: string, _refreshToken?: string) => void;
  switchTenant: (_tenantId: string) => void;
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
  tenantId: '',
  tokenTenantId: '',
  updateTokens: () => undefined,
  switchTenant: () => undefined,
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

  // Initialize with the tenant from localStorage if available
  const [activeTenantId, setActiveTenantId] = useState<string>(
    isBrowser ? locals.get(TENANT_KEY) || '' : ''
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
          const parsedToken = parseToken(accessToken);
          setTokenInfo(parsedToken);

          // If no active tenant is set, use the one from token
          if (!activeTenantId && parsedToken.tenantId) {
            setActiveTenantId(parsedToken.tenantId);
            if (isBrowser) {
              locals.set(TENANT_KEY, parsedToken.tenantId);
            }
          }
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
  }, [accessToken, activeTenantId]);

  // Handle token updates
  const handleTokens = useCallback(
    (newAccessToken?: string, newRefreshToken?: string) => {
      setAccessToken(newAccessToken);
      updateTokens(newAccessToken, newRefreshToken);

      if (newAccessToken) {
        try {
          const isExpired = tokenService.isTokenExpired(newAccessToken);
          setIsTokenValid(!isExpired);
          if (!isExpired) {
            const parsedToken = parseToken(newAccessToken);
            setTokenInfo(parsedToken);

            // If no active tenant is set, use the one from token
            if (!activeTenantId && parsedToken.tenantId) {
              setActiveTenantId(parsedToken.tenantId);
              if (isBrowser) {
                locals.set(TENANT_KEY, parsedToken.tenantId);
              }
            }
          }
        } catch (error: ExplicitAny) {
          console.error('Token validation failed:', error);
          setIsTokenValid(false);
        }
      } else {
        // Clear all auth state when tokens are removed
        setIsTokenValid(false);
        setTokenInfo({
          isAdmin: false,
          roles: [],
          permissions: [],
          tenantId: ''
        });
        setActiveTenantId('');
        if (isBrowser) {
          locals.remove(TENANT_KEY);
        }
      }

      setIsLoading(false);

      // Notify the Permission Service about token changes
      Permission.refreshState();
    },
    [activeTenantId]
  );

  // Handle tenant switching
  const handleSwitchTenant = useCallback((tenantId: string) => {
    setActiveTenantId(tenantId);
    if (isBrowser) {
      locals.set(TENANT_KEY, tenantId);
    }

    // Refresh permission state when tenant changes
    Permission.refreshState();

    // Emit event for tenant change
    eventEmitter.emit('tenant:changed', { tenantId });
  }, []);

  // Create memoized context value to avoid unnecessary re-renders
  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!accessToken && isTokenValid,
      isLoading,
      isAdmin: tokenInfo.isAdmin,
      roles: tokenInfo.roles,
      permissions: tokenInfo.permissions,
      tenantId: activeTenantId,
      tokenTenantId: tokenInfo.tenantId,
      updateTokens: handleTokens,
      switchTenant: handleSwitchTenant,
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
    [
      accessToken,
      isTokenValid,
      isLoading,
      tokenInfo,
      activeTenantId,
      handleTokens,
      handleSwitchTenant
    ]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

// Hook to access authentication context
export const useAuthContext = (): AuthContextValue => useContext(AuthContext);
