import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import {
  createDictionary,
  getDictionaries,
  getDictionary,
  updateDictionary
} from '@/apis/system/dictionary';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { Dictionary } from '@/types';

interface DictionaryKeys {
  create: ['dictionaryService', 'create'];
  get: (options?: {
    dictionary?: string;
  }) => ['dictionaryService', 'dictionary', { dictionary?: string }];
  update: ['dictionaryService', 'update'];
  list: (options?: QueryFormParams) => ['dictionaryService', 'dictionaries', QueryFormParams];
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

// Hook to list dictionaries with pagination
export const useListDictionaries = (queryParams: QueryFormParams = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: dictionaryKeys.list(queryParams),
    queryFn: () => getDictionaries(queryParams)
  });

  const paginatedResult = usePaginatedData<Dictionary>(
    data || { items: [], total: 0, has_next: false },
    queryParams?.cursor as string,
    queryParams?.limit as number
  );

  return { ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = <T>(
  data: { items: T[]; total: number; has_next: boolean; next?: string },
  cursor?: string,
  limit: number = 10
): PaginationResult<T> => {
  const { items, has_next, next } = paginateByCursor(data.items, data.total, cursor, limit) || {
    items: [],
    has_next: data.has_next,
    next: data.next
  };

  return { items, total: data.total, next, has_next };
};
