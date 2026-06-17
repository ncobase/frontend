import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { SEOAnalysisComponent } from '../components/seo_analysis';

import { Page, Topbar } from '@/components/layout';

export const SEOAuditPage = () => {
  const { contentType, contentId } = useParams<{ contentType: string; contentId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const editPath = contentType === 'topic' ? `/content/topics/${contentId}/edit` : '/content/seo';

  return (
    <Page
      sidebar
      title={t('seo.audit.title')}
      topbar={
        <Topbar
          title={t('seo.audit.title')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/content/seo')}
              className='p-2'
            >
              <Icons name='IconArrowLeft' size={20} />
            </Button>
          ]}
          right={[
            <Button variant='outline' size='sm' onClick={() => navigate(editPath)}>
              <Icons name='IconEdit' size={16} className='mr-2' />
              {t('actions.edit')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <SEOAnalysisComponent contentId={contentId!} contentType={contentType!} />
    </Page>
  );
};
