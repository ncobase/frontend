import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDistribution,
  deleteDistribution,
  getDistribution,
  getDistributions,
  updateDistribution,
  publishDistribution,
  cancelDistribution
} from './apis';
import { Distribution } from './distribution';

interface DistributionKeys {
  create: ['distributionService', 'create'];
  get: (_options?: {
    distribution?: string;
  }) => ['distributionService', 'distribution', { distribution?: string }];
  update: ['distributionService', 'update'];
  list: (_options?: any) => ['distributionService', 'distributions', any];
}

export const distributionKeys: DistributionKeys = {
  create: ['distributionService', 'create'],
  get: ({ distribution } = {}) => ['distributionService', 'distribution', { distribution }],
  update: ['distributionService', 'update'],
  list: (queryParams = {}) => ['distributionService', 'distributions', queryParams]
};

// Query single distribution
export const useQueryDistribution = (distributionId: string) =>
  useQuery({
    queryKey: distributionKeys.get({ distribution: distributionId }),
    queryFn: () => getDistribution(distributionId),
    enabled: !!distributionId
  });

// List distributions
export const useListDistributions = (queryParams: any) => {
  return useQuery({
    queryKey: distributionKeys.list(queryParams),
    queryFn: () => getDistributions(queryParams),
    staleTime: 5 * 60 * 1000
  });
};

// Create distribution mutation
export const useCreateDistribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Distribution>) => createDistribution(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributionService', 'distributions'] });
    }
  });
};

// Update distribution mutation
export const useUpdateDistribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Distribution>) => updateDistribution(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['distributionService', 'distributions'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: distributionKeys.get({ distribution: variables.id })
        });
      }
    }
  });
};

// Delete distribution mutation
export const useDeleteDistribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDistribution(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: distributionKeys.get({ distribution: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['distributionService', 'distributions'] });
    }
  });
};

// Publish distribution mutation
export const usePublishDistribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishDistribution(id),
    onSuccess: (_, distributionId) => {
      queryClient.invalidateQueries({ queryKey: ['distributionService', 'distributions'] });
      queryClient.invalidateQueries({
        queryKey: distributionKeys.get({ distribution: distributionId })
      });
    }
  });
};

// Cancel distribution mutation
export const useCancelDistribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelDistribution(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['distributionService', 'distributions'] });
      queryClient.invalidateQueries({
        queryKey: distributionKeys.get({ distribution: id })
      });
    }
  });
};
