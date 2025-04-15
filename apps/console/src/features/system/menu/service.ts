import { sortTree } from '@ncobase/utils';
import { useQuery, useMutation } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import {
  getMenu,
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenus
} from '@/apis/system/menu';
import { AnyObject, Menu } from '@/types';

interface MenuKeys {
  create: ['menuService', 'create'];
  // eslint-disable-next-line no-unused-vars
  get: (options?: { menu?: string }) => ['menuService', 'menu', { menu?: string }];
  // eslint-disable-next-line no-unused-vars
  tree: (options?: AnyObject) => ['menuService', 'tree', AnyObject];
  update: ['menuService', 'update'];
  // eslint-disable-next-line no-unused-vars
  delete: (options?: { menu?: string }) => ['menuService', 'delete', { menu?: string }];
  // eslint-disable-next-line no-unused-vars
  list: (options?: QueryFormParams) => ['menuService', 'menus', QueryFormParams];
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

// Hook to list menus
export const useListMenus = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: menuKeys.list(queryParams),
    queryFn: () => getMenus(queryParams)
  });
};
