import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createPermission,
  getPermission,
  getPermissions,
  updatePermission
} from '@/apis/system/permission';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { AnyObject, Permission } from '@/types';

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

// Hook to list permissions with pagination
export const useListPermissions = (queryParams: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: permissionKeys.list(queryParams),
    queryFn: () => getPermissions(queryParams)
  });

  const paginatedResult = usePaginatedData<Permission>(
    data || { items: [], total: 0, has_next: false },
    queryParams?.cursor as string,
    queryParams?.limit as number
  );

  return { ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = <T>(
  data: { items: T[]; total: number; has_next: boolean; next?: string },
  cursor?: string,
  limit: number = 10
): PaginationResult<T> => {
  const { items, has_next, next } = paginateByCursor(data.items, data.total, cursor, limit) || {
    items: [],
    has_next: data.has_next,
    next: data.next
  };

  return { items, total: data.total, next, has_next };
};
