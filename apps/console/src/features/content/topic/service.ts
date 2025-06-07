import { AnyObject } from '@ncobase/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTopic, deleteTopic, getTopic, getTopics, updateTopic } from './apis';
import { QueryFormParams } from './config/query';
import { Topic } from './topic';

// Topic media related types
export interface TopicMedia {
  id?: string;
  topic_id?: string;
  media_id?: string;
  type?: 'featured' | 'gallery' | 'attachment';
  order?: number;
  media?: any;
}

interface TopicKeys {
  create: ['topicService', 'create'];
  get: (_options?: { topic?: string }) => ['topicService', 'topic', { topic?: string }];
  tree: (_options?: AnyObject) => ['topicService', 'tree', AnyObject];
  update: ['topicService', 'update'];
  list: (_options?: QueryFormParams) => ['topicService', 'topics', QueryFormParams];
  media: (_options?: { topicId?: string }) => ['topicService', 'topicMedia', { topicId?: string }];
}

export const topicKeys: TopicKeys = {
  create: ['topicService', 'create'],
  get: ({ topic } = {}) => ['topicService', 'topic', { topic }],
  tree: (queryParams = {}) => ['topicService', 'tree', queryParams],
  update: ['topicService', 'update'],
  list: (queryParams = {}) => ['topicService', 'topics', queryParams],
  media: ({ topicId } = {}) => ['topicService', 'topicMedia', { topicId }]
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

// Query topic media
export const useQueryTopicMedia = (topicId: string) =>
  useQuery({
    queryKey: topicKeys.media({ topicId }),
    queryFn: async () => {
      // This would call the topic-media API endpoint
      // For now, return empty array as placeholder
      return [];
    },
    enabled: !!topicId
  });

// Create topic mutation with media support
export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Pick<Topic, keyof Topic> & { media?: TopicMedia[] }) => {
      const { media, ...topicData } = payload;

      // Create topic first
      const topic = await createTopic(topicData);

      // If media provided, associate them with the topic
      if (media && media.length > 0) {
        // This would call the topic-media API to create associations
        // For now, we'll just log it
        console.log('Associating media with topic:', media);
      }

      return topic;
    },
    onSuccess: () => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: ['topicService', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicService', 'tree'] });
    },
    onError: error => {
      console.error('Failed to create topic:', error);
    }
  });
};

// Update topic mutation with media support
export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Pick<Topic, keyof Topic> & { media?: TopicMedia[] }) => {
      const { media, ...topicData } = payload;

      // Update topic first
      const topic = await updateTopic(topicData);

      // If media provided, update associations
      if (media && media.length > 0) {
        // This would call the topic-media API to update associations
        console.log('Updating media associations for topic:', media);
      }

      return topic;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific topic, topics list, and tree
      queryClient.invalidateQueries({ queryKey: ['topicService', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicService', 'tree'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: topicKeys.get({ topic: variables.id })
        });
        queryClient.invalidateQueries({
          queryKey: topicKeys.media({ topicId: variables.id })
        });
      }
    },
    onError: error => {
      console.error('Failed to update topic:', error);
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
      queryClient.removeQueries({
        queryKey: topicKeys.media({ topicId: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['topicService', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicService', 'tree'] });
    },
    onError: error => {
      console.error('Failed to delete topic:', error);
    }
  });
};

// Topic media operations
export const useCreateTopicMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TopicMedia) => {
      // This would call the topic-media API
      // For now, return the payload as mock response
      return { id: Date.now().toString(), ...payload };
    },
    onSuccess: (_, variables) => {
      if (variables.topic_id) {
        queryClient.invalidateQueries({
          queryKey: topicKeys.media({ topicId: variables.topic_id })
        });
      }
    }
  });
};

export const useDeleteTopicMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; topicId: string }) => {
      // This would call the topic-media delete API
      return payload;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: topicKeys.media({ topicId: variables.topicId })
      });
    }
  });
};
