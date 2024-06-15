import { useMutation, useQuery } from '@tanstack/react-query';
import { Account, AnyObject, ExplicitAny } from '@ncobase/types';

import { createUser, getUser, getUsers, updateUser } from '@/apis/user/user';
import { paginateByCursor } from '@/helpers/pagination';

type UserMutationFn = (payload: Pick<Account, keyof Account>) => Promise<Account>;
type UserQueryFn<T> = () => Promise<T>;

interface UserKeys {
  create: ['userService', 'create'];
  get: (options?: { user?: string }) => ['userService', 'user', { user?: string }];
  tree: (options?: AnyObject) => ['userService', 'tree', AnyObject];
  update: ['userService', 'update'];
  list: (options?: AnyObject) => ['userService', 'users', AnyObject];
}

export const userKeys: UserKeys = {
  create: ['userService', 'create'],
  get: ({ user } = {}) => ['userService', 'user', { user }],
  tree: (queryKey = {}) => ['userService', 'tree', queryKey],
  update: ['userService', 'update'],
  list: (queryKey = {}) => ['userService', 'users', queryKey]
};

const useUserMutation = (mutationFn: UserMutationFn) => useMutation({ mutationFn });

const useQueryUserData = <T>(queryKey: unknown[], queryFn: UserQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryUser = (user: string) =>
  useQueryUserData(userKeys.get({ user }), () => getUser(user));

export const useCreateUser = () => useUserMutation(payload => createUser(payload));
export const useUpdateUser = () => useUserMutation(payload => updateUser(payload));

export const useListUsers = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: userKeys.list(queryKey),
    queryFn: () => getUsers(queryKey)
  });
  const { content: users = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(users, cursor as string, limit as number);
  return { users: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
