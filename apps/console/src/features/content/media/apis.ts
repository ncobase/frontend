import { Media } from './media';

import { createApi } from '@/lib/api/factory';

export const mediaApi = createApi<Media>('/cms/media');

export const {
  create: createMedia,
  get: getMedia,
  update: updateMedia,
  delete: deleteMedia,
  list: getMediaList
} = mediaApi;
