import { Dictionary } from './dictionary';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  getDictionaryBySlug: async (slug: string) => {
    return request.get(`${endpoint}/slug/${slug}`);
  },
  getEnumOptions: async (slug: string) => {
    return request.get(`${endpoint}/options/${slug}`);
  },
  validateEnumValue: async (slug: string, value: string) => {
    return request.get(`${endpoint}/validate/${slug}?value=${encodeURIComponent(value)}`);
  },
  batchGetBySlug: async (slugs: string[]) => {
    return request.post(`${endpoint}/batch`, slugs);
  }
});

export const dictionaryApi = createApi<Dictionary>('/sys/dictionaries', {
  extensions: extensionMethods
});

export const createDictionary = dictionaryApi.create;
export const getDictionary = dictionaryApi.get;
export const updateDictionary = dictionaryApi.update;
export const deleteDictionary = dictionaryApi.delete;
export const getDictionaries = dictionaryApi.list;
export const getDictionaryBySlug = dictionaryApi.getDictionaryBySlug;
export const getEnumOptions = dictionaryApi.getEnumOptions;
export const validateEnumValue = dictionaryApi.validateEnumValue;
export const batchGetBySlug = dictionaryApi.batchGetBySlug;
