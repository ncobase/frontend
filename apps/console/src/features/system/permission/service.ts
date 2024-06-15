import { useMutation, useQuery } from '@tanstack/react-query';
import { AnyObject, ExplicitAny, Permission } from '@ncobase/types';

import {
  createPermission,
  getPermission,
  getPermissions,
  getPermissionTree,
  updatePermission
} from '@/apis/permission/permission';
import { paginateByCursor } from '@/helpers/pagination';

type PermissionMutationFn = (payload: Pick<Permission, keyof Permission>) => Promise<Permission>;
type PermissionQueryFn<T> = () => Promise<T>;

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

const usePermissionMutation = (mutationFn: PermissionMutationFn) => useMutation({ mutationFn });

const useQueryPermissionData = <T>(queryKey: unknown[], queryFn: PermissionQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryPermission = (permission: string) =>
  useQueryPermissionData(permissionKeys.get({ permission }), () => getPermission(permission));

export const useQueryPermissionTreeData = (permission: string, type?: string) =>
  useQueryPermissionData(permissionKeys.tree({ permission, type }), () =>
    getPermissionTree(permission, type)
  );

export const useCreatePermission = () =>
  usePermissionMutation(payload => createPermission(payload));
export const useUpdatePermission = () =>
  usePermissionMutation(payload => updatePermission(payload));

export const useListPermissions = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: permissionKeys.list(queryKey),
    queryFn: () => getPermissions(queryKey)
  });
  const { content: permissions = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(permissions, cursor as string, limit as number);

  return { permissions: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
