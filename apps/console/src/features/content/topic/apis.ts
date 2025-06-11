import { Topic } from './topic';

import { createApi } from '@/lib/api/factory';

export const topicApi = createApi<Topic>('/cms/topics');

export const {
  create: createTopic,
  get: getTopic,
  update: updateTopic,
  delete: deleteTopic,
  list: getTopics
} = topicApi;
