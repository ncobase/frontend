import { AnyObject } from '@ncobase/types';
import { sortTree } from '@ncobase/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createMenu,
  deleteMenu,
  getMenu,
  getMenus,
  getMenuTree,
  updateMenu,
  getMenuBySlug,
  getUserAuthorizedMenus,
  moveMenu,
  reorderMenus,
  toggleMenuStatus,
  getNavigationMenus
} from './apis';
import { QueryFormParams } from './config/query';
import { Menu, NavigationMenus } from './menu';

interface MenuKeys {
  create: ['menuService', 'create'];
  get: (_options?: { menu?: string }) => ['menuService', 'menu', { menu?: string }];
  getBySlug: (_slug?: string) => ['menuService', 'menu', 'slug', string];
  tree: (_options?: AnyObject) => ['menuService', 'tree', AnyObject];
  navigation: (_options: AnyObject) => ['menuService', 'navigation', AnyObject];
  authorized: (_userId?: string) => ['menuService', 'authorized', string];
  update: ['menuService', 'update'];
  delete: (_options?: { menu?: string }) => ['menuService', 'delete', { menu?: string }];
  list: (_options?: QueryFormParams) => ['menuService', 'menus', QueryFormParams];
}

export const menuKeys: MenuKeys = {
  create: ['menuService', 'create'],
  get: ({ menu } = {}) => ['menuService', 'menu', { menu }],
  getBySlug: (slug = '') => ['menuService', 'menu', 'slug', slug],
  tree: (queryParams = {}) => ['menuService', 'tree', queryParams],
  navigation: (queryParams = {}) => ['menuService', 'navigation', queryParams],
  authorized: (userId = '') => ['menuService', 'authorized', userId],
  update: ['menuService', 'update'],
  delete: ({ menu } = {}) => ['menuService', 'delete', { menu }],
  list: (queryParams = {}) => ['menuService', 'menus', queryParams]
};

// Query specific menu by ID or Slug
export const useQueryMenu = (menu: string) =>
  useQuery({
    queryKey: menuKeys.get({ menu }),
    queryFn: () => getMenu(menu),
    enabled: !!menu
  });

// Query menu by slug specifically
export const useQueryMenuBySlug = (slug: string) =>
  useQuery({
    queryKey: menuKeys.getBySlug(slug),
    queryFn: () => getMenuBySlug(slug),
    enabled: !!slug
  });

// Query menu tree
export const useQueryMenuTree = (queryParams = {}) => {
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

// Query navigation menus - Updated to use new API response structure
export const useQueryNavigationMenus = (queryParams = {}) => {
  return useQuery({
    queryKey: menuKeys.navigation(queryParams),
    queryFn: async (): Promise<NavigationMenus> => {
      try {
        const result = await getNavigationMenus({ ...queryParams });

        // The API now returns NavigationMenus structure directly
        return {
          headers: result?.headers || [],
          sidebars: result?.sidebars || [],
          accounts: result?.accounts || [],
          spaces: result?.spaces || []
        };
      } catch (error) {
        console.error('Failed to fetch navigation menus:', error);
        return {
          headers: [],
          sidebars: [],
          accounts: [],
          spaces: []
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Query user authorized menus
export const useUserAuthorizedMenus = (userId: string) =>
  useQuery({
    queryKey: menuKeys.authorized(userId),
    queryFn: () => getUserAuthorizedMenus(userId),
    enabled: !!userId
  });

// List menus
export const useListMenus = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: menuKeys.list(queryParams),
    queryFn: () => getMenus(queryParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Create menu mutation
export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Menu, keyof Menu>) => createMenu(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuService', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'tree'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'navigation'] });
    },
    onError: error => {
      console.error('Failed to create menu:', error);
    }
  });
};

// Update menu mutation
export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Menu, keyof Menu>) => updateMenu(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menuService', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'tree'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'navigation'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: menuKeys.get({ menu: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update menu:', error);
    }
  });
};

// Menu management mutations
export const useMoveMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, parentId, order }: { id: string; parentId: string; order: number }) =>
      moveMenu(id, parentId, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuService'] });
    }
  });
};

export const useReorderMenus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuIds: string[]) => reorderMenus(menuIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuService'] });
    }
  });
};

// Updated to use unified toggle status API
export const useToggleMenuStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      action
    }: {
      id: string;
      action: 'enable' | 'disable' | 'show' | 'hide';
    }) => {
      return toggleMenuStatus(id, action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuService'] });
    }
  });
};

// Delete menu mutation
export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMenu(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: menuKeys.get({ menu: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'menus'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'tree'] });
      queryClient.invalidateQueries({ queryKey: ['menuService', 'navigation'] });
    },
    onError: error => {
      console.error('Failed to delete menu:', error);
    }
  });
};
