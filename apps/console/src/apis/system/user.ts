import { PaginationResult } from '@ncobase/react';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { UserMeshes, ExplicitAny, User } from '@/types';

const ENDPOINT = '/user/users';

// create
export const createUser = async (payload: User): Promise<UserMeshes> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getUser = async (id: string): Promise<User> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// get user meshes
export const getUserMeshes = async (id: string): Promise<UserMeshes> => {
  return request.get(`${ENDPOINT}/${id}/meshes`);
};

// update
export const updateUser = async (payload: User): Promise<UserMeshes> => {
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// delete
export const deleteUser = async (id: string): Promise<ExplicitAny> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getUsers = async (params: ExplicitAny): Promise<PaginationResult<User>> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
