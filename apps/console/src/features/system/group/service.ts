import { useMutation, useQuery } from '@tanstack/react-query';
import { AnyObject, ExplicitAny, Group } from '@ncobase/types';

import { createGroup, getGroup, getGroups, getGroupTree, updateGroup } from '@/apis/group/group';
import { paginateByCursor } from '@/helpers/pagination';

type GroupMutationFn = (payload: Pick<Group, keyof Group>) => Promise<Group>;
type GroupQueryFn<T> = () => Promise<T>;

interface GroupKeys {
  create: ['groupService', 'create'];
  get: (options?: { group?: string }) => ['groupService', 'group', { group?: string }];
  tree: (options?: AnyObject) => ['groupService', 'tree', AnyObject];
  update: ['groupService', 'update'];
  list: (options?: AnyObject) => ['groupService', 'groups', AnyObject];
}

export const groupKeys: GroupKeys = {
  create: ['groupService', 'create'],
  get: ({ group } = {}) => ['groupService', 'group', { group }],
  tree: (queryKey = {}) => ['groupService', 'tree', queryKey],
  update: ['groupService', 'update'],
  list: (queryKey = {}) => ['groupService', 'groups', queryKey]
};

const useGroupMutation = (mutationFn: GroupMutationFn) => useMutation({ mutationFn });

const useQueryGroupData = <T>(queryKey: unknown[], queryFn: GroupQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryGroup = (group: string) =>
  useQueryGroupData(groupKeys.get({ group }), () => getGroup(group));

export const useQueryGroupTreeData = (group: string, type?: string) =>
  useQueryGroupData(groupKeys.tree({ group, type }), () => getGroupTree(group, type));

export const useCreateGroup = () => useGroupMutation(payload => createGroup(payload));
export const useUpdateGroup = () => useGroupMutation(payload => updateGroup(payload));

export const useListGroups = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: groupKeys.list(queryKey),
    queryFn: () => getGroups(queryKey)
  });
  const { content: groups = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(groups, cursor as string, limit as number);

  return { groups: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
