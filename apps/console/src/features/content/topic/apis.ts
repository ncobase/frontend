import { Topic } from './topic';

import { createApi } from '@/lib/api/factory';

export const topicApi = createApi<Topic>('/cms/topics');

export const createTopic = topicApi.create;
export const getTopic = topicApi.get;
export const updateTopic = topicApi.update;
export const deleteTopic = topicApi.delete;
export const getTopics = topicApi.list;
