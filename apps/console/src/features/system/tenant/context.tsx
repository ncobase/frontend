import React, { useCallback, useContext } from 'react';

import { useAuthContext } from '@/features/account/context';

interface TenantContextValue {
  tenant_id: string;
  hasTenant: boolean;
  updateTenant: (_id: string) => void;
}

const TenantContext = React.createContext<TenantContextValue>({
  tenant_id: '',
  hasTenant: false,
  updateTenant: () => undefined
});

export const TenantProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { tenantId, switchTenant, isAuthenticated } = useAuthContext();

  // Simplified tenant update method that calls the AuthContext's switchTenant
  const handleUpdateTenant = useCallback(
    (id: string) => {
      switchTenant(id);
    },
    [switchTenant]
  );

  const value = {
    tenant_id: tenantId,
    hasTenant: isAuthenticated && !!tenantId,
    updateTenant: handleUpdateTenant
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenantContext = (): TenantContextValue => useContext(TenantContext);
