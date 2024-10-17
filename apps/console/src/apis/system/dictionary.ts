import { PaginationResult } from '@ncobase/react';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { Dictionary, ExplicitAny } from '@/types';

const ENDPOINT = '/system/dictionaries';

// create
export const createDictionary = async (payload: Dictionary): Promise<Dictionary> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getDictionary = async (id: string): Promise<Dictionary> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateDictionary = async (payload: Dictionary): Promise<Dictionary> => {
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// delete
export const deleteDictionary = async (id: string): Promise<Dictionary> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getDictionaries = async (
  params: ExplicitAny
): Promise<PaginationResult<Dictionary>> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
