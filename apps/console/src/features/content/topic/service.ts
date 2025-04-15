import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import { createTopic, deleteTopic, getTopic, getTopics, updateTopic } from '@/apis/content/topic';
import { Topic } from '@/types';

interface TopicKeys {
  create: ['topicService', 'create'];
  // eslint-disable-next-line no-unused-vars
  get: (options?: { topic?: string }) => ['topicService', 'topic', { topic?: string }];
  update: ['topicService', 'update'];
  // eslint-disable-next-line no-unused-vars
  list: (options?: QueryFormParams) => ['topicService', 'topics', QueryFormParams];
}

export const topicKeys: TopicKeys = {
  create: ['topicService', 'create'],
  get: ({ topic } = {}) => ['topicService', 'topic', { topic }],
  update: ['topicService', 'update'],
  list: (queryParams = {}) => ['topicService', 'topics', queryParams]
};

// Hook to query a specific topic by ID or Slug
export const useQueryTopic = (topic: string) =>
  useQuery({ queryKey: topicKeys.get({ topic }), queryFn: () => getTopic(topic) });

// Hook for create topic mutation
export const useCreateTopic = () =>
  useMutation({ mutationFn: (payload: Pick<Topic, keyof Topic>) => createTopic(payload) });

// Hook for update topic mutation
export const useUpdateTopic = () =>
  useMutation({ mutationFn: (payload: Pick<Topic, keyof Topic>) => updateTopic(payload) });

// Hook for delete topic mutation
export const useDeleteTopic = () => useMutation({ mutationFn: (id: string) => deleteTopic(id) });

// Hook to list topics
export const useListTopics = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: topicKeys.list(queryParams),
    queryFn: () => getTopics(queryParams)
  });
};
