import { useMutation, useQuery } from '@tanstack/react-query';

import { createTopic, getTopic, getTopics, updateTopic } from '@/apis/content/topic';
import { paginateByCursor } from '@/helpers/pagination';
import { AnyObject, ExplicitAny, Topic } from '@/types';

interface TopicKeys {
  create: ['topicService', 'create'];
  get: (options?: { topic?: string }) => ['topicService', 'topic', { topic?: string }];
  update: ['topicService', 'update'];
  list: (options?: AnyObject) => ['topicService', 'topics', AnyObject];
}

export const topicKeys: TopicKeys = {
  create: ['topicService', 'create'],
  get: ({ topic } = {}) => ['topicService', 'topic', { topic }],
  update: ['topicService', 'update'],
  list: (queryKey = {}) => ['topicService', 'topics', queryKey]
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

// Hook to list topics with pagination
export const useListTopics = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: topicKeys.list(queryKey),
    queryFn: () => getTopics(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { topics: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
