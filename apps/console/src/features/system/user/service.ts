import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import { createUser, getUser, getUsers, updateUser } from '@/apis/system/user';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { UserMeshes, User } from '@/types';

interface UserKeys {
  create: ['userService', 'create'];
  get: (options?: { user?: string }) => ['userService', 'user', { user?: string }];
  update: ['userService', 'update'];
  list: (options?: QueryFormParams) => ['userService', 'users', QueryFormParams];
}

export const userKeys: UserKeys = {
  create: ['userService', 'create'],
  get: ({ user } = {}) => ['userService', 'user', { user }],
  update: ['userService', 'update'],
  list: (queryParams = {}) => ['userService', 'users', queryParams]
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
export const useListUsers = (queryParams: QueryFormParams = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: userKeys.list(queryParams),
    queryFn: () => getUsers(queryParams)
  });

  const paginatedResult = usePaginatedData<User>(
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
