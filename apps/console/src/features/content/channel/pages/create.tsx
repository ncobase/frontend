import React from 'react';

import { Card, Button, Icons, Form, Section } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { useCreateChannel } from '../service';

import { Page, Topbar } from '@/components/layout';

export const ChannelCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToastMessage();

  const createChannelMutation = useCreateChannel();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      type: 'website',
      slug: '',
      description: '',
      status: 0,
      auto_publish: false,
      require_review: false,
      webhook_url: '',
      allowed_types: ['article']
    }
  });

  const selectedType = watch('type');

  const onSubmit = async (data: any) => {
    try {
      // convert status to number
      data.status = parseInt(data.status);
      await createChannelMutation.mutateAsync(data);
      toast.success('Channel created successfully');
      navigate('/content/channels');
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to create channel');
    }
  };

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
      placeholder: 'Enter URL-friendly slug (auto-generated if empty)'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'textarea',
      className: 'col-span-full',
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
      placeholder: 'https://example.com/webhook (optional)'
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
      ],
      rules: { required: 'At least one content type must be selected' }
    }
  ];

  const getChannelIcon = (type: string) => {
    const iconMap = {
      website: 'IconGlobe',
      wechat: 'IconBrandWechat',
      douyin: 'IconBrandTiktok',
      tiktok: 'IconBrandTiktok',
      xiaohongshu: 'IconCamera',
      twitter: 'IconBrandTwitter',
      facebook: 'IconBrandFacebook',
      custom: 'IconSettings'
    };
    return iconMap[type] || 'IconBroadcast';
  };

  const getChannelDescription = (type: string) => {
    const descriptions = {
      website: 'Publish content to your website or blog',
      wechat: 'Distribute content to WeChat Official Account',
      douyin: 'Share content on Douyin platform',
      tiktok: 'Publish videos to TikTok',
      xiaohongshu: 'Share content on Xiaohongshu (Little Red Book)',
      twitter: 'Post content to Twitter/X',
      facebook: 'Publish to Facebook Page',
      custom: 'Custom integration with your own platform'
    };
    return descriptions[type] || 'Custom distribution channel';
  };

  return (
    <Page
      sidebar
      title='Create Channel'
      topbar={
        <Topbar
          title='Add a new distribution channel'
          left={[
            <Button variant='outline' size='sm' onClick={() => navigate('/content/channels')}>
              <Icons name='IconArrowLeft' size={16} className='mr-2' />
              Back
            </Button>
          ]}
          right={[
            <Button type='button' variant='outline' onClick={() => navigate('/content/channels')}>
              Cancel
            </Button>,
            <Button type='submit' loading={createChannelMutation.isPending}>
              Create Channel
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Form */}
        <div className='lg:col-span-2'>
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

            {/* Channel Settings */}
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
        </div>

        {/* Preview */}
        <div className='space-y-6'>
          {/* Channel Preview */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Channel Preview</h3>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <Icons name={getChannelIcon(selectedType)} size={24} className='text-blue-600' />
                </div>
                <div>
                  <h4 className='font-medium text-gray-900 capitalize'>{selectedType}</h4>
                  <p className='text-sm text-gray-600'>{getChannelDescription(selectedType)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Channel Types Info */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Channel Types</h3>
            <div className='space-y-3 text-sm'>
              <div className='flex items-start space-x-2'>
                <Icons name='IconGlobe' size={16} className='text-blue-500 mt-0.5' />
                <div>
                  <p className='font-medium'>Website</p>
                  <p className='text-gray-600'>Direct publication to your website or blog</p>
                </div>
              </div>
              <div className='flex items-start space-x-2'>
                <Icons name='IconBrandWechat' size={16} className='text-green-500 mt-0.5' />
                <div>
                  <p className='font-medium'>Social Media</p>
                  <p className='text-gray-600'>WeChat, Douyin, TikTok, Twitter, etc.</p>
                </div>
              </div>
              <div className='flex items-start space-x-2'>
                <Icons name='IconSettings' size={16} className='text-purple-500 mt-0.5' />
                <div>
                  <p className='font-medium'>Custom</p>
                  <p className='text-gray-600'>Integration with your own platform</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Tips</h3>
            <div className='space-y-3 text-sm text-gray-600'>
              <div className='flex items-start space-x-2'>
                <Icons name='IconLightbulb' size={16} className='text-yellow-500 mt-0.5' />
                <p>Choose content types that match your channel's capabilities</p>
              </div>
              <div className='flex items-start space-x-2'>
                <Icons name='IconShield' size={16} className='text-green-500 mt-0.5' />
                <p>Enable review for channels that require content approval</p>
              </div>
              <div className='flex items-start space-x-2'>
                <Icons name='IconZap' size={16} className='text-blue-500 mt-0.5' />
                <p>Auto-publish can streamline your content workflow</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
