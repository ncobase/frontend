import type { ResourceRuntimePolicy, ResourceUsage } from './resource';
import { DEFAULT_RESOURCE_RUNTIME_POLICY } from './resource_policy';
import {
  isResourceFileTypeAllowed,
  normalizeAllowedResourceTypes,
  RESOURCE_MAX_UPLOAD_BYTES
} from './upload_payload';

export type VersionUploadRejectionCode = 'empty' | 'too_large' | 'type' | 'quota';

export interface VersionUploadRejection {
  code: VersionUploadRejectionCode;
  limitBytes?: number;
  availableBytes?: number;
}

export const getVersionUploadRejection = (
  file: Pick<File, 'name' | 'size' | 'type'>,
  policy?: ResourceRuntimePolicy,
  usage?: ResourceUsage | null
): VersionUploadRejection | null => {
  const runtimePolicy = policy || DEFAULT_RESOURCE_RUNTIME_POLICY;
  const maxUploadBytes = Math.max(
    1,
    Number(runtimePolicy.upload.max_upload_size) || RESOURCE_MAX_UPLOAD_BYTES
  );
  const allowedTypes = normalizeAllowedResourceTypes(runtimePolicy.upload.allowed_types);

  if (file.size <= 0) {
    return { code: 'empty' };
  }

  if (file.size > maxUploadBytes) {
    return { code: 'too_large', limitBytes: maxUploadBytes };
  }

  if (!isResourceFileTypeAllowed(file, allowedTypes)) {
    return { code: 'type' };
  }

  const quotaEnabled = runtimePolicy.quota.enable_quotas !== false;
  const quotaEnforced = quotaEnabled && runtimePolicy.quota.enable_enforcement !== false;
  const availableBytes =
    usage && usage.quota > 0
      ? Math.max(Number(usage.quota) - Number(usage.usage || 0), 0)
      : undefined;

  if (
    quotaEnforced &&
    (usage?.quota_exceeded || (availableBytes !== undefined && file.size > availableBytes))
  ) {
    return { code: 'quota', availableBytes };
  }

  return null;
};
