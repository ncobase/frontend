import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createUser,
  deleteUser,
  getUser,
  getUserMeshes,
  getUsers,
  updateUser,
  createUserWithProfile,
  updateUserWithProfile
} from './apis';
import { QueryFormParams } from './config/query';
import { User } from './user';

interface UserKeys {
  create: ['userService', 'create'];
  get: (_options?: { user?: string }) => ['userService', 'user', { user?: string }];
  meshes: (_options?: { user?: string }) => ['userService', 'userMeshes', { user?: string }];
  update: ['userService', 'update'];
  list: (_options?: QueryFormParams) => ['userService', 'users', QueryFormParams];
}

export const userKeys: UserKeys = {
  create: ['userService', 'create'],
  get: ({ user } = {}) => ['userService', 'user', { user }],
  meshes: ({ user } = {}) => ['userService', 'userMeshes', { user }],
  update: ['userService', 'update'],
  list: (queryParams = {}) => ['userService', 'users', queryParams]
};

// Query a specific user by ID
export const useQueryUser = (user: string) =>
  useQuery({
    queryKey: userKeys.get({ user }),
    queryFn: () => getUser(user),
    enabled: !!user
  });

// Query user meshes (user + profile data)
export const useQueryUserMeshes = (user: string) => {
  return useQuery({
    queryKey: userKeys.meshes({ user }),
    queryFn: () => getUserMeshes(user),
    enabled: !!user
  });
};

// List users with query params
export const useListUsers = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: userKeys.list(queryParams),
    queryFn: () => getUsers(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<User, keyof User>) => createUser(payload),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
    },
    onError: error => {
      console.error('Failed to create user:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Create user with profile mutation
export const useCreateUserWithProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserWithProfile,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
    },
    onError: error => {
      console.error('Failed to create user with profile:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<User, keyof User>) => updateUser(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific user, user meshes, and users list
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: userKeys.get({ user: variables.id })
        });
        queryClient.invalidateQueries({
          queryKey: userKeys.meshes({ user: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update user:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update user with profile mutation
export const useUpdateUserWithProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserWithProfile,
    onSuccess: (_, variables) => {
      // Invalidate specific user, user meshes, and users list
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
      if (variables.user.id) {
        queryClient.invalidateQueries({
          queryKey: userKeys.get({ user: variables.user.id })
        });
        queryClient.invalidateQueries({
          queryKey: userKeys.meshes({ user: variables.user.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update user with profile:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate users list
      queryClient.removeQueries({
        queryKey: userKeys.get({ user: deletedId })
      });
      queryClient.removeQueries({
        queryKey: userKeys.meshes({ user: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
    },
    onError: error => {
      console.error('Failed to delete user:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
