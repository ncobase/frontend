import { Option } from './option.d';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Get option by name
  getByName: async (name: string) => {
    return request.get(`${endpoint}/name/${encodeURIComponent(name)}`);
  },

  // Get options by type
  getByType: async (type: string) => {
    return request.get(`${endpoint}/type/${encodeURIComponent(type)}`);
  },

  // Batch get options by names
  batchGetByNames: async (names: string[]) => {
    return request.post(`${endpoint}/batch`, { names });
  },

  // Delete options by prefix
  deleteByPrefix: async (prefix: string) => {
    return request.delete(`${endpoint}/prefix`, {
      body: { prefix }
    });
  },

  // Export options as JSON
  exportOptions: async (params?: any): Promise<Option[]> => {
    const response = await request.get(`${endpoint}`, { params: { ...params, limit: 10000 } });
    return response.data.items || [];
  },

  // Validate option value based on type
  validateValue: async (
    type: string,
    value: string
  ): Promise<{ valid: boolean; error?: string }> => {
    try {
      switch (type) {
        case 'object':
        case 'array':
          JSON.parse(value);
          break;
        case 'number':
          if (isNaN(Number(value))) {
            throw new Error('Invalid number');
          }
          break;
        case 'boolean':
          if (!['true', 'false', '1', '0', 'yes', 'no'].includes(value.toLowerCase())) {
            throw new Error('Invalid boolean value');
          }
          break;
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error['message'] };
    }
  }
});

export const optionApi = createApi<Option>('/sys/options', {
  extensions: extensionMethods
});

export const {
  create: createOption,
  get: getOption,
  update: updateOption,
  delete: deleteOption,
  list: getOptions,
  getByName,
  getByType,
  batchGetByNames,
  deleteByPrefix,
  exportOptions,
  validateValue
} = optionApi;
