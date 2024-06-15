import { AnyObject, Tenant, Tenants } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

const ENDPOINT = '/v1/account/tenants';

// get user belonged tenants or my tenants
export const getUserTenants = async (params: AnyObject): Promise<Tenants> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}?${queryString}`);
};

// get user tenant detail
export const getUserTenant = async (id: string): Promise<Tenant> => {
  return request.get(`${ENDPOINT}/${id}`);
};
