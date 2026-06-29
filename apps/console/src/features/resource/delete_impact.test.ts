import { describe, expect, it, vi } from 'vitest';

import {
  fetchResourceDeleteImpact,
  ResourceDeleteImpactFetchers,
  summarizeResourceDeleteImpacts
} from './delete_impact';
import type { ResourceDeleteImpactResponse, ResourceFile } from './resource';

vi.mock('./apis', () => ({
  getBatchDeleteImpact: vi.fn()
}));

const resourceFile = (id: string): ResourceFile => ({
  id,
  name: `${id}.png`,
  original_name: `${id}.png`,
  path: `/uploads/${id}.png`,
  type: 'image/png'
});

const response = (
  overrides: Partial<ResourceDeleteImpactResponse['impacts'][number]> = {}
): ResourceDeleteImpactResponse => ({
  impacts: [
    {
      file: resourceFile('file-1'),
      media_references: [],
      topic_references: [],
      media_reference_total: 0,
      topic_reference_total: 0,
      media_references_complete: true,
      topic_references_complete: true,
      errors: [],
      can_delete: true,
      ...overrides
    }
  ],
  summary: {
    file_count: 1,
    referenced_file_count: 0,
    media_reference_count: 0,
    topic_reference_count: 0,
    error_count: 0,
    can_delete: true
  }
});

describe('resource delete impact', () => {
  it('loads delete impact from the backend aggregation endpoint', async () => {
    const fetchers: ResourceDeleteImpactFetchers = {
      getDeleteImpacts: vi.fn().mockResolvedValue(response())
    };

    const impacts = await fetchResourceDeleteImpact([resourceFile('file-1')], fetchers);
    const summary = summarizeResourceDeleteImpacts(impacts);

    expect(fetchers.getDeleteImpacts).toHaveBeenCalledWith(['file-1']);
    expect(summary).toMatchObject({
      fileCount: 1,
      mediaReferenceCount: 0,
      topicReferenceCount: 0,
      errorCount: 0,
      canDelete: true
    });
  });

  it('normalizes CMS media, topic-media and topic references from the backend response', async () => {
    const fetchers: ResourceDeleteImpactFetchers = {
      getDeleteImpacts: vi.fn().mockResolvedValue(
        response({
          media_references: [
            {
              id: 'media-1',
              title: 'Hero Image',
              type: 'image',
              resource_id: 'file-1',
              path: '/media/hero.png',
              mime_type: 'image/png'
            }
          ],
          topic_references: [
            {
              media: {
                id: 'media-1',
                title: 'Hero Image',
                type: 'image',
                resource_id: 'file-1'
              },
              relation: {
                id: 'topic-media-1',
                media_id: 'media-1',
                topic_id: 'topic-1',
                type: 'featured'
              },
              topic: {
                id: 'topic-1',
                title: 'Launch Story',
                slug: 'launch-story'
              }
            }
          ],
          media_reference_total: 1,
          topic_reference_total: 1,
          can_delete: false
        })
      )
    };

    const impacts = await fetchResourceDeleteImpact([resourceFile('file-1')], fetchers);
    const summary = summarizeResourceDeleteImpacts(impacts);

    expect(impacts[0].mediaReferences[0].title).toBe('Hero Image');
    expect(impacts[0].topicReferences[0].topic?.title).toBe('Launch Story');
    expect(summary).toMatchObject({
      mediaReferenceCount: 1,
      topicReferenceCount: 1,
      referencedFileCount: 1,
      canDelete: false
    });
  });

  it('blocks deletion when backend reference checks report errors', async () => {
    const fetchers: ResourceDeleteImpactFetchers = {
      getDeleteImpacts: vi.fn().mockResolvedValue(
        response({
          media_references_complete: false,
          errors: ['content reference services are unavailable'],
          can_delete: false
        })
      )
    };

    const impacts = await fetchResourceDeleteImpact([resourceFile('file-1')], fetchers);
    const summary = summarizeResourceDeleteImpacts(impacts);

    expect(impacts[0].errors).toContain('content reference services are unavailable');
    expect(summary.errorCount).toBe(1);
    expect(summary.canDelete).toBe(false);
  });
});
