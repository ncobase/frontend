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

export interface ResourceDeleteImpactMedia {
  id: string;
  title?: string;
  type?: 'image' | 'video' | 'audio' | 'file' | string;
  resource_id?: string;
  url?: string;
  path?: string;
  mime_type?: string;
  size?: number;
  description?: string;
  alt?: string;
  space_id?: string;
  owner_id?: string;
  metadata?: Record<string, any>;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface ResourceDeleteImpactTopicMedia {
  id: string;
  topic_id?: string;
  media_id?: string;
  type?: 'featured' | 'gallery' | 'attachment' | string;
  order?: number;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface ResourceDeleteImpactTopic {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  content_type?: string;
  status?: number;
  featured_media?: string;
  tags?: string[];
  space_id?: string;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface ResourceDeleteImpactTopicReference {
  media?: ResourceDeleteImpactMedia;
  relation?: ResourceDeleteImpactTopicMedia;
  topic?: ResourceDeleteImpactTopic;
}

export interface ResourceDeleteImpact {
  file: ResourceFile;
  media_references: ResourceDeleteImpactMedia[];
  topic_references: ResourceDeleteImpactTopicReference[];
  media_reference_total: number;
  topic_reference_total: number;
  media_references_complete: boolean;
  topic_references_complete: boolean;
  errors: string[];
  can_delete: boolean;
}

export interface ResourceDeleteImpactSummary {
  file_count: number;
  referenced_file_count: number;
  media_reference_count: number;
  topic_reference_count: number;
  error_count: number;
  can_delete: boolean;
}

export interface ResourceDeleteImpactResponse {
  impacts: ResourceDeleteImpact[];
  summary: ResourceDeleteImpactSummary;
}

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

export interface ResourceProcessingOptions {
  create_thumbnail?: boolean;
  resize_image?: boolean;
  max_width?: number;
  max_height?: number;
  compress_image?: boolean;
  compression_quality?: number;
  convert_format?: string;
}

export interface ResourceUploadOptions {
  access_level: ResourceAccessLevel;
  is_public?: boolean;
  path_prefix?: string;
  tags?: string[];
  expires_at?: number;
  processing_options?: ResourceProcessingOptions;
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

export interface ResourceBatchDeleteResult {
  operation_id?: string;
  total_files: number;
  success_count: number;
  failure_count: number;
  deleted_ids: string[];
  failed_ids?: string[];
  errors?: string[];
}

export interface ResourceBatchStatus {
  operation_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial_failure' | string;
  progress: number;
  message?: string;
  started_at: number;
  completed_at?: number;
}

export interface ResourceUploadPolicy {
  max_upload_size: number;
  allowed_types: string[];
  default_storage: string;
}

export interface ResourceImagePolicy {
  enable_thumbnails: boolean;
  default_thumbnail_width: number;
  default_thumbnail_height: number;
  enable_resizing: boolean;
  max_image_width: number;
  max_image_height: number;
  compression_quality: number;
}

export interface ResourceQuotaPolicy {
  enable_quotas: boolean;
  enable_enforcement: boolean;
  default_quota: number;
  warning_threshold: number;
  quota_check_interval: string;
}

export interface ResourceStoragePolicy {
  default_provider: string;
  allow_public_links: boolean;
  require_owner_scope: boolean;
  audit_downloads: boolean;
}

export interface ResourceRuntimePolicy {
  upload: ResourceUploadPolicy;
  image: ResourceImagePolicy;
  quota: ResourceQuotaPolicy;
  storage: ResourceStoragePolicy;
  errors?: string[];
}

export interface StorageStats {
  total_size: number;
  total_files: number;
  total_users: number;
  by_category: Record<string, number>;
  by_storage: Record<string, number>;
  daily_uploads?: Array<{
    date: string;
    count: number;
    size: number;
  }>;
  top_users?: Array<{
    user_id: string;
    size: number;
    files: number;
  }>;
  storage_health: string;
}

export interface StorageHealthCheck {
  name: string;
  status: 'ok' | 'warning' | 'error' | string;
  message?: string;
  last_run?: number;
}

export interface StorageHealth {
  status: 'healthy' | 'warning' | 'critical' | string;
  total_space: number;
  used_space: number;
  free_space: number;
  usage_percent: number;
  orphaned_files: number;
  corrupted_files: number;
  health_checks: StorageHealthCheck[];
  recommendations?: string[];
}

export interface BatchCleanupResult {
  job_id: string;
  type: string;
  items_found: number;
  items_cleaned: number;
  space_freed: number;
  potential_space_freed?: number;
  dry_run: boolean;
  candidate_items?: string[];
  cleaned_items?: string[];
  errors?: string[];
}

export interface BatchJob {
  id: string;
  type: string;
  status: string;
  progress: number;
  item_count: number;
  processed_count: number;
  error_count: number;
  started_at: number;
  completed_at?: number;
  created_by?: string;
  result?: Record<string, any>;
  errors?: string[];
}

export interface BatchJobListResponse {
  jobs: BatchJob[];
  total: number;
}

export interface OptimizeResult {
  task_id: string;
  mode?: 'analysis' | 'executed' | string;
  deduplicated_files: number;
  space_freed: number;
  orphaned_cleaned: number;
  indexes_rebuilt: number;
  potential_duplicate_files?: number;
  potential_space_freed?: number;
  orphaned_files?: number;
  performed_actions?: string[];
  duration: number;
}

export interface ShareLink {
  url: string;
  access_level: string;
  expires_in?: string;
  expires_at?: number | string;
}
