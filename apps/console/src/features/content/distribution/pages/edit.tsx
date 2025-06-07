import React, { useEffect } from 'react';

import { Card, Button, Icons, Form, Section } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';

import { useListChannels } from '../../channel/service';
import { useListTopics } from '../../topic/service';
import { useQueryDistribution, useUpdateDistribution } from '../service';

import { Page } from '@/components/layout';

export const DistributionEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: distribution, isLoading } = useQueryDistribution(id!);
  const updateDistributionMutation = useUpdateDistribution();
  const { data: topicsData } = useListTopics({ limit: 100 });
  const { data: channelsData } = useListChannels({ limit: 100, status: 0 });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (distribution) {
      reset({
        topic_id: distribution.topic_id,
        channel_id: distribution.channel_id,
        status: distribution.status,
        scheduled_at: distribution.scheduled_at
          ? new Date(distribution.scheduled_at).toISOString().slice(0, 16)
          : '',
        custom_data: distribution.custom_data || {}
      });
    }
  }, [distribution, reset]);

  const onSubmit = async (data: any) => {
    try {
      const submitData = {
        id,
        ...data,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at).getTime() : null,
        status: data.scheduled_at ? 1 : data.status
      };

      await updateDistributionMutation.mutateAsync(submitData);
      toast.success('Distribution updated successfully');
      navigate(`/content/distributions/${id}`);
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update distribution');
    }
  };

  if (isLoading) {
    return (
      <Page sidebar title='Edit Distribution'>
        <div className='flex items-center justify-center h-64'>
          <Icons name='IconLoader2' className='animate-spin' size={32} />
        </div>
      </Page>
    );
  }

  if (!distribution) {
    return (
      <Page sidebar title='Edit Distribution'>
        <Card className='text-center py-12'>
          <Icons name='IconAlertCircle' size={48} className='mx-auto text-red-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Distribution not found</h3>
          <Button onClick={() => navigate('/content/distributions')}>Back to Distributions</Button>
        </Card>
      </Page>
    );
  }

  const topicOptions =
    topicsData?.items?.map(topic => ({
      label: topic.title,
      value: topic.id
    })) || [];

  const channelOptions =
    channelsData?.items?.map(channel => ({
      label: `${channel.name} (${channel.type})`,
      value: channel.id
    })) || [];

  const fields = [
    {
      title: 'Topic',
      name: 'topic_id',
      type: 'select',
      options: topicOptions,
      rules: { required: 'Topic is required' }
    },
    {
      title: 'Channel',
      name: 'channel_id',
      type: 'select',
      options: channelOptions,
      rules: { required: 'Channel is required' }
    },
    {
      title: 'Status',
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 0 },
        { label: 'Scheduled', value: 1 },
        { label: 'Published', value: 2 },
        { label: 'Failed', value: 3 },
        { label: 'Cancelled', value: 4 }
      ]
    },
    {
      title: 'Scheduled At (Optional)',
      name: 'scheduled_at',
      type: 'datetime-local'
    }
  ];

  return (
    <Page sidebar title='Edit Distribution' className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate(`/content/distributions/${id}`)}
          >
            <Icons name='IconArrowLeft' size={16} className='mr-2' />
            Back
          </Button>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Edit Distribution</h1>
            <p className='text-gray-600'>
              {distribution.topic?.title} → {distribution.channel?.name}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Section
          title='Distribution Settings'
          icon='IconBroadcast'
          className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
        >
          <Form
            control={control}
            errors={errors}
            fields={fields}
            className='grid grid-cols-2 gap-4'
          />
        </Section>

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate(`/content/distributions/${id}`)}
          >
            Cancel
          </Button>
          <Button type='submit' loading={updateDistributionMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Page>
  );
};
