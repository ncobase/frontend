import { sortTree } from '@ncobase/utils';
import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getMenu,
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenus
} from '@/apis/system/menu';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { AnyObject, Menu } from '@/types';

interface MenuKeys {
  create: ['menuService', 'create'];
  get: (options?: { menu?: string }) => ['menuService', 'menu', { menu?: string }];
  tree: (options?: AnyObject) => ['menuService', 'tree', AnyObject];
  update: ['menuService', 'update'];
  delete: (options?: { menu?: string }) => ['menuService', 'delete', { menu?: string }];
  list: (options?: AnyObject) => ['menuService', 'menus', AnyObject];
}

export const menuKeys: MenuKeys = {
  create: ['menuService', 'create'],
  get: ({ menu } = {}) => ['menuService', 'menu', { menu }],
  tree: (queryParams = {}) => ['menuService', 'tree', queryParams],
  update: ['menuService', 'update'],
  delete: ({ menu } = {}) => ['menuService', 'delete', { menu }],
  list: (queryParams = {}) => ['menuService', 'menus', queryParams]
};

// Hook to query a specific menu by ID or Slug
export const useQueryMenu = (menu: string) =>
  useQuery({ queryKey: menuKeys.get({ menu }), queryFn: () => getMenu(menu) });

// Hook to query menu tree
export const useQueryMenuTreeData = (queryParams = {}) => {
  return useQuery({
    queryKey: menuKeys.tree(queryParams),
    queryFn: async () => {
      const result = await getMenuTree({ ...queryParams, children: true });
      return sortTree(result?.items || [], 'order', 'desc');
    },
    select: data => data,
    gcTime: Infinity,
    staleTime: Infinity
  });
};

// Hook for create menu mutation
export const useCreateMenu = () =>
  useMutation({ mutationFn: (payload: Pick<Menu, keyof Menu>) => createMenu(payload) });

// Hook for update menu mutation
export const useUpdateMenu = () =>
  useMutation({
    mutationFn: (payload: Pick<Menu, keyof Menu>) => updateMenu(payload)
  });

// Hook for delete menu mutation
export const useDeleteMenu = () => useMutation({ mutationFn: (id: string) => deleteMenu(id) });

// Hook to list menus with pagination
export const useListMenus = (queryParams: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: menuKeys.list(queryParams),
    queryFn: () => getMenus(queryParams)
  });

  const paginatedResult = usePaginatedData<Menu>(
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
