import { ExplicitAny, Role, Roles, RoleTrees } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

const ENDPOINT = '/v1/roles';

// create
export const createRole = async (payload: Role): Promise<Role> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getRole = async (id: string): Promise<Role> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateRole = async (payload: Role): Promise<Role> => {
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deleteRole = async (id: string): Promise<Role> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getRoles = async (params: ExplicitAny): Promise<Roles> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}?${queryString}`);
};

// get role tree
export const getRoleTree = async (role: string, type?: string): Promise<RoleTrees> => {
  const queryParams = buildQueryString({ role, type });
  return request.get(`/trees/roles?${queryParams}`);
};
