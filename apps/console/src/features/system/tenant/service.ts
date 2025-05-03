import { PaginationParams } from '@ncobase/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTenant, deleteTenant, getTenant, getTenants, updateTenant } from './apis';
import { Tenant } from './tenant';

interface TenantKeys {
  create: ['tenantService', 'create'];
  get: (_options?: { slug?: string }) => ['tenantService', 'tenant', { slug?: string }];
  update: ['tenantService', 'update'];
  delete: ['tenantService', 'delete'];
  list: (_options?: PaginationParams) => ['tenantService', 'tenants', PaginationParams];
}

export const tenantKeys: TenantKeys = {
  create: ['tenantService', 'create'],
  get: ({ slug } = {}) => ['tenantService', 'tenant', { slug }],
  update: ['tenantService', 'update'],
  delete: ['tenantService', 'delete'],
  list: (queryParams = {}) => ['tenantService', 'tenants', queryParams]
};

// Hook to query a specific tenant by ID
export const useQueryTenant = (slug: string) =>
  useQuery({
    queryKey: tenantKeys.get({ slug }),
    queryFn: () => getTenant(slug),
    enabled: !!slug
  });

// Hook for create tenant mutation
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Tenant) => createTenant(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.list() });
    }
  });
};

// Hook for update tenant mutation
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Tenant) => updateTenant(payload),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.get({ slug: data.slug }) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.list() });
    }
  });
};

// Hook for delete tenant mutation
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteTenant(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.list() });
    }
  });
};

// Hook to list tenants with pagination
export const useListTenants = (queryParams: PaginationParams) => {
  return useQuery({
    queryKey: tenantKeys.list(queryParams),
    queryFn: () => getTenants(queryParams)
  });
};
