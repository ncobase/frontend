import { describe, expect, it } from 'vitest';

import {
  buildMediaRecordFromResource,
  getMediaDownloadUrl,
  getMediaMimeType,
  getMediaPreviewUrl,
  getMediaSize,
  getMediaTypeFromFile
} from './media_resource_helpers';

import type { ResourceFile } from '@/features/resource/resource';

describe('content media resource helpers', () => {
  it('detects media type from MIME type and extension fallback', () => {
    expect(getMediaTypeFromFile(new File(['image'], 'cover.png', { type: 'image/png' }))).toBe(
      'image'
    );
    expect(getMediaTypeFromFile(new File(['movie'], 'clip.mov', { type: '' }))).toBe('video');
    expect(getMediaTypeFromFile(new File(['audio'], 'track.ogg', { type: '' }))).toBe('audio');
    expect(getMediaTypeFromFile(new File(['data'], 'archive.zip', { type: '' }))).toBe('file');
  });

  it('builds CMS media payloads from uploaded resources', () => {
    const file = new File(['image'], 'cover.png', { type: 'image/png' });
    const resource: ResourceFile = {
      id: 'res_1',
      name: 'cover.png',
      path: 'content/media/cover.png',
      type: 'image/png',
      size: 2048,
      storage: 'local',
      download_url: '/api/res/res_1/download',
      thumbnail_url: '/api/res/thumb/res_1'
    };

    const payload = buildMediaRecordFromResource(file, resource, {
      ownerId: 'user_1',
      spaceId: 'space_1',
      source: 'topic'
    });

    expect(payload).toMatchObject({
      title: 'cover.png',
      type: 'image',
      resource_id: 'res_1',
      url: '/api/res/res_1/download',
      path: 'content/media/cover.png',
      mime_type: 'image/png',
      size: file.size,
      space_id: 'space_1',
      owner_id: 'user_1'
    });
    expect(payload.metadata).toMatchObject({
      source: 'topic',
      resource_name: 'cover.png',
      thumbnail_url: '/api/res/thumb/res_1'
    });
  });

  it('resolves media display values from resource-backed records', () => {
    const media = {
      type: 'image' as const,
      metadata: {
        mime_type: 'image/webp',
        size: 1000
      },
      resource: {
        id: 'res_1',
        name: 'image.webp',
        path: 'content/media/image.webp',
        type: 'image/webp',
        size: 2000,
        storage: 'local',
        download_url: '/download',
        thumbnail_url: '/thumb'
      }
    };

    expect(getMediaPreviewUrl(media)).toBe('/thumb');
    expect(getMediaDownloadUrl(media)).toBe('/download');
    expect(getMediaMimeType(media)).toBe('image/webp');
    expect(getMediaSize(media)).toBe(1000);
  });
});
