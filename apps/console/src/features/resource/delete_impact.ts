import { getBatchDeleteImpact } from './apis';
import type {
  ResourceDeleteImpact as ApiResourceDeleteImpact,
  ResourceDeleteImpactResponse,
  ResourceFile
} from './resource';

import type { Media } from '@/features/content/media/media';
import type { Topic } from '@/features/content/topic/topic';
import type { TopicMedia } from '@/features/content/topic/topic_media';

export interface ResourceTopicReference {
  media: Media;
  relation: TopicMedia;
  topic?: Topic;
}

export interface ResourceDeleteImpact {
  file: ResourceFile;
  mediaReferences: Media[];
  topicReferences: ResourceTopicReference[];
  mediaReferenceTotal: number;
  topicReferenceTotal: number;
  mediaReferencesComplete: boolean;
  topicReferencesComplete: boolean;
  errors: string[];
}

export interface ResourceDeleteImpactSummary {
  fileCount: number;
  referencedFileCount: number;
  mediaReferenceCount: number;
  topicReferenceCount: number;
  errorCount: number;
  canDelete: boolean;
}

export interface ResourceDeleteImpactFetchers {
  getDeleteImpacts: (_ids: string[]) => Promise<ResourceDeleteImpactResponse>;
}

const defaultFetchers: ResourceDeleteImpactFetchers = {
  getDeleteImpacts: getBatchDeleteImpact
};

const byFileId = (files: ResourceFile[]) =>
  files.reduce<Record<string, ResourceFile>>((acc, file) => {
    if (file.id) acc[file.id] = file;
    return acc;
  }, {});

const toMedia = (media: ApiResourceDeleteImpact['media_references'][number]): Media => ({
  id: media.id,
  title: media.title,
  type: media.type as Media['type'],
  url: media.url,
  resource_id: media.resource_id,
  path: media.path,
  mime_type: media.mime_type,
  size: media.size,
  description: media.description,
  alt: media.alt,
  metadata: media.metadata,
  space_id: media.space_id,
  owner_id: media.owner_id,
  created_by: media.created_by,
  created_at: media.created_at ? String(media.created_at) : undefined,
  updated_by: media.updated_by,
  updated_at: media.updated_at ? String(media.updated_at) : undefined
});

const toTopicMedia = (
  relation?: ApiResourceDeleteImpact['topic_references'][number]['relation']
): TopicMedia => ({
  id: relation?.id,
  topic_id: relation?.topic_id,
  media_id: relation?.media_id,
  type: relation?.type as TopicMedia['type'],
  order: relation?.order,
  created_by: relation?.created_by,
  created_at: relation?.created_at ? String(relation.created_at) : undefined,
  updated_by: relation?.updated_by,
  updated_at: relation?.updated_at ? String(relation.updated_at) : undefined
});

const toTopic = (
  topic?: ApiResourceDeleteImpact['topic_references'][number]['topic']
): Topic | undefined =>
  topic
    ? {
        id: topic.id,
        name: topic.name,
        title: topic.title,
        slug: topic.slug,
        content_type: topic.content_type,
        status: topic.status,
        featured_media: topic.featured_media,
        tags: topic.tags,
        space_id: topic.space_id,
        created_by: topic.created_by,
        created_at: topic.created_at ? String(topic.created_at) : undefined,
        updated_by: topic.updated_by,
        updated_at: topic.updated_at ? String(topic.updated_at) : undefined
      }
    : undefined;

const normalizeImpact = (
  impact: ApiResourceDeleteImpact,
  originalFiles: Record<string, ResourceFile>
): ResourceDeleteImpact => {
  const file = impact.file || originalFiles[impact.file?.id || ''];
  const mediaReferences = (impact.media_references || []).map(toMedia);
  const mediaById = mediaReferences.reduce<Record<string, Media>>((acc, media) => {
    if (media.id) acc[media.id] = media;
    return acc;
  }, {});

  return {
    file,
    mediaReferences,
    topicReferences: (impact.topic_references || []).map(reference => {
      const relation = toTopicMedia(reference.relation);
      const media =
        reference.media?.id && mediaById[reference.media.id]
          ? mediaById[reference.media.id]
          : reference.media
            ? toMedia(reference.media)
            : mediaById[relation.media_id || ''] || ({} as Media);

      return {
        media,
        relation,
        topic: toTopic(reference.topic)
      };
    }),
    mediaReferenceTotal: impact.media_reference_total || 0,
    topicReferenceTotal: impact.topic_reference_total || 0,
    mediaReferencesComplete: impact.media_references_complete,
    topicReferencesComplete: impact.topic_references_complete,
    errors: impact.errors || []
  };
};

export const getResourceDisplayName = (file: ResourceFile) =>
  file.original_name || file.name || file.id;

export const getMediaDisplayName = (media: Media) =>
  media.title || media.resource?.name || media.path || media.id || '';

export const getTopicDisplayName = (reference: ResourceTopicReference) =>
  reference.topic?.title ||
  reference.topic?.name ||
  reference.topic?.slug ||
  reference.relation.topic_id ||
  '';

export const fetchResourceDeleteImpact = async (
  files: ResourceFile[],
  fetchers: ResourceDeleteImpactFetchers = defaultFetchers
): Promise<ResourceDeleteImpact[]> => {
  const ids = files.map(file => file.id).filter(Boolean);
  if (ids.length === 0) return [];

  const response = await fetchers.getDeleteImpacts(ids);
  const originals = byFileId(files);
  return (response.impacts || []).map(impact => normalizeImpact(impact, originals));
};

export const summarizeResourceDeleteImpacts = (
  impacts: ResourceDeleteImpact[]
): ResourceDeleteImpactSummary => {
  const mediaReferenceCount = impacts.reduce((sum, impact) => sum + impact.mediaReferenceTotal, 0);
  const topicReferenceCount = impacts.reduce((sum, impact) => sum + impact.topicReferenceTotal, 0);
  const errorCount = impacts.reduce((sum, impact) => sum + impact.errors.length, 0);
  const referencedFileCount = impacts.filter(
    impact => impact.mediaReferenceTotal > 0 || impact.topicReferenceTotal > 0
  ).length;

  return {
    fileCount: impacts.length,
    referencedFileCount,
    mediaReferenceCount,
    topicReferenceCount,
    errorCount,
    canDelete: referencedFileCount === 0 && errorCount === 0
  };
};
