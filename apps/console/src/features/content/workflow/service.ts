import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createWorkflow,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflows,
  getWorkflowsForContentType,
  getPendingTasks,
  completeStep,
  startWorkflow
} from './apis';

// Workflow keys for query management
export const workflowKeys = {
  all: ['workflows'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (filters: any) => [...workflowKeys.lists(), filters] as const,
  details: () => [...workflowKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
  instances: (filters: any) => ['workflow-instances', filters] as const,
  pendingTasks: (userId: string) => ['pending-tasks', userId] as const
};

// Workflow queries
export const useWorkflows = (params: any = {}) => {
  return useQuery({
    queryKey: workflowKeys.list(params),
    queryFn: () => getWorkflows(params),
    staleTime: 5 * 60 * 1000
  });
};

export const useWorkflow = (id: string) => {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: () => getWorkflow(id),
    enabled: !!id
  });
};

export const useWorkflowsForContentType = (contentType: string) => {
  return useQuery({
    queryKey: ['workflows', 'content-type', contentType],
    queryFn: () => getWorkflowsForContentType(contentType),
    enabled: !!contentType
  });
};

export const usePendingTasks = (userId: string) => {
  return useQuery({
    queryKey: workflowKeys.pendingTasks(userId),
    queryFn: () => getPendingTasks(userId),
    enabled: !!userId,
    refetchInterval: 30 * 1000 // Refresh every 30 seconds
  });
};

// Workflow mutations
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
    }
  });
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkflow,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.id) });
      }
    }
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
    }
  });
};

export const useStartWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      contentType,
      workflowId
    }: {
      contentId: string;
      contentType: string;
      workflowId: string;
    }) => startWorkflow(contentId, contentType, workflowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-instances'] });
    }
  });
};

export const useCompleteWorkflowStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      instanceId,
      stepId,
      decision,
      comments
    }: {
      instanceId: string;
      stepId: string;
      decision: string;
      comments?: string;
    }) => completeStep(instanceId, stepId, decision, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-instances'] });
      queryClient.invalidateQueries({ queryKey: ['pending-tasks'] });
    }
  });
};
