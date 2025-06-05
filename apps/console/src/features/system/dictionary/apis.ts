import { Dictionary } from './dictionary.d';

import { createApi, ApiContext } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Get enum options for a dictionary
  getEnumOptions: async (slug: string) => {
    return request.get(`${endpoint}/${slug}/options`);
  },

  // Validate enum value
  validateEnumValue: async (slug: string, value: string) => {
    return request.post(`${endpoint}/${slug}/validate`, { value });
  },

  // Batch get dictionaries by slugs
  batchGetBySlug: async (slugs: string[]) => {
    return request.post(`${endpoint}/batch`, { slugs });
  },

  // Get dictionary usage information
  getUsage: async (id: string) => {
    return request.get(`${endpoint}/${id}/usage`);
  },

  // Get all dictionaries
  getAllDictionaries: async (): Promise<Dictionary[]> => {
    return request.get(`${endpoint}/all`);
  }
});

export const dictionaryApi = createApi<Dictionary>('/sys/dictionaries', {
  extensions: extensionMethods
});

export const {
  create: createDictionary,
  get: getDictionary,
  update: updateDictionary,
  delete: deleteDictionary,
  list: getDictionaries,
  getEnumOptions,
  validateEnumValue,
  batchGetBySlug,
  getUsage: getDictionaryUsage,
  getAllDictionaries
} = dictionaryApi;
