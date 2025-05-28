import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';

import { isBrowser, locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { accountApi } from './apis';
import { Permission } from './permissions';
import { TokenPayload, tokenService } from './token_service';

export const ACCESS_TOKEN_KEY = 'app.access.token';
export const REFRESH_TOKEN_KEY = 'app.access.refresh';
export const TENANT_KEY = 'app.tenant.id';

import { Tenant } from '@/features/system/tenant/tenant';

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
  hasValidSession: boolean;
  clearSession: () => void;
}

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
  canAccess: () => false,
  hasValidSession: false,
  clearSession: () => undefined
});

const parseTokenSafely = (token: string) => {
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
    return { isAdmin: false, roles: [], permissions: [], tenantId: '' };
  }
};

const checkSessionValidity = async (): Promise<boolean> => {
  if (!isBrowser) return false;

  try {
    const response = await fetch('/api/iam/token-status', {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // Core state
  const [accessToken, setAccessToken] = useState<string | undefined>(
    isBrowser ? locals.get(ACCESS_TOKEN_KEY) : undefined
  );
  const [tenantId, setTenantId] = useState<string>(isBrowser ? locals.get(TENANT_KEY) || '' : '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);

  // Prevent duplicate checks
  const sessionChecked = useRef(false);
  const tenantSetFromAccount = useRef(false);

  // Derived state
  const isTokenValid = useMemo(() => {
    if (!accessToken) return false;
    return tokenService.isValidToken(accessToken) && !tokenService.isTokenExpired(accessToken);
  }, [accessToken]);

  const tokenInfo = useMemo(() => {
    return accessToken && isTokenValid
      ? parseTokenSafely(accessToken)
      : {
          isAdmin: false,
          roles: [],
          permissions: [],
          tenantId: ''
        };
  }, [accessToken, isTokenValid]);

  const isAuthenticated = (accessToken && isTokenValid) || hasValidSession;

  // Check session validity once if no token
  useEffect(() => {
    if (accessToken || sessionChecked.current) return;

    sessionChecked.current = true;
    checkSessionValidity().then(setHasValidSession);
  }, [accessToken]);

  // Fetch user data and set tenant from account
  useEffect(() => {
    if (!isTokenValid || tenantSetFromAccount.current) return;

    const fetchUserData = async () => {
      try {
        const userData = await accountApi.getCurrentUser();
        const userTenants = userData?.tenants || [];

        setAvailableTenants(userTenants);

        // Set tenant from account data if not set locally
        if (userTenants.length > 0) {
          const currentTenant = tenantId && userTenants.find(t => t.id === tenantId);
          const targetTenant = currentTenant || userTenants[0];

          if (targetTenant.id !== tenantId) {
            setTenantId(targetTenant.id);
            locals.set(TENANT_KEY, targetTenant.id);
          }
        }

        tenantSetFromAccount.current = true;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isTokenValid, tenantId]);

  // Update loading state
  useEffect(() => {
    if (!accessToken && sessionChecked.current) {
      setIsLoading(false);
    }
  }, [accessToken]);

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
      setTenantId('');
      setAvailableTenants([]);
      setHasValidSession(false);
      sessionChecked.current = false;
      tenantSetFromAccount.current = false;

      if (isBrowser) {
        locals.remove(TENANT_KEY);
      }
      Permission.clearAccountData();
    }

    Permission.refreshState();
  }, []);

  const switchTenant = useCallback(
    (newTenantId: string) => {
      const isValidTenant = availableTenants.some(t => t.id === newTenantId);

      if (!isValidTenant) {
        console.error(`Invalid tenant: ${newTenantId}`);
        return;
      }

      if (newTenantId === tenantId) return;

      setTenantId(newTenantId);

      if (isBrowser) {
        locals.set(TENANT_KEY, newTenantId);
      }

      Permission.refreshState();
    },
    [availableTenants, tenantId]
  );

  const clearSession = useCallback(() => {
    setHasValidSession(false);
    sessionChecked.current = false;
    tenantSetFromAccount.current = false;
    Permission.clearAccountData();
    updateTokens();
  }, [updateTokens]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!isAuthenticated) return false;
      try {
        return Permission.hasPermission(permission);
      } catch {
        return false;
      }
    },
    [isAuthenticated]
  );

  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (!isAuthenticated) return false;
      try {
        return Permission.hasRole(role);
      } catch {
        return false;
      }
    },
    [isAuthenticated]
  );

  const canAccess = useCallback(
    (options: {
      permission?: string;
      role?: string;
      any?: boolean;
      permissions?: string[];
      roles?: string[];
    }): boolean => {
      if (!isAuthenticated) return false;
      try {
        return Permission.canAccess(options);
      } catch {
        return false;
      }
    },
    [isAuthenticated]
  );

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      isAdmin: tokenInfo.isAdmin,
      roles: tokenInfo.roles,
      permissions: tokenInfo.permissions,
      tenantId,
      tokenTenantId: tokenInfo.tenantId,
      updateTokens,
      switchTenant,
      hasPermission,
      hasRole,
      canAccess,
      hasValidSession,
      clearSession
    }),
    [
      isAuthenticated,
      isLoading,
      tokenInfo,
      tenantId,
      updateTokens,
      switchTenant,
      hasPermission,
      hasRole,
      canAccess,
      hasValidSession,
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
