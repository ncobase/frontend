import React, { useEffect, useMemo, useState } from 'react';

import { Button, Icons, Modal, useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { MediaGallery } from '../../media/components/gallery';
import { MediaUpload } from '../../media/components/upload';
import type { Media } from '../../media/media';
import { getMediaPreviewUrl } from '../../media/media_resource';
import { type TopicMedia, useQueryTopicMedia, useSyncTopicMedia } from '../service';
import {
  buildTopicMediaPayload,
  createEmptyTopicMediaByType,
  getTopicMediaItemMediaId,
  groupTopicMediaByType,
  TOPIC_MEDIA_TYPES,
  type TopicMediaByType,
  type TopicMediaType
} from '../topic_media_helpers';

interface TopicMediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  topicId?: string;
  existingMedia?: TopicMedia[];
  onSave?: (_topicMedia: TopicMedia[]) => void;
  disabled?: boolean;
}

interface TopicMediaFieldProps {
  topicId?: string;
  value?: TopicMedia[];
  onChange?: (_topicMedia: TopicMedia[]) => void;
  disabled?: boolean;
}

const mediaTypeMeta: Record<
  TopicMediaType,
  { title: string; emptyIcon: string; maxItems?: number; gridClass: string }
> = {
  featured: {
    title: 'Featured Image',
    emptyIcon: 'IconPhoto',
    maxItems: 1,
    gridClass: 'grid-cols-1 sm:grid-cols-2'
  },
  gallery: {
    title: 'Gallery Images',
    emptyIcon: 'IconPhoto',
    gridClass: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  },
  attachment: {
    title: 'Attachments',
    emptyIcon: 'IconPaperclip',
    gridClass: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  }
};

const mediaIcon = (media?: Media) => {
  if (media?.type === 'video') return 'IconMovie';
  if (media?.type === 'audio') return 'IconMusic';
  return 'IconFile';
};

const mediaTitle = (item: TopicMedia) =>
  item.media?.title || item.media?.resource?.name || item.media_id;

const mediaFromItem = (item: TopicMedia) => item.media;

const itemMatchesMedia = (item: TopicMedia, mediaId: string) =>
  getTopicMediaItemMediaId(item) === mediaId;

