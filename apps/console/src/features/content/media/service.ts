import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createMedia, deleteMedia, getMedia, getMediaList, updateMedia } from './apis';
import { Media } from './media';

interface MediaKeys {
  create: ['mediaService', 'create'];
  get: (_options?: { media?: string }) => ['mediaService', 'media', { media?: string }];
  update: ['mediaService', 'update'];
  list: (_options?: any) => ['mediaService', 'media-list', any];
}

export const mediaKeys: MediaKeys = {
  create: ['mediaService', 'create'],
  get: ({ media } = {}) => ['mediaService', 'media', { media }],
  update: ['mediaService', 'update'],
  list: (queryParams = {}) => ['mediaService', 'media-list', queryParams]
};

// Query single media
export const useQueryMedia = (mediaId: string) =>
  useQuery({
    queryKey: mediaKeys.get({ media: mediaId }),
    queryFn: () => getMedia(mediaId),
    enabled: !!mediaId
  });

// List media
export const useListMedia = (queryParams: any) => {
  return useQuery({
    queryKey: mediaKeys.list(queryParams),
    queryFn: () => getMediaList(queryParams),
    staleTime: 5 * 60 * 1000
  });
};

// Create media mutation
export const useCreateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Media>) => createMedia(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaService', 'media-list'] });
    }
  });
};

// Update media mutation
export const useUpdateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Media>) => updateMedia(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mediaService', 'media-list'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: mediaKeys.get({ media: variables.id })
        });
      }
    }
  });
};

// Delete media mutation
export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: mediaKeys.get({ media: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['mediaService', 'media-list'] });
    }
  });
};
