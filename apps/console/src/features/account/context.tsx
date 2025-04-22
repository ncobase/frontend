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

import { accountApi } from './apis';
import { Permission } from './permissions';
import { TokenPayload, tokenService } from './token_service';

// Keys for local storage
export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.access.refresh';
export const TENANT_KEY = 'app.tenant.id';

import { Tenant } from '@/features/system/tenant/tenant';
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

  // Store available tenants for the user
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState<boolean>(false);

  // Fetch user's available tenants
  useEffect(() => {
    const fetchTenants = async () => {
      if (!isTokenValid || !accessToken) return;

      setIsLoadingTenants(true);
      try {
        const userData = await accountApi.getCurrentUser();
        if (userData && Array.isArray(userData.tenants)) {
          setAvailableTenants(userData.tenants);
        }
      } catch (error) {
        console.error('Failed to fetch user tenants:', error);
      } finally {
        setIsLoadingTenants(false);
      }
    };

    fetchTenants();
  }, [isTokenValid, accessToken]);

  // Validate token and check tenant after tenants are loaded
  useEffect(() => {
    const validateTokenAndTenant = () => {
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

          // Handle tenant selection logic
          if (availableTenants.length > 0) {
            // If we have tenants loaded, validate the active tenant ID
            if (activeTenantId && availableTenants.some(t => t.id === activeTenantId)) {
              // Current tenant ID is valid, keep using it
            } else if (
              parsedToken.tenantId &&
              availableTenants.some(t => t.id === parsedToken.tenantId)
            ) {
              // Use tenant ID from token if it's in the available tenants
              setActiveTenantId(parsedToken.tenantId);
              if (isBrowser) {
                locals.set(TENANT_KEY, parsedToken.tenantId);
              }
            } else if (availableTenants.length > 0) {
              // Fallback to first available tenant
              setActiveTenantId(availableTenants[0].id);
              if (isBrowser) {
                locals.set(TENANT_KEY, availableTenants[0].id);
              }
            }
          } else if (!activeTenantId && parsedToken.tenantId) {
            // If tenants aren't loaded yet, use token tenant as temporary value
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

    validateTokenAndTenant();
  }, [accessToken, activeTenantId, availableTenants]);

  // Handle token updates
  const handleTokens = useCallback((newAccessToken?: string, newRefreshToken?: string) => {
    setAccessToken(newAccessToken);
    updateTokens(newAccessToken, newRefreshToken);

    if (newAccessToken) {
      try {
        const isExpired = tokenService.isTokenExpired(newAccessToken);
        setIsTokenValid(!isExpired);

        if (!isExpired) {
          const parsedToken = parseToken(newAccessToken);
          setTokenInfo(parsedToken);

          // Reset tenant-related states when getting a new token
          // We'll validate against available tenants after they load
          if (parsedToken.tenantId) {
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
      setAvailableTenants([]);
      if (isBrowser) {
        locals.remove(TENANT_KEY);
      }
    }

    setIsLoading(false);

    // Notify the Permission Service about token changes
    Permission.refreshState();
  }, []);

  // Handle tenant switching
  const handleSwitchTenant = useCallback(
    (tenantId: string) => {
      // Validate that the tenant ID is available to the user
      const isTenantValid = availableTenants.some(t => t.id === tenantId);

      if (isTenantValid) {
        setActiveTenantId(tenantId);
        if (isBrowser) {
          locals.set(TENANT_KEY, tenantId);
        }

        // Refresh permission state when tenant changes
        Permission.refreshState();

        // Emit event for tenant change
        eventEmitter.emit('tenant:changed', { tenantId });
      } else {
        console.error(`Cannot switch to tenant ${tenantId}: not available to user`);
        eventEmitter.emit('tenant-error', { message: 'Invalid tenant selection' });
      }
    },
    [availableTenants]
  );

  // Create memoized context value to avoid unnecessary re-renders
  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!accessToken && isTokenValid,
      isLoading: isLoading || isLoadingTenants,
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
      isLoadingTenants,
      tokenInfo,
      activeTenantId,
      handleTokens,
      handleSwitchTenant
    ]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => useContext(AuthContext);
