import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import {
  createTaxonomy,
  getTaxonomies,
  getTaxonomy,
  updateTaxonomy
} from '@/apis/content/taxonomy';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { Taxonomy } from '@/types';

interface TaxonomyKeys {
  create: ['taxonomyService', 'create'];
  get: (options?: { taxonomy?: string }) => ['taxonomyService', 'taxonomy', { taxonomy?: string }];
  update: ['taxonomyService', 'update'];
  list: (options?: QueryFormParams) => ['taxonomyService', 'taxonomies', QueryFormParams];
}

export const taxonomyKeys: TaxonomyKeys = {
  create: ['taxonomyService', 'create'],
  get: ({ taxonomy } = {}) => ['taxonomyService', 'taxonomy', { taxonomy }],
  update: ['taxonomyService', 'update'],
  list: (queryParams = {}) => ['taxonomyService', 'taxonomies', queryParams]
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
export const useListTaxonomies = (queryParams: QueryFormParams = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: taxonomyKeys.list(queryParams),
    queryFn: () => getTaxonomies(queryParams)
  });

  const paginatedResult = usePaginatedData<Taxonomy>(
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
