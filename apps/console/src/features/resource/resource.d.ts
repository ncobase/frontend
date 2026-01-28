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
  user_id: string;
  quota: number;
  usage: number;
  usage_percent: number;
  file_count: number;
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
  id: string;
  file_id: string;
  url: string;
  access_level: string;
  expires_at?: number;
  created_at: number;
}
