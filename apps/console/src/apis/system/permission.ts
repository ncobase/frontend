import { PaginationResult } from '@ncobase/react';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { ExplicitAny, Permission } from '@/types';

const ENDPOINT = '/access/permissions';

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
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// delete
export const deletePermission = async (id: string): Promise<Permission> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getPermissions = async (
  params: ExplicitAny
): Promise<PaginationResult<Permission>> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
