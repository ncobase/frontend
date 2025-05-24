import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTenant, deleteTenant, getTenant, getTenants, updateTenant } from './apis';
import { QueryFormParams } from './config/query';
import { Tenant } from './tenant';

interface TenantKeys {
  create: ['tenantService', 'create'];
  get: (_options?: { slug?: string }) => ['tenantService', 'tenant', { slug?: string }];
  update: ['tenantService', 'update'];
  delete: ['tenantService', 'delete'];
  list: (_options?: QueryFormParams) => ['tenantService', 'tenants', QueryFormParams];
}

export const tenantKeys: TenantKeys = {
  create: ['tenantService', 'create'],
  get: ({ slug } = {}) => ['tenantService', 'tenant', { slug }],
  update: ['tenantService', 'update'],
  delete: ['tenantService', 'delete'],
  list: (queryParams = {}) => ['tenantService', 'tenants', queryParams]
};

// Query a specific tenant by slug
export const useQueryTenant = (slug: string) =>
  useQuery({
    queryKey: tenantKeys.get({ slug }),
    queryFn: () => getTenant(slug),
    enabled: !!slug
  });

// List tenants with query params
export const useListTenants = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: tenantKeys.list(queryParams),
    queryFn: () => getTenants(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create tenant mutation
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Tenant) => createTenant(payload),
    onSuccess: () => {
      // Invalidate and refetch tenants list
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'tenants'] });
    },
    onError: error => {
      console.error('Failed to create tenant:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update tenant mutation
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Tenant) => updateTenant(payload),
    onSuccess: data => {
      // Invalidate specific tenant and tenants list
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'tenants'] });
      if (data?.slug) {
        queryClient.invalidateQueries({
          queryKey: tenantKeys.get({ slug: data.slug })
        });
      }
    },
    onError: error => {
      console.error('Failed to update tenant:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete tenant mutation
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteTenant(slug),
    onSuccess: (_, deletedSlug) => {
      // Remove from cache and invalidate tenants list
      queryClient.removeQueries({
        queryKey: tenantKeys.get({ slug: deletedSlug })
      });
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'tenants'] });
    },
    onError: error => {
      console.error('Failed to delete tenant:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
