import { ExplicitAny, Dictionary, Dictionaries, DictionaryTrees } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

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
  return request.get(`${ENDPOINT}?${queryString}`);
};

// get dictionary tree
export const getDictionaryTree = async (
  dictionary: string,
  type?: string
): Promise<DictionaryTrees> => {
  const queryParams = buildQueryString({ dictionary, type });
  return request.get(`/trees/dictionaries?${queryParams}`);
};
