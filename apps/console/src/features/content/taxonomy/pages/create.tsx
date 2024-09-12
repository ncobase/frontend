import React from 'react';

import { Button, Container, Icons, ScrollView } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CreateTaxonomyForms } from '../forms/create';

import { useLayoutContext } from '@/layout';

export const CreateTaxonomyPage = ({ viewMode, onSubmit, control, errors }) => {
  const { vmode } = useLayoutContext();
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <CreateTaxonomyForms onSubmit={onSubmit} control={control} errors={errors} />;
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
            <div className='text-slate-600 font-medium'>{t('actions.create')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={onSubmit}>{t('actions.submit')}</Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <CreateTaxonomyForms onSubmit={onSubmit} control={control} errors={errors} />
        </Container>
      </ScrollView>
    </>
  );
};
