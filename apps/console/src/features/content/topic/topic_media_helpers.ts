import type { TopicMedia } from './topic_media';

export const TOPIC_MEDIA_TYPES = ['featured', 'gallery', 'attachment'] as const;

export type TopicMediaType = (typeof TOPIC_MEDIA_TYPES)[number];

export type TopicMediaByType = Record<TopicMediaType, TopicMedia[]>;

export const topicMediaItems = (response: any): TopicMedia[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

export const normalizeTopicMedia = (topicId: string, media: TopicMedia[]) =>
  media
    .filter(item => item.media_id || item.media?.id)
    .map((item, index) => ({
      ...item,
      topic_id: topicId,
      media_id: item.media_id || item.media?.id,
      type: item.type || 'gallery',
      order: item.order ?? index
    })) as TopicMedia[];

export const reconcileTopicMediaChanges = (current: TopicMedia[], desired: TopicMedia[]) => {
  const currentByMediaId = new Map(
    current
      .filter((item): item is TopicMedia & { media_id: string } => !!item.media_id)
      .map(item => [item.media_id, item])
  );
  const desiredIds = new Set(desired.map(item => item.media_id).filter(Boolean));

  const create = desired.filter(item => item.media_id && !currentByMediaId.has(item.media_id));
  const update = desired.filter(item => {
    if (!item.media_id) return false;
    const existing = currentByMediaId.get(item.media_id);
    return !!existing && (existing.type !== item.type || existing.order !== item.order);
  });
  const remove = current.filter(item => item.id && item.media_id && !desiredIds.has(item.media_id));

  return { create, update, remove };
};

export const createEmptyTopicMediaByType = (): TopicMediaByType => ({
  featured: [],
  gallery: [],
  attachment: []
});

export const groupTopicMediaByType = (items: TopicMedia[]): TopicMediaByType => {
  const grouped = createEmptyTopicMediaByType();

  items
    .filter(item => item.media_id || item.media?.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach(item => {
      const type = TOPIC_MEDIA_TYPES.includes(item.type as TopicMediaType)
        ? (item.type as TopicMediaType)
        : 'gallery';
      grouped[type].push({ ...item, type });
    });

  return grouped;
};

export const getTopicMediaItemMediaId = (item: TopicMedia) => item.media_id || item.media?.id || '';

export const buildTopicMediaPayload = (
  mediaByType: Partial<Record<TopicMediaType, TopicMedia[]>>,
  topicId?: string
): TopicMedia[] => {
  const seenMediaIds = new Set<string>();
  const result: TopicMedia[] = [];

  TOPIC_MEDIA_TYPES.forEach(type => {
    (mediaByType[type] || []).forEach(item => {
      const mediaId = getTopicMediaItemMediaId(item);
      if (!mediaId || seenMediaIds.has(mediaId)) return;

      seenMediaIds.add(mediaId);
      result.push({
        ...item,
        topic_id: topicId || item.topic_id,
        media_id: mediaId,
        type,
        order: result.filter(resultItem => resultItem.type === type).length
      });
    });
  });

  return result;
};
