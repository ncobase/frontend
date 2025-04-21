import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';
import { Topic } from './topic';

import {
  createTopic,
  deleteTopic,
  getTopic,
  getTopics,
  updateTopic
} from '@/features/content/topic/apis';

interface TopicKeys {
  create: ['topicService', 'create'];
  get: (_options?: { topic?: string }) => ['topicService', 'topic', { topic?: string }];
  update: ['topicService', 'update'];
  list: (_options?: QueryFormParams) => ['topicService', 'topics', QueryFormParams];
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
