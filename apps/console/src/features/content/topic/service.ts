import { AnyObject } from '@ncobase/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  tree: (_options?: AnyObject) => ['topicService', 'tree', AnyObject];
  update: ['topicService', 'update'];
  list: (_options?: QueryFormParams) => ['topicService', 'topics', QueryFormParams];
}

export const topicKeys: TopicKeys = {
  create: ['topicService', 'create'],
  get: ({ topic } = {}) => ['topicService', 'topic', { topic }],
  tree: (queryParams = {}) => ['topicService', 'tree', queryParams],
  update: ['topicService', 'update'],
  list: (queryParams = {}) => ['topicService', 'topics', queryParams]
};

// Query a specific topic by ID or Slug
export const useQueryTopic = (topic: string) =>
  useQuery({
    queryKey: topicKeys.get({ topic }),
    queryFn: () => getTopic(topic),
    enabled: !!topic
  });

// List topics
export const useListTopics = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: topicKeys.list(queryParams),
    queryFn: () => getTopics(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Create topic mutation
export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Topic, keyof Topic>) => createTopic(payload),
    onSuccess: () => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: ['topicService', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicService', 'tree'] });
    },
    onError: error => {
      console.error('Failed to create topic:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Update topic mutation
export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<Topic, keyof Topic>) => updateTopic(payload),
    onSuccess: (_, variables) => {
      // Invalidate specific topic, topics list, and tree
      queryClient.invalidateQueries({ queryKey: ['topicService', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicService', 'tree'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: topicKeys.get({ topic: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update topic:', error);
      // Handle error (toast notification, etc.)
    }
  });
};

// Delete topic mutation
export const useDeleteTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTopic(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate topics list and tree
      queryClient.removeQueries({
        queryKey: topicKeys.get({ topic: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['topicService', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicService', 'tree'] });
    },
    onError: error => {
      console.error('Failed to delete topic:', error);
      // Handle error (toast notification, etc.)
    }
  });
};
