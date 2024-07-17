import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import { createTopic, getTopic, getTopics, updateTopic } from '@/apis/content/topic';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { Topic } from '@/types';

interface TopicKeys {
  create: ['topicService', 'create'];
  get: (options?: { topic?: string }) => ['topicService', 'topic', { topic?: string }];
  update: ['topicService', 'update'];
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

// Hook to list topics with pagination
export const useListTopics = (queryParams: QueryFormParams = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: topicKeys.list(queryParams),
    queryFn: () => getTopics(queryParams)
  });

  const paginatedResult = usePaginatedData<Topic>(
    data || { items: [], total: 0, has_next: false },
    queryParams?.cursor as string,
    queryParams?.limit as number
  );

  return { ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = <T>(
  data: { items: T[]; total: number; has_next: boolean; next?: string },
  cursor?: string,
  limit: number = 10
): PaginationResult<T> => {
  const { items, has_next, next } = paginateByCursor(data.items, data.total, cursor, limit) || {
    items: [],
    has_next: data.has_next,
    next: data.next
  };

  return { items, total: data.total, next, has_next };
};
