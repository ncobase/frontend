import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getVersion,
  deleteVersion,
  compareVersions,
  getContentVersions,
  getRevisionHistory,
  createSnapshot,
  restoreToVersion
} from './apis';

// Version query keys
export const versionKeys = {
  all: ['versions'] as const,
  lists: () => [...versionKeys.all, 'list'] as const,
  list: (filters: any) => [...versionKeys.lists(), filters] as const,
  details: () => [...versionKeys.all, 'detail'] as const,
  detail: (id: string) => [...versionKeys.details(), id] as const,
  content: (contentId: string, contentType: string) =>
    ['versions', 'content', contentId, contentType] as const,
  comparison: (versionA: string, versionB: string) =>
    ['versions', 'compare', versionA, versionB] as const,
  revisions: (contentId: string) => ['revisions', contentId] as const
};

// Version queries
export const useContentVersions = (contentId: string, contentType: string) => {
  return useQuery({
    queryKey: versionKeys.content(contentId, contentType),
    queryFn: () => getContentVersions(contentId, contentType),
    enabled: !!contentId && !!contentType,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

export const useVersion = (versionId: string) => {
  return useQuery({
    queryKey: versionKeys.detail(versionId),
    queryFn: () => getVersion(versionId),
    enabled: !!versionId
  });
};

export const useVersionComparison = (versionAId: string, versionBId: string) => {
  return useQuery({
    queryKey: versionKeys.comparison(versionAId, versionBId),
    queryFn: () => compareVersions(versionAId, versionBId),
    enabled: !!versionAId && !!versionBId
  });
};

export const useRevisionHistory = (contentId: string, fromVersion?: number, toVersion?: number) => {
  return useQuery({
    queryKey: versionKeys.revisions(contentId),
    queryFn: () => getRevisionHistory(contentId, fromVersion, toVersion),
    enabled: !!contentId
  });
};

// Version mutations
export const useCreateSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      contentType,
      data,
      changeSummary
    }: {
      contentId: string;
      contentType: string;
      data: any;
      changeSummary?: string;
    }) => createSnapshot(contentId, contentType, data, changeSummary),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: versionKeys.content(variables.contentId, variables.contentType)
      });
      queryClient.invalidateQueries({
        queryKey: versionKeys.revisions(variables.contentId)
      });
    }
  });
};

export const useRestoreVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, versionId }: { contentId: string; versionId: string }) =>
      restoreToVersion(contentId, versionId),
    onSuccess: (_, variables) => {
      // Invalidate related content queries
      queryClient.invalidateQueries({
        queryKey: ['topicService', 'topic', { topic: variables.contentId }]
      });
      queryClient.invalidateQueries({
        queryKey: ['taxonomyService', 'taxonomy', { taxonomy: variables.contentId }]
      });
      queryClient.invalidateQueries({
        queryKey: versionKeys.content(variables.contentId, 'topic') // Assume topic for now
      });
    }
  });
};

export const useDeleteVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: versionKeys.lists() });
    }
  });
};
