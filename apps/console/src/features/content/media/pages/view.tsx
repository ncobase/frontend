import { useState } from 'react';

import { Card, Button, Icons, useToastMessage } from '@ncobase/react';
import { useParams, useNavigate } from 'react-router';

import { canDownloadMedia, downloadMediaFile } from '../media_download';
import {
  getMediaDownloadUrl,
  getMediaMimeType,
  getMediaPreviewUrl,
  getMediaSize
} from '../media_resource';
import { useQueryMedia } from '../service';

import { ErrorPage } from '@/components/errors';
import { Page, Topbar } from '@/components/layout';
import { useListTopicMediaByMedia } from '@/features/content/topic/service';

export const MediaViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToastMessage();
  const { data: media, isLoading, error } = useQueryMedia(id!);
  const {
    data: topicReferences = [],
    isLoading: topicReferencesLoading,
    isError: topicReferencesError
  } = useListTopicMediaByMedia(id || '');
  const [downloading, setDownloading] = useState(false);

  if (isLoading) {
    return (
      <Page sidebar>
        <div className='flex items-center justify-center h-64'>
          <Icons name='IconLoader2' className='animate-spin' size={32} />
        </div>
      </Page>
    );
  }

  if (error || !media) {
    return (
      <Page sidebar>
        <ErrorPage code={404} />
      </Page>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return 'IconPhoto';
      case 'video':
        return 'IconMovie';
      case 'audio':
        return 'IconMusic';
      default:
        return 'IconFile';
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      image: 'bg-green-100 text-green-800',
      video: 'bg-blue-100 text-blue-800',
      audio: 'bg-purple-100 text-purple-800',
      file: 'bg-gray-100 text-gray-800'
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || colors.file}`}
      >
        {type}
      </span>
    );
  };

  const handleDownload = async () => {
    if (!media) return;
    setDownloading(true);
    try {
      await downloadMediaFile(media);
    } catch (downloadError: any) {
      toast.error('Failed to download media', {
        description: downloadError?.message || 'Download failed'
      });
    } finally {
      setDownloading(false);
    }
  };

  const previewUrl = getMediaPreviewUrl(media);
  const playbackUrl = getMediaDownloadUrl(media);
  const mimeType = getMediaMimeType(media);
  const size = getMediaSize(media);
  const downloadable = canDownloadMedia(media);

  return (
    <Page
      sidebar
      topbar={
        <Topbar
          left={[
            <Button variant='text' size='sm' onClick={() => navigate('/content/media')}>
              <Icons name='IconArrowLeft' size={16} className='mr-2' />
              Back
            </Button>
          ]}
          right={[
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate(`/content/media/${media.id}/edit`)}
            >
              <Icons name='IconEdit' size={16} className='mr-2' />
              Edit
            </Button>,
            <Button
              variant='outline'
              size='sm'
              disabled={!downloadable}
              isLoading={downloading}
              onClick={handleDownload}
            >
              <Icons name='IconDownload' size={16} className='mr-2' />
              Download
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8'
    >
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>{media.title}</h1>
        <div className='flex items-center space-x-4 text-gray-500'>
          {getTypeBadge(media.type)}
          <span>·</span>
          <span className='text-sm'>{new Date(media.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Media Preview */}
        <div className='lg:col-span-2'>
          <Card className='overflow-hidden'>
            <div className='bg-gray-50 p-8 flex items-center justify-center min-h-[400px]'>
              {media.type === 'image' && previewUrl ? (
                <img
                  src={previewUrl}
                  alt={media.alt || media.title}
                  className='max-w-full max-h-96 object-contain rounded-lg shadow-sm'
                />
              ) : media.type === 'video' && playbackUrl ? (
                <video
                  src={playbackUrl}
                  controls
                  className='max-w-full max-h-96 rounded-lg shadow-sm'
                >
                  Your browser does not support the video tag.
                </video>
              ) : media.type === 'audio' && playbackUrl ? (
                <div className='w-full max-w-md'>
                  <div className='text-center mb-4'>
                    <Icons name='IconMusic' size={64} className='mx-auto text-gray-400 mb-2' />
                    <p className='text-sm text-gray-600'>{media.title}</p>
                  </div>
                  <audio controls className='w-full'>
                    <source src={playbackUrl} type={mimeType} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <div className='text-center'>
                  <Icons
                    name={getTypeIcon(media.type)}
                    size={64}
                    className='mx-auto text-gray-400 mb-4'
                  />
                  <p className='text-gray-600 mb-4'>Preview not available for this file type</p>
                  {downloadable && (
                    <Button variant='outline' size='sm' onClick={handleDownload}>
                      <Icons name='IconExternalLink' size={16} className='mr-2' />
                      Download File
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Media Information */}
        <div className='space-y-6'>
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Information</h3>
            <div className='space-y-4'>
              {size ? (
                <div>
                  <label className='text-sm font-medium text-gray-500'>File Size</label>
                  <p className='mt-1 text-sm text-gray-900'>{(size / 1024).toFixed(1)} KB</p>
                </div>
              ) : null}

              {mimeType && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>MIME Type</label>
                  <p className='mt-1 text-sm text-gray-900'>{mimeType}</p>
                </div>
              )}

              {media.width && media.height && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>Dimensions</label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {media.width} × {media.height} px
                  </p>
                </div>
              )}

              {media.duration && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>Duration</label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {Math.floor(media.duration / 60)}:
                    {Math.floor(media.duration % 60)
                      .toString()
                      .padStart(2, '0')}
                  </p>
                </div>
              )}

              {media.description && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>Description</label>
                  <p className='mt-1 text-sm text-gray-900'>{media.description}</p>
                </div>
              )}

              {media.alt && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>Alt Text</label>
                  <p className='mt-1 text-sm text-gray-900'>{media.alt}</p>
                </div>
              )}

              <div>
                <label className='text-sm font-medium text-gray-500'>Resource ID</label>
                <p className='mt-1 break-all text-sm text-gray-900'>{media.resource_id || '-'}</p>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Resource Link</h3>
            {media.resource_id ? (
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>File</label>
                  <p className='mt-1 break-all text-sm text-gray-900'>
                    {media.resource?.name || media.path || media.resource_id}
                  </p>
                </div>
                {media.resource?.path && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Path</label>
                    <p className='mt-1 break-all text-sm text-gray-900'>{media.resource.path}</p>
                  </div>
                )}
                {media.resource?.is_expired && (
                  <div className='rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700'>
                    The linked resource URL is expired. Open the resource detail to refresh access.
                  </div>
                )}
                <div className='flex flex-wrap gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => navigate(`/res/view/${media.resource_id}`)}
                  >
                    <Icons name='IconExternalLink' size={14} className='mr-1' />
                    View Resource
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleDownload}
                    isLoading={downloading}
                  >
                    <Icons name='IconDownload' size={14} className='mr-1' />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className='rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500'>
                This media record is not linked to a managed resource file.
              </div>
            )}
          </Card>

          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Topic Usage</h3>
            {topicReferencesLoading ? (
              <div className='flex items-center gap-2 text-sm text-gray-500'>
                <Icons name='IconLoader2' className='animate-spin' size={16} />
                Loading topic references...
              </div>
            ) : topicReferencesError ? (
              <div className='rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700'>
                Failed to load topic references.
              </div>
            ) : topicReferences.length > 0 ? (
              <div className='space-y-2'>
                {topicReferences.map(reference => (
                  <button
                    key={reference.id || `${reference.topic_id}-${reference.media_id}`}
                    type='button'
                    onClick={() => navigate(`/content/topics/${reference.topic_id}`)}
                    className='flex w-full items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50'
                  >
                    <span className='min-w-0'>
                      <span className='block truncate font-medium text-slate-900'>
                        {reference.topic_id}
                      </span>
                      <span className='text-xs text-slate-500'>
                        {reference.type || 'gallery'} · order {reference.order ?? 0}
                      </span>
                    </span>
                    <Icons name='IconExternalLink' size={14} className='shrink-0 text-slate-400' />
                  </button>
                ))}
              </div>
            ) : (
              <div className='rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500'>
                No topic is using this media.
              </div>
            )}
          </Card>

          {/* Metadata */}
          {media.metadata && Object.keys(media.metadata).length > 0 && (
            <Card className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Metadata</h3>
              <div className='space-y-2'>
                {Object.entries(media.metadata).map(([key, value]) => (
                  <div key={key} className='flex justify-between'>
                    <span className='text-sm font-medium text-gray-500 capitalize'>
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className='text-sm text-gray-900'>{String(value)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
};
