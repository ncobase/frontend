import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTaxonomy, deleteTaxonomy, getTaxonomy, getTaxonomies, updateTaxonomy } from './apis';
import { QueryFormParams } from './config/query';
import { Taxonomy } from './taxonomy';

interface TaxonomyKeys {
  create: ['taxonomyService', 'create'];
  get: (_options?: { taxonomy?: string }) => ['taxonomyService', 'taxonomy', { taxonomy?: string }];
  update: ['taxonomyService', 'update'];
  list: (_options?: QueryFormParams) => ['taxonomyService', 'taxonomies', QueryFormParams];
}

export const taxonomyKeys: TaxonomyKeys = {
  create: ['taxonomyService', 'create'],
  get: ({ taxonomy } = {}) => ['taxonomyService', 'taxonomy', { taxonomy }],
  update: ['taxonomyService', 'update'],
  list: (queryParams = {}) => ['taxonomyService', 'taxonomies', queryParams]
};

// Query a specific taxonomy by ID or Slug
export const useQueryTaxonomy = (taxonomy: string) =>
  useQuery({
    queryKey: taxonomyKeys.get({ taxonomy }),
    queryFn: () => getTaxonomy(taxonomy),
    enabled: !!taxonomy
  });

// List taxonomies with query params
export const useListTaxonomies = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: taxonomyKeys.list(queryParams),
    queryFn: () => getTaxonomies(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create taxonomy mutation
export const useCreateTaxonomy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Taxonomy, keyof Taxonomy>) => createTaxonomy(payload),
    onSuccess: () => {
      // Invalidate and refetch taxonomies list
      queryClient.invalidateQueries({ queryKey: ['taxonomyService', 'taxonomies'] });
    },
    onError: error => {
      console.error('Failed to create taxonomy:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update taxonomy mutation
export const useUpdateTaxonomy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Taxonomy, keyof Taxonomy>) => updateTaxonomy(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific taxonomy and taxonomies list
      queryClient.invalidateQueries({ queryKey: ['taxonomyService', 'taxonomies'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: taxonomyKeys.get({ taxonomy: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update taxonomy:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete taxonomy mutation
export const useDeleteTaxonomy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTaxonomy(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate taxonomies list
      queryClient.removeQueries({
        queryKey: taxonomyKeys.get({ taxonomy: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['taxonomyService', 'taxonomies'] });
    },
    onError: error => {
      console.error('Failed to delete taxonomy:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
