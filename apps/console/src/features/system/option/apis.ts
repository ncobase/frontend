import { Option } from './option.d';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  getOptionByName: async (name: string) => {
    return request.get(`${endpoint}/name/${name}`);
  },
  getOptionByType: async (type: string) => {
    return request.get(`${endpoint}/type/${type}`);
  },
  batchGetOptionByNames: async (names: string[]) => {
    return request.post(`${endpoint}/batch`, names);
  },
  deleteOptionByPrefix: async (prefix: string) => {
    return request.delete(`${endpoint}/prefix?prefix=${encodeURIComponent(prefix)}`);
  }
});

export const optionService = createApi<Option>('/sys/options', { extensions: extensionMethods });

export const createOption = optionService.create;
export const getOption = optionService.get;
export const updateOption = optionService.update;
export const deleteOption = optionService.delete;
export const getOptionList = optionService.list;
export const getOptionByName = optionService.getOptionByName;
export const getOptionByType = optionService.getOptionByType;
export const batchGetOptionByNames = optionService.batchGetOptionByNames;
export const deleteOptionByPrefix = optionService.deleteOptionByPrefix;
