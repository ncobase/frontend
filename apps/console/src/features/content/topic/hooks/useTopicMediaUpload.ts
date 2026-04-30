import { useMediaResourceUpload } from '../../media/media_resource';

export const useTopicMediaUpload = () =>
  useMediaResourceUpload({
    source: 'topic',
    pathPrefix: 'content/topics',
    tags: ['topic']
  });
