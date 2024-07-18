import { PaginationResult } from '@ncobase/react';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { ExplicitAny, Role } from '@/types';

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
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// delete
export const deleteRole = async (id: string): Promise<Role> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getRoles = async (params: ExplicitAny): Promise<PaginationResult<Role>> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
