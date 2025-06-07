import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTemplate,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplates,
  applyTemplate,
  duplicateTemplate,
  getPopularTemplates,
  getTemplatesByCategory
} from './apis';

// Template query keys
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: any) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
  category: (category: string, type?: string) => ['templates', 'category', category, type] as const,
  popular: (type?: string, limit?: number) => ['templates', 'popular', type, limit] as const
};

// Template queries
export const useTemplates = (params: any = {}) => {
  return useQuery({
    queryKey: templateKeys.list(params),
    queryFn: () => getTemplates(params),
    staleTime: 5 * 60 * 1000
  });
};

export const useTemplate = (templateId: string) => {
  return useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: () => getTemplate(templateId),
    enabled: !!templateId
  });
};

export const useTemplatesByCategory = (category: string, type?: string) => {
  return useQuery({
    queryKey: templateKeys.category(category, type),
    queryFn: () => getTemplatesByCategory(category, type),
    enabled: !!category,
    staleTime: 10 * 60 * 1000
  });
};

export const usePopularTemplates = (type?: string, limit: number = 10) => {
  return useQuery({
    queryKey: templateKeys.popular(type, limit),
    queryFn: () => getPopularTemplates(type, limit),
    staleTime: 30 * 60 * 1000
  });
};

// Template mutations
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    }
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTemplate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) });
      }
    }
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    }
  });
};

export const useApplyTemplate = () => {
  return useMutation({
    mutationFn: ({
      templateId,
      contentId,
      contentType,
      data
    }: {
      templateId: string;
      contentId: string;
      contentType: string;
      data: any;
    }) => applyTemplate(templateId, contentId, contentType, data)
  });
};

export const useDuplicateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, name }: { templateId: string; name: string }) =>
      duplicateTemplate(templateId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    }
  });
};
