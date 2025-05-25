import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createOptions,
  deleteOptions,
  getOptionsList,
  getOptions,
  updateOptions,
  getOptionsByName,
  getOptionsByType,
  batchGetOptionsByNames,
  deleteOptionsByPrefix
} from './apis';
import { QueryFormParams } from './config/query';
import { Options } from './options';

interface OptionsKeys {
  create: ['optionsService', 'create'];
  get: (_options?: { option?: string }) => ['optionsService', 'option', { option?: string }];
  getByName: (_name?: string) => ['optionsService', 'option', 'name', string];
  getByType: (_type?: string) => ['optionsService', 'options', 'type', string];
  batch: (_names?: string[]) => ['optionsService', 'batch', string];
  update: ['optionsService', 'update'];
  list: (_options?: QueryFormParams) => ['optionsService', 'options', QueryFormParams];
}

export const optionsKeys: OptionsKeys = {
  create: ['optionsService', 'create'],
  get: ({ option } = {}) => ['optionsService', 'option', { option }],
  getByName: (name = '') => ['optionsService', 'option', 'name', name],
  getByType: (type = '') => ['optionsService', 'options', 'type', type],
  batch: (names = []) => ['optionsService', 'batch', names.sort().join(',')],
  update: ['optionsService', 'update'],
  list: (queryParams = {}) => ['optionsService', 'options', queryParams]
};

// Query specific option by ID or name
export const useQueryOptions = (option: string) =>
  useQuery({
    queryKey: optionsKeys.get({ option }),
    queryFn: () => getOptions(option),
    enabled: !!option
  });

// Query option by name specifically
export const useQueryOptionsByName = (name: string) =>
  useQuery({
    queryKey: optionsKeys.getByName(name),
    queryFn: () => getOptionsByName(name),
    enabled: !!name
  });

// Query options by type
export const useQueryOptionsByType = (type: string) =>
  useQuery({
    queryKey: optionsKeys.getByType(type),
    queryFn: () => getOptionsByType(type),
    enabled: !!type
  });

// Batch get options by names
export const useBatchOptions = (names: string[]) =>
  useQuery({
    queryKey: optionsKeys.batch(names),
    queryFn: () => batchGetOptionsByNames(names),
    enabled: names.length > 0
  });

// List options with query params
export const useListOptions = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: optionsKeys.list(queryParams),
    queryFn: () => getOptionsList(queryParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Create options mutation
export const useCreateOptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Options, keyof Options>) => createOptions(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optionsService', 'options'] });
    },
    onError: error => {
      console.error('Failed to create option:', error);
    }
  });
};

// Update options mutation
export const useUpdateOptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Options, keyof Options>) => updateOptions(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['optionsService', 'options'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: optionsKeys.get({ option: variables.id })
        });
      }
      if (variables.name) {
        queryClient.invalidateQueries({
          queryKey: optionsKeys.getByName(variables.name)
        });
      }
    },
    onError: error => {
      console.error('Failed to update option:', error);
    }
  });
};

// Delete options mutation
export const useDeleteOptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOptions(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: optionsKeys.get({ option: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['optionsService', 'options'] });
    },
    onError: error => {
      console.error('Failed to delete option:', error);
    }
  });
};

// Delete options by prefix mutation
export const useDeleteOptionsByPrefix = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prefix: string) => deleteOptionsByPrefix(prefix),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optionsService', 'options'] });
    },
    onError: error => {
      console.error('Failed to delete options by prefix:', error);
    }
  });
};
