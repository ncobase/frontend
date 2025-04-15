import { createApi } from '@/apis/factory';
import { Tenant } from '@/types';

export const tenantApi = createApi<Tenant>('/iam/tenants');

export const createTenant = tenantApi.create;
export const getTenant = tenantApi.get;
export const updateTenant = tenantApi.update;
export const deleteTenant = tenantApi.delete;
export const getTenants = tenantApi.list;
