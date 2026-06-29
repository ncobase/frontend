import { isBrowser, locals, buildQueryString } from '@ncobase/utils';

import {
  ResourceBatchUploadResult,
  ResourceBatchDeleteResult,
  ResourceBatchStatus,
  ResourceDeleteImpact,
  ResourceDeleteImpactResponse,
  ResourceFile,
  StorageStats,
  StorageHealth,
  BatchCleanupResult,
  BatchJobListResponse,
  OptimizeResult,
  ResourceQuota,
  ResourceUsage,
  ShareLink,
  ResourceProcessingOptions
} from './resource';
import { normalizeResourceTags } from './upload_payload';

import { ACCESS_TOKEN_KEY } from '@/features/account/context';
import { tokenService } from '@/features/account/token_service';
import { ApiContext, createApi } from '@/lib/api/factory';
import { assertRequiredApiArray, assertRequiredApiValue } from '@/lib/api/guards';

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
    return request.get(`${endpoint}/${assertRequiredApiValue(slug, 'Resource slug')}/download`, {
      responseType: 'blob'
    });
  },

  // Search
  search: (params: Record<string, any>): Promise<ResourceFile[]> => {
    const query = new URLSearchParams(params).toString();
    return request.get(`${endpoint}/search?${query}`);
  },

  // Versions
  getVersions: (slug: string): Promise<ResourceFile[]> => {
    return request.get(`${endpoint}/${assertRequiredApiValue(slug, 'Resource slug')}/versions`);
  },

  createVersion: (slug: string, data: FormData): Promise<ResourceFile> => {
    return request.post(
      `${endpoint}/${assertRequiredApiValue(slug, 'Resource slug')}/versions`,
      data
    );
  },

  // Share
  shareFile: (
    slug: string,
    payload: { access_level: string; expiration_hours?: number }
  ): Promise<ShareLink> => {
    return request.post(
      `${endpoint}/${assertRequiredApiValue(slug, 'Resource slug')}/share`,
      payload
    );
  },

  updateAccess: (slug: string, payload: { access_level: string }): Promise<ResourceFile> => {
    return request.put(
      `${endpoint}/${assertRequiredApiValue(slug, 'Resource slug')}/access`,
      payload
    );
  },

  // Thumbnail
  getThumbnail: (slug: string): Promise<string> => {
    return request.get(`${endpoint}/thumb/${assertRequiredApiValue(slug, 'Resource slug')}`);
  },

  createThumbnail: (slug: string, options: ResourceProcessingOptions): Promise<ResourceFile> => {
    return request.post(
      `${endpoint}/${assertRequiredApiValue(slug, 'Resource slug')}/thumbnail`,
      options
    );
  },

  // Batch
  batchUpload: (
    data: FormData,
    params?: Record<string, any>
  ): Promise<ResourceBatchUploadResult> => {
    return request.post(`${endpoint}/batch/upload`, ensureOwnerIdFormData(data, params));
  },

  batchProcess: (
    ids: string[],
    options?: ResourceProcessingOptions,
    params?: Record<string, any>
  ): Promise<ResourceFile[]> => {
    const finalParams = withOwnerId(params) || {};
    return request.post(`${endpoint}/batch/process`, {
      ids: assertRequiredApiArray(ids, 'Resource IDs'),
      options,
      ...finalParams
    });
  },

  batchDelete: (
    ids: string[],
    params?: Record<string, any>
  ): Promise<ResourceBatchDeleteResult> => {
    const finalParams = withOwnerId(params) || {};
    return request.post(`${endpoint}/batch/delete`, {
      ids: assertRequiredApiArray(ids, 'Resource IDs'),
      ...finalParams
    });
  },

  getBatchStatus: (jobId: string): Promise<ResourceBatchStatus> => {
    return request.get(`${endpoint}/status/${assertRequiredApiValue(jobId, 'Batch job ID')}`);
  },

  getDeleteImpact: (slug: string): Promise<ResourceDeleteImpact> => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(slug, 'Resource slug')}/delete-impact`
    );
  },

  getBatchDeleteImpact: (ids: string[]): Promise<ResourceDeleteImpactResponse> => {
    return request.post(`${endpoint}/delete-impact`, {
      ids: assertRequiredApiArray(ids, 'Resource IDs')
    });
  },

  // Quota
  getQuota: (): Promise<ResourceQuota> => {
    return request.get(`${endpoint}/quota`);
  },

  getUsage: (): Promise<ResourceUsage> => {
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

  batchCleanup: (payload: {
    type: string;
    dry_run?: boolean;
    max_items?: number;
  }): Promise<BatchCleanupResult> => {
    return request.post(`${endpoint}/admin/batch/cleanup`, payload);
  },

  listBatchJobs: (params: Record<string, any> = {}): Promise<BatchJobListResponse> => {
    const query = new URLSearchParams(params).toString();
    return request.get(`${endpoint}/admin/batch/jobs${query ? `?${query}` : ''}`);
  },

  optimizeStorage: (): Promise<OptimizeResult> => {
    return request.post(`${endpoint}/admin/storage/optimize`);
  },

  getStorageHealth: (): Promise<StorageHealth> => {
    return request.get(`${endpoint}/admin/storage/health`);
  },

  // Upload (multipart)
  upload: (data: FormData, params?: Record<string, any>): Promise<ResourceFile> => {
    return request.post(endpoint, ensureOwnerIdFormData(data, params));
  }
});

export const resourceApi = createApi<ResourceFile>('/res', {
  update: (payload, ctx) => {
    const data = new FormData();
    const append = (key: string, value: unknown) => {
      if (value === undefined || value === null || value === '') return;
      data.append(key, String(value));
    };

    append('name', payload.name);
    append('original_name', payload.original_name);
    append('access_level', payload.access_level);
    if (typeof payload.is_public === 'boolean') {
      data.append('is_public', payload.is_public ? 'true' : 'false');
    }
    append('expires_at', payload.expires_at);

    if (Array.isArray(payload.tags) || typeof payload.tags === 'string') {
      const tags = normalizeResourceTags(payload.tags as string[] | string);
      data.append('tags', tags.join(','));
    }

    return ctx.request.put(
      `${ctx.endpoint}/${assertRequiredApiValue(payload.id, 'Resource ID')}`,
      data
    );
  },
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
  createThumbnail,
  batchUpload,
  batchProcess,
  batchDelete,
  getBatchStatus,
  getDeleteImpact,
  getBatchDeleteImpact,
  getQuota,
  getUsage,
  getAdminFiles,
  getAdminStats,
  batchCleanup,
  listBatchJobs,
  optimizeStorage,
  getStorageHealth,
  upload
} = resourceApi;
