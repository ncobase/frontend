import { useEffect } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { EditorTopicForm } from '../forms/editor';
import { useQueryTopic, useUpdateTopic } from '../service';

import { Page, Topbar } from '@/components/layout';

export const TopicEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: topic, isLoading } = useQueryTopic(id!);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();
  const updateTopicMutation = useUpdateTopic();

  // Reset form when topic data loads
  useEffect(() => {
    if (topic) {
      reset(topic);
    }
  }, [topic, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      await updateTopicMutation.mutateAsync({ ...data, id });
      toast.success(t('topic.update.success'));
      navigate(`/content/topics/${id}`);
    } catch (error) {
      toast.error(t('topic.update.error'));
      console.error('Update topic error:', error);
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
              onClick={() => navigate(`/content/topics/${id}`)}
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
              onClick={() => navigate(`/content/topics/${id}`)}
              size='sm'
            >
              {t('actions.cancel')}
            </Button>,
            <Button onClick={onSubmit} size='sm' loading={updateTopicMutation.isPending}>
              <Icons name='IconCheck' size={16} className='mr-2' />
              {t('actions.save')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <EditorTopicForm
        record={id}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    </Page>
  );
};
