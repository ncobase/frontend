import { ExplicitAny, Permission, Permissions, PermissionTrees } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

const ENDPOINT = '/v1/permissions';

// create
export const createPermission = async (payload: Permission): Promise<Permission> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getPermission = async (id: string): Promise<Permission> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updatePermission = async (payload: Permission): Promise<Permission> => {
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deletePermission = async (id: string): Promise<Permission> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getPermissions = async (params: ExplicitAny): Promise<Permissions> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}?${queryString}`);
};

// get permission tree
export const getPermissionTree = async (
  permission: string,
  type?: string
): Promise<PermissionTrees> => {
  const queryParams = buildQueryString({ permission, type });
  return request.get(`/trees/permissions?${queryParams}`);
};
