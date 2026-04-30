import type { TopicMedia } from './topic_media';

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
