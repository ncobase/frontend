import { describe, expect, it } from 'vitest';

import type { TopicMedia } from './topic_media';
import { reconcileTopicMediaChanges } from './topic_media_helpers';

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
});
