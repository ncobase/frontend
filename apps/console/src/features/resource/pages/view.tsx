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

export const ResourceViewPage = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: file, isLoading, refetch } = useGetResource(slug || '');
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
