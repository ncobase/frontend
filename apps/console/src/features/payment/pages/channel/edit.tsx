import { useEffect } from 'react';

import { Button, Container, ScrollView, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { ChannelEditorForm } from '../../forms/channel_editor';
import { useGetChannel, useUpdateChannel } from '../../service';

export const ChannelEditPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToastMessage();
  const { data: channel, isLoading } = useGetChannel(slug || '');
  const updateMutation = useUpdateChannel();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<any>();

  useEffect(() => {
    if (channel) {
      reset(channel);
    }
  }, [channel, reset]);

  const onSubmit = handleSubmit((data: any) => {
    updateMutation.mutate(
      { ...data, id: slug },
      {
        onSuccess: () => {
          toast.success(t('messages.success'), {
            description: t('payment.messages.channel_updated', 'Channel updated')
          });
          navigate('/pay/channels');
        },
        onError: (error: any) => {
          toast.error(t('messages.error'), {
            description: error?.message || t('messages.unknown_error')
          });
        }
      }
    );
  });

  if (isLoading) {
    return <div className='p-6 text-slate-400'>{t('common.loading', 'Loading...')}</div>;
  }

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='text-slate-600 font-medium'>
            {t('payment.channel.edit_title', 'Edit Channel')}
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm'>
              {t('actions.save', 'Save')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <ChannelEditorForm onSubmit={onSubmit} control={control} errors={errors} />
        </Container>
      </ScrollView>
    </>
  );
};
