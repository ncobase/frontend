import { useMutation, useQuery } from '@tanstack/react-query';
import { AnyObject, Dictionary, ExplicitAny } from '@ncobase/types';

import {
  createDictionary,
  getDictionary,
  getDictionaries,
  getDictionaryTree,
  updateDictionary
} from '@/apis/dictionary/dictionary';
import { paginateByCursor } from '@/helpers/pagination';

type DictionaryMutationFn = (payload: Pick<Dictionary, keyof Dictionary>) => Promise<Dictionary>;
type DictionaryQueryFn<T> = () => Promise<T>;

interface DictionaryKeys {
  create: ['dictionaryService', 'create'];
  get: (options?: {
    dictionary?: string;
  }) => ['dictionaryService', 'dictionary', { dictionary?: string }];
  tree: (options?: AnyObject) => ['dictionaryService', 'tree', AnyObject];
  update: ['dictionaryService', 'update'];
  list: (options?: AnyObject) => ['dictionaryService', 'dictionaries', AnyObject];
}

export const dictionaryKeys: DictionaryKeys = {
  create: ['dictionaryService', 'create'],
  get: ({ dictionary } = {}) => ['dictionaryService', 'dictionary', { dictionary }],
  tree: (queryKey = {}) => ['dictionaryService', 'tree', queryKey],
  update: ['dictionaryService', 'update'],
  list: (queryKey = {}) => ['dictionaryService', 'dictionaries', queryKey]
};

const useDictionaryMutation = (mutationFn: DictionaryMutationFn) => useMutation({ mutationFn });

const useQueryDictionaryData = <T>(queryKey: unknown[], queryFn: DictionaryQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryDictionary = (dictionary: string) =>
  useQueryDictionaryData(dictionaryKeys.get({ dictionary }), () => getDictionary(dictionary));

export const useQueryDictionaryTreeData = (dictionary: string, type?: string) =>
  useQueryDictionaryData(dictionaryKeys.tree({ dictionary, type }), () =>
    getDictionaryTree(dictionary, type)
  );

export const useCreateDictionary = () =>
  useDictionaryMutation(payload => createDictionary(payload));
export const useUpdateDictionary = () =>
  useDictionaryMutation(payload => updateDictionary(payload));

export const useListDictionaries = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: dictionaryKeys.list(queryKey),
    queryFn: () => getDictionaries(queryKey)
  });
  const { content: dictionaries = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(dictionaries, cursor as string, limit as number);

  return { dictionaries: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
