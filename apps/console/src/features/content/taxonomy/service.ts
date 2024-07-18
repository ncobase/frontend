import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import {
  createTaxonomy,
  deleteTaxonomy,
  getTaxonomies,
  getTaxonomy,
  updateTaxonomy
} from '@/apis/content/taxonomy';
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

// Hook for delete taxonomy mutation
export const useDeleteTaxonomy = () =>
  useMutation({ mutationFn: (id: string) => deleteTaxonomy(id) });

// Hook to list taxonomies
export const useListTaxonomies = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: taxonomyKeys.list(queryParams),
    queryFn: () => getTaxonomies(queryParams)
  });
};
