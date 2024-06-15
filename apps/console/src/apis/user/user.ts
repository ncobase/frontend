import { Account, ExplicitAny, Users } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

const ENDPOINT = '/v1/users';

// create
export const createUser = async (payload: Account): Promise<Account> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getUser = async (id: string): Promise<Account> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateUser = async (payload: Account): Promise<Account> => {
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deleteUser = async (id: string): Promise<ExplicitAny> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getUsers = async (params: ExplicitAny): Promise<Users> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}?${queryString}`);
};
