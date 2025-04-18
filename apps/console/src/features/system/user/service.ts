import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';
import { User } from './user';

import {
  createUser,
  deleteUser,
  getUser,
  getUserMeshes,
  getUsers,
  updateUser
} from '@/features/system/user/apis';

interface UserKeys {
  create: ['userService', 'create'];
  // eslint-disable-next-line no-unused-vars
  get: (options?: { user?: string }) => ['userService', 'user', { user?: string }];
  update: ['userService', 'update'];
  // eslint-disable-next-line no-unused-vars
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

// Hook to query user meshes
export const useQueryUserMeshes = (user: string) => {
  return useQuery({ queryKey: userKeys.get({ user }), queryFn: () => getUserMeshes(user) });
};

// Hook for create user mutation
export const useCreateUser = () =>
  useMutation({ mutationFn: (payload: Pick<User, keyof User>) => createUser(payload) });

// Hook for update user mutation
export const useUpdateUser = () =>
  useMutation({ mutationFn: (payload: Pick<User, keyof User>) => updateUser(payload) });

// Hook for delete user mutation
export const useDeleteUser = () => useMutation({ mutationFn: (id: string) => deleteUser(id) });

// Hook to list users
export const useListUsers = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: userKeys.list(queryParams),
    queryFn: () => getUsers(queryParams)
  });
};
