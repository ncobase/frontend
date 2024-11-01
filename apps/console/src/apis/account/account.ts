import { request } from '@/apis/request';
import { Account, Tenant, Tenants } from '@/types';

const ENDPOINT = '/iam/account';

// current user
export const getCurrentUser = async (): Promise<Account> => {
  return request.get(`${ENDPOINT}`);
};

// get user owned tenant
export const getAccountTenant = async (): Promise<Tenant> => {
  return request.get(`${ENDPOINT}/tenant`);
};

// get user belonged tenants or related tenants
export const getAccountTenants = async (): Promise<Tenants> => {
  return request.get(`${ENDPOINT}/tenants`);
};
