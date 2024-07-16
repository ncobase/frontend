import { useMutation, useQuery } from '@tanstack/react-query';

import { createTenant, getTenant, getTenants, updateTenant } from '@/apis/system/tenant';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { AnyObject, Tenant } from '@/types';

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

// Hook to list tenants with pagination
export const useListTenants = (queryParams: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: tenantKeys.list(queryParams),
    queryFn: () => getTenants(queryParams)
  });

  const paginatedResult = usePaginatedData<Tenant>(
    data || { items: [], total: 0, has_next: false },
    queryParams?.cursor as string,
    queryParams?.limit as number
  );

  return { ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = <T>(
  data: { items: T[]; total: number; has_next: boolean; next?: string },
  cursor?: string,
  limit: number = 10
): PaginationResult<T> => {
  const { items, has_next, next } = paginateByCursor(data.items, data.total, cursor, limit) || {
    items: [],
    has_next: data.has_next,
    next: data.next
  };

  return { items, total: data.total, next, has_next };
};
