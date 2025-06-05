import { ExplicitAny } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { Menu, MenuTrees, NavigationMenus } from './menu';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  getMenuBySlug: async (slug: string): Promise<Menu> => {
    return request.get(`${endpoint}/slug/${slug}`);
  },
  getMenuTree: async (params?: ExplicitAny): Promise<MenuTrees> => {
    const queryString = params ? buildQueryString(params) : '';
    return request.get(`${endpoint}/tree${queryString ? `?${queryString}` : ''}`);
  },
  // Updated to use new navigation endpoint structure
  getNavigationMenus: async (params?: ExplicitAny): Promise<NavigationMenus> => {
    const queryString = params ? buildQueryString(params) : '';
    return request.get(`${endpoint}/navigation${queryString ? `?${queryString}` : ''}`);
  },
  moveMenu: async (id: string, parentId: string | null, order: number): Promise<Menu> => {
    return request.put(`${endpoint}/${id}/move`, {
      parent_id: parentId,
      order
    });
  },
  getChildMenus: async (parentId: string): Promise<Menu[]> => {
    return request.get(`${endpoint}/children/${parentId}`);
  },
  getUserAuthorizedMenus: async (userId: string): Promise<Menu[]> => {
    return request.get(`${endpoint}/authorized/${userId}`);
  },
  reorderMenus: async (menuIds: string[]): Promise<void> => {
    return request.post(`${endpoint}/reorder`, menuIds);
  },
  // Updated to use unified toggle status endpoint
  toggleMenuStatus: async (
    id: string,
    action: 'enable' | 'disable' | 'show' | 'hide'
  ): Promise<Menu> => {
    return request.put(`${endpoint}/${id}/${action}`);
  }
});

export const menuApi = createApi<Menu>('/sys/menus', {
  extensions: extensionMethods
});

// export const createMenu = menuApi.create;
// export const getMenu = menuApi.get;
// export const updateMenu = menuApi.update;
// export const deleteMenu = menuApi.delete;
// export const getMenus = menuApi.list;
// export const getMenuTree = menuApi.getMenuTree;
// export const getMenuBySlug = menuApi.getMenuBySlug;
// export const getNavigationMenus = menuApi.getNavigationMenus;
// export const getUserAuthorizedMenus = menuApi.getUserAuthorizedMenus;
// export const moveMenu = menuApi.moveMenu;
// export const reorderMenus = menuApi.reorderMenus;
// export const toggleMenuStatus = menuApi.toggleMenuStatus;

export const {
  create: createMenu,
  get: getMenu,
  update: updateMenu,
  delete: deleteMenu,
  list: getMenus,
  getMenuTree,
  getMenuBySlug,
  getNavigationMenus,
  getUserAuthorizedMenus,
  moveMenu,
  reorderMenus,
  toggleMenuStatus
} = menuApi;
