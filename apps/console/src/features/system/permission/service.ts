import { AnyObject } from '@ncobase/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPermission,
  deletePermission,
  getPermission,
  getPermissions,
  updatePermission
} from './apis';
import { QueryFormParams } from './config/query';
import { Permission } from './permission';

interface PermissionKeys {
  create: ['permissionService', 'create'];
  get: (_options?: {
    permission?: string;
  }) => ['permissionService', 'permission', { permission?: string }];
  tree: (_options?: AnyObject) => ['permissionService', 'tree', AnyObject];
  update: ['permissionService', 'update'];
  list: (_options?: QueryFormParams) => ['permissionService', 'permissions', QueryFormParams];
}

export const permissionKeys: PermissionKeys = {
  create: ['permissionService', 'create'],
  get: ({ permission } = {}) => ['permissionService', 'permission', { permission }],
  tree: (queryParams = {}) => ['permissionService', 'tree', queryParams],
  update: ['permissionService', 'update'],
  list: (queryParams = {}) => ['permissionService', 'permissions', queryParams]
};

// Query a specific permission by ID or Slug
export const useQueryPermission = (permission: string) =>
  useQuery({
    queryKey: permissionKeys.get({ permission }),
    queryFn: () => getPermission(permission),
    enabled: !!permission
  });

// List permissions
export const useListPermissions = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: permissionKeys.list(queryParams),
    queryFn: () => getPermissions(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create permission mutation
export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Permission, keyof Permission>) => createPermission(payload),
    onSuccess: () => {
      // Invalidate and refetch permissions list
      queryClient.invalidateQueries({ queryKey: ['permissionService', 'permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissionService', 'tree'] });
    },
    onError: error => {
      console.error('Failed to create permission:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update permission mutation
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Permission, keyof Permission>) => updatePermission(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific permission, permissions list, and tree
      queryClient.invalidateQueries({ queryKey: ['permissionService', 'permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissionService', 'tree'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: permissionKeys.get({ permission: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update permission:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete permission mutation
export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePermission(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate permissions list and tree
      queryClient.removeQueries({
        queryKey: permissionKeys.get({ permission: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['permissionService', 'permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissionService', 'tree'] });
    },
    onError: error => {
      console.error('Failed to delete permission:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
