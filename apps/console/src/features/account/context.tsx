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
import { TokenPayload } from './token_service';

export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.refresh.token';
export const TENANT_KEY = 'app.tenant.id';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  roles: string[];
  permissions: string[];
  tenantId: string;
  updateTokens: (_accessToken?: string, _refreshToken?: string) => void;
  switchTenant: (_tenantId: string) => void;
  hasPermission: (_permission: string) => boolean;
  hasRole: (_role: string | string[]) => boolean;
  clearSession: () => void;
}

const AuthContext = React.createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  roles: [],
  permissions: [],
  tenantId: '',
  updateTokens: () => undefined,
  switchTenant: () => undefined,
  hasPermission: () => false,
  hasRole: () => false,
  clearSession: () => undefined
});

// Parse token payload safely
const parseToken = (token: string) => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.payload || null;
  } catch {
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    isBrowser ? locals.get(ACCESS_TOKEN_KEY) : undefined
  );
  const [tenantId, setTenantId] = useState<string>(isBrowser ? locals.get(TENANT_KEY) || '' : '');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Derived state from token
  const tokenPayload = useMemo(() => {
    return accessToken && !isTokenExpired(accessToken) ? parseToken(accessToken) : null;
  }, [accessToken]);

  const isAuthenticated = !!tokenPayload;
  const roles = tokenPayload?.roles || [];
  const permissions = tokenPayload?.permissions || [];

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await accountApi.getCurrentUser();
        setUser(userData);

        // Set tenant from user data if not set
        if (!tenantId && userData?.tenants?.[0]) {
          const defaultTenant = userData.tenants[0];
          setTenantId(defaultTenant.id);
          if (isBrowser) {
            locals.set(TENANT_KEY, defaultTenant.id);
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, tenantId]);

  const updateTokens = useCallback((newAccessToken?: string, newRefreshToken?: string) => {
    setAccessToken(newAccessToken);

    if (isBrowser) {
      if (newAccessToken) {
        locals.set(ACCESS_TOKEN_KEY, newAccessToken);
      } else {
        locals.remove(ACCESS_TOKEN_KEY);
      }

      if (newRefreshToken) {
        locals.set(REFRESH_TOKEN_KEY, newRefreshToken);
      } else {
        locals.remove(REFRESH_TOKEN_KEY);
      }
    }

    if (!newAccessToken) {
      setUser(null);
      setTenantId('');
      if (isBrowser) {
        locals.remove(TENANT_KEY);
      }
    }
  }, []);

  const switchTenant = useCallback(
    (newTenantId: string) => {
      if (newTenantId === tenantId) return;

      setTenantId(newTenantId);
      if (isBrowser) {
        locals.set(TENANT_KEY, newTenantId);
      }
    },
    [tenantId]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!isAuthenticated) return false;
      if (tokenPayload?.is_admin) return true;

      const [action, resource] = permission.split(':');
      return permissions.some(perm => {
        if (perm === permission) return true;
        if (perm === `*:${resource}` || perm === `${action}:*` || perm === '*:*') return true;
        return false;
      });
    },
    [isAuthenticated, tokenPayload, permissions]
  );

  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (!isAuthenticated) return false;

      if (Array.isArray(role)) {
        return role.some(r => roles.includes(r));
      }
      return roles.includes(role);
    },
    [isAuthenticated, roles]
  );

  const clearSession = useCallback(() => {
    updateTokens();
    setUser(null);
  }, [updateTokens]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      roles,
      permissions,
      tenantId,
      updateTokens,
      switchTenant,
      hasPermission,
      hasRole,
      clearSession
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      roles,
      permissions,
      tenantId,
      updateTokens,
      switchTenant,
      hasPermission,
      hasRole,
      clearSession
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
