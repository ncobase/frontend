import { Card, Button, Icons } from '@ncobase/react';
import { useParams, useNavigate } from 'react-router';

import { useQueryMedia } from '../service';

import { ErrorPage } from '@/components/errors';
import { Page, Topbar } from '@/components/layout';

export const MediaViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: media, isLoading, error } = useQueryMedia(id!);

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
            <Button variant='outline' size='sm' onClick={() => window.open(media.url, '_blank')}>
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
              {media.type === 'image' && media.url ? (
                <img
                  src={media.url}
                  alt={media.alt || media.title}
                  className='max-w-full max-h-96 object-contain rounded-lg shadow-sm'
                />
              ) : media.type === 'video' && media.url ? (
                <video
                  src={media.url}
                  controls
                  className='max-w-full max-h-96 rounded-lg shadow-sm'
                >
                  Your browser does not support the video tag.
                </video>
              ) : media.type === 'audio' && media.url ? (
                <div className='w-full max-w-md'>
                  <div className='text-center mb-4'>
                    <Icons name='IconMusic' size={64} className='mx-auto text-gray-400 mb-2' />
                    <p className='text-sm text-gray-600'>{media.title}</p>
                  </div>
                  <audio controls className='w-full'>
                    <source src={media.url} type={media.mime_type} />
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
                  {media.url && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(media.url, '_blank')}
                    >
                      <Icons name='IconExternalLink' size={16} className='mr-2' />
                      Open File
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
              {media.size && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>File Size</label>
                  <p className='mt-1 text-sm text-gray-900'>{(media.size / 1024).toFixed(1)} KB</p>
                </div>
              )}

              {media.mime_type && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>MIME Type</label>
                  <p className='mt-1 text-sm text-gray-900'>{media.mime_type}</p>
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

              {media.url && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>URL</label>
                  <div className='mt-1 flex items-center space-x-2'>
                    <input
                      type='text'
                      value={media.url}
                      readOnly
                      className='flex-1 text-xs text-gray-600 bg-gray-50 border border-gray-300 rounded px-2 py-1'
                    />
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => navigator.clipboard.writeText(media.url)}
                    >
                      <Icons name='IconCopy' size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
