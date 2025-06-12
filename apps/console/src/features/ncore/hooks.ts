import { useState, useEffect, useCallback } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getExtensions,
  getExtensionStatus,
  getExtensionMetadata,
  getExtension,
  getExtensionMetrics,
  getSystemMetrics,
  getComprehensiveMetrics,
  getSpecificExtensionMetrics,
  getDataMetrics,
  getEventsMetrics,
  getServiceDiscoveryMetrics,
  getHistoricalMetrics,
  getLatestMetrics,
  getStorageStats,
  getSystemHealth,
  getDataHealth,
  getExtensionsHealth,
  getCircuitBreakersStatus,
  getSystemInfo,
  getSystemConfig,
  loadPlugin,
  unloadPlugin,
  reloadPlugin,
  refreshCrossServices
} from './apis';
import type {
  ExtensionListResponse,
  MetricsResponse,
  ComprehensiveMetricsResponse,
  DataMetrics,
  EventsMetrics,
  ServiceDiscoveryMetrics,
  HealthResponse,
  DataHealth,
  CircuitBreakerStatus,
  HistoricalMetricsResponse,
  LatestMetricsResponse,
  StorageStats
} from './ncore';

// Query keys
export const extensionKeys = {
  all: ['extensions'] as const,
  lists: () => [...extensionKeys.all, 'list'] as const,
  status: () => [...extensionKeys.all, 'status'] as const,
  metadata: () => [...extensionKeys.all, 'metadata'] as const,
  extension: (name: string) => [...extensionKeys.all, 'detail', name] as const,
  metrics: () => [...extensionKeys.all, 'metrics'] as const,
  systemMetrics: () => [...extensionKeys.metrics(), 'system'] as const,
  extensionMetrics: () => [...extensionKeys.metrics(), 'extensions'] as const,
  comprehensiveMetrics: () => [...extensionKeys.metrics(), 'comprehensive'] as const,
  dataMetrics: () => [...extensionKeys.metrics(), 'data'] as const,
  eventsMetrics: () => [...extensionKeys.metrics(), 'events'] as const,
  serviceDiscoveryMetrics: () => [...extensionKeys.metrics(), 'service-discovery'] as const,
  specificMetrics: (name: string) => [...extensionKeys.metrics(), 'specific', name] as const,
  historicalMetrics: (params: any) => [...extensionKeys.metrics(), 'historical', params] as const,
  latestMetrics: (name: string, limit: number) =>
    [...extensionKeys.metrics(), 'latest', name, limit] as const,
  storageStats: () => [...extensionKeys.metrics(), 'storage'] as const,
  health: () => [...extensionKeys.all, 'health'] as const,
  dataHealth: () => [...extensionKeys.health(), 'data'] as const,
  extensionsHealth: () => [...extensionKeys.health(), 'extensions'] as const,
  circuitBreakers: () => [...extensionKeys.health(), 'circuit-breakers'] as const,
  system: () => [...extensionKeys.all, 'system'] as const
};

// Extensions
export function useExtensions() {
  return useQuery<ExtensionListResponse>({
    queryKey: extensionKeys.lists(),
    queryFn: getExtensions,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  });
}

export function useExtensionStatus(autoRefresh = false) {
  return useQuery({
    queryKey: extensionKeys.status(),
    queryFn: getExtensionStatus,
    staleTime: 10 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: autoRefresh ? 30 * 1000 : false
  });
}

export function useExtensionMetadata() {
  return useQuery({
    queryKey: extensionKeys.metadata(),
    queryFn: getExtensionMetadata,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000
  });
}

export function useExtension(name: string, enabled = true) {
  return useQuery({
    queryKey: extensionKeys.extension(name),
    queryFn: () => getExtension(name),
    enabled: enabled && !!name,
    staleTime: 30 * 1000
  });
}

// Metrics
export function useExtensionMetrics(autoRefresh = false) {
  return useQuery<MetricsResponse>({
    queryKey: extensionKeys.extensionMetrics(),
    queryFn: getExtensionMetrics,
    staleTime: 5 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: autoRefresh ? 15 * 1000 : false
  });
}

export function useSystemMetrics(autoRefresh = false) {
  return useQuery({
    queryKey: extensionKeys.systemMetrics(),
    queryFn: getSystemMetrics,
    staleTime: 5 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: autoRefresh ? 15 * 1000 : false
  });
}

export function useComprehensiveMetrics(autoRefresh = false) {
  return useQuery<ComprehensiveMetricsResponse>({
    queryKey: extensionKeys.comprehensiveMetrics(),
    queryFn: getComprehensiveMetrics,
    staleTime: 10 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: autoRefresh ? 30 * 1000 : false
  });
}

