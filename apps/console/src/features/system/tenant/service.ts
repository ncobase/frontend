import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from '../menu/config/query';

import { createTenant, getTenant, getTenants, updateTenant } from '@/apis/system/tenant';
import { Tenant } from '@/types';

interface TenantKeys {
  create: ['tenantService', 'create'];
  get: (options?: { tenant?: string }) => ['tenantService', 'tenant', { tenant?: string }];
  update: ['tenantService', 'update'];
  list: (options?: QueryFormParams) => ['tenantService', 'tenants', QueryFormParams];
}

export const tenantKeys: TenantKeys = {
  create: ['tenantService', 'create'],
  get: ({ tenant } = {}) => ['tenantService', 'tenant', { tenant }],
  update: ['tenantService', 'update'],
  list: (queryParams = {}) => ['tenantService', 'tenants', queryParams]
};

// Hook to query a specific tenant by ID or Slug
export const useQueryTenant = (tenant: string) =>
  useQuery({ queryKey: tenantKeys.get({ tenant }), queryFn: () => getTenant(tenant) });

// Hook for create tenant mutation
export const useCreateTenant = () =>
  useMutation({ mutationFn: (payload: Pick<Tenant, keyof Tenant>) => createTenant(payload) });

// Hook for update tenant mutation
export const useUpdateTenant = () =>
  useMutation({ mutationFn: (payload: Pick<Tenant, keyof Tenant>) => updateTenant(payload) });

// Hook to list tenants
export const useListTenants = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: tenantKeys.list(queryParams),
    queryFn: () => getTenants(queryParams)
  });
};
