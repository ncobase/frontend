import { createApi } from '@/apis/factory';
import { Topic } from '@/types';

export const topicApi = createApi<Topic>('/cms/topics');

export const createTopic = topicApi.create;
export const getTopic = topicApi.get;
export const updateTopic = topicApi.update;
export const deleteTopic = topicApi.delete;
export const getTopics = topicApi.list;
