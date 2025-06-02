import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createOption,
  deleteOption,
  getOptionList,
  getOption,
  updateOption,
  getOptionByName,
  getOptionByType,
  batchGetOptionByNames,
  deleteOptionByPrefix
} from './apis';
import { QueryFormParams } from './config/query';
import { Option } from './option';

interface OptionKeys {
  create: ['optionService', 'create'];
  get: (_option?: { option?: string }) => ['optionService', 'option', { option?: string }];
  getByName: (_name?: string) => ['optionService', 'option', 'name', string];
  getByType: (_type?: string) => ['optionService', 'option', 'type', string];
  batch: (_names?: string[]) => ['optionService', 'batch', string];
  update: ['optionService', 'update'];
  list: (_option?: QueryFormParams) => ['optionService', 'option', QueryFormParams];
}

export const optionKeys: OptionKeys = {
  create: ['optionService', 'create'],
  get: ({ option } = {}) => ['optionService', 'option', { option }],
  getByName: (name = '') => ['optionService', 'option', 'name', name],
  getByType: (type = '') => ['optionService', 'option', 'type', type],
  batch: (names = []) => ['optionService', 'batch', names.sort().join(',')],
  update: ['optionService', 'update'],
  list: (queryParams = {}) => ['optionService', 'option', queryParams]
};

// Query specific option by ID or name
export const useQueryOption = (option: string) =>
  useQuery({
    queryKey: optionKeys.get({ option }),
    queryFn: () => getOption(option),
    enabled: !!option
  });

// Query option by name specifically
export const useQueryOptionByName = (name: string) =>
  useQuery({
    queryKey: optionKeys.getByName(name),
    queryFn: () => getOptionByName(name),
    enabled: !!name
  });

// Query option by type
export const useQueryOptionByType = (type: string) =>
  useQuery({
    queryKey: optionKeys.getByType(type),
    queryFn: () => getOptionByType(type),
    enabled: !!type
  });

// Batch get option by names
export const useBatchOption = (names: string[]) =>
  useQuery({
    queryKey: optionKeys.batch(names),
    queryFn: () => batchGetOptionByNames(names),
    enabled: names.length > 0
  });

// List option
export const useListOption = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: optionKeys.list(queryParams),
    queryFn: () => getOptionList(queryParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Create option mutation
export const useCreateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Option, keyof Option>) => createOption(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optionService', 'option'] });
    },
    onError: error => {
      console.error('Failed to create option:', error);
    }
  });
};

// Update option mutation
export const useUpdateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Option, keyof Option>) => updateOption(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['optionService', 'option'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: optionKeys.get({ option: variables.id })
        });
      }
      if (variables.name) {
        queryClient.invalidateQueries({
          queryKey: optionKeys.getByName(variables.name)
        });
      }
    },
    onError: error => {
      console.error('Failed to update option:', error);
    }
  });
};

// Delete option mutation
export const useDeleteOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOption(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: optionKeys.get({ option: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['optionService', 'option'] });
    },
    onError: error => {
      console.error('Failed to delete option:', error);
    }
  });
};

// Delete option by prefix mutation
export const useDeleteOptionByPrefix = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prefix: string) => deleteOptionByPrefix(prefix),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optionService', 'option'] });
    },
    onError: error => {
      console.error('Failed to delete option by prefix:', error);
    }
  });
};
