import { useMutation, useQuery } from '@tanstack/react-query';

import { createRole, getRole, getRoles, updateRole } from '@/apis/system/role';
import { paginateByCursor } from '@/helpers/pagination';
import { AnyObject, ExplicitAny, Role } from '@/types';

interface RoleKeys {
  create: ['roleService', 'create'];
  get: (options?: { role?: string }) => ['roleService', 'role', { role?: string }];
  update: ['roleService', 'update'];
  list: (options?: AnyObject) => ['roleService', 'roles', AnyObject];
}

export const roleKeys: RoleKeys = {
  create: ['roleService', 'create'],
  get: ({ role } = {}) => ['roleService', 'role', { role }],
  update: ['roleService', 'update'],
  list: (queryKey = {}) => ['roleService', 'roles', queryKey]
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

// Hook to list roles with pagination
export const useListRoles = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: roleKeys.list(queryKey),
    queryFn: () => getRoles(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { roles: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
