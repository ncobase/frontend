import { ExplicitAny } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { Menu, MenuTrees } from './menu';

import { createApi } from '@/lib/api/factory';

export const menuApi = createApi<Menu>('/sys/menus', {
  extensions: ({ endpoint, request }) => ({
    getMenuTree: async (params?: ExplicitAny): Promise<MenuTrees> => {
      const queryString = params ? buildQueryString(params) : '';
      return request.get(`${endpoint}${queryString ? `?${queryString}` : ''}`);
    },
    moveMenu: async (id: string, parentId: string | null, position: number): Promise<Menu> => {
      return request.put(`${endpoint}/${id}/move`, {
        parentId,
        position
      });
    },
    getChildMenus: async (parentId: string): Promise<Menu[]> => {
      return request.get(`${endpoint}/children/${parentId}`);
    }
  })
});

export const createMenu = menuApi.create;
export const getMenu = menuApi.get;
export const updateMenu = menuApi.update;
export const deleteMenu = menuApi.delete;
export const getMenus = menuApi.list;
export const getMenuTree = menuApi.getMenuTree;

// Future exports as they are implemented
// export const moveMenu = menuApi.moveMenu;
// export const getChildMenus = menuApi.getChildMenus;
