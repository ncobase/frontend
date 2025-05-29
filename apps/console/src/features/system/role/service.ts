import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createRole, deleteRole, getRole, getRoles, updateRole } from './apis';
import { QueryFormParams } from './config/query';
import { Role } from './role';

interface RoleKeys {
  create: ['roleService', 'create'];
  get: (_options?: { role?: string }) => ['roleService', 'role', { role?: string }];
  update: ['roleService', 'update'];
  list: (_options?: QueryFormParams) => ['roleService', 'roles', QueryFormParams];
}

export const roleKeys: RoleKeys = {
  create: ['roleService', 'create'],
  get: ({ role } = {}) => ['roleService', 'role', { role }],
  update: ['roleService', 'update'],
  list: (queryParams = {}) => ['roleService', 'roles', queryParams]
};

// Query a specific role by ID or Slug
export const useQueryRole = (role: string) =>
  useQuery({
    queryKey: roleKeys.get({ role }),
    queryFn: () => getRole(role),
    enabled: !!role
  });

// List roles
export const useListRoles = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: roleKeys.list(queryParams),
    queryFn: () => getRoles(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create role mutation
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Role, keyof Role>) => createRole(payload),
    onSuccess: () => {
      // Invalidate and refetch roles list
      queryClient.invalidateQueries({ queryKey: ['roleService', 'roles'] });
    },
    onError: error => {
      console.error('Failed to create role:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update role mutation
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Role, keyof Role>) => updateRole(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific role and roles list
      queryClient.invalidateQueries({ queryKey: ['roleService', 'roles'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: roleKeys.get({ role: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update role:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete role mutation
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate roles list
      queryClient.removeQueries({
        queryKey: roleKeys.get({ role: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['roleService', 'roles'] });
    },
    onError: error => {
      console.error('Failed to delete role:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
