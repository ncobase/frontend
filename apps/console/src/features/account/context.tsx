import React, { PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { isBrowser, locals } from '@ncobase/utils';

import { TenantProvider } from '@/features/system/tenant/context';

interface AuthContextValue {
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;

  updateTokens(accessToken?: string, refreshToken?: string): void;
}

export const ACCESS_TOKEN_KEY = '_AK';
export const REFRESH_TOKEN_KEY = '_RK';

const AuthContext = React.createContext<AuthContextValue>({
  isAuthenticated: false,
  updateTokens: () => undefined
});

const updateTokens = (accessToken?: string, refreshToken?: string) => {
  if (!isBrowser) {
    return () => undefined;
  }
  if (!accessToken) {
    locals.remove(ACCESS_TOKEN_KEY);
  } else {
    locals.set(ACCESS_TOKEN_KEY, accessToken);
  }
  if (!refreshToken) {
    locals.remove(REFRESH_TOKEN_KEY);
  } else {
    locals.set(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    (isBrowser && locals.get(ACCESS_TOKEN_KEY)) ?? undefined
  );

  const handleTokens = useCallback(
    (accessToken?: string, refreshToken?: string) => {
      setAccessToken(accessToken);
      updateTokens(accessToken, refreshToken);
    },
    [setAccessToken]
  );

  const value = useMemo(
    () => ({
      isAuthenticated: !!accessToken,
      updateTokens: handleTokens
    }),
    [accessToken, handleTokens]
  );

  return (
    <AuthContext.Provider value={value}>
      <TenantProvider>{children}</TenantProvider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
