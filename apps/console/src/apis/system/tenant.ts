import { ExplicitAny, Tenant, Tenants } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';

const ENDPOINT = '/v1/tenants';

// create
export const createTenant = async (payload: Tenant): Promise<Tenant> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getTenant = async (id: string): Promise<Tenant> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateTenant = async (payload: Tenant): Promise<Tenant> => {
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deleteTenant = async (id: string): Promise<Tenant> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getTenants = async (params: ExplicitAny): Promise<Tenants> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
