import { AnyObject, ExplicitAny, Group } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createGroup, getGroup, getGroups, updateGroup } from '@/apis/system/group';
import { paginateByCursor } from '@/helpers/pagination';

interface GroupKeys {
  create: ['groupService', 'create'];
  get: (options?: { group?: string }) => ['groupService', 'group', { group?: string }];
  update: ['groupService', 'update'];
  list: (options?: AnyObject) => ['groupService', 'groups', AnyObject];
}

export const groupKeys: GroupKeys = {
  create: ['groupService', 'create'],
  get: ({ group } = {}) => ['groupService', 'group', { group }],
  update: ['groupService', 'update'],
  list: (queryKey = {}) => ['groupService', 'groups', queryKey]
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

// Hook to list groups with pagination
export const useListGroups = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: groupKeys.list(queryKey),
    queryFn: () => getGroups(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { groups: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
