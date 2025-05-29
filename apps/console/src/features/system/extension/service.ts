import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getAllExtensions,
  getExtensionStatus,
  loadExtension,
  unloadExtension,
  reloadExtension,
  refreshCrossServices,
  getMetrics,
  getMetricsByType
} from './apis';

// Query keys
export const extensionKeys = {
  all: ['extensionService'] as const,
  lists: () => [...extensionKeys.all, 'list'] as const,
  list: () => [...extensionKeys.lists()] as const,
  status: () => [...extensionKeys.all, 'status'] as const,
  metrics: () => [...extensionKeys.all, 'metrics'] as const,
  metricsByType: (type: string) => [...extensionKeys.metrics(), type] as const
};

// Query all extensions
export const useExtensions = () => {
  return useQuery({
    queryKey: extensionKeys.list(),
    queryFn: getAllExtensions,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Query extension status
export const useExtensionStatus = () => {
  return useQuery({
    queryKey: extensionKeys.status(),
    queryFn: getExtensionStatus,
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000 // Auto-refresh every 30 seconds
  });
};

// Query metrics
export const useMetrics = () => {
  return useQuery({
    queryKey: extensionKeys.metrics(),
    queryFn: getMetrics,
    staleTime: 5 * 1000, // 5 seconds
    gcTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000 // Auto-refresh every 10 seconds
  });
};

// Query metrics by type
export const useMetricsByType = (type: string) => {
  return useQuery({
    queryKey: extensionKeys.metricsByType(type),
    queryFn: () => getMetricsByType(type),
    enabled: !!type,
    staleTime: 5 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: 10 * 1000
  });
};

// Load extension mutation
export const useLoadExtension = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => loadExtension(name),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: extensionKeys.list() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
    },
    onError: error => {
      console.error('Failed to load extension:', error);
    }
  });
};

// Unload extension mutation
export const useUnloadExtension = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => unloadExtension(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.list() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
    },
    onError: error => {
      console.error('Failed to unload extension:', error);
    }
  });
};

// Reload extension mutation
export const useReloadExtension = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => reloadExtension(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.list() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
    },
    onError: error => {
      console.error('Failed to reload extension:', error);
    }
  });
};

// Refresh cross services mutation
export const useRefreshCrossServices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshCrossServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
    },
    onError: error => {
      console.error('Failed to refresh cross services:', error);
    }
  });
};
