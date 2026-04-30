import type { Media } from './media';
import { getMediaDownloadUrl } from './media_resource_helpers';

export const getMediaDownloadFileName = (media: Media) =>
  media.resource?.name || media.title || media.resource_id || media.id || 'media-file';

export const canDownloadMedia = (media?: Media | null) =>
  !!(media?.resource_id || getMediaDownloadUrl(media));

const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const downloadMediaFile = async (media: Media) => {
  if (media.resource_id) {
    const { download } = await import('@/features/resource/apis');
    const blob = await download(media.resource_id);
    saveBlob(blob, getMediaDownloadFileName(media));
    return;
  }

  const downloadUrl = getMediaDownloadUrl(media);
  if (!downloadUrl) {
    throw new Error('Download URL is not available');
  }

  window.open(downloadUrl, '_blank');
};
