import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createUser,
  deleteUser,
  getUser,
  getUserMeshes,
  getUsers,
  updateUser,
  createUserWithProfile,
  updateUserWithProfile,
  getUserRoles,
  assignRoles,
  removeRoles,
  enableUser,
  disableUser,
  deleteApiKey,
  generateApiKey,
  getUserSpaceRoles,
  createEmployee,
  deleteEmployee,
  getEmployee,
  getUserApiKeys,
  updateEmployee,
  getEmployees,
  updateStatus
} from './apis';
import { QueryFormParams } from './config/query';
import { CreateApiKeyRequest, EmployeeBody, User } from './user';

interface UserKeys {
  create: ['userService', 'create'];
  get: (_options?: { user?: string }) => ['userService', 'user', { user?: string }];
  meshes: (_options?: { user?: string }) => ['userService', 'userMeshes', { user?: string }];
  roles: (_options?: { user?: string }) => ['userService', 'userRoles', { user?: string }];
  update: ['userService', 'update'];
  list: (_options?: QueryFormParams) => ['userService', 'users', QueryFormParams];
}

export const userKeys: UserKeys = {
  create: ['userService', 'create'],
  get: ({ user } = {}) => ['userService', 'user', { user }],
  meshes: ({ user } = {}) => ['userService', 'userMeshes', { user }],
  roles: ({ user } = {}) => ['userService', 'userRoles', { user }],
  update: ['userService', 'update'],
  list: (queryParams = {}) => ['userService', 'users', queryParams]
};

// Query user by ID
export const useQueryUser = (user: string) =>
  useQuery({
    queryKey: userKeys.get({ user }),
    queryFn: () => getUser(user),
    enabled: !!user
  });

// Query user meshes (combined user and profile data)
export const useQueryUserMeshes = (user: string) => {
  return useQuery({
    queryKey: userKeys.meshes({ user }),
    queryFn: () => getUserMeshes(user),
    enabled: !!user
  });
};

// Query user roles
export const useQueryUserRoles = (user: string) => {
  return useQuery({
    queryKey: userKeys.roles({ user }),
    queryFn: () => getUserRoles(user),
    enabled: !!user
  });
};

// List users
export const useListUsers = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: userKeys.list(queryParams),
    queryFn: () => getUsers(queryParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<User, keyof User>) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
    },
    onError: error => {
      console.error('Failed to create user:', error);
    }
  });
};

// Create user with profile mutation
export const useCreateUserWithProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserWithProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
    },
    onError: error => {
      console.error('Failed to create user with profile:', error);
    }
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<User, keyof User>) => updateUser(payload),
    onSuccess: (_, variables) => {
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
    }
  });
};

// Update user with profile mutation
export const useUpdateUserWithProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserWithProfile,
    onSuccess: (_, variables) => {
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
    }
  });
};

// Assign roles mutation
export const useAssignRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      assignRoles(userId, roleIds),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.roles({ user: userId })
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.meshes({ user: userId })
      });
    },
    onError: error => {
      console.error('Failed to assign roles:', error);
    }
  });
};

// Remove roles mutation
export const useRemoveRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      removeRoles(userId, roleIds),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.roles({ user: userId })
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.meshes({ user: userId })
      });
    },
    onError: error => {
      console.error('Failed to remove roles:', error);
    }
  });
};

// Enable user mutation
export const useEnableUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => enableUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
      queryClient.invalidateQueries({
        queryKey: userKeys.get({ user: userId })
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.meshes({ user: userId })
      });
    },
    onError: error => {
      console.error('Failed to enable user:', error);
    }
  });
};

// Disable user mutation
export const useDisableUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => disableUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
      queryClient.invalidateQueries({
        queryKey: userKeys.get({ user: userId })
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.meshes({ user: userId })
      });
    },
    onError: error => {
      console.error('Failed to disable user:', error);
    }
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: userKeys.get({ user: deletedId })
      });
      queryClient.removeQueries({
        queryKey: userKeys.meshes({ user: deletedId })
      });
      queryClient.removeQueries({
        queryKey: userKeys.roles({ user: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['userService', 'users'] });
    },
    onError: error => {
      console.error('Failed to delete user:', error);
    }
  });
};

// Employee hooks
export const useQueryEmployee = (userId: string) => {
  return useQuery({
    queryKey: ['userService', 'employee', { userId }],
    queryFn: () => getEmployee(userId),
    enabled: !!userId
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeeBody) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userService', 'employees'] });
    }
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, ...payload }: EmployeeBody & { userId: string }) =>
      updateEmployee(userId, payload),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['userService', 'employee', { userId }]
      });
    }
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteEmployee(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userService', 'employees'] });
    }
  });
};

// API Key hooks
export const useQueryUserApiKeys = (userId: string) => {
  return useQuery({
    queryKey: ['userService', 'apiKeys', { userId }],
    queryFn: () => getUserApiKeys(userId),
    enabled: !!userId
  });
};

export const useGenerateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApiKeyRequest) => generateApiKey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userService', 'apiKeys'] });
    }
  });
};

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (keyId: string) => deleteApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userService', 'apiKeys'] });
    }
  });
};

// Query user space roles
export const useQueryUserSpaceRoles = (
  userId: string,
  spaceId?: string,
  options = { enabled: false }
) =>
  useQuery({
    queryKey: ['userService', 'userSpaceRoles', { userId, spaceId }],
    queryFn: () => getUserSpaceRoles(userId, spaceId!),
    enabled: !!userId && !!spaceId && options?.enabled !== false,
    ...options
  });

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, status }: { username: string; status: number }) =>
      updateStatus(username, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const useListEmployees = (params: any) =>
  useQuery({
    queryKey: ['employees', params],
    queryFn: () => getEmployees(params),
    staleTime: 5 * 60 * 1000
  });
