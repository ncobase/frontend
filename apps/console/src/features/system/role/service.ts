import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import { createRole, deleteRole, getRole, getRoles, updateRole } from '@/apis/system/role';
import { Role } from '@/types';

interface RoleKeys {
  create: ['roleService', 'create'];
  // eslint-disable-next-line no-unused-vars
  get: (options?: { role?: string }) => ['roleService', 'role', { role?: string }];
  update: ['roleService', 'update'];
  // eslint-disable-next-line no-unused-vars
  list: (options?: QueryFormParams) => ['roleService', 'roles', QueryFormParams];
}

export const roleKeys: RoleKeys = {
  create: ['roleService', 'create'],
  get: ({ role } = {}) => ['roleService', 'role', { role }],
  update: ['roleService', 'update'],
  list: (queryParams = {}) => ['roleService', 'roles', queryParams]
};

// Hook to query a specific role by ID or Slug
export const useQueryRole = (role: string) =>
  useQuery({ queryKey: roleKeys.get({ role }), queryFn: () => getRole(role) });

// Hook for create role mutation
export const useCreateRole = () =>
  useMutation({ mutationFn: (payload: Pick<Role, keyof Role>) => createRole(payload) });

// Hook for update role mutation
export const useUpdateRole = () =>
  useMutation({ mutationFn: (payload: Pick<Role, keyof Role>) => updateRole(payload) });

// Hook for delete role mutation
export const useDeleteRole = () => useMutation({ mutationFn: (id: string) => deleteRole(id) });

// Hook to list roles
export const useListRoles = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: roleKeys.list(queryParams),
    queryFn: () => getRoles(queryParams)
  });
};
