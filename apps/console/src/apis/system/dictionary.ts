import { Dictionaries, Dictionary, ExplicitAny } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';

const ENDPOINT = '/v1/dictionaries';

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
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deleteDictionary = async (id: string): Promise<Dictionary> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getDictionaries = async (params: ExplicitAny): Promise<Dictionaries> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
