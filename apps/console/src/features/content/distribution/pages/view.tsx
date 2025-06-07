import React from 'react';

import { Card, Button, Icons, Badge } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useParams, useNavigate } from 'react-router';

import { DISTRIBUTION_STATUS, DISTRIBUTION_STATUS_LABELS } from '../distribution.d';
import { useQueryDistribution, usePublishDistribution, useCancelDistribution } from '../service';

import { Page, Topbar } from '@/components/layout';

export const DistributionViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: distribution, isLoading, error, refetch } = useQueryDistribution(id!);
  const publishMutation = usePublishDistribution();
  const cancelMutation = useCancelDistribution();

  if (isLoading) {
    return (
      <Page sidebar title='Distribution Details'>
        <div className='flex items-center justify-center h-64'>
          <Icons name='IconLoader2' className='animate-spin' size={32} />
        </div>
      </Page>
    );
  }

  if (error || !distribution) {
    return (
      <Page sidebar title='Distribution Details'>
        <Card className='text-center py-12'>
          <Icons name='IconAlertCircle' size={48} className='mx-auto text-red-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Distribution not found</h3>
          <p className='text-gray-500 mb-6'>The distribution you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/content/distributions')}>Back to Distributions</Button>
        </Card>
      </Page>
    );
  }

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(distribution.id);
      toast.success('Distribution published successfully');
      refetch();
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to publish distribution');
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Please enter a reason for cancellation:');
    if (!reason) return;

    try {
      await cancelMutation.mutateAsync({ id: distribution.id, reason });
      toast.success('Distribution cancelled successfully');
      refetch();
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to cancel distribution');
    }
  };

  const getStatusBadge = (status: number) => {
    const variants = {
      [DISTRIBUTION_STATUS.DRAFT]: 'secondary',
      [DISTRIBUTION_STATUS.SCHEDULED]: 'warning',
      [DISTRIBUTION_STATUS.PUBLISHED]: 'success',
      [DISTRIBUTION_STATUS.FAILED]: 'danger',
      [DISTRIBUTION_STATUS.CANCELLED]: 'secondary'
    };

    return (
      <Badge variant={variants[status] as any} className='text-sm'>
        {DISTRIBUTION_STATUS_LABELS[status]}
      </Badge>
    );
  };

  const canPublish = distribution.status === DISTRIBUTION_STATUS.DRAFT;
  const canCancel =
    distribution.status === DISTRIBUTION_STATUS.SCHEDULED ||
    distribution.status === DISTRIBUTION_STATUS.DRAFT;

  return (
    <Page
      sidebar
      title='Distribution Details'
      topbar={
        <Topbar
          // title={`${distribution.topic?.title} → ${distribution.channel?.name}`}
          left={[
            <Button variant='outline' size='sm' onClick={() => navigate('/content/distributions')}>
              <Icons name='IconArrowLeft' size={16} className='mr-2' />
              Back
            </Button>
          ]}
          right={[
            <div className='flex items-center space-x-3'>
              {canPublish && (
                <Button onClick={handlePublish} size='sm' loading={publishMutation.isPending}>
                  <Icons name='IconSend' size={16} className='mr-2' />
                  Publish Now
                </Button>
              )}
              {canCancel && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleCancel}
                  loading={cancelMutation.isPending}
                >
                  <Icons name='IconX' size={16} className='mr-2' />
                  Cancel
                </Button>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate(`/content/distributions/${distribution.id}/edit`)}
              >
                <Icons name='IconEdit' size={16} className='mr-2' />
                Edit
              </Button>
            </div>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div>
            <div className='flex items-center space-x-3 mb-1'>
              <h1 className='text-2xl font-bold text-gray-900'>Distribution Details</h1>
              {getStatusBadge(distribution.status)}
            </div>
            <p className='text-gray-600'>
              {distribution.topic?.title} → {distribution.channel?.name}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Distribution Information */}
        <div className='lg:col-span-2 space-y-6'>
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Distribution Information</h3>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <label className='text-sm font-medium text-gray-500'>Status</label>
                <div className='mt-1'>{getStatusBadge(distribution.status)}</div>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-500'>Created</label>
                <p className='mt-1 text-sm text-gray-900'>
                  {new Date(distribution.created_at).toLocaleString()}
                </p>
              </div>

              {distribution.scheduled_at && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>Scheduled At</label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {new Date(distribution.scheduled_at).toLocaleString()}
                  </p>
                </div>
              )}

              {distribution.published_at && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>Published At</label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {new Date(distribution.published_at).toLocaleString()}
                  </p>
                </div>
              )}

              {distribution.external_id && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>External ID</label>
                  <p className='mt-1 text-sm text-gray-900'>{distribution.external_id}</p>
                </div>
              )}

              {distribution.external_url && (
                <div className='col-span-2'>
                  <label className='text-sm font-medium text-gray-500'>Published URL</label>
                  <div className='mt-1'>
                    <a
                      href={distribution.external_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 underline text-sm'
                    >
                      {distribution.external_url}
                      <Icons name='IconExternalLink' size={14} className='inline ml-1' />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Topic Details */}
          {distribution.topic && (
            <Card className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Topic Details</h3>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium text-gray-900'>{distribution.topic.title}</h4>
                  <p className='text-sm text-gray-600'>{distribution.topic.name}</p>
                </div>
                {distribution.topic.content && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Content Preview</label>
                    <div className='mt-1 p-3 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-700 line-clamp-3'>
                        {distribution.topic.content.replace(/<[^>]*>/g, '').substring(0, 300)}...
                      </p>
                    </div>
                  </div>
                )}
                <div className='flex items-center space-x-4 text-xs text-gray-500'>
                  <span>Status: {distribution.topic.status === 1 ? 'Published' : 'Draft'}</span>
                  <span>
                    Created: {new Date(distribution.topic.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Error Details */}
          {distribution.error_details && (
            <Card className='p-6 border-red-200 bg-red-50'>
              <h3 className='text-lg font-medium text-red-900 mb-4'>Error Details</h3>
              <div className='bg-red-100 rounded-lg p-4'>
                <p className='text-sm text-red-800'>{distribution.error_details}</p>
              </div>
            </Card>
          )}

          {/* Custom Data */}
          {distribution.custom_data && Object.keys(distribution.custom_data).length > 0 && (
            <Card className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Custom Data</h3>
              <div className='bg-gray-50 rounded-lg p-4'>
                <pre className='text-xs text-gray-700 whitespace-pre-wrap'>
                  {JSON.stringify(distribution.custom_data, null, 2)}
                </pre>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Channel Details */}
          {distribution.channel && (
            <Card className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Channel Details</h3>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Icons name='IconBroadcast' size={20} className='text-blue-600' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>{distribution.channel.name}</h4>
                    <p className='text-sm text-gray-600 capitalize'>{distribution.channel.type}</p>
                  </div>
                </div>
                {distribution.channel.description && (
                  <p className='text-sm text-gray-600'>{distribution.channel.description}</p>
                )}
                <div className='space-y-2 text-xs text-gray-500'>
                  <div className='flex justify-between'>
                    <span>Auto Publish:</span>
                    <span>{distribution.channel.auto_publish ? 'Yes' : 'No'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Require Review:</span>
                    <span>{distribution.channel.require_review ? 'Yes' : 'No'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Status:</span>
                    <span>{distribution.channel.status === 0 ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Distribution Timeline */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Timeline</h3>
            <div className='space-y-4'>
              <div className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                <div>
                  <p className='text-sm font-medium text-gray-900'>Created</p>
                  <p className='text-xs text-gray-500'>
                    {new Date(distribution.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {distribution.scheduled_at && (
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-orange-500 rounded-full mt-2'></div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Scheduled</p>
                    <p className='text-xs text-gray-500'>
                      {new Date(distribution.scheduled_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {distribution.published_at && (
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-green-500 rounded-full mt-2'></div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Published</p>
                    <p className='text-xs text-gray-500'>
                      {new Date(distribution.published_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {distribution.status === DISTRIBUTION_STATUS.FAILED && (
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-red-500 rounded-full mt-2'></div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Failed</p>
                    <p className='text-xs text-gray-500'>
                      {new Date(distribution.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {distribution.status === DISTRIBUTION_STATUS.CANCELLED && (
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-gray-500 rounded-full mt-2'></div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Cancelled</p>
                    <p className='text-xs text-gray-500'>
                      {new Date(distribution.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Quick Actions</h3>
            <div className='space-y-3'>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => navigate(`/content/topics/${distribution.topic_id}`)}
              >
                <Icons name='IconFileText' size={16} className='mr-2' />
                View Topic
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => navigate(`/content/channels/${distribution.channel_id}`)}
              >
                <Icons name='IconBroadcast' size={16} className='mr-2' />
                View Channel
              </Button>
              {distribution.external_url && (
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => window.open(distribution.external_url, '_blank')}
                >
                  <Icons name='IconExternalLink' size={16} className='mr-2' />
                  View Published
                </Button>
              )}
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => {
                  // Export distribution data
                  const dataStr = JSON.stringify(distribution, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `distribution-${distribution.id}-data.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Icons name='IconDownload' size={16} className='mr-2' />
                Export Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
