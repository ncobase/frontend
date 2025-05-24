import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDictionary,
  deleteDictionary,
  getDictionaries,
  getDictionary,
  updateDictionary
} from './apis';
import { QueryFormParams } from './config/query';
import { Dictionary } from './dictionary';

interface DictionaryKeys {
  create: ['dictionaryService', 'create'];
  get: (_options?: {
    dictionary?: string;
  }) => ['dictionaryService', 'dictionary', { dictionary?: string }];
  update: ['dictionaryService', 'update'];
  list: (_options?: QueryFormParams) => ['dictionaryService', 'dictionaries', QueryFormParams];
}

export const dictionaryKeys: DictionaryKeys = {
  create: ['dictionaryService', 'create'],
  get: ({ dictionary } = {}) => ['dictionaryService', 'dictionary', { dictionary }],
  update: ['dictionaryService', 'update'],
  list: (queryParams = {}) => ['dictionaryService', 'dictionaries', queryParams]
};

// Query a specific dictionary by ID or Slug
export const useQueryDictionary = (dictionary: string) =>
  useQuery({
    queryKey: dictionaryKeys.get({ dictionary }),
    queryFn: () => getDictionary(dictionary),
    enabled: !!dictionary
  });

// List dictionaries with query params
export const useListDictionaries = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: dictionaryKeys.list(queryParams),
    queryFn: () => getDictionaries(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create dictionary mutation
export const useCreateDictionary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Dictionary, keyof Dictionary>) => createDictionary(payload),
    onSuccess: () => {
      // Invalidate and refetch dictionaries list
      queryClient.invalidateQueries({ queryKey: ['dictionaryService', 'dictionaries'] });
    },
    onError: error => {
      console.error('Failed to create dictionary:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update dictionary mutation
export const useUpdateDictionary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Dictionary, keyof Dictionary>) => updateDictionary(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific dictionary and dictionaries list
      queryClient.invalidateQueries({ queryKey: ['dictionaryService', 'dictionaries'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: dictionaryKeys.get({ dictionary: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update dictionary:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete dictionary mutation
export const useDeleteDictionary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDictionary(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate dictionaries list
      queryClient.removeQueries({
        queryKey: dictionaryKeys.get({ dictionary: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['dictionaryService', 'dictionaries'] });
    },
    onError: error => {
      console.error('Failed to delete dictionary:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
