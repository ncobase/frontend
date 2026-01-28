import { useState } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { FilePreview } from '../components/file_preview';
import { ShareDialog } from '../components/share_dialog';
import { VersionHistory } from '../components/version_history';
import { ResourceViewer } from '../forms/viewer';
import { useGetResource } from '../service';

import { Page, Topbar } from '@/components/layout';

export const ResourceViewPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: file, isLoading } = useGetResource(slug || '');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

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
            file.download_url ? (
              <a key='download' href={file.download_url} download>
                <Button size='sm'>
                  <Icons name='IconDownload' className='w-4 h-4 mr-1' />
                  {t('resource.actions.download', 'Download')}
                </Button>
              </a>
            ) : null
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
      <ShareDialog isOpen={shareOpen} file={file} onClose={() => setShareOpen(false)} />
    </Page>
  );
};
