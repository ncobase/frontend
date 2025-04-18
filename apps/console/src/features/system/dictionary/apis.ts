import { Dictionary } from './dictionary';

import { createApi } from '@/lib/api/factory';

export const dictionaryApi = createApi<Dictionary>('/sys/dictionaries');

export const createDictionary = dictionaryApi.create;
export const getDictionary = dictionaryApi.get;
export const updateDictionary = dictionaryApi.update;
export const deleteDictionary = dictionaryApi.delete;
export const getDictionaries = dictionaryApi.list;
