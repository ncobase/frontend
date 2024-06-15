import { ExplicitAny, Group, Groups, GroupTrees } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

const ENDPOINT = '/v1/groups';

// create
export const createGroup = async (payload: Group): Promise<Group> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getGroup = async (id: string): Promise<Group> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateGroup = async (payload: Group): Promise<Group> => {
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deleteGroup = async (id: string): Promise<Group> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getGroups = async (params: ExplicitAny): Promise<Groups> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}?${queryString}`);
};

// get group tree
export const getGroupTree = async (group: string, type?: string): Promise<GroupTrees> => {
  const queryParams = buildQueryString({ group, type });
  return request.get(`/trees/groups?${queryParams}`);
};
