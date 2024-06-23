import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { ExplicitAny, Menu, Menus, MenuTrees } from '@/types';

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
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// delete
export const deleteMenu = async (id: string): Promise<Menu> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getMenus = async (params: ExplicitAny): Promise<Menus> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};

// get menu tree
export const getMenuTree = async (params: ExplicitAny): Promise<MenuTrees> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
