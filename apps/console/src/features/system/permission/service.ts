import { AnyObject } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';
import { Permission } from './permission';

import {
  createPermission,
  deletePermission,
  getPermission,
  getPermissions,
  updatePermission
} from '@/features/system/permission/apis';

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

// Hook to query a specific permission by ID or Slug
export const useQueryPermission = (permission: string) =>
  useQuery({
    queryKey: permissionKeys.get({ permission }),
    queryFn: () => getPermission(permission)
  });

// Hook for create permission mutation
export const useCreatePermission = () =>
  useMutation({
    mutationFn: (payload: Pick<Permission, keyof Permission>) => createPermission(payload)
  });

// Hook for update permission mutation
export const useUpdatePermission = () =>
  useMutation({
    mutationFn: (payload: Pick<Permission, keyof Permission>) => updatePermission(payload)
  });

// Hook for delete permission mutation
export const useDeletePermission = () =>
  useMutation({ mutationFn: (id: string) => deletePermission(id) });

// Hook to list permissions
export const useListPermissions = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: permissionKeys.list(queryParams),
    queryFn: () => getPermissions(queryParams)
  });
};
