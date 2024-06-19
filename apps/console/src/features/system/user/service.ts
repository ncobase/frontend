import { UserMeshes, AnyObject, ExplicitAny } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createUser, getUser, getUsers, updateUser } from '@/apis/system/user';
import { paginateByCursor } from '@/helpers/pagination';

interface UserKeys {
  create: ['userService', 'create'];
  get: (options?: { user?: string }) => ['userService', 'user', { user?: string }];
  update: ['userService', 'update'];
  list: (options?: AnyObject) => ['userService', 'users', AnyObject];
}

export const userKeys: UserKeys = {
  create: ['userService', 'create'],
  get: ({ user } = {}) => ['userService', 'user', { user }],
  update: ['userService', 'update'],
  list: (queryKey = {}) => ['userService', 'users', queryKey]
};

// Hook to query a specific user by ID or Slug
export const useQueryUser = (user: string) =>
  useQuery({ queryKey: userKeys.get({ user }), queryFn: () => getUser(user) });

// Hook for create user mutation
export const useCreateUser = () =>
  useMutation({ mutationFn: (payload: Pick<UserMeshes, keyof UserMeshes>) => createUser(payload) });

// Hook for update user mutation
export const useUpdateUser = () =>
  useMutation({ mutationFn: (payload: Pick<UserMeshes, keyof UserMeshes>) => updateUser(payload) });

// Hook to list users with pagination
export const useListUsers = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: userKeys.list(queryKey),
    queryFn: () => getUsers(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { users: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
