import { useQuery } from '@tanstack/react-query';

import type { ResourceRuntimePolicy } from './resource';

import type { Option } from '@/features/system/option/option';
import {
  parseRuntimeOptionValue,
  RUNTIME_OPTION_DEFINITION_BY_NAME,
  type RuntimeOptionName,
  type RuntimeOptionValue
} from '@/features/system/option/runtime/options';

export const RESOURCE_POLICY_OPTION_NAMES = [
  'resource.upload',
  'resource.image',
  'resource.quota',
  'system.storage_policy'
] as const;

export type ResourcePolicyOptionName = (typeof RESOURCE_POLICY_OPTION_NAMES)[number];

export const DEFAULT_RESOURCE_RUNTIME_POLICY: ResourceRuntimePolicy = {
  upload: {
    max_upload_size: 5368709120,
    allowed_types: ['*'],
    default_storage: 'configured'
  },
  image: {
    enable_thumbnails: true,
    default_thumbnail_width: 300,
    default_thumbnail_height: 300,
    enable_resizing: true,
    max_image_width: 2048,
    max_image_height: 2048,
    compression_quality: 85
  },
  quota: {
    enable_quotas: true,
    enable_enforcement: true,
    default_quota: 10737418240,
    warning_threshold: 0.8,
    quota_check_interval: '24h'
  },
  storage: {
    default_provider: 'configured',
    allow_public_links: true,
    require_owner_scope: true,
    audit_downloads: true
  }
};

const asNumber = (value: RuntimeOptionValue[string], fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const asBoolean = (value: RuntimeOptionValue[string], fallback: boolean) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

const asString = (value: RuntimeOptionValue[string], fallback: string) => {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
};

const asStringList = (value: RuntimeOptionValue[string], fallback: string[]) => {
  if (Array.isArray(value)) {
    const items = value.map(item => String(item).trim()).filter(Boolean);
    return items.length > 0 ? items : fallback;
  }
  const items = String(value || '')
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
};

const parsePolicyOption = (
  name: ResourcePolicyOptionName,
  options?: Partial<Record<ResourcePolicyOptionName, Option>>
) => {
  const definition = RUNTIME_OPTION_DEFINITION_BY_NAME[name as RuntimeOptionName];
  return parseRuntimeOptionValue(definition, options?.[name]);
};

export const buildResourceRuntimePolicy = (
  options?: Partial<Record<ResourcePolicyOptionName, Option>>
): ResourceRuntimePolicy => {
  const upload = parsePolicyOption('resource.upload', options);
  const image = parsePolicyOption('resource.image', options);
  const quota = parsePolicyOption('resource.quota', options);
  const storage = parsePolicyOption('system.storage_policy', options);

  const errors = [
    upload.parseError && `resource.upload: ${upload.parseError}`,
    image.parseError && `resource.image: ${image.parseError}`,
    quota.parseError && `resource.quota: ${quota.parseError}`,
    storage.parseError && `system.storage_policy: ${storage.parseError}`
  ].filter(Boolean) as string[];

  return {
    upload: {
      max_upload_size: asNumber(
        upload.value.max_upload_size,
        DEFAULT_RESOURCE_RUNTIME_POLICY.upload.max_upload_size
      ),
      allowed_types: asStringList(
        upload.value.allowed_types,
        DEFAULT_RESOURCE_RUNTIME_POLICY.upload.allowed_types
      ),
      default_storage: asString(
        upload.value.default_storage,
        DEFAULT_RESOURCE_RUNTIME_POLICY.upload.default_storage
      )
    },
    image: {
      enable_thumbnails: asBoolean(
        image.value.enable_thumbnails,
        DEFAULT_RESOURCE_RUNTIME_POLICY.image.enable_thumbnails
      ),
      default_thumbnail_width: asNumber(
        image.value.default_thumbnail_width,
        DEFAULT_RESOURCE_RUNTIME_POLICY.image.default_thumbnail_width
      ),
      default_thumbnail_height: asNumber(
        image.value.default_thumbnail_height,
        DEFAULT_RESOURCE_RUNTIME_POLICY.image.default_thumbnail_height
      ),
      enable_resizing: asBoolean(
        image.value.enable_resizing,
        DEFAULT_RESOURCE_RUNTIME_POLICY.image.enable_resizing
      ),
      max_image_width: asNumber(
        image.value.max_image_width,
        DEFAULT_RESOURCE_RUNTIME_POLICY.image.max_image_width
      ),
      max_image_height: asNumber(
        image.value.max_image_height,
        DEFAULT_RESOURCE_RUNTIME_POLICY.image.max_image_height
      ),
      compression_quality: asNumber(
        image.value.compression_quality,
        DEFAULT_RESOURCE_RUNTIME_POLICY.image.compression_quality
      )
    },
    quota: {
      enable_quotas: asBoolean(
        quota.value.enable_quotas,
        DEFAULT_RESOURCE_RUNTIME_POLICY.quota.enable_quotas
      ),
      enable_enforcement: asBoolean(
        quota.value.enable_enforcement,
        DEFAULT_RESOURCE_RUNTIME_POLICY.quota.enable_enforcement
      ),
      default_quota: asNumber(
        quota.value.default_quota,
        DEFAULT_RESOURCE_RUNTIME_POLICY.quota.default_quota
      ),
      warning_threshold: asNumber(
        quota.value.warning_threshold,
        DEFAULT_RESOURCE_RUNTIME_POLICY.quota.warning_threshold
      ),
      quota_check_interval: asString(
        quota.value.quota_check_interval,
        DEFAULT_RESOURCE_RUNTIME_POLICY.quota.quota_check_interval
      )
    },
    storage: {
      default_provider: asString(
        storage.value.default_provider,
        DEFAULT_RESOURCE_RUNTIME_POLICY.storage.default_provider
      ),
      allow_public_links: asBoolean(
        storage.value.allow_public_links,
        DEFAULT_RESOURCE_RUNTIME_POLICY.storage.allow_public_links
      ),
      require_owner_scope: asBoolean(
        storage.value.require_owner_scope,
        DEFAULT_RESOURCE_RUNTIME_POLICY.storage.require_owner_scope
      ),
      audit_downloads: asBoolean(
        storage.value.audit_downloads,
        DEFAULT_RESOURCE_RUNTIME_POLICY.storage.audit_downloads
      )
    },
    errors
  };
};

export const useResourceRuntimePolicy = (enabled = true) =>
  useQuery({
    queryKey: ['resourceService', 'runtime-policy', RESOURCE_POLICY_OPTION_NAMES.join(',')],
    queryFn: async () => {
      const { batchGetByNames } = await import('@/features/system/option/apis');
      return (await batchGetByNames([...RESOURCE_POLICY_OPTION_NAMES])) as Partial<
        Record<ResourcePolicyOptionName, Option>
      >;
    },
    select: buildResourceRuntimePolicy,
    staleTime: 60 * 1000,
    enabled
  });
