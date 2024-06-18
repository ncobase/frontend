import { AnyObject, ExplicitAny, Menu } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createMenu, getMenu, getMenus, getMenuTree, updateMenu } from '@/apis/menu/menu';
import { paginateByCursor } from '@/helpers/pagination';

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

const useMenuMutation = (mutationFn: MenuMutationFn) => useMutation({ mutationFn });

const useQueryMenuData = <T>(queryKey: unknown[], queryFn: MenuQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryMenu = (menu: string) =>
  useQueryMenuData(menuKeys.get({ menu }), () => getMenu(menu));

export const useQueryMenuTreeData = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQueryMenuData(menuKeys.tree(queryKey), () =>
    getMenuTree({ ...queryKey, children: true })
  );
  const { content: menuTree = [] } = data || {};
  return { data: menuTree, ...rest };
};

export const useCreateMenu = () => useMenuMutation(payload => createMenu(payload));
export const useUpdateMenu = () => useMenuMutation(payload => updateMenu(payload));

export const useListMenus = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: menuKeys.list(queryKey),
    queryFn: () => getMenus(queryKey)
  });
  const { content: menus = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(menus, cursor as string, limit as number);

  return { menus: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
