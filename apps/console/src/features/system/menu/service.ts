import { AnyObject } from '@ncobase/types';
import { sortTree } from '@ncobase/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createMenu, deleteMenu, getMenu, getMenus, getMenuTree, updateMenu } from './apis';
import { QueryFormParams } from './config/query';
import { Menu } from './menu';

interface MenuKeys {
  create: ['menuService', 'create'];
  get: (_options?: { menu?: string }) => ['menuService', 'menu', { menu?: string }];
  tree: (_options?: AnyObject) => ['menuService', 'tree', AnyObject];
  update: ['menuService', 'update'];
  delete: (_options?: { menu?: string }) => ['menuService', 'delete', { menu?: string }];
  list: (_options?: QueryFormParams) => ['menuService', 'menus', QueryFormParams];
}

export const menuKeys: MenuKeys = {
  create: ['menuService', 'create'],
  get: ({ menu } = {}) => ['menuService', 'menu', { menu }],
  tree: (queryParams = {}) => ['menuService', 'tree', queryParams],
  update: ['menuService', 'update'],
  delete: ({ menu } = {}) => ['menuService', 'delete', { menu }],
  list: (queryParams = {}) => ['menuService', 'menus', queryParams]
};

// Query a specific menu by ID or Slug
export const useQueryMenu = (menu: string) =>
  useQuery({
    queryKey: menuKeys.get({ menu }),
    queryFn: () => getMenu(menu),
    enabled: !!menu
  });

// Query menu tree with sorting
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

// List menus with query params
export const useListMenus = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: menuKeys.list(queryParams),
    queryFn: () => getMenus(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create menu mutation
export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Menu, keyof Menu>) => createMenu(payload),
    onSuccess: () => {
      // Invalidate and refetch menus list and tree
      queryClient.invalidateQueries({ queryKey: ['menuService', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'tree'] });
    },
    onError: error => {
      console.error('Failed to create menu:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update menu mutation
export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Menu, keyof Menu>) => updateMenu(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific menu, menus list, and tree
      queryClient.invalidateQueries({ queryKey: ['menuService', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'tree'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: menuKeys.get({ menu: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update menu:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete menu mutation
export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMenu(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate menus list and tree
      queryClient.removeQueries({
        queryKey: menuKeys.get({ menu: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'tree'] });
    },
    onError: error => {
      console.error('Failed to delete menu:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
