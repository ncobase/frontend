import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createGroup, deleteGroup, getGroup, getGroups, updateGroup } from './apis';
import { QueryFormParams } from './config/query';
import { Group } from './group';

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

// Query a specific group by ID or Slug
export const useQueryGroup = (group: string) =>
  useQuery({
    queryKey: groupKeys.get({ group }),
    queryFn: () => getGroup(group),
    enabled: !!group
  });

// List groups
export const useListGroups = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: groupKeys.list(queryParams),
    queryFn: () => getGroups(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create group mutation
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Group, keyof Group>) => createGroup(payload),
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: ['groupService', 'groups'] });
    },
    onError: error => {
      console.error('Failed to create group:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update group mutation
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Group, keyof Group>) => updateGroup(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific group and groups list
      queryClient.invalidateQueries({ queryKey: ['groupService', 'groups'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: groupKeys.get({ group: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update group:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete group mutation
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate groups list
      queryClient.removeQueries({
        queryKey: groupKeys.get({ group: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['groupService', 'groups'] });
    },
    onError: error => {
      console.error('Failed to delete group:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
