import { PaginationResult } from '@ncobase/react';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { ExplicitAny, Tenant } from '@/types';

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
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// list
export const getTenants = async (params: ExplicitAny): Promise<PaginationResult<Tenant>> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
