import React, { useEffect, useMemo, useState } from 'react';

import { Button, Icons, Modal } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { getMediaList } from '../apis';
import type { Media } from '../media';
import { buildMediaRecordFromExistingResource } from '../media_resource';
import { useCreateMedia } from '../service';

import type { ResourceFile } from '@/features/resource/resource';
import { useListResources } from '@/features/resource/service';
import { useSpaceContext } from '@/features/space/context';

interface ResourceMediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (_media: Media | Media[]) => void;
  multiSelect?: boolean;
  source?: 'media' | 'topic' | 'taxonomy';
}

const resourceTitle = (resource: ResourceFile) =>
  resource.original_name || resource.name || resource.path || resource.id;

const resourceIcon = (resource: ResourceFile) => {
  if (resource.category === 'image' || resource.type?.startsWith('image/')) return 'IconPhoto';
  if (resource.category === 'video' || resource.type?.startsWith('video/')) return 'IconMovie';
  if (resource.category === 'audio' || resource.type?.startsWith('audio/')) return 'IconMusic';
  return 'IconFile';
};

const formatBytes = (size?: number) => {
  if (!size) return '-';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export const ResourceMediaPicker: React.FC<ResourceMediaPickerProps> = ({
  isOpen,
  onClose,
  onSuccess,
  multiSelect = false,
  source = 'media'
}) => {
  const { t } = useTranslation();
  const { space_id } = useSpaceContext();
  const createMediaMutation = useCreateMedia();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedResourceMap, setSelectedResourceMap] = useState<Record<string, ResourceFile>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resourceQuery = useMemo(
    () => ({
      search,
      category,
      limit: 50
    }),
    [category, search]
  );
  const { data, isLoading, isError } = useListResources(resourceQuery);
  const resources = data?.items || [];
  const selectedResources = Object.values(selectedResourceMap);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds(new Set());
    setSelectedResourceMap({});
    setError(null);
  }, [isOpen]);

  const toggleResource = (resource: ResourceFile) => {
    setSelectedIds(prev => {
      const next = new Set(multiSelect ? prev : []);
      if (next.has(resource.id)) {
        next.delete(resource.id);
      } else {
        next.add(resource.id);
      }
      return next;
    });
    setSelectedResourceMap(prev => {
      const next = multiSelect ? { ...prev } : {};
      if (next[resource.id]) {
        delete next[resource.id];
      } else {
        next[resource.id] = resource;
      }
      return next;
    });
  };

  const resolveMediaForResource = async (resource: ResourceFile) => {
    const existing = await getMediaList({ resource_id: resource.id, limit: 1 });
    const existingMedia = existing?.items?.[0];
    if (existingMedia) return existingMedia;

    return createMediaMutation.mutateAsync(
      buildMediaRecordFromExistingResource(resource, {
        ownerId: '',
        spaceId: space_id || '',
        source
      })
    );
  };

  const handleConfirm = async () => {
    if (selectedResources.length === 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const resolvedMedia: Media[] = [];
      for (const resource of selectedResources) {
        resolvedMedia.push((await resolveMediaForResource(resource)) as Media);
      }
      onSuccess?.(multiSelect ? resolvedMedia : resolvedMedia[0]);
      onClose();
    } catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : t('media.resource_picker.create_failed', 'Failed to create media from resource');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderResource = (resource: ResourceFile) => {
    const selected = selectedIds.has(resource.id);
    const previewUrl = resource.thumbnail_url || resource.download_url;

    return (
      <button
        key={resource.id}
        type='button'
        data-testid={`resource-media-picker-item-${resource.id}`}
        onClick={() => toggleResource(resource)}
        className={`min-w-0 rounded-lg border p-2 text-left transition-colors ${
          selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className='aspect-square overflow-hidden rounded-md bg-slate-100'>
          {resource.category === 'image' && previewUrl ? (
            <img
              src={previewUrl}
              alt={resourceTitle(resource)}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <Icons name={resourceIcon(resource)} size={28} className='text-slate-400' />
            </div>
          )}
        </div>
        <div className='mt-2 flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <div className='truncate text-sm font-medium text-slate-900'>
              {resourceTitle(resource)}
            </div>
            <div className='mt-0.5 truncate text-xs text-slate-500'>
              {resource.type || resource.category || 'file'} · {formatBytes(resource.size)}
            </div>
          </div>
          {selected && <Icons name='IconCheck' size={16} className='shrink-0 text-blue-600' />}
        </div>
      </button>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t('media.resource_picker.title', 'Select Existing Resources')}
      description={t(
        'media.resource_picker.description',
        'Selected files are reused as CMS media records. Existing media records are reused instead of duplicated.'
      )}
      onCancel={onClose}
      confirmText={t('media.resource_picker.confirm', 'Use Selected')}
      confirmDisabled={selectedResources.length === 0 || isLoading || isError || submitting}
      loading={submitting}
      onConfirm={handleConfirm}
      size='xl'
    >
      <div className='space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <input
            type='text'
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder={t('resource.placeholders.search', 'Search by filename')}
            className='min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500'
          />
          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            className='rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value=''>{t('resource.category.all', 'All categories')}</option>
            <option value='image'>{t('resource.category.image', 'Image')}</option>
            <option value='document'>{t('resource.category.document', 'Document')}</option>
            <option value='video'>{t('resource.category.video', 'Video')}</option>
            <option value='audio'>{t('resource.category.audio', 'Audio')}</option>
            <option value='archive'>{t('resource.category.archive', 'Archive')}</option>
            <option value='other'>{t('resource.category.other', 'Other')}</option>
          </select>
        </div>

        {error && (
          <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
            {error}
          </div>
        )}

        {isError ? (
          <div className='rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700'>
            {t('media.resource_picker.load_failed', 'Failed to load resources.')}
          </div>
        ) : isLoading ? (
          <div className='flex h-40 items-center justify-center'>
            <Icons name='IconLoader2' className='animate-spin text-slate-400' size={24} />
          </div>
        ) : resources.length > 0 ? (
          <div className='grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 lg:grid-cols-5'>
            {resources.map(renderResource)}
          </div>
        ) : (
          <div className='rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500'>
            {t('media.resource_picker.empty', 'No resources found.')}
          </div>
        )}

        <div className='flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500'>
          <span>
            {t('media.resource_picker.selected_count', '{{count}} selected', {
              count: selectedResources.length
            })}
          </span>
          <Button
            variant='outline'
            size='xs'
            disabled={selectedResources.length === 0 || submitting}
            onClick={() => {
              setSelectedIds(new Set());
              setSelectedResourceMap({});
            }}
          >
            {t('actions.clear', 'Clear')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
