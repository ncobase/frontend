import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  AIActionRequest,
  AICompleteRequest,
  AIEmbedRequest,
  AIRunQuery,
  AIUsageQuery
} from './ai';
import {
  completeAI,
  embedAI,
  getAIActions,
  getAIHealth,
  getAIModels,
  getAIProviders,
  getAIRun,
  getAIRuns,
  getAIStatus,
  getAIUsage,
  runAIAction
} from './apis';

export const aiKeys = {
  root: ['aiService'] as const,
  status: () => ['aiService', 'status'] as const,
  providers: () => ['aiService', 'providers'] as const,
  models: (provider?: string) => ['aiService', 'models', { provider }] as const,
  actions: () => ['aiService', 'actions'] as const,
  runs: (params?: AIRunQuery) => ['aiService', 'runs', params] as const,
  run: (id?: string) => ['aiService', 'run', { id }] as const,
  usage: (params?: AIUsageQuery) => ['aiService', 'usage', params] as const,
  health: () => ['aiService', 'health'] as const
};

export const useAIStatus = () =>
  useQuery({
    queryKey: aiKeys.status(),
    queryFn: getAIStatus,
    staleTime: 30 * 1000
  });

export const useAIProviders = () =>
  useQuery({
    queryKey: aiKeys.providers(),
    queryFn: getAIProviders,
    staleTime: 60 * 1000
  });

export const useAIModels = (provider?: string, enabled = true) =>
  useQuery({
    queryKey: aiKeys.models(provider),
    queryFn: () => getAIModels(provider),
    staleTime: 60 * 1000,
    enabled
  });

export const useAIActions = () =>
  useQuery({
    queryKey: aiKeys.actions(),
    queryFn: getAIActions,
    staleTime: 5 * 60 * 1000
  });

export const useAIRuns = (params?: AIRunQuery) =>
  useQuery({
    queryKey: aiKeys.runs(params),
    queryFn: () => getAIRuns(params),
    staleTime: 30 * 1000
  });

export const useAIRun = (id?: string) =>
  useQuery({
    queryKey: aiKeys.run(id),
    queryFn: () => getAIRun(id || ''),
    enabled: !!id
  });

export const useAIUsage = (params?: AIUsageQuery) =>
  useQuery({
    queryKey: aiKeys.usage(params),
    queryFn: () => getAIUsage(params),
    staleTime: 60 * 1000
  });

export const useAIHealth = (enabled = true) =>
  useQuery({
    queryKey: aiKeys.health(),
    queryFn: getAIHealth,
    staleTime: 30 * 1000,
    enabled
  });

export const useCompleteAI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AICompleteRequest) => completeAI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiService', 'runs'] });
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
      queryClient.invalidateQueries({ queryKey: aiKeys.status() });
    }
  });
};

export const useEmbedAI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AIEmbedRequest) => embedAI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiService', 'runs'] });
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
      queryClient.invalidateQueries({ queryKey: aiKeys.status() });
    }
  });
};

export const useRunAIAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ action, payload }: { action: string; payload: AIActionRequest }) =>
      runAIAction(action, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiService', 'runs'] });
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
      queryClient.invalidateQueries({ queryKey: aiKeys.status() });
    }
  });
};
