import type { ResourceBatchUploadResult, ResourceFile } from './resource';

export type ResourceUploadFeedbackStatus = 'success' | 'failed' | 'unknown';

export interface ResourceUploadQueueFile {
  name: string;
  size: number;
  lastModified: number;
}

export interface ResourceUploadFeedbackItem {
  key: string;
  fileName: string;
  status: ResourceUploadFeedbackStatus;
  message?: string;
  resourceId?: string;
}

export interface ResourceUploadFeedback {
  status: 'success' | 'partial' | 'failed';
  total: number;
  successCount: number;
  failureCount: number;
  operationId?: string;
  errors: string[];
  items: ResourceUploadFeedbackItem[];
}

export const getUploadFileKey = (file: ResourceUploadQueueFile) =>
  `${file.name}:${file.size}:${file.lastModified}`;

const basename = (value?: string) =>
  String(value || '')
    .split(/[\\/]/)
    .filter(Boolean)
    .pop() || '';

const normalizeRef = (value?: string) => String(value || '').trim();

const resourceMatchesFile = (resource: ResourceFile, file: ResourceUploadQueueFile) => {
  const candidates = [
    resource.original_name,
    resource.name,
    resource.path,
    resource.full_path,
    resource.extras?.original_name,
    resource.extras?.filename
  ].filter(Boolean) as string[];

  return candidates.some(candidate => {
    const normalized = normalizeRef(candidate);
    return normalized === file.name || basename(normalized) === file.name;
  });
};

const failedRefMatchesFile = (ref: string, file: ResourceUploadQueueFile) => {
  const normalized = normalizeRef(ref);
  if (!normalized) return false;
  return (
    normalized === getUploadFileKey(file) ||
    normalized === file.name ||
    basename(normalized) === file.name ||
    normalized.includes(file.name)
  );
};

const errorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallback;
};

export const buildBatchUploadFeedback = (
  files: ResourceUploadQueueFile[],
  result: ResourceBatchUploadResult
): ResourceUploadFeedback => {
  const errors = (result.errors || []).filter(Boolean);
  const failedRefs = (result.failed_files || []).filter(Boolean);
  const usedSuccessIndexes = new Set<number>();
  const successFiles = result.files || [];
  const reportedFailureCount = Math.max(0, Number(result.failure_count) || 0);

  const items = files.map(file => {
    const key = getUploadFileKey(file);
    const successIndex = successFiles.findIndex(
      (resource, index) => !usedSuccessIndexes.has(index) && resourceMatchesFile(resource, file)
    );

    if (successIndex >= 0) {
      usedSuccessIndexes.add(successIndex);
      return {
        key,
        fileName: file.name,
        status: 'success' as const,
        resourceId: successFiles[successIndex].id,
        message: 'Uploaded'
      };
    }

    const failedIndex = failedRefs.findIndex(ref => failedRefMatchesFile(ref, file));
    if (failedIndex >= 0) {
      return {
        key,
        fileName: file.name,
        status: 'failed' as const,
        message: errors[failedIndex] || errors[0] || 'Upload failed'
      };
    }

    if (reportedFailureCount > 0 && (result.success_count || 0) === 0) {
      return {
        key,
        fileName: file.name,
        status: 'failed' as const,
        message: errors[0] || 'Upload failed'
      };
    }

    if (reportedFailureCount > 0) {
      return {
        key,
        fileName: file.name,
        status: 'unknown' as const,
        message: 'The server did not return an item-level result for this file'
      };
    }

    return {
      key,
      fileName: file.name,
      status: 'success' as const,
      message: 'Uploaded'
    };
  });

  const inferredFailures = items.filter(item => item.status !== 'success').length;
  const successCount =
    Number(result.success_count) || items.filter(item => item.status === 'success').length;
  const failureCount = reportedFailureCount || inferredFailures;
  const status =
    failureCount === 0
      ? 'success'
      : successCount > 0 || items.some(item => item.status === 'success')
        ? 'partial'
        : 'failed';

  return {
    status,
    total: Number(result.total_files) || files.length,
    successCount,
    failureCount,
    operationId: result.operation_id,
    errors,
    items
  };
};

export const buildUploadErrorFeedback = (
  files: ResourceUploadQueueFile[],
  error: unknown
): ResourceUploadFeedback => {
  const message = errorMessage(error, 'Upload failed');

  return {
    status: 'failed',
    total: files.length,
    successCount: 0,
    failureCount: files.length,
    errors: [message],
    items: files.map(file => ({
      key: getUploadFileKey(file),
      fileName: file.name,
      status: 'failed',
      message
    }))
  };
};
