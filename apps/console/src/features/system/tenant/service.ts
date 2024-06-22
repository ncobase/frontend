import { useMutation, useQuery } from '@tanstack/react-query';

import { createTenant, getTenant, getTenants, updateTenant } from '@/apis/system/tenant';
import { paginateByCursor } from '@/helpers/pagination';
import { AnyObject, ExplicitAny, Tenant } from '@/types';

interface TenantKeys {
  create: ['tenantService', 'create'];
  get: (options?: { tenant?: string }) => ['tenantService', 'tenant', { tenant?: string }];
  update: ['tenantService', 'update'];
  list: (options?: AnyObject) => ['tenantService', 'tenants', AnyObject];
}

export const tenantKeys: TenantKeys = {
  create: ['tenantService', 'create'],
  get: ({ tenant } = {}) => ['tenantService', 'tenant', { tenant }],
  update: ['tenantService', 'update'],
  list: (queryKey = {}) => ['tenantService', 'tenants', queryKey]
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

// Hook to list tenants with pagination
export const useListTenants = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: tenantKeys.list(queryKey),
    queryFn: () => getTenants(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { tenants: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
