import type {
  Extension,
  ExtensionMetrics,
  ExtensionStatus,
  ExtensionListResponse,
  ExtensionActionResponse,
  HealthCheckResponse,
  CircuitBreakerStatus,
  MetricSnapshot
} from './extension';

import { createApi } from '@/lib/api/factory';

export const extensionService = createApi<Extension, any, any, any>('/sys/exts', {
  extensions: ({ endpoint, request }) => ({
    // Get all extensions grouped by group and type
    getAllExtensions: async (): Promise<ExtensionListResponse> => {
      return request.get(endpoint);
    },

    // Get extension status
    getExtensionStatus: async (): Promise<ExtensionStatus> => {
      return request.get(`${endpoint}/status`);
    },

    // Get comprehensive metrics
    getMetrics: async (): Promise<ExtensionMetrics> => {
      return request.get(`${endpoint}/metrics`);
    },

    // Get specific metric type (collections, storage, service_cache, data, system, security, resource)
    getMetricsByType: async (type: string): Promise<any> => {
      return request.get(`${endpoint}/metrics/${type}`);
    },

    // Get metrics collections list
    getMetricsCollections: async (): Promise<{
      collections: string[];
      details: { [name: string]: any };
    }> => {
      return request.get(`${endpoint}/metrics/collections`);
    },

    // Get specific collection data
    getCollectionData: async (
      collection: string
    ): Promise<{
      collection: string;
      metrics: MetricSnapshot[];
      last_updated: string;
    }> => {
      return request.get(`${endpoint}/metrics/collections/${collection}`);
    },

    // Query historical metrics
    queryMetrics: async (
      collection: string,
      params: {
        start?: string;
        end?: string;
        limit?: number;
      }
    ): Promise<{
      collection: string;
      start?: string;
      end?: string;
      limit?: number;
      count: number;
      data: MetricSnapshot[];
    }> => {
      const query = new URLSearchParams();
      if (params.start) query.append('start', params.start);
      if (params.end) query.append('end', params.end);
      if (params.limit) query.append('limit', params.limit.toString());

      return request.get(`${endpoint}/metrics/query/${collection}?${query}`);
    },

    // Get metrics snapshot
    getMetricsSnapshot: async (): Promise<{
      [collection: string]: MetricSnapshot[];
    }> => {
      return request.get(`${endpoint}/metrics/snapshot`);
    },

    // Get storage stats
    getStorageStats: async (): Promise<any> => {
      return request.get(`${endpoint}/metrics/storage`);
    },

    // Health endpoints
    getSystemHealth: async (): Promise<HealthCheckResponse> => {
      return request.get(`${endpoint}/health`);
    },

    getDataHealth: async (): Promise<any> => {
      return request.get(`${endpoint}/health/data`);
    },

    getExtensionsHealth: async (): Promise<{
      summary: {
        total: number;
        active: number;
        error: number;
        other: number;
      };
      extensions: { [name: string]: string };
    }> => {
      return request.get(`${endpoint}/health/extensions`);
    },

    getCircuitBreakersStatus: async (): Promise<CircuitBreakerStatus> => {
      return request.get(`${endpoint}/health/circuit-breakers`);
    },

    // Plugin management
    loadExtension: async (name: string): Promise<ExtensionActionResponse> => {
      return request.post(`${endpoint}/load?name=${encodeURIComponent(name)}`);
    },

    unloadExtension: async (name: string): Promise<ExtensionActionResponse> => {
      return request.post(`${endpoint}/unload?name=${encodeURIComponent(name)}`);
    },

    reloadExtension: async (name: string): Promise<ExtensionActionResponse> => {
      return request.post(`${endpoint}/reload?name=${encodeURIComponent(name)}`);
    },

    // Refresh cross services
    refreshCrossServices: async (): Promise<ExtensionActionResponse> => {
      return request.post(`${endpoint}/refresh-cross-services`);
    }
  })
});

export const {
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
} = extensionService;
