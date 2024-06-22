import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createTaxonomy,
  getTaxonomies,
  getTaxonomy,
  updateTaxonomy
} from '@/apis/content/taxonomy';
import { paginateByCursor } from '@/helpers/pagination';
import { AnyObject, ExplicitAny, Taxonomy } from '@/types';

interface TaxonomyKeys {
  create: ['taxonomyService', 'create'];
  get: (options?: { taxonomy?: string }) => ['taxonomyService', 'taxonomy', { taxonomy?: string }];
  update: ['taxonomyService', 'update'];
  list: (options?: AnyObject) => ['taxonomyService', 'taxonomies', AnyObject];
}

export const taxonomyKeys: TaxonomyKeys = {
  create: ['taxonomyService', 'create'],
  get: ({ taxonomy } = {}) => ['taxonomyService', 'taxonomy', { taxonomy }],
  update: ['taxonomyService', 'update'],
  list: (queryKey = {}) => ['taxonomyService', 'taxonomies', queryKey]
};

// Hook to query a specific taxonomy by ID or Slug
export const useQueryTaxonomy = (taxonomy: string) =>
  useQuery({ queryKey: taxonomyKeys.get({ taxonomy }), queryFn: () => getTaxonomy(taxonomy) });

// Hook for create taxonomy mutation
export const useCreateTaxonomy = () =>
  useMutation({ mutationFn: (payload: Pick<Taxonomy, keyof Taxonomy>) => createTaxonomy(payload) });

// Hook for update taxonomy mutation
export const useUpdateTaxonomy = () =>
  useMutation({ mutationFn: (payload: Pick<Taxonomy, keyof Taxonomy>) => updateTaxonomy(payload) });

// Hook to list taxonomies with pagination
export const useListTaxonomies = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: taxonomyKeys.list(queryKey),
    queryFn: () => getTaxonomies(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { taxonomies: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
