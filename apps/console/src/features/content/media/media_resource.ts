import { useCallback, useState } from 'react';

import { locals } from '@ncobase/utils';

import type { Media } from './media';
import {
  buildMediaRecordFromResource,
  getMediaResourceUrl,
  getMediaTypeFromFile,
  type ContentMediaSource
} from './media_resource_helpers';
import { useCreateMedia } from './service';

import { ACCESS_TOKEN_KEY, useAuthContext } from '@/features/account/context';
import { tokenService } from '@/features/account/token_service';
import { upload } from '@/features/resource/apis';
import type { ResourceFile } from '@/features/resource/resource';
import { buildResourceUploadFormData } from '@/features/resource/upload_payload';
import { useSpaceContext } from '@/features/space/context';

export {
  buildMediaRecordFromExistingResource,
  buildMediaRecordFromResource,
  getMediaDownloadUrl,
  getMediaMimeType,
  getMediaPreviewUrl,
  getMediaResourceUrl,
  getMediaSize,
  getMediaTypeFromFile,
  getMediaTypeFromResource
} from './media_resource_helpers';
export type { ContentMediaSource } from './media_resource_helpers';

export interface MediaResourceUploadOptions {
  source: ContentMediaSource;
  pathPrefix?: string;
  tags?: string[];
  createMediaRecord?: boolean;
  accessLevel?: 'public' | 'private' | 'shared';
  isPublic?: boolean;
}

export interface MediaResourceUploadResult extends ResourceFile {
  media?: Media;
  url?: string;
  download_url?: string;
  thumbnail_url?: string;
}

const getUserId = (user?: any) => {
  if (user?.id) return user.id;
  const token = locals.get(ACCESS_TOKEN_KEY);
  return token ? tokenService.getUserIdFromToken(token) : '';
};

const getPathPrefix = (source: ContentMediaSource, pathPrefix?: string) =>
  pathPrefix || `content/${source}`;

export const useMediaResourceUpload = ({
  source,
  pathPrefix,
  tags = [],
  createMediaRecord = true,
  accessLevel = 'private',
  isPublic = false
}: MediaResourceUploadOptions) => {
  const { user } = useAuthContext();
  const { space_id } = useSpaceContext();
  const createMediaMutation = useCreateMedia();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaResourceUploadResult | null>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<MediaResourceUploadResult> => {
      const ownerId = getUserId(user);
      const spaceId = space_id;

      if (!ownerId) {
        throw new Error('Current user is required for media upload');
      }
      if (!spaceId) {
        throw new Error('Current space is required for media upload');
      }

      setUploading(true);
      setProgress(10);
      setError(null);
      setResult(null);

      try {
        const mediaType = getMediaTypeFromFile(file);
        const data = buildResourceUploadFormData(
          [file],
          {
            access_level: accessLevel,
            is_public: isPublic,
            path_prefix: getPathPrefix(source, pathPrefix),
            tags: Array.from(new Set(['cms', source, mediaType, ...tags])),
            processing_options:
              mediaType === 'image'
                ? {
                    create_thumbnail: true,
                    compress_image: true,
                    compression_quality: 85
                  }
                : undefined
          },
          'file'
        );
        data.append('owner_id', ownerId);
        data.append('space_id', spaceId);

        const resource = await upload(data, { owner_id: ownerId });
        setProgress(70);

        const mediaPayload = buildMediaRecordFromResource(file, resource, {
          ownerId,
          spaceId,
          source
        });
        const media = createMediaRecord
          ? await createMediaMutation.mutateAsync(mediaPayload)
          : undefined;

        const uploadResult: MediaResourceUploadResult = {
          ...resource,
          media,
          url: media?.url || getMediaResourceUrl(resource),
          download_url: resource.download_url,
          thumbnail_url: resource.thumbnail_url
        };

        setProgress(100);
        setResult(uploadResult);
        return uploadResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [
      accessLevel,
      createMediaMutation,
      createMediaRecord,
      isPublic,
      pathPrefix,
      source,
      space_id,
      tags,
      user
    ]
  );

  return {
    uploadFile,
    uploading: uploading || createMediaMutation.isPending,
    progress,
    error,
    result
  };
};
