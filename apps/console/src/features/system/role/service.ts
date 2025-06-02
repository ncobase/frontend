import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  assignPermissionsToRole,
  createRole,
  deleteRole,
  getRole,
  getRolePermissions,
  getRoles,
  getRoleUsers,
  removePermissionsFromRole,
  updateRole
} from './apis';
import { QueryFormParams } from './config/query';
import { Role } from './role';

interface RoleKeys {
  create: ['roleService', 'create'];
  get: (_options?: { role?: string }) => ['roleService', 'role', { role?: string }];
  permissions: (_options?: {
    role?: string;
  }) => ['roleService', 'rolePermissions', { role?: string }];
  users: (_options?: { role?: string }) => ['roleService', 'roleUsers', { role?: string }];
  update: ['roleService', 'update'];
  list: (_options?: QueryFormParams) => ['roleService', 'roles', QueryFormParams];
}

export const roleKeys: RoleKeys = {
  create: ['roleService', 'create'],
  get: ({ role } = {}) => ['roleService', 'role', { role }],
  permissions: ({ role } = {}) => ['roleService', 'rolePermissions', { role }],
  users: ({ role } = {}) => ['roleService', 'roleUsers', { role }],
  update: ['roleService', 'update'],
  list: (queryParams = {}) => ['roleService', 'roles', queryParams]
};

// Enhanced role queries and mutations
export const useQueryRole = (role: string) =>
  useQuery({
    queryKey: roleKeys.get({ role }),
    queryFn: () => getRole(role),
    enabled: !!role
  });

export const useQueryRolePermissions = (role: string) =>
  useQuery({
    queryKey: roleKeys.permissions({ role }),
    queryFn: () => getRolePermissions(role),
    enabled: !!role
  });

export const useQueryRoleUsers = (role: string) =>
  useQuery({
    queryKey: roleKeys.users({ role }),
    queryFn: () => getRoleUsers(role),
    enabled: !!role
  });

export const useListRoles = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: roleKeys.list(queryParams),
    queryFn: () => getRoles(queryParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Role mutations
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Role, keyof Role>) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleService', 'roles'] });
    },
    onError: error => {
      console.error('Failed to create role:', error);
    }
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Role, keyof Role>) => updateRole(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roleService', 'roles'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: roleKeys.get({ role: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update role:', error);
    }
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: roleKeys.get({ role: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['roleService', 'roles'] });
    },
    onError: error => {
      console.error('Failed to delete role:', error);
    }
  });
};

// Role permission management
export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      assignPermissionsToRole(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.permissions({ role: roleId })
      });
    },
    onError: error => {
      console.error('Failed to assign permissions:', error);
    }
  });
};

export const useRemovePermissionsFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      removePermissionsFromRole(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.permissions({ role: roleId })
      });
    },
    onError: error => {
      console.error('Failed to remove permissions:', error);
    }
  });
};