export function useDataMetrics(autoRefresh = false) {
  return useQuery<DataMetrics>({
    queryKey: extensionKeys.dataMetrics(),
    queryFn: getDataMetrics,
    staleTime: 15 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: autoRefresh ? 45 * 1000 : false,
    retry: 1 // Don't retry too much for unavailable metrics
  });
}

export function useEventsMetrics(autoRefresh = false) {
  return useQuery<EventsMetrics>({
    queryKey: extensionKeys.eventsMetrics(),
    queryFn: getEventsMetrics,
    staleTime: 5 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: autoRefresh ? 15 * 1000 : false
  });
}

export function useServiceDiscoveryMetrics(autoRefresh = false) {
  return useQuery<ServiceDiscoveryMetrics>({
    queryKey: extensionKeys.serviceDiscoveryMetrics(),
    queryFn: getServiceDiscoveryMetrics,
    staleTime: 10 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: autoRefresh ? 20 * 1000 : false
  });
}

export function useSpecificExtensionMetrics(name: string, enabled = true) {
  return useQuery({
    queryKey: extensionKeys.specificMetrics(name),
    queryFn: () => getSpecificExtensionMetrics(name),
    enabled: enabled && !!name,
    staleTime: 10 * 1000,
    refetchInterval: 20 * 1000
  });
}

export function useHistoricalMetrics() {
  return useMutation<HistoricalMetricsResponse, Error, any>({
    mutationFn: (params: any) => getHistoricalMetrics(params)
  });
}

export function useLatestMetrics(name: string, limit = 100, enabled = true) {
  return useQuery<LatestMetricsResponse>({
    queryKey: extensionKeys.latestMetrics(name, limit),
    queryFn: () => getLatestMetrics(name, limit),
    enabled: enabled && !!name,
    staleTime: 10 * 1000
  });
}

export function useStorageStats() {
  return useQuery<StorageStats>({
    queryKey: extensionKeys.storageStats(),
    queryFn: getStorageStats,
    staleTime: 30 * 1000
  });
}

// Health
export function useSystemHealth(autoRefresh = false) {
  return useQuery<HealthResponse>({
    queryKey: extensionKeys.health(),
    queryFn: getSystemHealth,
    staleTime: 15 * 1000,
    gcTime: 60 * 1000,
    refetchInterval: autoRefresh ? 30 * 1000 : false
  });
}

export function useDataHealth() {
  return useQuery<DataHealth>({
    queryKey: extensionKeys.dataHealth(),
    queryFn: getDataHealth,
    staleTime: 20 * 1000,
    gcTime: 60 * 1000
  });
}

export function useExtensionsHealth() {
  return useQuery({
    queryKey: extensionKeys.extensionsHealth(),
    queryFn: getExtensionsHealth,
    staleTime: 15 * 1000,
    refetchInterval: 20 * 1000
  });
}

export function useCircuitBreakersStatus() {
  return useQuery<CircuitBreakerStatus>({
    queryKey: extensionKeys.circuitBreakers(),
    queryFn: getCircuitBreakersStatus,
    staleTime: 20 * 1000,
    refetchInterval: 15 * 1000
  });
}

// System
export function useSystemInfo() {
  return useQuery({
    queryKey: [...extensionKeys.system(), 'info'],
    queryFn: getSystemInfo,
    staleTime: 60 * 1000
  });
}

export function useSystemConfig() {
  return useQuery({
    queryKey: [...extensionKeys.system(), 'config'],
    queryFn: getSystemConfig,
    staleTime: 5 * 60 * 1000
  });
}

// Mutations
export function useLoadPlugin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loadPlugin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
    }
  });
}

export function useUnloadPlugin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unloadPlugin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
    }
  });
}

export function useReloadPlugin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reloadPlugin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
    }
  });
}

export function useRefreshCrossServices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshCrossServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
    }
  });
}

// Real-time updates hook
export function useRealTimeUpdates(enabled = true, interval = 5000) {
  const queryClient = useQueryClient();

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: extensionKeys.status() });
    queryClient.invalidateQueries({ queryKey: extensionKeys.extensionMetrics() });
    queryClient.invalidateQueries({ queryKey: extensionKeys.health() });
  }, [queryClient]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(refresh, interval);
    return () => clearInterval(timer);
  }, [enabled, interval, refresh]);

  return { refresh };
}

// Auto-refresh control hook
export function useAutoRefresh(initialEnabled = true) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [interval, setInterval] = useState(5000);

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const setRefreshInterval = useCallback((newInterval: number) => {
    setInterval(newInterval);
  }, []);

  return {
    enabled,
    interval,
    toggle,
    setEnabled,
    setRefreshInterval
  };
}
