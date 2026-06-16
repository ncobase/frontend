import { describe, expect, it, vi } from 'vitest';

import {
  fetchResourceDeleteImpact,
  ResourceDeleteImpactFetchers,
  summarizeResourceDeleteImpacts
} from './delete_impact';
import type { ResourceFile } from './resource';

vi.mock('@/features/content/media/apis', () => ({
  getMediaList: vi.fn()
}));

vi.mock('@/features/content/topic/apis', () => ({
  getTopic: vi.fn(),
  getTopicMediaList: vi.fn()
}));

const resourceFile = (id: string): ResourceFile => ({
  id,
  name: `${id}.png`,
  original_name: `${id}.png`,
  path: `/uploads/${id}.png`,
  type: 'image/png'
});

describe('resource delete impact', () => {
  it('allows deletion when no CMS references exist', async () => {
    const fetchers: ResourceDeleteImpactFetchers = {
      listMedia: vi.fn().mockResolvedValue({ items: [], total: 0, has_next: false }),
      listTopicMedia: vi.fn(),
      getTopic: vi.fn()
    };

    const impacts = await fetchResourceDeleteImpact([resourceFile('file-1')], fetchers);
    const summary = summarizeResourceDeleteImpacts(impacts);

    expect(fetchers.listMedia).toHaveBeenCalledWith(
      expect.objectContaining({ resource_id: 'file-1', limit: 100 })
    );
    expect(fetchers.listTopicMedia).not.toHaveBeenCalled();
    expect(summary).toMatchObject({
      fileCount: 1,
      mediaReferenceCount: 0,
      topicReferenceCount: 0,
      errorCount: 0,
      canDelete: true
    });
  });

  it('aggregates paginated CMS media and topic usage references', async () => {
    const fetchers: ResourceDeleteImpactFetchers = {
      listMedia: vi.fn().mockImplementation(params => {
        if (params.cursor === 'next-media') {
          return Promise.resolve({
            items: [{ id: 'media-2', title: 'Gallery Image' }],
            total: 2,
            has_next: false
          });
        }

        return Promise.resolve({
          items: [{ id: 'media-1', title: 'Hero Image' }],
          total: 2,
          has_next: true,
          next_cursor: 'next-media'
        });
      }),
      listTopicMedia: vi.fn().mockImplementation(params => {
        if (params.media_id === 'media-1') {
          return Promise.resolve({
            items: [
              {
                id: 'topic-media-1',
                media_id: 'media-1',
                topic_id: 'topic-1',
                type: 'featured'
              }
            ],
            total: 1,
            has_next: false
          });
        }

        return Promise.resolve({ items: [], total: 0, has_next: false });
      }),
      getTopic: vi.fn().mockResolvedValue({ id: 'topic-1', title: 'Launch Story' })
    };

    const impacts = await fetchResourceDeleteImpact([resourceFile('file-1')], fetchers);
    const summary = summarizeResourceDeleteImpacts(impacts);

    expect(fetchers.listMedia).toHaveBeenCalledWith(
      expect.objectContaining({ cursor: 'next-media' })
    );
    expect(fetchers.listTopicMedia).toHaveBeenCalledWith(
      expect.objectContaining({ media_id: 'media-1', limit: 100 })
    );
    expect(fetchers.getTopic).toHaveBeenCalledWith('topic-1');
    expect(impacts[0].mediaReferences).toHaveLength(2);
    expect(impacts[0].topicReferences[0].topic?.title).toBe('Launch Story');
    expect(summary).toMatchObject({
      mediaReferenceCount: 2,
      topicReferenceCount: 1,
      referencedFileCount: 1,
      canDelete: false
    });
  });

  it('blocks deletion when reference checks fail', async () => {
    const fetchers: ResourceDeleteImpactFetchers = {
      listMedia: vi.fn().mockRejectedValue(new Error('CMS media lookup failed')),
      listTopicMedia: vi.fn(),
      getTopic: vi.fn()
    };

    const impacts = await fetchResourceDeleteImpact([resourceFile('file-1')], fetchers);
    const summary = summarizeResourceDeleteImpacts(impacts);

    expect(impacts[0].errors).toContain('CMS media lookup failed');
    expect(summary.errorCount).toBe(1);
    expect(summary.canDelete).toBe(false);
  });
});
