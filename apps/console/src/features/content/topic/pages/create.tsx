import { Button, Icons } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CreateTopicForm } from '../forms/create';
import { useCreateTopic } from '../service';

import { Page, Topbar } from '@/components/layout';

export const CreateTopicPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();
  const createTopicMutation = useCreateTopic();

  const onSubmit = handleSubmit(async data => {
    try {
      await createTopicMutation.mutateAsync(data);
      toast.success(t('topic.create.success'));
      navigate('/content/topics');
    } catch (error) {
      toast.error(t('topic.create.error'));
      console.error('Create topic error:', error);
    }
  });

  return (
    <Page
      sidebar
      topbar={
        <Topbar
          title={t('content.topics.create_subtitle')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/content/topics')}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[
            <Button variant='outline' size='sm' onClick={() => navigate('/content/topics')}>
              {t('actions.cancel')}
            </Button>,
            <Button onClick={onSubmit} size='sm' loading={createTopicMutation.isPending}>
              <Icons name='IconCheck' size={16} className='mr-2' />
              {t('actions.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <CreateTopicForm onSubmit={onSubmit} control={control} setValue={setValue} errors={errors} />
    </Page>
  );
};
