import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  assignPermissions,
  assignUsers,
  createRole,
  deleteRole,
  getEnabledRoles,
  getRole,
  getRoleBySlug,
  getRolePermissions,
  getRoles,
  getRoleUsers,
  removePermissions,
  removeUsers,
  updateRole
} from './apis';
import { QueryFormParams } from './config/query';

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

// Role CRUD hooks
export const useQueryRole = (roleId: string) =>
  useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId),
    enabled: !!roleId
  });

export const useQueryRoleBySlug = (slug: string) =>
  useQuery({
    queryKey: ['roleBySlug', slug],
    queryFn: () => getRoleBySlug(slug),
    enabled: !!slug
  });

export const useListRoles = (params: any) =>
  useQuery({
    queryKey: ['roles', params],
    queryFn: () => getRoles(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

export const useListEnabledRoles = () =>
  useQuery({
    queryKey: ['enabledRoles'],
    queryFn: getEnabledRoles,
    staleTime: 10 * 60 * 1000
  });

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
      }
    }
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ['role', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });
};

// Role-Permission management hooks
export const useQueryRolePermissions = (roleId: string) =>
  useQuery({
    queryKey: ['rolePermissions', roleId],
    queryFn: () => getRolePermissions(roleId),
    enabled: !!roleId
  });

export const useAssignPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      assignPermissions(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', roleId] });
    }
  });
};

export const useRemovePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      removePermissions(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', roleId] });
    }
  });
};

// Role-User management hooks
export const useQueryRoleUsers = (roleId: string) =>
  useQuery({
    queryKey: ['roleUsers', roleId],
    queryFn: () => getRoleUsers(roleId),
    enabled: !!roleId
  });

export const useAssignUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, userIds }: { roleId: string; userIds: string[] }) =>
      assignUsers(roleId, userIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['roleUsers', roleId] });
    }
  });
};

export const useRemoveUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, userIds }: { roleId: string; userIds: string[] }) =>
      removeUsers(roleId, userIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['roleUsers', roleId] });
    }
  });
};
