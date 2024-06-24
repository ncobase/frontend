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
import { paginateByCursor } from '@/helpers/pagination';
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
  tree: (queryKey = {}) => ['menuService', 'tree', queryKey],
  update: ['menuService', 'update'],
  delete: ({ menu } = {}) => ['menuService', 'delete', { menu }],
  list: (queryKey = {}) => ['menuService', 'menus', queryKey]
};

// Hook to query a specific menu by ID or Slug
export const useQueryMenu = (menu: string) =>
  useQuery({ queryKey: menuKeys.get({ menu }), queryFn: () => getMenu(menu) });

// Hook to query menu tree
export const useQueryMenuTreeData = (queryKey = {}) => {
  return useQuery({
    queryKey: menuKeys.tree(queryKey),
    queryFn: async () => {
      const result = await getMenuTree({ ...queryKey, children: true });
      return sortTree(result?.content || [], 'order', 'desc');
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
export const useListMenus = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: menuKeys.list(queryKey),
    queryFn: () => getMenus(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { menus: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = <T>(data: T[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor<T>(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
