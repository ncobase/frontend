import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';
import { Dictionary } from './dictionary';

import {
  createDictionary,
  deleteDictionary,
  getDictionaries,
  getDictionary,
  updateDictionary
} from '@/features/system/dictionary/apis';

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

// Hook to query a specific dictionary by ID or Slug
export const useQueryDictionary = (dictionary: string) =>
  useQuery({
    queryKey: dictionaryKeys.get({ dictionary }),
    queryFn: () => getDictionary(dictionary)
  });

// Hook for create dictionary mutation
export const useCreateDictionary = () =>
  useMutation({
    mutationFn: (payload: Pick<Dictionary, keyof Dictionary>) => createDictionary(payload)
  });

// Hook for update dictionary mutation
export const useUpdateDictionary = () =>
  useMutation({
    mutationFn: (payload: Pick<Dictionary, keyof Dictionary>) => updateDictionary(payload)
  });

// Hook for delete dictionary mutation
export const useDeleteDictionary = () =>
  useMutation({ mutationFn: (id: string) => deleteDictionary(id) });

// Hook to list dictionaries
export const useListDictionaries = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: dictionaryKeys.list(queryParams),
    queryFn: () => getDictionaries(queryParams)
  });
};
