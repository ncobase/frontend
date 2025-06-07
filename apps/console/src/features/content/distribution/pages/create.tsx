import { Card, Button, Icons, Form } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';

import { useListChannels } from '../../channel/service';
import { useListTopics } from '../../topic/service';
import { useCreateDistribution } from '../service';

import { Page, Topbar } from '@/components/layout';

export const DistributionCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastMessage();

  // Get pre-selected values from location state
  const initialTopicId = location.state?.topicId;
  const initialChannelId = location.state?.channelId;

  const createDistributionMutation = useCreateDistribution();
  const { data: topicsData } = useListTopics({ limit: 100 });
  const { data: channelsData } = useListChannels({ limit: 100, status: 0 });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      topic_id: initialTopicId || '',
      channel_id: initialChannelId || '',
      status: 0, // Draft
      scheduled_at: '',
      custom_data: {}
    }
  });

  const selectedTopicId = watch('topic_id');
  const selectedChannelId = watch('channel_id');

  const onSubmit = async (data: any) => {
    try {
      // Convert scheduled_at to timestamp if provided
      const submitData = {
        ...data,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at).getTime() : null,
        status: data.scheduled_at ? 1 : 0 // Set to scheduled if date provided
      };

      console.log(submitData);

      await createDistributionMutation.mutateAsync(submitData);
      toast.success('Distribution created successfully');
      navigate('/content/distributions');
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to create distribution');
    }
  };

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

  const basicFields = [
    {
      title: 'Topic',
      name: 'topic_id',
      type: 'select',
      options: topicOptions,
      placeholder: 'Select a topic to distribute',
      rules: { required: 'Topic is required' }
    },
    {
      title: 'Channel',
      name: 'channel_id',
      type: 'select',
      options: channelOptions,
      placeholder: 'Select a distribution channel',
      rules: { required: 'Channel is required' }
    },
    {
      title: 'Scheduled At (Optional)',
      name: 'scheduled_at',
      type: 'datetime-local',
      description: 'Leave empty to save as draft, or select a time to schedule'
    }
  ];

  const selectedTopic = topicsData?.items?.find(t => t.id === selectedTopicId);
  const selectedChannel = channelsData?.items?.find(c => c.id === selectedChannelId);

  return (
    <Page
      sidebar
      title='Create Distribution'
      topbar={
        <Topbar
          title='Distribute content to a channel'
          left={[
            <Button variant='outline' size='sm' onClick={() => navigate('/content/distributions')}>
              <Icons name='IconArrowLeft' size={16} className='mr-2' />
              Back
            </Button>
          ]}
          right={[<div className='h-1 ml-auto'></div>]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Form */}
        <div className='lg:col-span-2'>
          <Form
            control={control}
            errors={errors}
            fields={basicFields}
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-2 gap-4'
          >
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/content/distributions')}
            >
              Cancel
            </Button>
            <Button type='submit' loading={createDistributionMutation.isPending}>
              Create Distribution
            </Button>
          </Form>
        </div>

        {/* Preview */}
        <div className='space-y-6'>
          {/* Selected Topic Preview */}
          {selectedTopic && (
            <Card className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Selected Topic</h3>
              <div className='space-y-3'>
                <div>
                  <h4 className='font-medium text-gray-900'>{selectedTopic.title}</h4>
                  <p className='text-sm text-gray-600'>{selectedTopic.name}</p>
                </div>
                {selectedTopic.content && (
                  <div>
                    <p className='text-sm text-gray-600 line-clamp-3'>
                      {selectedTopic.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                  </div>
                )}
                <div className='flex items-center text-xs text-gray-500'>
                  <Icons name='IconCalendar' size={12} className='mr-1' />
                  Created {new Date(selectedTopic.created_at).toLocaleDateString()}
                </div>
              </div>
            </Card>
          )}

          {/* Selected Channel Preview */}
          {selectedChannel && (
            <Card className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Selected Channel</h3>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Icons name='IconBroadcast' size={20} className='text-blue-600' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>{selectedChannel.name}</h4>
                    <p className='text-sm text-gray-600 capitalize'>{selectedChannel.type}</p>
                  </div>
                </div>
                {selectedChannel.description && (
                  <p className='text-sm text-gray-600'>{selectedChannel.description}</p>
                )}
                <div className='flex items-center space-x-4 text-xs text-gray-500'>
                  <span>Auto Publish: {selectedChannel.auto_publish ? 'Yes' : 'No'}</span>
                  <span>Review Required: {selectedChannel.require_review ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Info */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Distribution Info</h3>
            <div className='space-y-3 text-sm'>
              <div className='flex items-start space-x-2'>
                <Icons name='IconInfo' size={16} className='text-blue-500 mt-0.5' />
                <div>
                  <p className='font-medium'>Draft Mode</p>
                  <p className='text-gray-600'>
                    Distributions are created as drafts by default. You can publish them manually or
                    schedule them for later.
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-2'>
                <Icons name='IconClock' size={16} className='text-orange-500 mt-0.5' />
                <div>
                  <p className='font-medium'>Scheduling</p>
                  <p className='text-gray-600'>
                    Set a future date and time to automatically publish the content to the selected
                    channel.
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-2'>
                <Icons name='IconShield' size={16} className='text-green-500 mt-0.5' />
                <div>
                  <p className='font-medium'>Review Process</p>
                  <p className='text-gray-600'>
                    If the channel requires review, the content will need approval before
                    publishing.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
