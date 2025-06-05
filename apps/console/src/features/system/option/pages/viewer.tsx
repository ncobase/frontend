import { Button, Icons, ScrollView, Container } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { OptionViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/components/layout';

export const OptionViewerPage = ({ viewMode, record: initialRecord, handleView }) => {
  const { vmode } = useLayoutContext();
  const { id } = useParams<{ id: string }>();
  const record = initialRecord || id;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }

  if (mode === 'modal') {
    return <OptionViewerForms record={record} />;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4 z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <Button
              variant='ghost'
              onClick={() => navigate(-1)}
              size='sm'
              className='text-gray-600 hover:text-gray-800'
            >
              ← Back
            </Button>
            <div className='text-slate-800 font-semibold text-lg'>
              {t('actions.view', 'View')} {t('system.option.singular', 'Option')}
            </div>
          </div>
          <div className='flex gap-x-3'>
            <Button
              variant='outline'
              prependIcon={<Icons name='IconEdit' className='w-4 h-4' />}
              onClick={() => handleView({ id: record }, 'edit')}
              size='sm'
            >
              {t('actions.edit', 'Edit')}
            </Button>
            <Button
              variant='outline'
              prependIcon={<Icons name='IconCopy' className='w-4 h-4' />}
              onClick={() => {
                const duplicateRecord = {
                  id: record,
                  name: `copy_${Date.now()}`
                };
                handleView(duplicateRecord, 'create');
              }}
              size='sm'
            >
              {t('actions.duplicate', 'Duplicate')}
            </Button>
          </div>
        </div>
      </div>

      <ScrollView className='bg-gray-50 min-h-screen'>
        <Container className='py-6'>
          <OptionViewerForms record={record} />
        </Container>
      </ScrollView>
    </>
  );
};
