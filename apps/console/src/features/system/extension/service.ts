import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getAllExtensions,
  getExtensionStatus,
  getMetrics,
  getMetricsByType,
  getMetricsCollections,
  getCollectionData,
  queryMetrics,
  getMetricsSnapshot,
  getStorageStats,
  getSystemHealth,
  getDataHealth,
  getExtensionsHealth,
  getCircuitBreakersStatus,
  loadExtension,
  unloadExtension,
  reloadExtension,
  refreshCrossServices
} from './apis';
import type {
  ExtensionListResponse,
  ExtensionStatus,
  ExtensionMetrics,
  ExtensionActionResponse,
  HealthCheckResponse,
  CircuitBreakerStatus,
  MetricSnapshot
} from './extension';

// Query keys
export const extensionKeys = {
  all: ['extensionService'] as const,
  lists: () => [...extensionKeys.all, 'list'] as const,
  list: () => [...extensionKeys.lists()] as const,
  status: () => [...extensionKeys.all, 'status'] as const,
  metrics: () => [...extensionKeys.all, 'metrics'] as const,
  metricsByType: (type: string) => [...extensionKeys.metrics(), type] as const,
  collections: () => [...extensionKeys.metrics(), 'collections'] as const,
  collection: (name: string) => [...extensionKeys.collections(), name] as const,
  health: () => [...extensionKeys.all, 'health'] as const,
  healthData: () => [...extensionKeys.health(), 'data'] as const,
  healthExtensions: () => [...extensionKeys.health(), 'extensions'] as const,
  circuitBreakers: () => [...extensionKeys.health(), 'circuit-breakers'] as const
};

// Extensions
export const useExtensions = () => {
  return useQuery<ExtensionListResponse>({
    queryKey: extensionKeys.list(),
    queryFn: getAllExtensions,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Extension status
export const useExtensionStatus = (autoRefresh = true) => {
  return useQuery<ExtensionStatus>({
    queryKey: extensionKeys.status(),
    queryFn: getExtensionStatus,
    staleTime: 10 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: autoRefresh ? 30 * 1000 : false,
    retry: 2
  });
};

// Comprehensive metrics
export const useMetrics = (autoRefresh = true) => {
  return useQuery<ExtensionMetrics>({
    queryKey: extensionKeys.metrics(),
    queryFn: getMetrics,
    staleTime: 5 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: autoRefresh ? 10 * 1000 : false,
    retry: 2
  });
};

// Specific metric type
export const useMetricsByType = (type: string, enabled = true) => {
  return useQuery<any>({
    queryKey: extensionKeys.metricsByType(type),
    queryFn: () => getMetricsByType(type),
    enabled: enabled && !!type,
    staleTime: 5 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: 15 * 1000,
    retry: 2
  });
};

// Metrics collections
export const useMetricsCollections = () => {
  return useQuery({
    queryKey: extensionKeys.collections(),
    queryFn: getMetricsCollections,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2
  });
};

// Specific collection
export const useCollectionData = (collection: string, enabled = true) => {
  return useQuery({
    queryKey: extensionKeys.collection(collection),
    queryFn: () => getCollectionData(collection),
    enabled: enabled && !!collection,
    staleTime: 10 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: 20 * 1000,
    retry: 2
  });
};

// Metrics snapshot
export const useMetricsSnapshot = (enabled = true) => {
  return useQuery({
    queryKey: [...extensionKeys.metrics(), 'snapshot'],
    queryFn: getMetricsSnapshot,
    enabled,
    staleTime: 5 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: 15 * 1000,
    retry: 2
  });
};

// Storage stats
export const useStorageStats = () => {
  return useQuery({
    queryKey: [...extensionKeys.metrics(), 'storage'],
    queryFn: getStorageStats,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2
  });
};

// Health checks
export const useSystemHealth = (autoRefresh = true) => {
  return useQuery<HealthCheckResponse>({
    queryKey: extensionKeys.health(),
    queryFn: getSystemHealth,
    staleTime: 15 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: autoRefresh ? 30 * 1000 : false,
    retry: 2
  });
};

export const useDataHealth = () => {
  return useQuery({
    queryKey: extensionKeys.healthData(),
    queryFn: getDataHealth,
    staleTime: 20 * 1000,
    gcTime: 60 * 1000,
    retry: 2
  });
};

export const useExtensionsHealth = () => {
  return useQuery({
    queryKey: extensionKeys.healthExtensions(),
    queryFn: getExtensionsHealth,
    staleTime: 15 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: 20 * 1000,
    retry: 2
  });
};

export const useCircuitBreakersStatus = () => {
  return useQuery<CircuitBreakerStatus>({
    queryKey: extensionKeys.circuitBreakers(),
    queryFn: getCircuitBreakersStatus,
    staleTime: 20 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: 15 * 1000,
    retry: 2
  });
};

// Query historical metrics
export const useQueryMetrics = () => {
  return useMutation<
    {
      collection: string;
      start?: string;
      end?: string;
      limit?: number;
      count: number;
      data: MetricSnapshot[];
    },
    Error,
    {
      collection: string;
      start?: string;
      end?: string;
      limit?: number;
    }
  >({
    mutationFn: ({ collection, ...params }) => queryMetrics(collection, params)
  });
};

// Plugin management mutations
export const useLoadExtension = () => {
  const queryClient = useQueryClient();

  return useMutation<ExtensionActionResponse, Error, string>({
    mutationFn: (name: string) => loadExtension(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.list() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
    },
    onError: (error: Error) => {
      console.error('Failed to load extension:', error);
    }
  });
};

export const useUnloadExtension = () => {
  const queryClient = useQueryClient();

  return useMutation<ExtensionActionResponse, Error, string>({
    mutationFn: (name: string) => unloadExtension(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.list() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
    },
    onError: (error: Error) => {
      console.error('Failed to unload extension:', error);
    }
  });
};

export const useReloadExtension = () => {
  const queryClient = useQueryClient();

  return useMutation<ExtensionActionResponse, Error, string>({
    mutationFn: (name: string) => reloadExtension(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.list() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
    },
    onError: (error: Error) => {
      console.error('Failed to reload extension:', error);
    }
  });
};

export const useRefreshCrossServices = () => {
  const queryClient = useQueryClient();

  return useMutation<ExtensionActionResponse, Error, void>({
    mutationFn: () => refreshCrossServices(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
    },
    onError: (error: Error) => {
      console.error('Failed to refresh cross services:', error);
    }
  });
};
