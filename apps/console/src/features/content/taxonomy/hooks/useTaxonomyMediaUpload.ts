import { useMediaResourceUpload } from '../../media/media_resource';

export const useTaxonomyMediaUpload = () =>
  useMediaResourceUpload({
    source: 'taxonomy',
    pathPrefix: 'content/taxonomies',
    tags: ['taxonomy']
  });
