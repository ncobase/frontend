import { Group } from './group';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({});

export const groupApi = createApi<Group>('/org/groups', {
  extensions: extensionMethods
});

export const createGroup = groupApi.create;
export const getGroup = groupApi.get;
export const updateGroup = groupApi.update;
export const deleteGroup = groupApi.delete;
export const getGroups = groupApi.list;
