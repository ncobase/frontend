import React, { useState } from 'react';

import { Card, Button, Icons, Badge, Tooltip, Modal } from '@ncobase/react';
import { useParams, useNavigate } from 'react-router';

import { useQueryChannel } from '../service';

import { ErrorPage } from '@/components/errors';
import { Page, Topbar } from '@/components/layout';

export const ChannelViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: channel, isLoading, error } = useQueryChannel(id!);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  if (isLoading) {
    return (
      <Page sidebar>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <Icons name='IconLoader2' className='animate-spin mx-auto mb-4' size={40} />
            <p className='text-gray-600'>Loading channel details...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error || !channel) {
    return (
      <Page sidebar>
        <ErrorPage statusCode={404} />
      </Page>
    );
  }

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

  const getStatusBadge = (status: number) => {
    const variants = {
      0: { variant: 'success', label: 'Active', icon: 'IconCircleCheck' },
      1: { variant: 'secondary', label: 'Inactive', icon: 'IconCircleDashed' }
    };
    const { variant, label, icon } = variants[status] || variants[1];

    return (
      <Badge variant={variant} className='flex items-center gap-1 px-3 py-1'>
        <Icons name={icon} size={14} />
        {label}
      </Badge>
    );
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success message
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      // Show error message
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Page
      sidebar
      topbar={
        <Topbar
          title={channel.name}
          left={[
            <Button variant='outline' size='sm' onClick={() => navigate('/content/channels')}>
              <Icons name='IconArrowLeft' size={16} className='mr-2' />
              Back
            </Button>
          ]}
          right={[
            <Tooltip content='Edit channel settings'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate(`/content/channels/${channel.id}/edit`)}
              >
                <Icons name='IconEdit' size={18} className='mr-2' />
                Edit
              </Button>
            </Tooltip>,
            <Tooltip content='Test channel connectivity'>
              <Button
                variant='outline'
                loading={isTestingConnection}
                onClick={handleTestConnection}
                size='sm'
              >
                <Icons name='IconWifi' size={18} className='mr-2' />
                Test Connection
              </Button>
            </Tooltip>,
            <Button variant='primary' size='sm'>
              <Icons name='IconSend' size={18} className='mr-2' />
              Create Distribution
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Header */}
      <div className='bg-white rounded-xl p-6 mb-8'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg'>
                <Icons name={getChannelIcon(channel.type)} size={32} className='text-white' />
              </div>
              <div>
                <div className='flex items-center gap-3'>
                  <h1 className='text-2xl font-bold text-gray-900'>{channel.name}</h1>
                  {getStatusBadge(channel.status)}
                </div>
                <p className='text-gray-500 mt-1 flex items-center gap-2'>
                  <Icons name='IconLink' size={16} />
                  {channel.slug}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Channel Information */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>Channel Information</h3>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-2 gap-8'>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>Name</label>
                  <p className='text-gray-900'>{channel.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>Type</label>
                  <div className='flex items-center gap-2'>
                    <Icons
                      name={getChannelIcon(channel.type)}
                      size={16}
                      className='text-gray-600'
                    />
                    <span className='text-gray-900 capitalize'>{channel.type}</span>
                  </div>
                </div>
                {channel.description && (
                  <div className='col-span-2'>
                    <label className='text-sm font-medium text-gray-500 block mb-2'>
                      Description
                    </label>
                    <p className='text-gray-900 whitespace-pre-wrap'>{channel.description}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>Channel Settings</h3>
            </div>
            <div className='p-6'>
              <div className='space-y-6'>
                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                  <div>
                    <p className='font-medium text-gray-900'>Auto Publish</p>
                    <p className='text-sm text-gray-500 mt-1'>
                      Automatically publish content to this channel
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Badge
                      variant={channel.auto_publish ? 'success' : 'secondary'}
                      className='min-w-[80px] justify-center'
                    >
                      {channel.auto_publish ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                  <div>
                    <p className='font-medium text-gray-900'>Review Required</p>
                    <p className='text-sm text-gray-500 mt-1'>
                      Content requires approval before publishing
                    </p>
                  </div>
                  <Badge
                    variant={channel.require_review ? 'warning' : 'secondary'}
                    className='min-w-[80px] justify-center'
                  >
                    {channel.require_review ? 'Required' : 'Optional'}
                  </Badge>
                </div>

                {channel.webhook_url && (
                  <div className='p-4 bg-gray-50 rounded-lg'>
                    <label className='text-sm font-medium text-gray-900 block mb-2'>
                      Webhook URL
                    </label>
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={channel.webhook_url}
                        readOnly
                        className='flex-1 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2'
                      />
                      <Tooltip content='Copy webhook URL'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => navigator.clipboard.writeText(channel.webhook_url)}
                        >
                          <Icons name='IconCopy' size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Configuration */}
          {channel.config && Object.keys(channel.config).length > 0 && (
            <Card className='overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>Configuration</h3>
                <Button variant='text' onClick={() => setShowConfigModal(true)}>
                  <Icons name='IconMaximize' size={16} className='mr-2' />
                  View Full Config
                </Button>
              </div>
              <div className='p-6'>
                <div className='bg-gray-50 rounded-lg p-4 max-h-[200px] overflow-auto'>
                  <pre className='text-sm text-gray-700'>
                    {JSON.stringify(channel.config, null, 2)}
                  </pre>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-8'>
          {/* Quick Actions */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>Quick Actions</h3>
            </div>
            <div className='p-4'>
              <div className='grid gap-3'>
                <Button
                  variant='primary'
                  className='w-full justify-start'
                  onClick={() =>
                    navigate('/content/distributions/create', {
                      state: { channelId: channel.id }
                    })
                  }
                >
                  <Icons name='IconSend' size={18} className='mr-2' />
                  Create Distribution
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() =>
                    navigate('/content/distributions', {
                      state: { filter: { channel_id: channel.id } }
                    })
                  }
                >
                  <Icons name='IconList' size={18} className='mr-2' />
                  View Distributions
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => {
                    const dataStr = JSON.stringify(channel, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `channel-${channel.slug}-settings.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Icons name='IconDownload' size={18} className='mr-2' />
                  Export Settings
                </Button>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>Channel Statistics</h3>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-gray-50 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-gray-900'>0</p>
                  <p className='text-sm text-gray-500 mt-1'>Total Distributions</p>
                </div>
                <div className='bg-gray-50 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-gray-900'>0</p>
                  <p className='text-sm text-gray-500 mt-1'>Published Content</p>
                </div>
                <div className='bg-gray-50 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-red-500'>0</p>
                  <p className='text-sm text-gray-500 mt-1'>Failed Distributions</p>
                </div>
                <div className='bg-gray-50 rounded-lg p-4 text-center'>
                  <p className='text-sm font-medium text-gray-900'>
                    {new Date(channel.updated_at).toLocaleDateString()}
                  </p>
                  <p className='text-sm text-gray-500 mt-1'>Last Activity</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Allowed Content Types */}
          {channel.allowed_types && channel.allowed_types.length > 0 && (
            <Card className='overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h3 className='text-lg font-semibold'>Allowed Content Types</h3>
              </div>
              <div className='p-6'>
                <div className='flex flex-wrap gap-2'>
                  {channel.allowed_types.map(type => (
                    <Badge key={type} variant='primary' className='capitalize px-3 py-1'>
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      <Modal
        title='Channel Configuration'
        isOpen={showConfigModal}
        onCancel={() => setShowConfigModal(false)}
      >
        <div className='p-6'>
          <pre className='bg-gray-50 rounded-lg p-4 overflow-auto max-h-[600px] text-sm'>
            {JSON.stringify(channel.config, null, 2)}
          </pre>
        </div>
      </Modal>
    </Page>
  );
};
