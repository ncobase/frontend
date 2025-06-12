import type {
  ExtensionListResponse,
  ExtensionStatus,
  MetricsResponse,
  HealthResponse,
  DataHealth,
  CircuitBreakerStatus,
  ExtensionActionResponse,
  HistoricalMetricsResponse,
  LatestMetricsResponse,
  StorageStats
} from './ncore';

import { createApi } from '@/lib/api/factory';

export const extensionApi = createApi<any, any, any, any>('/ncore', {
  extensions: ({ endpoint, request }) => ({
    // Extension management
    getExtensions: async (): Promise<ExtensionListResponse> => {
      return request.get(`${endpoint}/extensions`);
    },

    getExtensionStatus: async (): Promise<{ summary: any; extensions: ExtensionStatus }> => {
      return request.get(`${endpoint}/extensions/status`);
    },

    getExtensionMetadata: async (): Promise<Record<string, any>> => {
      return request.get(`${endpoint}/extensions/metadata`);
    },

    getExtension: async (name: string): Promise<any> => {
      return request.get(`${endpoint}/extensions/${name}`);
    },

    // Plugin management
    loadPlugin: async (name: string): Promise<ExtensionActionResponse> => {
      return request.post(`${endpoint}/plugins/load?name=${encodeURIComponent(name)}`);
    },

    unloadPlugin: async (name: string): Promise<ExtensionActionResponse> => {
      return request.post(`${endpoint}/plugins/unload?name=${encodeURIComponent(name)}`);
    },

    reloadPlugin: async (name: string): Promise<ExtensionActionResponse> => {
      return request.post(`${endpoint}/plugins/reload?name=${encodeURIComponent(name)}`);
    },

    // Metrics endpoints
    getMetricsSummary: async (): Promise<any> => {
      return request.get(`${endpoint}/metrics/summary`);
    },

    getSystemMetrics: async (): Promise<any> => {
      return request.get(`${endpoint}/metrics/system`);
    },

    getComprehensiveMetrics: async (): Promise<any> => {
      return request.get(`${endpoint}/metrics/comprehensive`);
    },

    getExtensionMetrics: async (): Promise<MetricsResponse> => {
      return request.get(`${endpoint}/metrics/extensions`);
    },

    getSpecificExtensionMetrics: async (name: string): Promise<any> => {
      return request.get(`${endpoint}/metrics/extensions/${name}`);
    },

    getDataMetrics: async (): Promise<any> => {
      return request.get(`${endpoint}/metrics/data`);
    },

    getEventsMetrics: async (): Promise<any> => {
      return request.get(`${endpoint}/metrics/events`);
    },

    getServiceDiscoveryMetrics: async (): Promise<any> => {
      return request.get(`${endpoint}/metrics/service-discovery`);
    },

    getHistoricalMetrics: async (params?: any): Promise<HistoricalMetricsResponse> => {
      const query = new URLSearchParams();
      if (params?.extension) query.append('extension', params.extension);
      if (params?.metric_type) query.append('metric_type', params.metric_type);
      if (params?.start) query.append('start', params.start);
      if (params?.end) query.append('end', params.end);
      if (params?.aggregation) query.append('aggregation', params.aggregation);
      if (params?.interval) query.append('interval', params.interval);
      if (params?.limit) query.append('limit', params.limit.toString());

      return request.get(`${endpoint}/metrics/history?${query}`);
    },

    getLatestMetrics: async (name: string, limit = 100): Promise<LatestMetricsResponse> => {
      return request.get(`${endpoint}/metrics/latest/${name}?limit=${limit}`);
    },

    getStorageStats: async (): Promise<StorageStats> => {
      return request.get(`${endpoint}/metrics/storage`);
    },

    // Health endpoints
    getSystemHealth: async (): Promise<HealthResponse> => {
      return request.get(`${endpoint}/health`);
    },

    getExtensionsHealth: async (): Promise<{ summary: any; extensions: ExtensionStatus }> => {
      return request.get(`${endpoint}/health/extensions`);
    },

    getDataHealth: async (): Promise<DataHealth> => {
      return request.get(`${endpoint}/health/data`);
    },

    getCircuitBreakersStatus: async (): Promise<CircuitBreakerStatus> => {
      return request.get(`${endpoint}/health/circuit-breakers`);
    },

    // System management
    getSystemInfo: async (): Promise<any> => {
      return request.get(`${endpoint}/system/info`);
    },

    refreshCrossServices: async (): Promise<ExtensionActionResponse> => {
      return request.post(`${endpoint}/system/cross-services/refresh`);
    },

    getSystemConfig: async (): Promise<any> => {
      return request.get(`${endpoint}/system/config`);
    }
  })
});

export const {
  getExtensions,
  getExtensionStatus,
  getExtensionMetadata,
  getExtension,
  loadPlugin,
  unloadPlugin,
  reloadPlugin,
  getMetricsSummary,
  getSystemMetrics,
  getComprehensiveMetrics,
  getExtensionMetrics,
  getSpecificExtensionMetrics,
  getDataMetrics,
  getEventsMetrics,
  getServiceDiscoveryMetrics,
  getHistoricalMetrics,
  getLatestMetrics,
  getStorageStats,
  getSystemHealth,
  getExtensionsHealth,
  getDataHealth,
  getCircuitBreakersStatus,
  getSystemInfo,
  refreshCrossServices,
  getSystemConfig
} = extensionApi;
