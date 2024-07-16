import { useMutation, useQuery } from '@tanstack/react-query';

import { createGroup, getGroup, getGroups, updateGroup } from '@/apis/system/group';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { AnyObject, Group } from '@/types';

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

// Hook to list groups with pagination
export const useListGroups = (queryParams: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: groupKeys.list(queryParams),
    queryFn: () => getGroups(queryParams)
  });

  const paginatedResult = usePaginatedData<Group>(
    data || { items: [], total: 0, has_next: false },
    queryParams?.cursor as string,
    queryParams?.limit as number
  );

  return { ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = <T>(
  data: { items: T[]; total: number; has_next: boolean; next?: string },
  cursor?: string,
  limit: number = 10
): PaginationResult<T> => {
  const { items, has_next, next } = paginateByCursor(data.items, data.total, cursor, limit) || {
    items: [],
    has_next: data.has_next,
    next: data.next
  };

  return { items, total: data.total, next, has_next };
};
