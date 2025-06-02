import { Tenant } from './tenant';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({});

export const tenantApi = createApi<Tenant>('/sys/tenants', {
  extensions: extensionMethods
});

export const createTenant = tenantApi.create;
export const getTenant = tenantApi.get;
export const updateTenant = tenantApi.update;
export const deleteTenant = tenantApi.delete;
export const getTenants = tenantApi.list;
