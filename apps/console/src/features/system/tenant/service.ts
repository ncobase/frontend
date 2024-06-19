import { AnyObject, ExplicitAny, Tenant } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createTenant,
  getTenant,
  getTenants,
  getTenantTree,
  updateTenant
} from '@/apis/system/tenant';
import { paginateByCursor } from '@/helpers/pagination';

type TenantMutationFn = (payload: Pick<Tenant, keyof Tenant>) => Promise<Tenant>;
type TenantQueryFn<T> = () => Promise<T>;

interface TenantKeys {
  create: ['tenantService', 'create'];
  get: (options?: { tenant?: string }) => ['tenantService', 'tenant', { tenant?: string }];
  tree: (options?: AnyObject) => ['tenantService', 'tree', AnyObject];
  update: ['tenantService', 'update'];
  list: (options?: AnyObject) => ['tenantService', 'tenants', AnyObject];
}

export const tenantKeys: TenantKeys = {
  create: ['tenantService', 'create'],
  get: ({ tenant } = {}) => ['tenantService', 'tenant', { tenant }],
  tree: (queryKey = {}) => ['tenantService', 'tree', queryKey],
  update: ['tenantService', 'update'],
  list: (queryKey = {}) => ['tenantService', 'tenants', queryKey]
};

const useTenantMutation = (mutationFn: TenantMutationFn) => useMutation({ mutationFn });

const useQueryTenantData = <T>(queryKey: unknown[], queryFn: TenantQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryTenant = (tenant: string) =>
  useQueryTenantData(tenantKeys.get({ tenant }), () => getTenant(tenant));

export const useQueryTenantTreeData = (tenant: string, type?: string) =>
  useQueryTenantData(tenantKeys.tree({ tenant, type }), () => getTenantTree(tenant, type));

export const useCreateTenant = () => useTenantMutation(payload => createTenant(payload));
export const useUpdateTenant = () => useTenantMutation(payload => updateTenant(payload));

export const useListTenants = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: tenantKeys.list(queryKey),
    queryFn: () => getTenants(queryKey)
  });
  const { content: tenants = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(tenants, cursor as string, limit as number);

  return { tenants: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
