import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createChannel, deleteChannel, getChannel, getChannels, updateChannel } from './apis';
import { Channel } from './channel';

interface ChannelKeys {
  create: ['channelService', 'create'];
  get: (_options?: { channel?: string }) => ['channelService', 'channel', { channel?: string }];
  update: ['channelService', 'update'];
  list: (_options?: any) => ['channelService', 'channels', any];
}

export const channelKeys: ChannelKeys = {
  create: ['channelService', 'create'],
  get: ({ channel } = {}) => ['channelService', 'channel', { channel }],
  update: ['channelService', 'update'],
  list: (queryParams = {}) => ['channelService', 'channels', queryParams]
};

// Query single channel
export const useQueryChannel = (channelId: string) =>
  useQuery({
    queryKey: channelKeys.get({ channel: channelId }),
    queryFn: () => getChannel(channelId),
    enabled: !!channelId
  });

// List channels
export const useListChannels = (queryParams: any) => {
  return useQuery({
    queryKey: channelKeys.list(queryParams),
    queryFn: () => getChannels(queryParams),
    staleTime: 5 * 60 * 1000
  });
};

// Create channel mutation
export const useCreateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Channel>) => createChannel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelService', 'channels'] });
    }
  });
};

// Update channel mutation
export const useUpdateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Channel>) => updateChannel(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['channelService', 'channels'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: channelKeys.get({ channel: variables.id })
        });
      }
    }
  });
};

// Delete channel mutation
export const useDeleteChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChannel(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: channelKeys.get({ channel: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['channelService', 'channels'] });
    }
  });
};
