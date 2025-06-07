import React, { useEffect } from 'react';

import { Button, Container, Icons, ScrollView } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { EditorTaxonomyForm } from '../forms/editor';
import { useQueryTaxonomy, useUpdateTaxonomy } from '../service';

import { Page, Topbar } from '@/components/layout';

export const TaxonomyEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: taxonomy, isLoading } = useQueryTaxonomy(id!);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();
  const updateTaxonomyMutation = useUpdateTaxonomy();

  // Reset form when taxonomy data loads
  useEffect(() => {
    if (taxonomy) {
      reset(taxonomy);
    }
  }, [taxonomy, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      await updateTaxonomyMutation.mutateAsync({ ...data, id });
      toast.success(t('taxonomy.update.success'));
      navigate(`/content/taxonomies/${id}`);
    } catch (error) {
      toast.error(t('taxonomy.update.error'));
      console.error('Update taxonomy error:', error);
    }
  });

  if (isLoading) {
    return (
      <Page sidebar>
        <div className='flex items-center justify-center h-64'>
          <Icons name='IconLoader2' className='animate-spin' size={32} />
        </div>
      </Page>
    );
  }

  return (
    <Page
      sidebar
      topbar={
        <Topbar
          title={t('content.topics.edit')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(`/content/taxonomies/${id}`)}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[
            <Button
              variant='outline'
              onClick={() => navigate(`/content/taxonomies/${id}`)}
              size='sm'
            >
              {t('actions.cancel')}
            </Button>,
            <Button onClick={onSubmit} size='sm' loading={updateTaxonomyMutation.isPending}>
              <Icons name='IconCheck' size={16} className='mr-2' />
              {t('actions.save')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <EditorTaxonomyForm
        record={id}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    </Page>
  );
};
