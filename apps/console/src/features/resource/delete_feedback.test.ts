import { describe, expect, it } from 'vitest';

import {
  buildBatchDeleteFeedback,
  buildDeleteErrorFeedback,
  getRetryableDeleteFiles
} from './delete_feedback';
import type { ResourceFile } from './resource';

const resourceFile = (id: string): ResourceFile => ({
  id,
  name: `${id}.png`,
  original_name: `${id}.png`,
  path: `/uploads/${id}.png`,
  type: 'image/png'
});

describe('resource delete feedback', () => {
  it('marks all files deleted when the batch result has no failures', () => {
    const files = [resourceFile('file-1'), resourceFile('file-2')];

    const feedback = buildBatchDeleteFeedback(files, {
      total_files: 2,
      success_count: 2,
      failure_count: 0,
      deleted_ids: ['file-1', 'file-2']
    });

    expect(feedback.status).toBe('success');
    expect(feedback.items.every(item => item.status === 'deleted')).toBe(true);
    expect(getRetryableDeleteFiles(feedback)).toHaveLength(0);
  });

  it('keeps failed ids retryable with item-level messages', () => {
    const files = [resourceFile('file-1'), resourceFile('file-2')];

    const feedback = buildBatchDeleteFeedback(files, {
      total_files: 2,
      success_count: 1,
      failure_count: 1,
      deleted_ids: ['file-1'],
      failed_ids: ['file-2'],
      errors: ['Failed to delete file file-2: locked']
    });

    expect(feedback.status).toBe('partial');
    expect(feedback.items).toEqual([
      expect.objectContaining({ key: 'file-1', status: 'deleted' }),
      expect.objectContaining({
        key: 'file-2',
        status: 'failed',
        message: 'Failed to delete file file-2: locked'
      })
    ]);
    expect(getRetryableDeleteFiles(feedback)).toEqual([files[1]]);
  });

  it('marks unmatched files as unknown when aggregate failures lack failed ids', () => {
    const files = [resourceFile('file-1'), resourceFile('file-2')];

    const feedback = buildBatchDeleteFeedback(files, {
      total_files: 2,
      success_count: 1,
      failure_count: 1,
      deleted_ids: ['file-1'],
      errors: ['one file failed']
    });

    expect(feedback.status).toBe('partial');
    expect(feedback.items).toEqual([
      expect.objectContaining({ key: 'file-1', status: 'deleted' }),
      expect.objectContaining({ key: 'file-2', status: 'unknown' })
    ]);
  });

  it('turns request errors into per-file failed feedback', () => {
    const files = [resourceFile('file-1'), resourceFile('file-2')];

    const feedback = buildDeleteErrorFeedback(files, new Error('network unavailable'));

    expect(feedback.status).toBe('failed');
    expect(feedback.failureCount).toBe(2);
    expect(feedback.items.every(item => item.status === 'failed')).toBe(true);
    expect(feedback.errors).toEqual(['network unavailable']);
  });
});
