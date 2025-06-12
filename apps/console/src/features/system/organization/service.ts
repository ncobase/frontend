import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createOrg, deleteOrg, getOrg, getOrgs, updateOrg } from './apis';
import { QueryFormParams } from './config/query';
import { Org } from './org';

interface OrgKeys {
  create: ['orgService', 'create'];
  get: (_options?: { org?: string }) => ['orgService', 'org', { org?: string }];
  update: ['orgService', 'update'];
  list: (_options?: QueryFormParams) => ['orgService', 'orgs', QueryFormParams];
}

export const orgKeys: OrgKeys = {
  create: ['orgService', 'create'],
  get: ({ org } = {}) => ['orgService', 'org', { org }],
  update: ['orgService', 'update'],
  list: (queryParams = {}) => ['orgService', 'orgs', queryParams]
};

// Query a specific org by ID or Slug
export const useQueryOrg = (org: string) =>
  useQuery({
    queryKey: orgKeys.get({ org }),
    queryFn: () => getOrg(org),
    enabled: !!org
  });

// List orgs
export const useListOrgs = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: orgKeys.list(queryParams),
    queryFn: () => getOrgs(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create org mutation
export const useCreateOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Org, keyof Org>) => createOrg(payload),
    onSuccess: () => {
      // Invalidate and refetch orgs list
      queryClient.invalidateQueries({ queryKey: ['orgService', 'orgs'] });
    },
    onError: error => {
      console.error('Failed to create org:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update org mutation
export const useUpdateOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Org, keyof Org>) => updateOrg(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific org and orgs list
      queryClient.invalidateQueries({ queryKey: ['orgService', 'orgs'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: orgKeys.get({ org: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update org:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete org mutation
export const useDeleteOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrg(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate orgs list
      queryClient.removeQueries({
        queryKey: orgKeys.get({ org: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['orgService', 'orgs'] });
    },
    onError: error => {
      console.error('Failed to delete org:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
