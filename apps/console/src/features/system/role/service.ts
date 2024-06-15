import { useMutation, useQuery } from '@tanstack/react-query';
import { AnyObject, ExplicitAny, Role } from '@ncobase/types';

import { createRole, getRole, getRoles, getRoleTree, updateRole } from '@/apis/role/role';
import { paginateByCursor } from '@/helpers/pagination';

type RoleMutationFn = (payload: Pick<Role, keyof Role>) => Promise<Role>;
type RoleQueryFn<T> = () => Promise<T>;

interface RoleKeys {
  create: ['roleService', 'create'];
  get: (options?: { role?: string }) => ['roleService', 'role', { role?: string }];
  tree: (options?: AnyObject) => ['roleService', 'tree', AnyObject];
  update: ['roleService', 'update'];
  list: (options?: AnyObject) => ['roleService', 'roles', AnyObject];
}

export const roleKeys: RoleKeys = {
  create: ['roleService', 'create'],
  get: ({ role } = {}) => ['roleService', 'role', { role }],
  tree: (queryKey = {}) => ['roleService', 'tree', queryKey],
  update: ['roleService', 'update'],
  list: (queryKey = {}) => ['roleService', 'roles', queryKey]
};

const useRoleMutation = (mutationFn: RoleMutationFn) => useMutation({ mutationFn });

const useQueryRoleData = <T>(queryKey: unknown[], queryFn: RoleQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryRole = (role: string) =>
  useQueryRoleData(roleKeys.get({ role }), () => getRole(role));

export const useQueryRoleTreeData = (role: string, type?: string) =>
  useQueryRoleData(roleKeys.tree({ role, type }), () => getRoleTree(role, type));

export const useCreateRole = () => useRoleMutation(payload => createRole(payload));
export const useUpdateRole = () => useRoleMutation(payload => updateRole(payload));

export const useListRoles = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: roleKeys.list(queryKey),
    queryFn: () => getRoles(queryKey)
  });
  const { content: roles = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(roles, cursor as string, limit as number);

  return { roles: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
