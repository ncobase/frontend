import type { Media } from './media';

import type { ResourceFile } from '@/features/resource/resource';

export type ContentMediaSource = 'media' | 'topic' | 'taxonomy';
type MediaType = NonNullable<Media['type']>;

const extensionTypeMap: Record<string, MediaType> = {
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.gif': 'image',
  '.webp': 'image',
  '.svg': 'image',
  '.mp4': 'video',
  '.webm': 'video',
  '.mov': 'video',
  '.mp3': 'audio',
  '.wav': 'audio',
  '.ogg': 'audio'
};

const getFileExtension = (name?: string) => {
  const value = String(name || '').toLowerCase();
  const index = value.lastIndexOf('.');
  return index >= 0 ? value.slice(index) : '';
};

export const getMediaTypeFromFile = (file: Pick<File, 'name' | 'type'>): MediaType => {
  const contentType = String(file.type || '').toLowerCase();
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.startsWith('audio/')) return 'audio';
  return extensionTypeMap[getFileExtension(file.name)] || 'file';
};

export const getMediaTypeFromResource = (
  resource: Pick<ResourceFile, 'name' | 'original_name' | 'path' | 'type' | 'category'>
): MediaType => {
  const contentType = String(resource.type || '').toLowerCase();
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.startsWith('audio/')) return 'audio';

  if (resource.category === 'image') return 'image';
  if (resource.category === 'video') return 'video';
  if (resource.category === 'audio') return 'audio';

  return (
    extensionTypeMap[
      getFileExtension(resource.original_name || resource.name || resource.path || '')
    ] || 'file'
  );
};

export const getMediaResourceUrl = (resource?: Partial<ResourceFile> | null) =>
  resource?.download_url || resource?.thumbnail_url || resource?.path || '';

export const getMediaPreviewUrl = (media?: Media | null) =>
  media?.url ||
  media?.resource?.thumbnail_url ||
  media?.resource?.download_url ||
  media?.resource?.path ||
  '';

export const getMediaDownloadUrl = (media?: Media | null) =>
  media?.url || media?.resource?.download_url || media?.resource?.path || '';

export const getMediaMimeType = (media?: Media | null) =>
  media?.mime_type || media?.metadata?.mime_type || media?.resource?.type || '';

export const getMediaSize = (media?: Media | null) =>
  media?.size || media?.metadata?.size || media?.resource?.size || 0;

export const buildMediaRecordFromResource = (
  file: Pick<File, 'name' | 'type' | 'size'>,
  resource: ResourceFile,
  context: {
    ownerId: string;
    spaceId: string;
    source: ContentMediaSource;
  }
): Partial<Media> => {
  const mediaType = getMediaTypeFromFile(file);
  const url = getMediaResourceUrl(resource);

  return {
    title: file.name,
    type: mediaType,
    resource_id: resource.id,
    url,
    path: resource.path,
    mime_type: file.type || resource.type,
    size: file.size || resource.size,
    description: `Uploaded ${context.source} file: ${file.name}`,
    alt: mediaType === 'image' ? file.name : undefined,
    space_id: context.spaceId,
    owner_id: context.ownerId,
    metadata: {
      source: context.source,
      mime_type: file.type || resource.type,
      size: file.size || resource.size,
      resource_name: resource.name,
      resource_path: resource.path,
      storage: resource.storage,
      download_url: resource.download_url,
      thumbnail_url: resource.thumbnail_url
    }
  };
};

export const buildMediaRecordFromExistingResource = (
  resource: ResourceFile,
  context: {
    ownerId: string;
    spaceId: string;
    source: ContentMediaSource;
  }
): Partial<Media> => {
  const mediaType = getMediaTypeFromResource(resource);
  const title = resource.original_name || resource.name || resource.path;
  const url = getMediaResourceUrl(resource);

  return {
    title,
    type: mediaType,
    resource_id: resource.id,
    url,
    path: resource.path,
    mime_type: resource.type,
    size: resource.size,
    description: `Linked ${context.source} resource: ${title}`,
    alt: mediaType === 'image' ? title : undefined,
    space_id: context.spaceId,
    owner_id: context.ownerId,
    metadata: {
      source: context.source,
      linked_from_resource: true,
      mime_type: resource.type,
      size: resource.size,
      resource_name: resource.name,
      resource_path: resource.path,
      storage: resource.storage,
      download_url: resource.download_url,
      thumbnail_url: resource.thumbnail_url
    }
  };
};
