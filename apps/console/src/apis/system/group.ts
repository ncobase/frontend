import { createApi } from '@/apis/factory';
import { Group } from '@/types';

export const groupApi = createApi<Group>('/org/groups');

export const createGroup = groupApi.create;
export const getGroup = groupApi.get;
export const updateGroup = groupApi.update;
export const deleteGroup = groupApi.delete;
export const getGroups = groupApi.list;
