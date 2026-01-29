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

const ensureOwnerIdFormData = (data: FormData, params?: Record<string, any>) => {
  if (data.has('owner_id')) return data;
  const ownerId = resolveOwnerId(params);
  if (ownerId) {
    data.append('owner_id', ownerId);
  }
  return data;
};

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Download
  download: (slug: string): Promise<Blob> => {
    return request.get(`${endpoint}/${slug}/download`, { responseType: 'blob' });
  },

  // Search
  search: (params: Record<string, any>): Promise<ResourceFile[]> => {
    const query = new URLSearchParams(params).toString();
    return request.get(`${endpoint}/search?${query}`);
  },

  // Versions
  getVersions: (slug: string): Promise<FileVersion[]> => {
    return request.get(`${endpoint}/${slug}/versions`);
  },

  createVersion: (slug: string, data: FormData): Promise<FileVersion> => {
    return request.post(`${endpoint}/${slug}/versions`, data);
  },

  // Share
  shareFile: (
    slug: string,
    payload: { access_level: string; expires_at?: number }
  ): Promise<ShareLink> => {
    return request.post(`${endpoint}/${slug}/share`, payload);
  },

  updateAccess: (slug: string, payload: { access_level: string }): Promise<ResourceFile> => {
    return request.put(`${endpoint}/${slug}/access`, payload);
  },

  // Thumbnail
  getThumbnail: (slug: string): Promise<string> => {
    return request.get(`${endpoint}/thumb/${slug}`);
  },

  // Batch
  batchUpload: (data: FormData, params?: Record<string, any>): Promise<ResourceFile[]> => {
    return request.post(`${endpoint}/batch/upload`, ensureOwnerIdFormData(data, params));
  },

  batchDelete: (ids: string[], params?: Record<string, any>): Promise<void> => {
    const finalParams = withOwnerId(params) || {};
    return request.post(`${endpoint}/batch/delete`, { ids, ...finalParams });
  },

  // Quota
  getQuota: (): Promise<ResourceQuota> => {
    return request.get(`${endpoint}/quota`);
  },

  getUsage: (): Promise<{ usage: number; file_count: number }> => {
    return request.get(`${endpoint}/usage`);
  },

  // Admin
  getAdminFiles: (params: Record<string, any>): Promise<any> => {
    const query = new URLSearchParams(params).toString();
    return request.get(`${endpoint}/admin/files?${query}`);
  },

  getAdminStats: (): Promise<StorageStats> => {
    return request.get(`${endpoint}/admin/stats`);
  },

  batchCleanup: (payload: { type: string; dry_run?: boolean }): Promise<any> => {
    return request.post(`${endpoint}/admin/batch/cleanup`, payload);
  },

  // Upload (multipart)
  upload: (data: FormData, params?: Record<string, any>): Promise<ResourceFile> => {
    return request.post(endpoint, ensureOwnerIdFormData(data, params));
  }
});

export const resourceApi = createApi<ResourceFile>('/res', {
  list: (params, ctx) => {
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
