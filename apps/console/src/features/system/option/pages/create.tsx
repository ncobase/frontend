import { Button, Container, ScrollView } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CreateOptionForms } from '../forms/create';

import { useLayoutContext } from '@/components/layout';

export const CreateOptionPage = ({ viewMode, onSubmit, control, errors }) => {
  const { vmode } = useLayoutContext();
  const mode = viewMode || vmode || 'flatten';

  if (mode === 'modal') {
    return <CreateOptionForms onSubmit={onSubmit} control={control} errors={errors} />;
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
              {t('actions.create', 'Create')} {t('system.option.singular', 'Option')}
            </div>
          </div>
          <div className='flex gap-x-3'>
            <Button variant='outline' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm' variant='primary'>
              {t('actions.create', 'Create')} {t('system.option.singular', 'Option')}
            </Button>
          </div>
        </div>
      </div>

      <ScrollView className='bg-gray-50 min-h-screen'>
        <Container className='py-6'>
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <CreateOptionForms onSubmit={onSubmit} control={control} errors={errors} />
          </div>
        </Container>
      </ScrollView>
    </>
  );
};
