import { Button, Icons, ScrollView, Container } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { DictionaryViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/components/layout';

export const DictionaryViewerPage = ({ viewMode, record: initialRecord, handleView }) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }
  if (mode === 'modal') {
    return <DictionaryViewerForms record={record} />;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' />
            </Button>
            <div className='text-slate-600 font-medium'>{t('actions.view')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button
              variant='outline-primary'
              prependIcon={<Icons name='IconEdit' className='w-4 h-4' />}
              onClick={() => handleView({ id: record }, '../edit')}
            >
              {t('actions.edit')}
            </Button>
            <Button
              variant='outline-danger'
              prependIcon={<Icons name='IconPrinter' className='w-4 h-4' />}
              onClick={() => handleView({ id: record }, '../printer')}
            >
              {t('actions.printer')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <DictionaryViewerForms record={record} />
        </Container>
      </ScrollView>
    </>
  );
};