export const TopicMediaManager: React.FC<TopicMediaManagerProps> = ({
  isOpen,
  onClose,
  topicId,
  existingMedia = [],
  onSave,
  disabled = false
}) => {
  const { t } = useTranslation();
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: persistedMedia = [], isLoading, isError } = useQueryTopicMedia(topicId || '');
  const syncTopicMediaMutation = useSyncTopicMedia();
  const sourceMedia = useMemo(
    () => (topicId ? persistedMedia : existingMedia),
    [existingMedia, persistedMedia, topicId]
  );
  const [mediaByType, setMediaByType] = useState<TopicMediaByType>(createEmptyTopicMediaByType);
  const [currentType, setCurrentType] = useState<TopicMediaType>('gallery');

  useEffect(() => {
    if (!isOpen) return;
    setSaveError(null);
    setMediaByType(groupTopicMediaByType(sourceMedia));
  }, [isOpen, sourceMedia]);

  const handleMediaSelect = (media: Media, type: TopicMediaType) => {
    if (!media.id) return;

    setMediaByType(prev => {
      const next = createEmptyTopicMediaByType();

      TOPIC_MEDIA_TYPES.forEach(mediaType => {
        next[mediaType] = prev[mediaType].filter(item => !itemMatchesMedia(item, media.id!));
      });

      const item: TopicMedia = {
        media,
        type,
        topic_id: topicId,
        media_id: media.id,
        order: type === 'featured' ? 0 : next[type].length
      };

      next[type] = type === 'featured' ? [item] : [...next[type], item];
      return next;
    });

    if (type === 'featured') {
      setShowMediaGallery(false);
    }
  };

  const handleRemoveMedia = (mediaId: string | undefined, type: TopicMediaType) => {
    if (!mediaId) return;
    setMediaByType(prev => ({
      ...prev,
      [type]: prev[type].filter(item => !itemMatchesMedia(item, mediaId))
    }));
  };

  const handleMoveMedia = (type: TopicMediaType, index: number, direction: -1 | 1) => {
    setMediaByType(prev => {
      const nextIndex = index + direction;
      const mediaList = [...prev[type]];

      if (nextIndex < 0 || nextIndex >= mediaList.length) {
        return prev;
      }

      [mediaList[index], mediaList[nextIndex]] = [mediaList[nextIndex], mediaList[index]];

      return {
        ...prev,
        [type]: mediaList.map((item, order) => ({ ...item, order }))
      };
    });
  };

  const handleSave = async () => {
    setSaveError(null);
    const allMedia = buildTopicMediaPayload(mediaByType, topicId);

    try {
      const savedMedia = topicId
        ? await syncTopicMediaMutation.mutateAsync({ topicId, media: allMedia })
        : allMedia;
      onSave?.(savedMedia);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t('topic.media.save_error', 'Failed to save topic media');
      setSaveError(message);
    }
  };

  const handleUploadSuccess = (media: Media | Media[]) => {
    const items = Array.isArray(media) ? media : [media];
    items.filter(Boolean).forEach(item => handleMediaSelect(item, currentType));
  };

  const selectedMedia = buildTopicMediaPayload(mediaByType)
    .map(item => mediaFromItem(item))
    .filter(Boolean) as Media[];

  const renderMediaSection = (type: TopicMediaType) => {
    const meta = mediaTypeMeta[type];
    const mediaList = mediaByType[type] || [];
    const canAddMore = !meta.maxItems || mediaList.length < meta.maxItems;

    return (
      <div key={type} className='space-y-3'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h4 className='font-medium text-gray-900'>{meta.title}</h4>
            <p className='text-xs text-gray-500'>
              {mediaList.length} {mediaList.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {canAddMore && (
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={disabled || syncTopicMediaMutation.isPending}
                onClick={() => {
                  setCurrentType(type);
                  setShowMediaUpload(true);
                }}
              >
                <Icons name='IconUpload' size={16} className='mr-1' />
                {t('actions.upload', 'Upload')}
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={disabled || syncTopicMediaMutation.isPending}
                onClick={() => {
                  setCurrentType(type);
                  setShowMediaGallery(true);
                }}
              >
                <Icons name='IconPhoto' size={16} className='mr-1' />
                {t('topic.media.gallery', 'Gallery')}
              </Button>
            </div>
          )}
        </div>

        {mediaList.length > 0 ? (
          <div className={`grid gap-3 ${meta.gridClass}`}>
            {mediaList.map((item, index) => {
              const media = mediaFromItem(item);
              const mediaId = getTopicMediaItemMediaId(item);
              const previewUrl = media ? getMediaPreviewUrl(media) : '';
              const controlsDisabled = disabled || syncTopicMediaMutation.isPending;

              return (
                <div key={`${mediaId}-${index}`} className='min-w-0'>
                  <div
                    className={`bg-gray-100 rounded-lg overflow-hidden ${
                      type === 'featured' ? 'aspect-video' : 'aspect-square'
                    }`}
                  >
                    {media?.type === 'image' && previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={media.alt || media.title || mediaId}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <Icons
                          name={mediaIcon(media)}
                          size={type === 'featured' ? 32 : 24}
                          className='text-gray-400'
                        />
                      </div>
                    )}
                  </div>
                  <div className='mt-2 flex items-center justify-between gap-2'>
                    <p className='min-w-0 truncate text-xs text-gray-600'>{mediaTitle(item)}</p>
                    <div className='flex shrink-0 items-center gap-1'>
                      {mediaList.length > 1 && (
                        <>
                          <button
                            type='button'
                            aria-label={t('topic.media.move_up', 'Move media up')}
                            disabled={controlsDisabled || index === 0}
                            onClick={() => handleMoveMedia(type, index, -1)}
                            className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
                          >
                            <Icons name='IconChevronUp' size={14} />
                          </button>
                          <button
                            type='button'
                            aria-label={t('topic.media.move_down', 'Move media down')}
                            disabled={controlsDisabled || index === mediaList.length - 1}
                            onClick={() => handleMoveMedia(type, index, 1)}
                            className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
                          >
                            <Icons name='IconChevronDown' size={14} />
                          </button>
                        </>
                      )}
                      <button
                        type='button'
                        aria-label={t('topic.media.remove', 'Remove media')}
                        disabled={controlsDisabled}
                        onClick={() => handleRemoveMedia(mediaId, type)}
                        className='flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40'
                      >
                        <Icons name='IconTrash' size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
            <Icons name={meta.emptyIcon} size={32} className='mx-auto text-gray-400 mb-2' />
            <p className='text-sm text-gray-500'>
              {t('topic.media.empty_type', 'No {{type}} added', {
                type: meta.title.toLowerCase()
              })}
            </p>
            {meta.maxItems && (
              <p className='text-xs text-gray-400 mt-1'>
                {t('topic.media.max_items', 'Max {{count}} item', { count: meta.maxItems })}
              </p>
            )}
          </div>
        )}

        {meta.maxItems && mediaList.length >= meta.maxItems && (
          <p className='text-xs text-orange-600'>
            {t('topic.media.max_reached', 'Maximum {{count}} {{type}} reached', {
              count: meta.maxItems,
              type: meta.title.toLowerCase()
            })}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={t('topic.media.manage', 'Manage Topic Media')}
        description={t(
          'topic.media.manage_description',
          'Media can only belong to one topic media type at a time. Selecting it in another section moves it there.'
        )}
        onCancel={onClose}
        confirmText={t('actions.save', 'Save')}
        confirmDisabled={disabled || isLoading}
        loading={syncTopicMediaMutation.isPending}
        onConfirm={handleSave}
        size='xl'
      >
        <div className='space-y-8'>
          {saveError && (
            <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {saveError}
            </div>
          )}
          {isError && (
            <div className='rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700'>
              {t('topic.media.load_error', 'Failed to load saved topic media.')}
            </div>
          )}
          {isLoading ? (
            <div className='flex items-center justify-center h-24'>
              <Icons name='IconLoader2' className='animate-spin' size={24} />
            </div>
          ) : (
            TOPIC_MEDIA_TYPES.map(type => renderMediaSection(type))
          )}
        </div>
      </Modal>

      <MediaGallery
        isOpen={showMediaGallery}
        onClose={() => setShowMediaGallery(false)}
        onSelect={media => handleMediaSelect(media, currentType)}
        selectedMedia={selectedMedia}
        multiSelect={currentType !== 'featured'}
      />

      <MediaUpload
        isOpen={showMediaUpload}
        onClose={() => setShowMediaUpload(false)}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
};

export const TopicMediaField: React.FC<TopicMediaFieldProps> = ({
  topicId,
  value = [],
  onChange,
  disabled = false
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const {
    data: persistedMedia = [],
    isLoading,
    isError,
    refetch
  } = useQueryTopicMedia(topicId || '');
  const sourceMedia = topicId ? persistedMedia : value;
  const groupedMedia = useMemo(() => groupTopicMediaByType(sourceMedia), [sourceMedia]);
  const mediaItems = useMemo(() => buildTopicMediaPayload(groupedMedia), [groupedMedia]);

  const handleSave = (nextMedia: TopicMedia[]) => {
    if (topicId) {
      refetch();
      toast.success(t('topic.media.save_success', 'Topic media saved'));
      return;
    }
    onChange?.(nextMedia);
  };

  return (
    <div className='col-span-full space-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h3 className='text-sm font-medium text-slate-900'>
            {t('topic.media.manager_title', 'Featured, gallery, and attachments')}
          </h3>
          <p className='mt-1 text-xs text-slate-500'>
            {topicId
              ? t('topic.media.persisted_hint', 'Changes are saved to topic media relations.')
              : t(
                  'topic.media.pending_hint',
                  'Selections are stored with the draft and linked after the topic is created.'
                )}
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          disabled={disabled || isLoading}
          onClick={() => setIsManagerOpen(true)}
        >
          <Icons name='IconPhotoEdit' size={16} className='mr-1' />
          {t('topic.media.manage', 'Manage Topic Media')}
        </Button>
      </div>

      {isError ? (
        <div className='rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700'>
          {t('topic.media.load_error', 'Failed to load saved topic media.')}
        </div>
      ) : isLoading ? (
        <div className='flex items-center gap-2 text-sm text-slate-500'>
          <Icons name='IconLoader2' className='animate-spin' size={16} />
          {t('common.loading', 'Loading...')}
        </div>
      ) : mediaItems.length > 0 ? (
        <div className='flex flex-wrap gap-3'>
          {TOPIC_MEDIA_TYPES.map(type => (
            <div key={type} className='rounded-md border border-slate-200 bg-white px-3 py-2'>
              <div className='text-xs font-medium text-slate-600'>{mediaTypeMeta[type].title}</div>
              <div className='mt-1 text-lg font-semibold text-slate-900'>
                {groupedMedia[type].length}
              </div>
            </div>
          ))}
          <div className='flex min-w-0 flex-1 items-center gap-2'>
            {mediaItems.slice(0, 6).map(item => {
              const media = mediaFromItem(item);
              const mediaId = getTopicMediaItemMediaId(item);
              const previewUrl = media ? getMediaPreviewUrl(media) : '';

              return (
                <div
                  key={mediaId}
                  className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100'
                  title={mediaTitle(item)}
                >
                  {media?.type === 'image' && previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={media.alt || media.title || mediaId}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <Icons name={mediaIcon(media)} size={20} className='text-slate-400' />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-2 text-sm text-slate-500'>
          <Icons name='IconPhoto' size={18} className='text-slate-400' />
          {t('topic.media.empty', 'No topic media selected')}
        </div>
      )}

      <TopicMediaManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        topicId={topicId}
        existingMedia={value}
        onSave={handleSave}
        disabled={disabled}
      />
    </div>
  );
};
