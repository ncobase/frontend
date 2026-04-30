import { useState } from 'react';

import { Button, Icons, useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { FilePreview } from '../components/file_preview';
import { ShareDialog } from '../components/share_dialog';
import { VersionHistory } from '../components/version_history';
import { downloadResourceFile } from '../file_actions';
import { ResourceViewer } from '../forms/viewer';
import { useResourceRuntimePolicy } from '../resource_policy';
import { useCreateThumbnail, useGetResource } from '../service';

import { Page, Topbar } from '@/components/layout';
import type { Media } from '@/features/content/media/media';
import { useListMedia } from '@/features/content/media/service';

export const ResourceViewPage = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: file, isLoading, refetch } = useGetResource(slug || '');
  const {
    data: mediaReferences,
    isLoading: referencesLoading,
    isError: referencesError
  } = useListMedia({ resource_id: file?.id, limit: 20 }, !!file?.id);
  const { data: policy, isLoading: policyLoading } = useResourceRuntimePolicy();
  const thumbnailMutation = useCreateThumbnail();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (isLoading) {
    return (
      <Page sidebar title={t('resource.view.title', 'File Details')}>
        <div className='p-6 text-slate-400'>{t('common.loading', 'Loading...')}</div>
      </Page>
    );
  }

  if (!file) {
    return (
      <Page sidebar title={t('resource.view.title', 'File Details')}>
        <div className='p-6 text-slate-400'>{t('resource.view.not_found', 'File not found')}</div>
      </Page>
    );
  }

  const canCreateThumbnail =
    file.category === 'image' && (policy?.image.enable_thumbnails ?? true) && !file.thumbnail_url;
  const mediaReferenceItems = mediaReferences?.items || [];
  const mediaReferenceTotal = mediaReferences?.total || mediaReferenceItems.length;

  const handleCreateThumbnail = () => {
    const maxEdge = Math.min(
      policy?.image.max_image_width || 2048,
      policy?.image.max_image_height || 2048
    );
    thumbnailMutation.mutate(
      {
        id: file.id,
        options: {
          create_thumbnail: true,
          max_width: policy?.image.default_thumbnail_width || Math.min(300, maxEdge),
          max_height: policy?.image.default_thumbnail_height || Math.min(300, maxEdge),
          compression_quality: policy?.image.compression_quality || 85
        }
      },
      {
        onSuccess: () => refetch(),
        onError: (error: any) => {
          toast.error(t('messages.error'), {
            description: error?.message || t('messages.unknown_error')
          });
        }
      }
    );
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadResourceFile(file);
    } catch (error: any) {
      toast.error(t('messages.error'), {
        description: error?.message || t('messages.unknown_error')
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Page
      sidebar
      title={file.original_name || file.name}
      topbar={
        <Topbar
          title={file.original_name || file.name}
          left={[
            <Button key='back' variant='outline-slate' size='sm' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' className='w-4 h-4 mr-1' />
              {t('actions.back', 'Back')}
            </Button>
          ]}
          right={[
            <Button
              key='preview'
              variant='outline-slate'
              size='sm'
              onClick={() => setPreviewOpen(true)}
            >
              <Icons name='IconEye' className='w-4 h-4 mr-1' />
              {t('resource.actions.preview', 'Preview')}
            </Button>,
            <Button
              key='share'
              variant='outline-slate'
              size='sm'
              onClick={() => setShareOpen(true)}
            >
              <Icons name='IconShare' className='w-4 h-4 mr-1' />
              {t('resource.actions.share', 'Share')}
            </Button>,
            canCreateThumbnail ? (
              <Button
                key='thumbnail'
                variant='outline-slate'
                size='sm'
                onClick={handleCreateThumbnail}
                isLoading={thumbnailMutation.isPending}
              >
                <Icons name='IconPhotoCog' className='w-4 h-4 mr-1' />
                {t('resource.actions.thumbnail', 'Thumbnail')}
              </Button>
            ) : null,
            <Button key='download' size='sm' onClick={handleDownload} isLoading={downloading}>
              <Icons name='IconDownload' className='w-4 h-4 mr-1' />
              {t('resource.actions.download', 'Download')}
            </Button>
          ].filter(Boolean)}
        />
      }
    >
      <div className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <div className='bg-white border rounded-lg'>
            <ResourceViewer record={file} />
          </div>
        </div>
        <div className='space-y-4'>
          <div className='bg-white border rounded-lg p-4'>
            <VersionHistory fileId={file.id} />
          </div>
          <div className='bg-white border rounded-lg p-4'>
            <div className='mb-3 flex items-center justify-between gap-3'>
              <h3 className='text-sm font-medium text-slate-900'>
                {t('resource.references.cms_media', 'CMS media references')}
              </h3>
              {mediaReferenceTotal > 0 && (
                <span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600'>
                  {mediaReferenceTotal}
                </span>
              )}
            </div>

            {referencesLoading ? (
              <div className='flex items-center gap-2 text-sm text-slate-500'>
                <Icons name='IconLoader2' className='animate-spin' size={16} />
                {t('resource.references.loading', 'Checking references...')}
              </div>
            ) : referencesError ? (
              <div className='rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700'>
                {t('resource.references.load_failed', 'Failed to load CMS media references.')}
              </div>
            ) : mediaReferenceItems.length > 0 ? (
              <div className='space-y-2'>
                {mediaReferenceItems.map((media: Media) => (
                  <button
                    key={media.id}
                    type='button'
                    onClick={() => navigate(`/content/media/${media.id}`)}
                    className='flex w-full items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-left transition-colors hover:bg-slate-50'
                  >
                    <span className='min-w-0'>
                      <span className='block truncate text-sm font-medium text-slate-900'>
                        {media.title || media.id}
                      </span>
                      <span className='text-xs text-slate-500'>
                        {media.type || 'file'}
                        {media.id ? ` · ${media.id}` : ''}
                      </span>
                    </span>
                    <Icons name='IconExternalLink' size={14} className='shrink-0 text-slate-400' />
                  </button>
                ))}
                {mediaReferenceTotal > mediaReferenceItems.length && (
                  <Button
                    variant='outline-slate'
                    size='sm'
                    onClick={() => navigate(`/content/media?resource_id=${file.id}`)}
                  >
                    {t('resource.references.view_all', 'View all references')}
                  </Button>
                )}
              </div>
            ) : (
              <div className='rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500'>
                {t('resource.references.none', 'No CMS media records reference this file.')}
              </div>
            )}
          </div>
        </div>
      </div>

      <FilePreview isOpen={previewOpen} file={file} onClose={() => setPreviewOpen(false)} />
      <ShareDialog
        isOpen={shareOpen}
        file={file}
        onClose={() => setShareOpen(false)}
        policy={policy}
        policyLoading={policyLoading}
      />
    </Page>
  );
};
