import { PaginationResult } from '@ncobase/react';

export interface ResourceFile {
  id: string;
  name: string;
  original_name?: string;
  path: string;
  type: string;
  size?: number;
  storage?: string;
  bucket?: string;
  endpoint?: string;
  access_level?: 'public' | 'private' | 'shared';
  expires_at?: number;
  tags?: string[];
  is_public?: boolean;
  category?: 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';
  download_url?: string;
  thumbnail_url?: string;
  is_expired?: boolean;
  hash?: string;
  owner_id?: string;
  extras?: Record<string, any>;
  created_by?: string;
  updated_by?: string;
  created_at?: number;
  updated_at?: number;
  full_path?: string;
}

export type ResourceFileListResponse = PaginationResult<ResourceFile>;

export interface ResourceQuota {
  quota: number;
}

export interface ResourceUsage {
  user_id?: string;
  usage: number;
  quota: number;
  usage_percent: number;
  quota_exceeded?: boolean;
  formatted_usage?: string;
  formatted_quota?: string;
  file_count: number;
}

export type ResourceAccessLevel = 'public' | 'private' | 'shared';

export interface ResourceUploadOptions {
  access_level: ResourceAccessLevel;
  is_public?: boolean;
  path_prefix?: string;
  tags?: string[];
  expires_at?: number;
  processing_options?: {
    create_thumbnail?: boolean;
    resize_image?: boolean;
    max_width?: number;
    max_height?: number;
    compress_image?: boolean;
    compression_quality?: number;
    convert_format?: string;
  };
}

export interface ResourceUploadSubmission {
  files: File[];
  options: ResourceUploadOptions;
}

export interface ResourceBatchUploadResult {
  operation_id?: string;
  total_files: number;
  success_count: number;
  failure_count: number;
  files: ResourceFile[];
  failed_files?: string[];
  errors?: string[];
}

export interface StorageStats {
  total_size: number;
  total_files: number;
  total_users: number;
  by_category: Record<string, number>;
  by_storage: Record<string, number>;
  storage_health: string;
}

export interface FileVersion {
  id: string;
  file_id: string;
  version: number;
  size: number;
  hash: string;
  created_at: number;
  created_by: string;
}

export interface ShareLink {
  url: string;
  access_level: string;
  expires_in?: string;
  expires_at?: number | string;
}
