import React from 'react';

import { Button, Container, Icons, ScrollView } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Page, Topbar } from '@/components/layout';

export const MediaCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { handleSubmit } = useForm();

  const onSubmit = handleSubmit(async () => {
    try {
      // Handle media upload
      toast.success(t('media.create.success'));
      navigate('/content/media');
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t('media.create.error'));
    }
  });

  return (
    <Page
      sidebar
      topbar={
        <Topbar
          title={t('content.media.upload_subtitle')}
          left={[
            <Button variant='ghost' size='sm' onClick={() => navigate('/content/media')}>
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[
            <Button onClick={onSubmit} size='sm'>
              <Icons name='IconUpload' size={16} className='mr-2' />
              {t('actions.upload')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    ></Page>
  );
};
