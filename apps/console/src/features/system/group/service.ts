import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';
import { Group } from './group';

import {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  updateGroup
} from '@/features/system/group/apis';

interface GroupKeys {
  create: ['groupService', 'create'];
  get: (_options?: { group?: string }) => ['groupService', 'group', { group?: string }];
  update: ['groupService', 'update'];
  list: (_options?: QueryFormParams) => ['groupService', 'groups', QueryFormParams];
}

export const groupKeys: GroupKeys = {
  create: ['groupService', 'create'],
  get: ({ group } = {}) => ['groupService', 'group', { group }],
  update: ['groupService', 'update'],
  list: (queryParams = {}) => ['groupService', 'groups', queryParams]
};

// Hook to query a specific group by ID or Slug
export const useQueryGroup = (group: string) =>
  useQuery({ queryKey: groupKeys.get({ group }), queryFn: () => getGroup(group) });

// Hook for create group mutation
export const useCreateGroup = () =>
  useMutation({ mutationFn: (payload: Pick<Group, keyof Group>) => createGroup(payload) });

// Hook for update group mutation
export const useUpdateGroup = () =>
  useMutation({ mutationFn: (payload: Pick<Group, keyof Group>) => updateGroup(payload) });

// Hook for delete group mutation
export const useDeleteGroup = () => useMutation({ mutationFn: (id: string) => deleteGroup(id) });

// Hook to list groups
export const useListGroups = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: groupKeys.list(queryParams),
    queryFn: () => getGroups(queryParams)
  });
};
