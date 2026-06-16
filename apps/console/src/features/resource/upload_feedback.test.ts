import { describe, expect, it } from 'vitest';

import {
  buildBatchUploadFeedback,
  buildUploadErrorFeedback,
  getUploadFileKey,
  type ResourceUploadQueueFile
} from './upload_feedback';

const queueFile = (name: string, size = 100): ResourceUploadQueueFile => ({
  name,
  size,
  lastModified: 1
});

describe('resource upload feedback', () => {
  it('marks all files successful when the batch upload result has no failures', () => {
    const files = [queueFile('a.png'), queueFile('b.png')];

    const feedback = buildBatchUploadFeedback(files, {
      total_files: 2,
      success_count: 2,
      failure_count: 0,
      files: [
        {
          id: 'res-a',
          name: 'stored-a',
          original_name: 'a.png',
          path: '/a.png',
          type: 'image/png'
        },
        { id: 'res-b', name: 'stored-b', original_name: 'b.png', path: '/b.png', type: 'image/png' }
      ]
    });

    expect(feedback.status).toBe('success');
    expect(feedback.successCount).toBe(2);
    expect(feedback.failureCount).toBe(0);
    expect(feedback.items).toEqual([
      expect.objectContaining({
        key: getUploadFileKey(files[0]),
        status: 'success',
        resourceId: 'res-a'
      }),
      expect.objectContaining({
        key: getUploadFileKey(files[1]),
        status: 'success',
        resourceId: 'res-b'
      })
    ]);
  });

  it('maps server failed_files entries to retryable failed items', () => {
    const files = [queueFile('a.png'), queueFile('b.png')];

    const feedback = buildBatchUploadFeedback(files, {
      total_files: 2,
      success_count: 1,
      failure_count: 1,
      files: [
        { id: 'res-a', name: 'stored-a', original_name: 'a.png', path: '/a.png', type: 'image/png' }
      ],
      failed_files: ['b.png'],
      errors: ['b.png exceeds quota']
    });

    expect(feedback.status).toBe('partial');
    expect(feedback.items).toEqual([
      expect.objectContaining({ fileName: 'a.png', status: 'success' }),
      expect.objectContaining({
        fileName: 'b.png',
        status: 'failed',
        message: 'b.png exceeds quota'
      })
    ]);
  });

  it('keeps unmatched files retryable when the server only returns aggregate failures', () => {
    const files = [queueFile('a.png'), queueFile('b.png')];

    const feedback = buildBatchUploadFeedback(files, {
      total_files: 2,
      success_count: 1,
      failure_count: 1,
      files: [
        { id: 'res-a', name: 'stored-a', original_name: 'a.png', path: '/a.png', type: 'image/png' }
      ],
      errors: ['one file failed']
    });

    expect(feedback.status).toBe('partial');
    expect(feedback.items).toEqual([
      expect.objectContaining({ fileName: 'a.png', status: 'success' }),
      expect.objectContaining({ fileName: 'b.png', status: 'unknown' })
    ]);
  });

  it('turns request errors into per-file failed feedback', () => {
    const files = [queueFile('a.png'), queueFile('b.png')];

    const feedback = buildUploadErrorFeedback(files, new Error('network unavailable'));

    expect(feedback.status).toBe('failed');
    expect(feedback.failureCount).toBe(2);
    expect(feedback.items.every(item => item.status === 'failed')).toBe(true);
    expect(feedback.errors).toEqual(['network unavailable']);
  });
});
