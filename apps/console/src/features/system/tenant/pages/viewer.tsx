import { Button, Icons, ScrollView } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { TenantViewerForm } from '../forms/viewer';

import { useLayoutContext } from '@/components/layout';

export const TenantViewerPage = ({ viewMode, record: initialRecord, handleView }) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }
  if (mode === 'modal') {
    return <TenantViewerForm record={record} />;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              <Icons name='IconArrowLeft' />
            </Button>
            <div className='text-slate-600 font-medium'>{t('actions.view')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button
              variant='outline-primary'
              size='sm'
              prependIcon={<Icons name='IconEdit' className='w-4 h-4' />}
              onClick={() => handleView({ slug: record }, '../edit')}
            >
              {t('actions.edit')}
            </Button>
            <Button
              variant='outline-danger'
              size='sm'
              prependIcon={<Icons name='IconPrinter' className='w-4 h-4' />}
              onClick={() => handleView({ slug: record }, '../printer')}
            >
              {t('actions.printer')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white p-4'>
        <TenantViewerForm record={record} />
      </ScrollView>
    </>
  );
};
