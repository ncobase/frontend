import type { Topic } from './topic';
import type { TopicMedia } from './topic_media';

import { createApi } from '@/lib/api/factory';
import { assertRequiredApiValue } from '@/lib/api/guards';

export const topicApi = createApi<Topic>('/cms/topics');
export const topicMediaApi = createApi<TopicMedia>('/cms/topic-media', {
  extensions: ({ request, endpoint }) => ({
    listByTopic: (topicId: string, params: Record<string, any> = {}) => {
      const query = new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = String(value);
          }
          return acc;
        }, {})
      ).toString();

      return request.get(
        `${endpoint}/by-topic/${assertRequiredApiValue(topicId, 'Topic ID')}${query ? `?${query}` : ''}`
      );
    },
    getByTopicAndMedia: (topicId: string, mediaId: string) => {
      const query = new URLSearchParams({
        topicId: assertRequiredApiValue(topicId, 'Topic ID'),
        mediaId: assertRequiredApiValue(mediaId, 'Media ID')
      }).toString();
      return request.get(`${endpoint}/by-topic-and-media?${query}`);
    }
  })
});

export const {
  create: createTopic,
  get: getTopic,
  update: updateTopic,
  delete: deleteTopic,
  list: getTopics
} = topicApi;

export const {
  create: createTopicMedia,
  get: getTopicMedia,
  update: updateTopicMedia,
  delete: deleteTopicMedia,
  list: getTopicMediaList,
  listByTopic: getTopicMediaByTopic,
  getByTopicAndMedia: getTopicMediaByTopicAndMedia
} = topicMediaApi;
