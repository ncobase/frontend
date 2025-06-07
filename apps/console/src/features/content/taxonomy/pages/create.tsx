import { Button, Icons } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CreateTaxonomyForm } from '../forms/create';
import { useCreateTaxonomy } from '../service';

import { Page, Topbar } from '@/components/layout';

export const CreateTaxonomyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();
  const createTaxonomyMutation = useCreateTaxonomy();

  const onSubmit = handleSubmit(async data => {
    try {
      await createTaxonomyMutation.mutateAsync(data);
      toast.success(t('taxonomy.create.success'));
      navigate('/content/taxonomies');
    } catch (error) {
      toast.error(t('taxonomy.create.error'));
      console.error('Create taxonomy error:', error);
    }
  });

  return (
    <Page
      sidebar
      topbar={
        <Topbar
          title={t('content.taxonomies.create_subtitle')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/content/taxonomies')}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate('/content/taxonomies')}
              size='sm'
            >
              {t('actions.cancel')}
            </Button>,
            <Button onClick={onSubmit} size='sm' loading={createTaxonomyMutation.isPending}>
              <Icons name='IconCheck' size={16} className='mr-2' />
              {t('actions.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <CreateTaxonomyForm
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    </Page>
  );
};
