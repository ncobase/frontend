import { AnyObject } from '@ncobase/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTopic,
  createTopicMedia,
  deleteTopic,
  deleteTopicMedia,
  getTopic,
  getTopicMediaByTopic,
  getTopicMediaList,
  getTopics,
  updateTopic,
  updateTopicMedia
} from './apis';
import type { QueryFormParams, Topic } from './topic';
import type { TopicMedia } from './topic_media';
import {
  normalizeTopicMedia,
  reconcileTopicMediaChanges,
  topicMediaItems
} from './topic_media_helpers';

export { reconcileTopicMediaChanges } from './topic_media_helpers';

interface TopicKeys {
  create: ['topicService', 'create'];
  get: (_options?: { topic?: string }) => ['topicService', 'topic', { topic?: string }];
  tree: (_options?: AnyObject) => ['topicService', 'tree', AnyObject];
  update: ['topicService', 'update'];
  list: (_options?: QueryFormParams) => ['topicService', 'topics', QueryFormParams];
  media: (_options?: { topicId?: string }) => ['topicService', 'topicMedia', { topicId?: string }];
  mediaReferences: (_options?: {
    mediaId?: string;
  }) => ['topicService', 'topicMediaByMedia', { mediaId?: string }];
}

export const topicKeys: TopicKeys = {
  create: ['topicService', 'create'],
  get: ({ topic } = {}) => ['topicService', 'topic', { topic }],
  tree: (queryParams = {}) => ['topicService', 'tree', queryParams],
  update: ['topicService', 'update'],
  list: (queryParams = {}) => ['topicService', 'topics', queryParams],
  media: ({ topicId } = {}) => ['topicService', 'topicMedia', { topicId }],
  mediaReferences: ({ mediaId } = {}) => ['topicService', 'topicMediaByMedia', { mediaId }]
};

export const syncTopicMedia = async (topicId: string, media: TopicMedia[]) => {
  const desired = normalizeTopicMedia(topicId, media);
  const current = topicMediaItems(await getTopicMediaByTopic(topicId, { limit: 100 }));
  const changes = reconcileTopicMediaChanges(current, desired);

  await Promise.all(
    changes.remove.map(item => (item.id ? deleteTopicMedia(item.id) : Promise.resolve()))
  );

  await Promise.all(
    changes.update.map(item => {
      const existing = current.find(currentItem => currentItem.media_id === item.media_id);
      return existing?.id ? updateTopicMedia({ ...existing, ...item, id: existing.id }) : item;
    })
  );

  await Promise.all(changes.create.map(item => createTopicMedia(item as Omit<TopicMedia, 'id'>)));

  return topicMediaItems(await getTopicMediaByTopic(topicId, { limit: 100 }));
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
    queryFn: async () => topicMediaItems(await getTopicMediaByTopic(topicId, { limit: 100 })),
    enabled: !!topicId
  });

export const useListTopicMediaByMedia = (mediaId: string, limit = 20) =>
  useQuery({
    queryKey: topicKeys.mediaReferences({ mediaId }),
    queryFn: async () => topicMediaItems(await getTopicMediaList({ media_id: mediaId, limit })),
    enabled: !!mediaId
  });

// Create topic mutation with media support
export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Pick<Topic, keyof Topic> & { media?: TopicMedia[] }) => {
      const { media, ...topicData } = payload;

      // Create topic first
      const topic = await createTopic(topicData);

      if (media && media.length > 0 && topic.id) {
        await syncTopicMedia(topic.id, media);
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

      if (media && topic.id) {
        await syncTopicMedia(topic.id, media);
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
    mutationFn: (payload: TopicMedia) => createTopicMedia(payload as Omit<TopicMedia, 'id'>),
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
      await deleteTopicMedia(payload.id);
      return payload;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: topicKeys.media({ topicId: variables.topicId })
      });
    }
  });
};

export const useSyncTopicMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, media }: { topicId: string; media: TopicMedia[] }) =>
      syncTopicMedia(topicId, media),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: topicKeys.media({ topicId: variables.topicId })
      });
    }
  });
};

export type { TopicMedia };
