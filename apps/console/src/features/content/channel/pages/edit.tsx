import React, { useEffect } from 'react';

import { Card, Button, Icons, Form, Section } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';

import { useQueryChannel, useUpdateChannel } from '../service';

import { Page, Topbar } from '@/components/layout';

export const ChannelEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: channel, isLoading } = useQueryChannel(id!);
  const updateChannelMutation = useUpdateChannel();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (channel) {
      reset({
        name: channel.name,
        type: channel.type,
        slug: channel.slug,
        description: channel.description,
        status: channel.status,
        auto_publish: channel.auto_publish,
        require_review: channel.require_review,
        webhook_url: channel.webhook_url,
        allowed_types: channel.allowed_types
      });
    }
  }, [channel, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateChannelMutation.mutateAsync({ id, ...data });
      toast.success('Channel updated successfully');
      navigate(`/content/channels/${id}`);
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update channel');
    }
  };

  if (isLoading) {
    return (
      <Page sidebar title='Edit Channel'>
        <div className='flex items-center justify-center h-64'>
          <Icons name='IconLoader2' className='animate-spin' size={32} />
        </div>
      </Page>
    );
  }

  if (!channel) {
    return (
      <Page sidebar title='Edit Channel'>
        <Card className='text-center py-12'>
          <Icons name='IconAlertCircle' size={48} className='mx-auto text-red-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Channel not found</h3>
          <Button onClick={() => navigate('/content/channels')}>Back to Channels</Button>
        </Card>
      </Page>
    );
  }

  const basicFields = [
    {
      title: 'Channel Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter channel name',
      rules: { required: 'Channel name is required' }
    },
    {
      title: 'Type',
      name: 'type',
      type: 'select',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'WeChat', value: 'wechat' },
        { label: 'Douyin', value: 'douyin' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'Xiaohongshu', value: 'xiaohongshu' },
        { label: 'Twitter', value: 'twitter' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Custom', value: 'custom' }
      ],
      rules: { required: 'Channel type is required' }
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'text',
      placeholder: 'Enter URL-friendly slug'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'textarea',
      placeholder: 'Enter channel description'
    }
  ];

  const settingsFields = [
    {
      title: 'Status',
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 0 },
        { label: 'Inactive', value: 1 }
      ]
    },
    {
      title: 'Auto Publish',
      name: 'auto_publish',
      type: 'switch',
      description: 'Automatically publish content to this channel'
    },
    {
      title: 'Require Review',
      name: 'require_review',
      type: 'switch',
      description: 'Content requires approval before publishing'
    },
    {
      title: 'Webhook URL',
      name: 'webhook_url',
      type: 'text',
      placeholder: 'https://example.com/webhook'
    }
  ];

  const contentTypeFields = [
    {
      title: 'Allowed Content Types',
      name: 'allowed_types',
      type: 'checkbox-group',
      options: [
        { label: 'Article', value: 'article' },
        { label: 'Video', value: 'video' },
        { label: 'Image', value: 'image' },
        { label: 'Audio', value: 'audio' },
        { label: 'Mixed', value: 'mixed' }
      ]
    }
  ];

  return (
    <Page
      sidebar
      title='Edit Channel'
      topbar={
        <Topbar
          title={channel.name}
          left={[
            <Button variant='outline' size='sm' onClick={() => navigate(`/content/channels/${id}`)}>
              <Icons name='IconArrowLeft' size={16} className='mr-2' />
              Back
            </Button>
          ]}
          right={[
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate(`/content/channels/${id}`)}
            >
              Cancel
            </Button>,
            <Button type='submit' loading={updateChannelMutation.isPending}>
              Save Changes
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Basic Information */}
        <Section
          title='Basic Information'
          icon='IconBroadcast'
          className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
        >
          <Form
            control={control}
            errors={errors}
            fields={basicFields}
            className='grid grid-cols-2 gap-4'
          />
        </Section>

        {/* Settings */}
        <Section
          title='Channel Settings'
          icon='IconSettings'
          className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
        >
          <Form
            control={control}
            errors={errors}
            fields={settingsFields}
            className='grid grid-cols-2 gap-4'
          />
        </Section>

        {/* Content Types */}
        <Section
          title='Content Types'
          icon='IconFileType'
          className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
        >
          <Form
            control={control}
            errors={errors}
            fields={contentTypeFields}
            className='grid grid-cols-1'
          />
        </Section>
      </form>
    </Page>
  );
};
