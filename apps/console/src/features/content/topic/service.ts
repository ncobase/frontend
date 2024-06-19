import { AnyObject, ExplicitAny, Topic } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createTopic, getTopic, getTopics, updateTopic } from '@/apis/content/topic';
import { paginateByCursor } from '@/helpers/pagination';

type TopicMutationFn = (payload: Pick<Topic, keyof Topic>) => Promise<Topic>;
type TopicQueryFn<T> = () => Promise<T>;

interface TopicKeys {
  create: ['topicService', 'create'];
  get: (options?: { topic?: string }) => ['topicService', 'topic', { topic?: string }];
  tree: (options?: AnyObject) => ['topicService', 'tree', AnyObject];
  update: ['topicService', 'update'];
  list: (options?: AnyObject) => ['topicService', 'topics', AnyObject];
}

export const topicKeys: TopicKeys = {
  create: ['topicService', 'create'],
  get: ({ topic } = {}) => ['topicService', 'topic', { topic }],
  tree: (queryKey = {}) => ['topicService', 'tree', queryKey],
  update: ['topicService', 'update'],
  list: (queryKey = {}) => ['topicService', 'topics', queryKey]
};

const useTopicMutation = (mutationFn: TopicMutationFn) => useMutation({ mutationFn });

const useQueryTopicData = <T>(queryKey: unknown[], queryFn: TopicQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryTopic = (topic: string) =>
  useQueryTopicData(topicKeys.get({ topic }), () => getTopic(topic));

export const useCreateTopic = () => useTopicMutation(payload => createTopic(payload));
export const useUpdateTopic = () => useTopicMutation(payload => updateTopic(payload));

export const useListTopics = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: topicKeys.list(queryKey),
    queryFn: () => getTopics(queryKey)
  });
  const { content: topics = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(topics, cursor as string, limit as number);

  return { topics: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
