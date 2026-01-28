import { isBrowser, locals, buildQueryString } from '@ncobase/utils';

import { ResourceFile, StorageStats, ResourceQuota, FileVersion, ShareLink } from './resource';

import { ACCESS_TOKEN_KEY } from '@/features/account/context';
import { tokenService } from '@/features/account/token_service';
import { ApiContext, createApi } from '@/lib/api/factory';

const resolveOwnerId = (params?: Record<string, any>) => {
  const explicitOwnerId = params?.owner_id;
  if (explicitOwnerId !== undefined && explicitOwnerId !== null && `${explicitOwnerId}` !== '') {
    return explicitOwnerId;
  }

  if (!isBrowser) return undefined;

  const token = locals.get(ACCESS_TOKEN_KEY);
  if (!token) return undefined;

  return tokenService.getUserIdFromToken(token) || undefined;
};

const withOwnerId = (params?: Record<string, any>) => {
  const ownerId = resolveOwnerId(params);
  if (!ownerId) return params;
  return {
    ...params,
    owner_id: ownerId
  };
};

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Download
  download: async (slug: string): Promise<Blob> => {
    return request.get(`${endpoint}/${slug}/download`, { responseType: 'blob' });
  },

  // Search
  search: async (params: Record<string, any>): Promise<ResourceFile[]> => {
    const query = new URLSearchParams(params).toString();
    return request.get(`${endpoint}/search?${query}`);
  },

  // Versions
  getVersions: async (slug: string): Promise<FileVersion[]> => {
    return request.get(`${endpoint}/${slug}/versions`);
  },

  createVersion: async (slug: string, data: FormData): Promise<FileVersion> => {
    return request.post(`${endpoint}/${slug}/versions`, data);
  },

  // Share
  shareFile: async (
    slug: string,
    payload: { access_level: string; expires_at?: number }
  ): Promise<ShareLink> => {
    return request.post(`${endpoint}/${slug}/share`, payload);
  },

  updateAccess: async (slug: string, payload: { access_level: string }): Promise<ResourceFile> => {
    return request.put(`${endpoint}/${slug}/access`, payload);
  },

  // Thumbnail
  getThumbnail: async (slug: string): Promise<string> => {
    return request.get(`${endpoint}/thumb/${slug}`);
  },

  // Batch
  batchUpload: async (data: FormData): Promise<ResourceFile[]> => {
    return request.post(`${endpoint}/batch/upload`, data);
  },

  batchDelete: async (ids: string[]): Promise<void> => {
    return request.post(`${endpoint}/batch/delete`, { ids });
  },

  // Quota
  getQuota: async (): Promise<ResourceQuota> => {
    return request.get(`${endpoint}/quota`);
  },

  getUsage: async (): Promise<{ usage: number; file_count: number }> => {
    return request.get(`${endpoint}/usage`);
  },

  // Admin
  getAdminFiles: async (params: Record<string, any>): Promise<any> => {
    const query = new URLSearchParams(params).toString();
    return request.get(`${endpoint}/admin/files?${query}`);
  },

  getAdminStats: async (): Promise<StorageStats> => {
    return request.get(`${endpoint}/admin/stats`);
  },

  batchCleanup: async (payload: { type: string; dry_run?: boolean }): Promise<any> => {
    return request.post(`${endpoint}/admin/batch/cleanup`, payload);
  },

  // Upload (multipart)
  upload: async (data: FormData): Promise<ResourceFile> => {
    return request.post(endpoint, data);
  }
});

export const resourceApi = createApi<ResourceFile>('/res', {
  list: async (params, ctx) => {
    const finalParams = withOwnerId(params);
    const queryString = finalParams ? buildQueryString(finalParams) : '';
    return ctx.request.get(`${ctx.endpoint}${queryString ? `?${queryString}` : ''}`);
  },
  extensions: extensionMethods
});

export const {
  create: createResource,
  get: getResource,
  update: updateResource,
  delete: deleteResource,
  list: listResources,
  download,
  search: searchResources,
  getVersions,
  createVersion,
  shareFile,
  updateAccess,
  getThumbnail,
  batchUpload,
  batchDelete,
  getQuota,
  getUsage,
  getAdminFiles,
  getAdminStats,
  batchCleanup,
  upload
} = resourceApi;
