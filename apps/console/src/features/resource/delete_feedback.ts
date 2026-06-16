import type { ResourceBatchDeleteResult, ResourceFile } from './resource';

export type ResourceDeleteFeedbackStatus = 'deleted' | 'failed' | 'unknown';

export interface ResourceDeleteFeedbackItem {
  key: string;
  file: ResourceFile;
  status: ResourceDeleteFeedbackStatus;
  message?: string;
}

export interface ResourceDeleteFeedback {
  status: 'success' | 'partial' | 'failed';
  total: number;
  successCount: number;
  failureCount: number;
  operationId?: string;
  errors: string[];
  items: ResourceDeleteFeedbackItem[];
}

const errorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallback;
};

export const buildBatchDeleteFeedback = (
  files: ResourceFile[],
  result: ResourceBatchDeleteResult
): ResourceDeleteFeedback => {
  const deletedIds = new Set(result.deleted_ids || []);
  const failedIds = new Set(result.failed_ids || []);
  const errors = (result.errors || []).filter(Boolean);
  const reportedFailureCount = Math.max(0, Number(result.failure_count) || 0);

  const items = files.map(file => {
    if (deletedIds.has(file.id)) {
      return {
        key: file.id,
        file,
        status: 'deleted' as const,
        message: 'Deleted'
      };
    }

    if (failedIds.has(file.id)) {
      const failedIndex = (result.failed_ids || []).findIndex(id => id === file.id);
      return {
        key: file.id,
        file,
        status: 'failed' as const,
        message: errors[failedIndex] || errors[0] || 'Delete failed'
      };
    }

    if (reportedFailureCount > 0) {
      return {
        key: file.id,
        file,
        status: 'unknown' as const,
        message: 'The server did not return an item-level result for this file'
      };
    }

    return {
      key: file.id,
      file,
      status: 'deleted' as const,
      message: 'Deleted'
    };
  });

  const inferredFailures = items.filter(item => item.status !== 'deleted').length;
  const successCount =
    Number(result.success_count) || items.filter(item => item.status === 'deleted').length;
  const failureCount = reportedFailureCount || inferredFailures;
  const status =
    failureCount === 0
      ? 'success'
      : successCount > 0 || items.some(item => item.status === 'deleted')
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

export const buildDeleteErrorFeedback = (
  files: ResourceFile[],
  error: unknown
): ResourceDeleteFeedback => {
  const message = errorMessage(error, 'Delete failed');

  return {
    status: 'failed',
    total: files.length,
    successCount: 0,
    failureCount: files.length,
    errors: [message],
    items: files.map(file => ({
      key: file.id,
      file,
      status: 'failed',
      message
    }))
  };
};

export const getRetryableDeleteFiles = (feedback?: ResourceDeleteFeedback | null) =>
  (feedback?.items || [])
    .filter(item => item.status === 'failed' || item.status === 'unknown')
    .map(item => item.file);
