import { useMutation, useQuery } from '@tanstack/react-query';

import { createRole, getRole, getRoles, updateRole } from '@/apis/system/role';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { AnyObject, Role } from '@/types';

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

// Hook to list roles with pagination
export const useListRoles = (queryParams: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: roleKeys.list(queryParams),
    queryFn: () => getRoles(queryParams)
  });

  const paginatedResult = usePaginatedData<Role>(
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
