import React, { useCallback, useContext, useMemo, useState } from 'react';

import { isBrowser, locals } from '@ncobase/utils';

interface TenantContextValue {
  tenant_id?: string;
  hasTenant: boolean;

  updateTenant(id?: string | null): void;
}

export const TENANT_KEY = '_TEN';

const TenantContext = React.createContext<TenantContextValue>({
  tenant_id: '',
  hasTenant: false,
  updateTenant: () => undefined
});

const updateTenant = (id?: string | null) => {
  if (!isBrowser) return;
  id ? locals.set(TENANT_KEY, id) : locals.remove(TENANT_KEY);
};

export const TenantProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [tenant, setTenant] = useState<string | undefined>(
    (isBrowser && locals.get(TENANT_KEY)) ?? undefined
  );

  const handleUpdateTenant = useCallback(
    (id: string) => {
      setTenant(id);
      updateTenant(id);
    },
    [setTenant]
  );

  const value = useMemo(
    () => ({
      tenant_id: tenant,
      hasTenant: !!tenant,
      updateTenant: handleUpdateTenant
    }),
    [tenant, handleUpdateTenant]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenantContext = (): TenantContextValue => useContext(TenantContext);
