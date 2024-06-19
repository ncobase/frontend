import { useMemo } from 'react';

import { AnyObject, ExplicitAny, Menu } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createMenu, getMenu, getMenus, getMenuTree, updateMenu } from '@/apis/menu/menu';
import { paginateByCursor } from '@/helpers/pagination';
import { sortMenus } from '@/layout/page/page.helper';

type MenuMutationFn = (payload: Pick<Menu, keyof Menu>) => Promise<Menu>;
type MenuQueryFn<T> = () => Promise<T>;

interface MenuKeys {
  create: ['menuService', 'create'];
  get: (options?: { menu?: string }) => ['menuService', 'menu', { menu?: string }];
  tree: (options?: AnyObject) => ['menuService', 'tree', AnyObject];
  update: ['menuService', 'update'];
  list: (options?: AnyObject) => ['menuService', 'menus', AnyObject];
}

export const menuKeys: MenuKeys = {
  create: ['menuService', 'create'],
  get: ({ menu } = {}) => ['menuService', 'menu', { menu }],
  tree: (queryKey = {}) => ['menuService', 'tree', queryKey],
  update: ['menuService', 'update'],
  list: (queryKey = {}) => ['menuService', 'menus', queryKey]
};

// Custom hook for mutation operations
const useMenuMutation = (mutationFn: MenuMutationFn) => useMutation({ mutationFn });

// Custom hook for query operations
const useQueryMenuData = <T>(queryKey: unknown[], queryFn: MenuQueryFn<T>) => {
  const { data, ...rest } = useQuery({ queryKey, queryFn });
  return { data, ...rest };
};

// Hook to query a specific menu by ID
export const useQueryMenu = (menu: string) =>
  useQueryMenuData(menuKeys.get({ menu }), () => getMenu(menu));

// Hook to query menu tree data with sorting
export const useQueryMenuTreeData = (queryKey = {}) => {
  const { data, ...rest } = useQueryMenuData(menuKeys.tree(queryKey), () =>
    getMenuTree({ ...queryKey, children: true })
  );
  const sorted = useMemo(() => sortMenus(data?.content || [], 'order', 'desc'), [data]);
  return { data: sorted, ...rest };
};

// Hooks for create and update menu mutations
export const useCreateMenu = () => useMenuMutation(createMenu);
export const useUpdateMenu = () => useMenuMutation(updateMenu);

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
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
