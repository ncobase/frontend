import { Channel } from './channel.d';

import { createApi } from '@/lib/api/factory';

export const channelApi = createApi<Channel>('/cms/channels');

export const {
  create: createChannel,
  get: getChannel,
  update: updateChannel,
  delete: deleteChannel,
  list: getChannels
} = channelApi;
