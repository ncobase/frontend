import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDictionary,
  deleteDictionary,
  getDictionaries,
  getDictionary,
  updateDictionary,
  getDictionaryBySlug,
  getEnumOptions,
  validateEnumValue,
  batchGetBySlug
} from './apis';
import { QueryFormParams } from './config/query';
import { Dictionary } from './dictionary';

interface DictionaryKeys {
  create: ['dictionaryService', 'create'];
  get: (_options?: {
    dictionary?: string;
  }) => ['dictionaryService', 'dictionary', { dictionary?: string }];
  getBySlug: (_slug?: string) => ['dictionaryService', 'dictionaries', 'slug', string];
  enumOptions: (_slug?: string) => ['dictionaryService', 'enumOptions', string];
  validateEnum: (
    _slug?: string,
    _value?: string
  ) => ['dictionaryService', 'validateEnum', string, string];
  update: ['dictionaryService', 'update'];
  list: (_options?: QueryFormParams) => ['dictionaryService', 'dictionaries', QueryFormParams];
}

export const dictionaryKeys: DictionaryKeys = {
  create: ['dictionaryService', 'create'],
  get: ({ dictionary } = {}) => ['dictionaryService', 'dictionary', { dictionary }],
  getBySlug: (slug = '') => ['dictionaryService', 'dictionaries', 'slug', slug],
  enumOptions: (slug = '') => ['dictionaryService', 'enumOptions', slug],
  validateEnum: (slug = '', value = '') => ['dictionaryService', 'validateEnum', slug, value],
  update: ['dictionaryService', 'update'],
  list: (queryParams = {}) => ['dictionaryService', 'dictionaries', queryParams]
};

// Query dictionary by ID or Slug
export const useQueryDictionary = (dictionary: string) =>
  useQuery({
    queryKey: dictionaryKeys.get({ dictionary }),
    queryFn: () => getDictionary(dictionary),
    enabled: !!dictionary
  });

// Query dictionary by slug specifically
export const useQueryDictionaryBySlug = (slug: string) =>
  useQuery({
    queryKey: dictionaryKeys.getBySlug(slug),
    queryFn: () => getDictionaryBySlug(slug),
    enabled: !!slug
  });

// Get enum options for select components
export const useEnumOptions = (slug: string) =>
  useQuery({
    queryKey: dictionaryKeys.enumOptions(slug),
    queryFn: () => getEnumOptions(slug),
    enabled: !!slug
  });

// Validate enum value
export const useValidateEnumValue = (slug: string, value: string) =>
  useQuery({
    queryKey: dictionaryKeys.validateEnum(slug, value),
    queryFn: () => validateEnumValue(slug, value),
    enabled: !!(slug && value)
  });

// Batch get dictionaries by slugs
export const useBatchDictionaries = (slugs: string[]) =>
  useQuery({
    queryKey: ['dictionaryService', 'batch', slugs.sort().join(',')],
    queryFn: () => batchGetBySlug(slugs),
    enabled: slugs.length > 0
  });

// List dictionaries with query params
export const useListDictionaries = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: dictionaryKeys.list(queryParams),
    queryFn: () => getDictionaries(queryParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Create dictionary mutation
export const useCreateDictionary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Dictionary, keyof Dictionary>) => createDictionary(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dictionaryService', 'dictionaries'] });
    },
    onError: error => {
      console.error('Failed to create dictionary:', error);
    }
  });
};

// Update dictionary mutation
export const useUpdateDictionary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Dictionary, keyof Dictionary>) => updateDictionary(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dictionaryService', 'dictionaries'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: dictionaryKeys.get({ dictionary: variables.id })
        });
      }
      if (variables.slug) {
        queryClient.invalidateQueries({
          queryKey: dictionaryKeys.getBySlug(variables.slug)
        });
      }
    },
    onError: error => {
      console.error('Failed to update dictionary:', error);
    }
  });
};

// Delete dictionary mutation
export const useDeleteDictionary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDictionary(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: dictionaryKeys.get({ dictionary: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['dictionaryService', 'dictionaries'] });
    },
    onError: error => {
      console.error('Failed to delete dictionary:', error);
    }
  });
};
