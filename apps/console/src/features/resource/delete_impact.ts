import type { ResourceFile } from './resource';

import { getMediaList } from '@/features/content/media/apis';
import type { Media } from '@/features/content/media/media';
import { getTopic, getTopicMediaList } from '@/features/content/topic/apis';
import type { Topic } from '@/features/content/topic/topic';
import type { TopicMedia } from '@/features/content/topic/topic_media';

type ListParams = Record<string, unknown>;

interface ListResponse<T> {
  items?: T[];
  total?: number;
  next_cursor?: string;
  has_next?: boolean;
}

interface FetchAllPagesResult<T> {
  items: T[];
  total: number;
  complete: boolean;
}

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
  listMedia: (_params: ListParams) => Promise<ListResponse<Media> | Media[]>;
  listTopicMedia: (_params: ListParams) => Promise<ListResponse<TopicMedia> | TopicMedia[]>;
  getTopic: (_topicId: string) => Promise<Topic>;
}

const defaultFetchers: ResourceDeleteImpactFetchers = {
  listMedia: getMediaList as ResourceDeleteImpactFetchers['listMedia'],
  listTopicMedia: getTopicMediaList as ResourceDeleteImpactFetchers['listTopicMedia'],
  getTopic
};

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

const asListResponse = <T>(response: ListResponse<T> | T[]): ListResponse<T> => {
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      has_next: false
    };
  }
  return response || {};
};

const fetchAllPages = async <T>(
  fetchPage: (_params: ListParams) => Promise<ListResponse<T> | T[]>,
  baseParams: ListParams
): Promise<FetchAllPagesResult<T>> => {
  const items: T[] = [];
  let cursor = typeof baseParams.cursor === 'string' ? baseParams.cursor : '';
  let total = 0;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = asListResponse(
      await fetchPage({
        ...baseParams,
        cursor,
        limit: baseParams.limit || PAGE_SIZE
      })
    );

    const pageItems = Array.isArray(response.items) ? response.items : [];
    items.push(...pageItems);
    total = Math.max(total, response.total ?? items.length);

    if (!response.has_next) {
      return {
        items,
        total: total || items.length,
        complete: true
      };
    }

    if (!response.next_cursor) {
      return {
        items,
        total: total || items.length,
        complete: false
      };
    }

    cursor = response.next_cursor;
  }

  return {
    items,
    total: total || items.length,
    complete: false
  };
};

const uniqueTopicIds = (impacts: ResourceDeleteImpact[]) =>
  Array.from(
    new Set(
      impacts
        .flatMap(impact => impact.topicReferences.map(reference => reference.relation.topic_id))
        .filter((topicId): topicId is string => !!topicId)
    )
  );

const loadTopicMap = async (
  topicIds: string[],
  fetchers: ResourceDeleteImpactFetchers
): Promise<Map<string, Topic>> => {
  const topicMap = new Map<string, Topic>();
  const results = await Promise.allSettled(
    topicIds.map(async topicId => ({
      topicId,
      topic: await fetchers.getTopic(topicId)
    }))
  );

  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value.topic) {
      topicMap.set(result.value.topicId, result.value.topic);
    }
  });

  return topicMap;
};

const attachTopics = (impacts: ResourceDeleteImpact[], topicMap: Map<string, Topic>) =>
  impacts.map(impact => ({
    ...impact,
    topicReferences: impact.topicReferences.map(reference => ({
      ...reference,
      topic: reference.relation.topic_id ? topicMap.get(reference.relation.topic_id) : undefined
    }))
  }));

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
  const impacts = await Promise.all(
    files.map(async file => {
      const impact: ResourceDeleteImpact = {
        file,
        mediaReferences: [],
        topicReferences: [],
        mediaReferenceTotal: 0,
        topicReferenceTotal: 0,
        mediaReferencesComplete: true,
        topicReferencesComplete: true,
        errors: []
      };

      try {
        const mediaPage = await fetchAllPages<Media>(fetchers.listMedia, {
          resource_id: file.id
        });
        impact.mediaReferences = mediaPage.items;
        impact.mediaReferenceTotal = mediaPage.total;
        impact.mediaReferencesComplete = mediaPage.complete;
        if (!mediaPage.complete) {
          impact.errors.push('Media reference pagination did not complete.');
        }
      } catch (error) {
        impact.mediaReferencesComplete = false;
        impact.errors.push(
          error instanceof Error ? error.message : 'Failed to load media references.'
        );
        return impact;
      }

      const topicReferenceResults = await Promise.all(
        impact.mediaReferences
          .filter((media): media is Media & { id: string } => !!media.id)
          .map(async media => {
            try {
              const topicMediaPage = await fetchAllPages<TopicMedia>(fetchers.listTopicMedia, {
                media_id: media.id
              });
              return {
                media,
                items: topicMediaPage.items,
                total: topicMediaPage.total,
                complete: topicMediaPage.complete,
                error: ''
              };
            } catch (error) {
              return {
                media,
                items: [] as TopicMedia[],
                total: 0,
                complete: false,
                error:
                  error instanceof Error ? error.message : 'Failed to load topic media references.'
              };
            }
          })
      );

      topicReferenceResults.forEach(result => {
        impact.topicReferenceTotal += result.total;
        impact.topicReferences.push(
          ...result.items.map(relation => ({
            media: result.media,
            relation
          }))
        );
        if (!result.complete) {
          impact.topicReferencesComplete = false;
          impact.errors.push(result.error || 'Topic reference pagination did not complete.');
        }
      });

      return impact;
    })
  );

  const topicMap = await loadTopicMap(uniqueTopicIds(impacts), fetchers);
  return attachTopics(impacts, topicMap);
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
