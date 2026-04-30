import { describe, expect, it } from 'vitest';

import type { TopicMedia } from './topic_media';
import {
  buildTopicMediaPayload,
  groupTopicMediaByType,
  reconcileTopicMediaChanges
} from './topic_media_helpers';

describe('topic media reconciliation', () => {
  it('detects creates updates and removals by media id', () => {
    const current: TopicMedia[] = [
      { id: 'rel_1', topic_id: 'topic_1', media_id: 'media_1', type: 'gallery', order: 0 },
      { id: 'rel_2', topic_id: 'topic_1', media_id: 'media_2', type: 'attachment', order: 1 },
      { id: 'rel_3', topic_id: 'topic_1', media_id: 'media_3', type: 'gallery', order: 2 }
    ];
    const desired: TopicMedia[] = [
      { topic_id: 'topic_1', media_id: 'media_1', type: 'featured', order: 0 },
      { topic_id: 'topic_1', media_id: 'media_2', type: 'attachment', order: 1 },
      { topic_id: 'topic_1', media_id: 'media_4', type: 'gallery', order: 2 }
    ];

    const changes = reconcileTopicMediaChanges(current, desired);

    expect(changes.create.map(item => item.media_id)).toEqual(['media_4']);
    expect(changes.update.map(item => item.media_id)).toEqual(['media_1']);
    expect(changes.remove.map(item => item.media_id)).toEqual(['media_3']);
  });

  it('groups topic media by type with stable order', () => {
    const items: TopicMedia[] = [
      { media_id: 'media_3', type: 'gallery', order: 2 },
      { media_id: 'media_1', type: 'featured', order: 0 },
      { media_id: 'media_2', type: 'gallery', order: 1 },
      { media_id: 'media_4', type: 'attachment', order: 0 }
    ];

    const grouped = groupTopicMediaByType(items);

    expect(grouped.featured.map(item => item.media_id)).toEqual(['media_1']);
    expect(grouped.gallery.map(item => item.media_id)).toEqual(['media_2', 'media_3']);
    expect(grouped.attachment.map(item => item.media_id)).toEqual(['media_4']);
  });

  it('builds save payload with per-type order and topic id', () => {
    const payload = buildTopicMediaPayload(
      {
        featured: [{ media_id: 'media_1', type: 'featured', order: 9 }],
        gallery: [
          { media_id: 'media_2', type: 'gallery', order: 4 },
          { media: { id: 'media_3', title: 'Gallery 3' }, type: 'gallery', order: 7 }
        ],
        attachment: [{ media_id: 'media_4', type: 'attachment', order: 3 }]
      },
      'topic_1'
    );

    expect(payload.map(item => [item.topic_id, item.media_id, item.type, item.order])).toEqual([
      ['topic_1', 'media_1', 'featured', 0],
      ['topic_1', 'media_2', 'gallery', 0],
      ['topic_1', 'media_3', 'gallery', 1],
      ['topic_1', 'media_4', 'attachment', 0]
    ]);
  });

  it('keeps one relation for duplicate media ids', () => {
    const payload = buildTopicMediaPayload(
      {
        featured: [{ media_id: 'media_1', type: 'featured' }],
        gallery: [{ media_id: 'media_1', type: 'gallery' }],
        attachment: []
      },
      'topic_1'
    );

    expect(payload).toHaveLength(1);
    expect(payload[0]).toMatchObject({
      topic_id: 'topic_1',
      media_id: 'media_1',
      type: 'featured',
      order: 0
    });
  });
});
