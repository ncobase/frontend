import { AnyObject, ExplicitAny, Dictionary } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createDictionary,
  getDictionary,
  getDictionaries,
  updateDictionary
} from '@/apis/system/dictionary';
import { paginateByCursor } from '@/helpers/pagination';

interface DictionaryKeys {
  create: ['dictionaryService', 'create'];
  get: (options?: {
    dictionary?: string;
  }) => ['dictionaryService', 'dictionary', { dictionary?: string }];
  update: ['dictionaryService', 'update'];
  list: (options?: AnyObject) => ['dictionaryService', 'dictionaries', AnyObject];
}

export const dictionaryKeys: DictionaryKeys = {
  create: ['dictionaryService', 'create'],
  get: ({ dictionary } = {}) => ['dictionaryService', 'dictionary', { dictionary }],
  update: ['dictionaryService', 'update'],
  list: (queryKey = {}) => ['dictionaryService', 'dictionaries', queryKey]
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
export const useListDictionaries = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: dictionaryKeys.list(queryKey),
    queryFn: () => getDictionaries(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { dictionaries: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
