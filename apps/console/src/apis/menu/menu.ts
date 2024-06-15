import { ExplicitAny, Menu, Menus, MenuTrees } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

const ENDPOINT = '/v1/menus';

// create
export const createMenu = async (payload: Menu): Promise<Menu> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getMenu = async (id: string): Promise<Menu> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateMenu = async (payload: Menu): Promise<Menu> => {
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deleteMenu = async (id: string): Promise<Menu> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getMenus = async (params: ExplicitAny): Promise<Menus> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}?${queryString}`);
};

// get menu tree
export const getMenuTree = async (menu: string, type?: string): Promise<MenuTrees> => {
  const queryParams = buildQueryString({ menu, type });
  return request.get(`/trees/menus?${queryParams}`);
};
