import { AnyObject, ExplicitAny, Taxonomy } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createTaxonomy,
  getTaxonomy,
  getTaxonomies,
  updateTaxonomy
} from '@/apis/taxonomy/taxonomy';
import { paginateByCursor } from '@/helpers/pagination';

type TaxonomyMutationFn = (payload: Pick<Taxonomy, keyof Taxonomy>) => Promise<Taxonomy>;
type TaxonomyQueryFn<T> = () => Promise<T>;

interface TaxonomyKeys {
  create: ['taxonomyService', 'create'];
  get: (options?: { taxonomy?: string }) => ['taxonomyService', 'taxonomy', { taxonomy?: string }];
  tree: (options?: AnyObject) => ['taxonomyService', 'tree', AnyObject];
  update: ['taxonomyService', 'update'];
  list: (options?: AnyObject) => ['taxonomyService', 'taxonomies', AnyObject];
}

export const taxonomyKeys: TaxonomyKeys = {
  create: ['taxonomyService', 'create'],
  get: ({ taxonomy } = {}) => ['taxonomyService', 'taxonomy', { taxonomy }],
  tree: (queryKey = {}) => ['taxonomyService', 'tree', queryKey],
  update: ['taxonomyService', 'update'],
  list: (queryKey = {}) => ['taxonomyService', 'taxonomies', queryKey]
};

const useTaxonomyMutation = (mutationFn: TaxonomyMutationFn) => useMutation({ mutationFn });

const useQueryTaxonomyData = <T>(queryKey: unknown[], queryFn: TaxonomyQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryTaxonomy = (taxonomy: string) =>
  useQueryTaxonomyData(taxonomyKeys.get({ taxonomy }), () => getTaxonomy(taxonomy));

export const useCreateTaxonomy = () => useTaxonomyMutation(payload => createTaxonomy(payload));
export const useUpdateTaxonomy = () => useTaxonomyMutation(payload => updateTaxonomy(payload));

export const useListTaxonomies = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: taxonomyKeys.list(queryKey),
    queryFn: () => getTaxonomies(queryKey)
  });
  const { content: taxonomies = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(taxonomies, cursor as string, limit as number);

  return { taxonomies: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
