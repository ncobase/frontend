import type {
  Extension,
  ExtensionMetrics,
  ExtensionStatus,
  ExtensionListResponse
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

    // Load an extension
    loadExtension: async (name: string): Promise<{ message: string }> => {
      return request.post(`${endpoint}/load?name=${name}`);
    },

    // Unload an extension
    unloadExtension: async (name: string): Promise<{ message: string }> => {
      return request.post(`${endpoint}/unload?name=${name}`);
    },

    // Reload an extension
    reloadExtension: async (name: string): Promise<{ message: string }> => {
      return request.post(`${endpoint}/reload?name=${name}`);
    },

    // Refresh cross services
    refreshCrossServices: async (): Promise<{ message: string }> => {
      return request.post(`${endpoint}/refresh-cross-services`);
    },

    // Get comprehensive metrics
    getMetrics: async (): Promise<ExtensionMetrics> => {
      return request.get(`${endpoint}/metrics`);
    },

    // Get specific metric type
    getMetricsByType: async (type: string): Promise<any> => {
      return request.get(`${endpoint}/metrics/${type}`);
    }
  })
});

export const getAllExtensions = extensionService.getAllExtensions;
export const getExtensionStatus = extensionService.getExtensionStatus;
export const loadExtension = extensionService.loadExtension;
export const unloadExtension = extensionService.unloadExtension;
export const reloadExtension = extensionService.reloadExtension;
export const refreshCrossServices = extensionService.refreshCrossServices;
export const getMetrics = extensionService.getMetrics;
export const getMetricsByType = extensionService.getMetricsByType;
