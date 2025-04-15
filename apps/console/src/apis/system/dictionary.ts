import { createApi } from '@/apis/factory';
import { Dictionary } from '@/types';

export const dictionaryApi = createApi<Dictionary>('/sys/dictionaries');

export const createDictionary = dictionaryApi.create;
export const getDictionary = dictionaryApi.get;
export const updateDictionary = dictionaryApi.update;
export const deleteDictionary = dictionaryApi.delete;
export const getDictionaries = dictionaryApi.list;
