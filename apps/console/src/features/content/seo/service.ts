import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  analyzeKeywordDensity,
  analyzeSEO,
  createSEOData,
  generateMetaTags,
  getContentSEO,
  getKeywordSuggestions,
  runAudit,
  updateSEOData
} from './apis';

// SEO query keys
export const seoKeys = {
  all: ['seo'] as const,
  lists: () => [...seoKeys.all, 'list'] as const,
  list: (filters: any) => [...seoKeys.lists(), filters] as const,
  details: () => [...seoKeys.all, 'detail'] as const,
  detail: (id: string) => [...seoKeys.details(), id] as const,
  content: (contentId: string, contentType: string) =>
    ['seo', 'content', contentId, contentType] as const,
  analysis: (contentId: string, contentType: string) =>
    ['seo', 'analysis', contentId, contentType] as const,
  keywords: (seed: string, language: string) => ['seo', 'keywords', seed, language] as const
};

// SEO queries
export const useContentSEO = (contentId: string, contentType: string) => {
  return useQuery({
    queryKey: seoKeys.content(contentId, contentType),
    queryFn: () => getContentSEO(contentId, contentType),
    enabled: !!contentId && !!contentType,
    staleTime: 5 * 60 * 1000
  });
};

export const useSEOAnalysis = (contentId: string, contentType: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: seoKeys.analysis(contentId, contentType),
    queryFn: () => analyzeSEO(contentId, contentType),
    enabled: enabled && !!contentId && !!contentType,
    staleTime: 2 * 60 * 1000
  });
};

export const useKeywordSuggestions = (seed: string, language: string = 'en') => {
  return useQuery({
    queryKey: seoKeys.keywords(seed, language),
    queryFn: () => getKeywordSuggestions(seed, language),
    enabled: !!seed && seed.length > 2,
    staleTime: 10 * 60 * 1000
  });
};

// SEO mutations
export const useCreateSEOData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSEOData,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: seoKeys.content(variables.content_id, variables.content_type)
      });
    }
  });
};

export const useUpdateSEOData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSEOData,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: seoKeys.content(variables.content_id, variables.content_type)
      });
      queryClient.invalidateQueries({
        queryKey: seoKeys.analysis(variables.content_id, variables.content_type)
      });
    }
  });
};

export const useRunSEOAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      contentType,
      auditType
    }: {
      contentId: string;
      contentType: string;
      auditType?: string;
    }) => runAudit(contentId, contentType, auditType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: seoKeys.analysis(variables.contentId, variables.contentType)
      });
    }
  });
};

export const useGenerateMetaTags = () => {
  return useMutation({
    mutationFn: ({ content, keywords }: { content: string; keywords?: string[] }) =>
      generateMetaTags(content, keywords)
  });
};

export const useAnalyzeKeywordDensity = () => {
  return useMutation({
    mutationFn: ({ content, keywords }: { content: string; keywords: string[] }) =>
      analyzeKeywordDensity(content, keywords)
  });
};
