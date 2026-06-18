import { Dictionary, DictionaryUsage } from './dictionary.d';

import { createApi, ApiContext } from '@/lib/api/factory';
import { assertRequiredApiArray, assertRequiredApiValue } from '@/lib/api/guards';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Get enum options for a dictionary
  getEnumOptions: async (slug: string) => {
    return request.get(`${endpoint}/options/${assertRequiredApiValue(slug, 'Dictionary slug')}`);
  },

  // Validate enum value
  validateEnumValue: async (slug: string, value: string) => {
    return request.get(
      `${endpoint}/validate/${assertRequiredApiValue(slug, 'Dictionary slug')}?value=${encodeURIComponent(assertRequiredApiValue(value, 'Dictionary value'))}`
    );
  },

  // Batch get dictionaries by slugs
  batchGetBySlug: async (slugs: string[]) => {
    return request.post(`${endpoint}/batch`, assertRequiredApiArray(slugs, 'Dictionary slugs'));
  },

  // Get dictionary usage information
  getUsage: async (id: string): Promise<DictionaryUsage[]> => {
    return request.get(
      `${endpoint}/${encodeURIComponent(assertRequiredApiValue(id, 'Dictionary ID'))}/usage`
    );
  },

  // Get all dictionaries
  getAllDictionaries: async (): Promise<Dictionary[]> => {
    const response = await request.get(`${endpoint}`, { params: { limit: 10000 } });
    return Array.isArray(response) ? response : response?.items || response?.data?.items || [];
  }
});

export const dictionaryApi = createApi<Dictionary>('/sys/dictionaries', {
  paths: {
    update: '/sys/dictionaries'
  },
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
