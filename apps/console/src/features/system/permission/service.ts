import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createPermission,
  getPermission,
  getPermissions,
  updatePermission
} from '@/apis/system/permission';
import { paginateByCursor } from '@/helpers/pagination';
import { AnyObject, ExplicitAny, Permission } from '@/types';

interface PermissionKeys {
  create: ['permissionService', 'create'];
  get: (options?: {
    permission?: string;
  }) => ['permissionService', 'permission', { permission?: string }];
  tree: (options?: AnyObject) => ['permissionService', 'tree', AnyObject];
  update: ['permissionService', 'update'];
  list: (options?: AnyObject) => ['permissionService', 'permissions', AnyObject];
}

export const permissionKeys: PermissionKeys = {
  create: ['permissionService', 'create'],
  get: ({ permission } = {}) => ['permissionService', 'permission', { permission }],
  tree: (queryKey = {}) => ['permissionService', 'tree', queryKey],
  update: ['permissionService', 'update'],
  list: (queryKey = {}) => ['permissionService', 'permissions', queryKey]
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

// Hook to list permissions with pagination
export const useListPermissions = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: permissionKeys.list(queryKey),
    queryFn: () => getPermissions(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { permissions: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
