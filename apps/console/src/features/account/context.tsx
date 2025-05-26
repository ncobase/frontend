import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { isBrowser, locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { accountApi } from './apis';
import { Permission } from './permissions';
import { TokenPayload, tokenService } from './token_service';

// Storage keys
export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.access.refresh';
export const TENANT_KEY = 'app.tenant.id';

import { Tenant } from '@/features/system/tenant/tenant';

// Auth context interface
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

// Token storage helper
const updateTokenStorage = (accessToken?: string, refreshToken?: string) => {
  if (!isBrowser) return;

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

// Token parser with error handling
const parseTokenSafely = (
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
      isAdmin: decoded.payload?.is_admin || false,
      roles: decoded.payload?.roles || [],
      permissions: decoded.payload?.permissions || [],
      tenantId: decoded.payload?.tenant_id || ''
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

// Auth provider component
export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // State management
  const [accessToken, setAccessToken] = useState<string | undefined>(
    isBrowser ? locals.get(ACCESS_TOKEN_KEY) : undefined
  );

  const [activeTenantId, setActiveTenantId] = useState<string>(
    isBrowser ? locals.get(TENANT_KEY) || '' : ''
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoadingTenants, setIsLoadingTenants] = useState<boolean>(false);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);

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

  // Fetch available tenants for authenticated user
  useEffect(() => {
    const fetchTenants = async () => {
      if (!isTokenValid || !accessToken) {
        setAvailableTenants([]);
        return;
      }

      setIsLoadingTenants(true);
      try {
        const userData = await accountApi.getCurrentUser();
        if (userData && Array.isArray(userData.tenants)) {
          setAvailableTenants(userData.tenants);
        } else {
          setAvailableTenants([]);
        }
      } catch (error) {
        console.error('Failed to fetch user tenants:', error);
        setAvailableTenants([]);
      } finally {
        setIsLoadingTenants(false);
      }
    };

    fetchTenants();
  }, [isTokenValid, accessToken]);

  // Validate and process tokens
  useEffect(() => {
    const processToken = () => {
      if (!accessToken) {
        // No token - clear everything
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
        // Validate token expiration
        const isExpired = tokenService.isTokenExpired(accessToken);
        setIsTokenValid(!isExpired);

        if (!isExpired) {
          // Parse token information
          const parsedToken = parseTokenSafely(accessToken);
          setTokenInfo(parsedToken);

          // Handle tenant selection logic
          if (availableTenants.length > 0) {
            // Validate current active tenant
            if (activeTenantId && availableTenants.some(t => t.id === activeTenantId)) {
              // Current tenant is valid, keep it
            } else if (
              parsedToken.tenantId &&
              availableTenants.some(t => t.id === parsedToken.tenantId)
            ) {
              // Use tenant from token if available
              setActiveTenantId(parsedToken.tenantId);
              if (isBrowser) {
                locals.set(TENANT_KEY, parsedToken.tenantId);
              }
            } else if (availableTenants.length > 0) {
              // Fallback to first available tenant
              const firstTenant = availableTenants[0];
              setActiveTenantId(firstTenant.id);
              if (isBrowser) {
                locals.set(TENANT_KEY, firstTenant.id);
              }
            }
          } else if (!activeTenantId && parsedToken.tenantId) {
            // No tenants loaded yet, use token tenant temporarily
            setActiveTenantId(parsedToken.tenantId);
            if (isBrowser) {
              locals.set(TENANT_KEY, parsedToken.tenantId);
            }
          }
        } else {
          // Token expired - clear token info but keep token for refresh attempt
          setTokenInfo({
            isAdmin: false,
            roles: [],
            permissions: [],
            tenantId: ''
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Token processing failed:', error);
        setIsTokenValid(false);
        setTokenInfo({
          isAdmin: false,
          roles: [],
          permissions: [],
          tenantId: ''
        });
        setIsLoading(false);

        // Clear invalid tokens
        if (isBrowser) {
          locals.remove(ACCESS_TOKEN_KEY);
          locals.remove(REFRESH_TOKEN_KEY);
        }
      }
    };

    processToken();
  }, [accessToken, activeTenantId, availableTenants]);

  // Handle token updates
  const handleTokenUpdate = useCallback((newAccessToken?: string, newRefreshToken?: string) => {
    setAccessToken(newAccessToken);
    updateTokenStorage(newAccessToken, newRefreshToken);

    if (newAccessToken) {
      try {
        // Validate new token
        const isExpired = tokenService.isTokenExpired(newAccessToken);
        setIsTokenValid(!isExpired);

        if (!isExpired) {
          const parsedToken = parseTokenSafely(newAccessToken);
          setTokenInfo(parsedToken);

          // Set tenant from new token
          if (parsedToken.tenantId) {
            setActiveTenantId(parsedToken.tenantId);
            if (isBrowser) {
              locals.set(TENANT_KEY, parsedToken.tenantId);
            }
          }
        }
      } catch (error) {
        console.error('New token validation failed:', error);
        setIsTokenValid(false);
        setTokenInfo({
          isAdmin: false,
          roles: [],
          permissions: [],
          tenantId: ''
        });

        // Clear invalid tokens
        if (isBrowser) {
          locals.remove(ACCESS_TOKEN_KEY);
          locals.remove(REFRESH_TOKEN_KEY);
        }
      }
    } else {
      // Clear all authentication state
      setIsTokenValid(false);
      setTokenInfo({
        isAdmin: false,
        roles: [],
        permissions: [],
        tenantId: ''
      });
      setActiveTenantId('');
      setAvailableTenants([]);

      if (isBrowser) {
        locals.remove(TENANT_KEY);
      }
    }

    setIsLoading(false);

    // Refresh permission service state
    Permission.refreshState();
  }, []);

  // Handle tenant switching
  const handleTenantSwitch = useCallback(
    (tenantId: string) => {
      // Validate tenant availability
      const isValidTenant = availableTenants.some(t => t.id === tenantId);

      if (!isValidTenant) {
        console.error(`Cannot switch to tenant ${tenantId}: not available to user`);
        return;
      }

      if (tenantId === activeTenantId) {
        // Already on this tenant
        return;
      }

      // Switch tenant
      setActiveTenantId(tenantId);
      if (isBrowser) {
        locals.set(TENANT_KEY, tenantId);
      }

      // Refresh permission state for new tenant
      Permission.refreshState();
    },
    [availableTenants, activeTenantId]
  );

  // Create context value with memoization
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!accessToken && isTokenValid,
      isLoading: isLoading || isLoadingTenants,
      isAdmin: tokenInfo.isAdmin,
      roles: tokenInfo.roles,
      permissions: tokenInfo.permissions,
      tenantId: activeTenantId,
      tokenTenantId: tokenInfo.tenantId,
      updateTokens: handleTokenUpdate,
      switchTenant: handleTenantSwitch,

      // Permission checks using Permission service
      hasPermission: (permission: string): boolean => {
        if (!isTokenValid) return false;
        try {
          return Permission.hasPermission(permission);
        } catch (error) {
          console.error('Permission check failed:', error);
          return false;
        }
      },

      hasRole: (role: string | string[]): boolean => {
        if (!isTokenValid) return false;
        try {
          return Permission.hasRole(role);
        } catch (error) {
          console.error('Role check failed:', error);
          return false;
        }
      },

      canAccess: (options: {
        permission?: string;
        role?: string;
        any?: boolean;
        permissions?: string[];
        roles?: string[];
      }): boolean => {
        if (!isTokenValid) return false;
        try {
          return Permission.canAccess(options);
        } catch (error) {
          console.error('Access check failed:', error);
          return false;
        }
      }
    }),
    [
      accessToken,
      isTokenValid,
      isLoading,
      isLoadingTenants,
      tokenInfo,
      activeTenantId,
      handleTokenUpdate,
      handleTenantSwitch
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
