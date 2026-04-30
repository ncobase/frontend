import { useState, useCallback, useEffect } from 'react';

import { Card, Button, Icons, Badge, TableView, useToastMessage } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';

import { BulkActions } from '../../components/BulkActions';
import { ContentSearch } from '../../components/ContentSearch';
import { useContentOperations } from '../../hooks/useContentOperations';
import { MediaUpload } from '../components/upload';
import type { Media } from '../media';
import { canDownloadMedia, downloadMediaFile } from '../media_download';
import { getMediaMimeType, getMediaPreviewUrl, getMediaSize } from '../media_resource';
import { useListMedia } from '../service';

import { Page, Topbar } from '@/components/layout';

export const MediaListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const resourceIdFilter = urlSearchParams.get('resource_id') || '';
  const [searchParams, setSearchParams] = useState<Record<string, any>>({
    search: '',
    type: '',
    resource_id: resourceIdFilter,
    limit: 50
  });
  const [selectedItems, setSelectedItems] = useState<Media[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: mediaData, isLoading, refetch } = useListMedia(searchParams);
  const { bulkDeleteMedia } = useContentOperations();

  const mediaItems = mediaData?.items || [];

  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      resource_id: resourceIdFilter,
      cursor: ''
    }));
  }, [resourceIdFilter]);

  const handleSearch = useCallback((query: string, filters: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      type: filters.type || '',
      cursor: ''
    }));
  }, []);

  const handleClearResourceFilter = useCallback(() => {
    const nextParams = new URLSearchParams(urlSearchParams);
    nextParams.delete('resource_id');
    setUrlSearchParams(nextParams, { replace: true });
    setSearchParams(prev => ({
      ...prev,
      resource_id: '',
      cursor: ''
    }));
  }, [setUrlSearchParams, urlSearchParams]);

  const handleToggleSelect = useCallback((item: Media) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      const success = await bulkDeleteMedia(ids);
      if (success) {
        setSelectedItems([]);
        refetch();
      }
    },
    [bulkDeleteMedia, refetch]
  );

  const handleDownloadMedia = useCallback(
    async (media: Media) => {
      setDownloadingId(media.id || null);
      try {
        await downloadMediaFile(media);
      } catch (error: any) {
        toast.error(t('messages.error', 'Error'), {
          description: error?.message || t('media.download_failed', 'Failed to download media')
        });
      } finally {
        setDownloadingId(null);
      }
    },
    [t, toast]
  );

  const isSelected = useCallback(
    (item: Media) => {
      return selectedItems.some(selected => selected.id === item.id);
    },
    [selectedItems]
  );

  const getTypeBadge = (type: string) => {
    const variants = {
      image: { variant: 'success', icon: 'IconPhoto' },
      video: { variant: 'primary', icon: 'IconMovie' },
      audio: { variant: 'warning', icon: 'IconMusic' },
      file: { variant: 'secondary', icon: 'IconFile' }
    };
    const config = variants[type] || variants.file;

    return (
      <Badge variant={config.variant} className='flex items-center gap-1 text-xs'>
        <Icons name={config.icon} size={12} />
        {type}
      </Badge>
    );
  };

  const filterOptions = {
    types: [
      { label: t('media.type.image'), value: 'image' },
      { label: t('media.type.video'), value: 'video' },
      { label: t('media.type.audio'), value: 'audio' },
      { label: t('media.type.file'), value: 'file' }
    ]
  };

  // Table columns for list view
  const columns = [
    {
      title: t('media.fields.title'),
      dataIndex: 'title',
      parser: (_: any, media: Media) => {
        const previewUrl = getMediaPreviewUrl(media);
        return (
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden'>
              {media.type === 'image' && previewUrl ? (
                <img
                  src={previewUrl}
                  alt={media.alt || media.title}
                  className='w-full h-full object-cover'
                />
              ) : (
                <Icons
                  name={
                    media.type === 'video'
                      ? 'IconMovie'
                      : media.type === 'audio'
                        ? 'IconMusic'
                        : 'IconFile'
                  }
                  size={20}
                  className='text-gray-400'
                />
              )}
            </div>
            <div>
              <div className='font-medium text-gray-900'>{media.title}</div>
              <div className='text-sm text-gray-500'>{getMediaMimeType(media)}</div>
            </div>
          </div>
        );
      }
    },
    {
      title: t('media.fields.type'),
      dataIndex: 'type',
      width: 100,
      parser: (type: string) => getTypeBadge(type)
    },
    {
      title: t('media.fields.size'),
      dataIndex: 'size',
      width: 100,
      parser: (_size: number, media: Media) => {
        const size = getMediaSize(media);
        return (
          <span className='text-sm text-gray-600'>
            {size ? `${(size / 1024).toFixed(1)} KB` : '-'}
          </span>
        );
      }
    },
    {
      title: t('media.fields.dimensions'),
      dataIndex: 'width',
      width: 120,
      parser: (_: any, media: Media) => (
        <span className='text-sm text-gray-600'>
          {media.width && media.height ? `${media.width} × ${media.height}` : '-'}
        </span>
      )
    },
    {
      title: t('media.fields.created_at'),
      dataIndex: 'created_at',
      width: 120,
      parser: (created_at: string) => (
        <span className='text-sm text-gray-500'>{formatDateTime(created_at)}</span>
      )
    },
    {
      title: t('common.actions'),
      filter: false,
      parser: (_: any, media: Media) => (
        <div className='flex space-x-1'>
          <Button variant='text' size='xs' onClick={() => navigate(`/content/media/${media.id}`)}>
            <Icons name='IconEye' size={14} className='mr-1' />
            {t('actions.view')}
          </Button>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/media/${media.id}/edit`)}
          >
            <Icons name='IconEdit' size={14} className='mr-1' />
            {t('actions.edit')}
          </Button>
          {canDownloadMedia(media) && (
            <Button
              variant='text'
              size='xs'
              isLoading={downloadingId === media.id}
              onClick={() => handleDownloadMedia(media)}
            >
              <Icons name='IconDownload' size={14} className='mr-1' />
              {t('actions.download')}
            </Button>
          )}
        </div>
      )
    }
  ];

  // Grid item renderer
  const renderMediaCard = (media: Media) => {
    const isSelectedItem = isSelected(media);
    const previewUrl = getMediaPreviewUrl(media);
    const size = getMediaSize(media);

    return (
      <Card key={media.id} className='relative group overflow-hidden'>
        <div className='aspect-[4/3] bg-gray-100 flex items-center justify-center'>
          {media.type === 'image' && previewUrl ? (
            <img
              src={previewUrl}
              alt={media.alt || media.title}
              className='w-full h-full object-cover'
            />
          ) : (
            <Icons
              name={
                media.type === 'video'
                  ? 'IconMovie'
                  : media.type === 'audio'
                    ? 'IconMusic'
                    : 'IconFile'
              }
              size={32}
              className='text-gray-400'
            />
          )}
        </div>

        {/* Selection checkbox */}
        <div className='absolute top-2 left-2 z-10'>
          <input
            type='checkbox'
            checked={isSelectedItem}
            onChange={() => handleToggleSelect(media)}
            className='w-4 h-4 text-blue-600 border-white rounded focus:ring-blue-500'
          />
        </div>

        {/* Type badge */}
        <div className='absolute top-2 right-2 z-10'>{getTypeBadge(media.type)}</div>

        {/* Actions */}
        <div className='absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100'>
          <div className='flex space-x-2'>
            <Button
              variant='ghost'
              onClick={() => navigate(`/content/media/${media.id}`)}
              className='bg-white text-gray-700 hover:bg-gray-100'
            >
              <Icons name='IconEye' size={16} />
            </Button>
            <Button
              variant='ghost'
              onClick={() => navigate(`/content/media/${media.id}/edit`)}
              className='bg-white text-gray-700 hover:bg-gray-100'
            >
              <Icons name='IconEdit' size={16} />
            </Button>
            {canDownloadMedia(media) && (
              <Button
                variant='ghost'
                size='sm'
                isLoading={downloadingId === media.id}
                onClick={() => handleDownloadMedia(media)}
                className='bg-white text-gray-700 hover:bg-gray-100'
              >
                <Icons name='IconDownload' size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Media info */}
        <div className='px-2 py-4 space-y-2'>
          <h3 className='font-medium text-xs truncate'>{media.title}</h3>
          <div className='flex items-center justify-between text-xs text-gray-500 mt-0.5'>
            <span className='truncate max-w-[60%]'>{getMediaMimeType(media)}</span>
            {size ? <span>{(size / 1024).toFixed(1)} KB</span> : null}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Page
      sidebar
      title={t('content.media.title')}
      topbar={
        <Topbar
          title={t('content.media.description')}
          right={[
            <Button
              variant='unstyle'
              size='lg'
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <Icons name={viewMode === 'grid' ? 'IconList' : 'IconGridPattern'} />
            </Button>,
            <Button size='sm' onClick={() => setShowUpload(true)}>
              <Icons name='IconUpload' size={16} className='mr-1' />
              {t('content.media.upload')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Search */}
      <ContentSearch
        onSearch={handleSearch}
        placeholder={t('content.media.search_placeholder')}
        showFilters={true}
        filterOptions={filterOptions}
      />

      {resourceIdFilter && (
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800'>
          <div className='flex min-w-0 items-center gap-2'>
            <Icons name='IconLink' size={16} className='shrink-0' />
            <span className='min-w-0 truncate'>
              {t('media.filters.resource_id', 'Filtered by resource')}{' '}
              <code className='rounded bg-white/70 px-1 py-0.5'>{resourceIdFilter}</code>
            </span>
          </div>
          <Button variant='outline' size='xs' onClick={handleClearResourceFilter}>
            {t('actions.clear', 'Clear')}
          </Button>
        </div>
      )}

      {/* Media List */}
      <div>
        {isLoading ? (
          <div className='flex items-center justify-center h-48'>
            <Icons name='IconLoader2' className='animate-spin' size={24} />
          </div>
        ) : mediaItems.length > 0 ? (
          viewMode === 'list' ? (
            <TableView
              header={columns}
              selected
              data={mediaItems}
              onSelectRow={row => {
                handleToggleSelect(row);
              }}
              onSelectAllRows={rows => {
                setSelectedItems(rows);
              }}
            />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
              {mediaItems.map(renderMediaCard)}
            </div>
          )
        ) : (
          <div className='flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 py-12'>
            <Icons name='IconPhoto' size={48} className='text-gray-400 mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {t('content.media.empty.title')}
            </h3>
            <p className='text-sm text-gray-500 mb-6 max-w-md text-center'>
              {t('content.media.empty.description')}
            </p>
            <Button size='lg' onClick={() => setShowUpload(true)}>
              <Icons name='IconUpload' size={20} className='mr-2' />
              {t('content.media.upload')}
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedItems([])}
        onBulkDelete={handleBulkDelete}
        onBulkExport={ids => {
          console.log('Export media:', ids);
        }}
      />

      {/* Upload Modal */}
      <MediaUpload
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </Page>
  );
};
