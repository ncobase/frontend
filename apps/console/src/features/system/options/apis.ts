import { Options } from './options';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  getOptionsByName: async (name: string) => {
    return request.get(`${endpoint}/name/${name}`);
  },
  getOptionsByType: async (type: string) => {
    return request.get(`${endpoint}/type/${type}`);
  },
  batchGetOptionsByNames: async (names: string[]) => {
    return request.post(`${endpoint}/batch`, names);
  },
  deleteOptionsByPrefix: async (prefix: string) => {
    return request.delete(`${endpoint}/prefix?prefix=${encodeURIComponent(prefix)}`);
  }
});

export const optionsApi = createApi<Options>('/sys/options', { extensions: extensionMethods });

export const createOptions = optionsApi.create;
export const getOptions = optionsApi.get;
export const updateOptions = optionsApi.update;
export const deleteOptions = optionsApi.delete;
export const getOptionsList = optionsApi.list;
export const getOptionsByName = optionsApi.getOptionsByName;
export const getOptionsByType = optionsApi.getOptionsByType;
export const batchGetOptionsByNames = optionsApi.batchGetOptionsByNames;
export const deleteOptionsByPrefix = optionsApi.deleteOptionsByPrefix;
