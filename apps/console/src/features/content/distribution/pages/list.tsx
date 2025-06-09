import { useState, useCallback } from 'react';

import { Card, Button, Icons, Badge, TableView } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { BulkActions } from '../../components/BulkActions';
import { ContentSearch } from '../../components/ContentSearch';
import { useContentOperations } from '../../hooks/useContentOperations';
import { DISTRIBUTION_STATUS, DISTRIBUTION_STATUS_LABELS } from '../distribution.d';
import { Distribution } from '../distribution.d';
import { useListDistributions, usePublishDistribution, useCancelDistribution } from '../service';

import { Page, Topbar } from '@/components/layout';

export const DistributionListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({ search: '', status: '', limit: 50 });
  const [selectedItems, setSelectedItems] = useState<Distribution[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const { data: distributionData, isLoading, refetch } = useListDistributions(searchParams);
  const { bulkDeleteDistributions } = useContentOperations();
  const publishMutation = usePublishDistribution();
  const cancelMutation = useCancelDistribution();

  const distributions = distributionData?.items || [];

  const handleSearch = useCallback((query: string, filters: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      status: filters.status || '',
      topic_id: filters.topic_id || '',
      channel_id: filters.channel_id || '',
      cursor: ''
    }));
  }, []);

  const handleToggleSelect = useCallback((item: Distribution) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      const success = await bulkDeleteDistributions(ids);
      if (success) {
        setSelectedItems([]);
        refetch();
      }
    },
    [bulkDeleteDistributions, refetch]
  );

  const handlePublish = useCallback(
    async (distributionId: string) => {
      try {
        await publishMutation.mutateAsync(distributionId);
        refetch();
      } catch (error) {
        console.error('Failed to publish distribution:', error);
      }
    },
    [publishMutation, refetch]
  );

  const handleCancel = useCallback(
    async (distributionId: string, reason: string) => {
      try {
        await cancelMutation.mutateAsync({ id: distributionId, reason });
        refetch();
      } catch (error) {
        console.error('Failed to cancel distribution:', error);
      }
    },
    [cancelMutation, refetch]
  );

  const isSelected = useCallback(
    (item: Distribution) => {
      return selectedItems.some(selected => selected.id === item.id);
    },
    [selectedItems]
  );

  const getStatusBadge = (status: number) => {
    const variants = {
      [DISTRIBUTION_STATUS.DRAFT]: { variant: 'secondary', icon: 'IconEdit' },
      [DISTRIBUTION_STATUS.SCHEDULED]: { variant: 'warning', icon: 'IconClock' },
      [DISTRIBUTION_STATUS.PUBLISHED]: { variant: 'success', icon: 'IconCheck' },
      [DISTRIBUTION_STATUS.FAILED]: { variant: 'danger', icon: 'IconAlertCircle' },
      [DISTRIBUTION_STATUS.CANCELLED]: { variant: 'secondary', icon: 'IconX' }
    };

    const config = variants[status] || variants[DISTRIBUTION_STATUS.DRAFT];
    return (
      <Badge variant={config.variant} className='flex items-center gap-1'>
        <Icons name={config.icon} size={12} />
        {DISTRIBUTION_STATUS_LABELS[status]}
      </Badge>
    );
  };

  const filterOptions = {
    statuses: [
      { label: t('distribution.status.draft'), value: '0' },
      { label: t('distribution.status.scheduled'), value: '1' },
      { label: t('distribution.status.published'), value: '2' },
      { label: t('distribution.status.failed'), value: '3' },
      { label: t('distribution.status.cancelled'), value: '4' }
    ]
  };

  // Table columns for list view
  const columns = [
    {
      title: t('distribution.fields.topic'),
      dataIndex: 'topic',
      parser: (_: any, distribution: Distribution) => (
        <div>
          <div className='font-medium text-gray-900'>
            {distribution.topic?.title || t('distribution.unknown_topic')}
          </div>
          <div className='text-sm text-gray-500'>
            {distribution.topic?.name || distribution.topic_id}
          </div>
        </div>
      )
    },
    {
      title: t('distribution.fields.channel'),
      dataIndex: 'channel',
      parser: (_: any, distribution: Distribution) => (
        <div className='flex items-center space-x-2'>
          <Icons name='IconBroadcast' size={16} className='text-gray-400' />
          <span className='text-sm text-gray-900'>
            {distribution.channel?.name || t('distribution.unknown_channel')}
          </span>
        </div>
      )
    },
    {
      title: t('distribution.fields.status'),
      dataIndex: 'status',
      width: 120,
      parser: (status: number) => getStatusBadge(status)
    },
    {
      title: t('distribution.fields.scheduled_at'),
      dataIndex: 'scheduled_at',
      width: 150,
      parser: (scheduled_at: string) => (
        <span className='text-sm text-gray-600'>
          {scheduled_at ? formatDateTime(scheduled_at) : '-'}
        </span>
      )
    },
    {
      title: t('distribution.fields.published_at'),
      dataIndex: 'published_at',
      width: 150,
      parser: (published_at: string) => (
        <span className='text-sm text-gray-600'>
          {published_at ? formatDateTime(published_at) : '-'}
        </span>
      )
    },
    {
      title: t('common.actions'),
      filter: false,
      parser: (_: any, distribution: Distribution) => (
        <div className='flex space-x-1'>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/distributions/${distribution.id}`)}
          >
            <Icons name='IconEye' size={14} className='mr-1' />
            {t('actions.view')}
          </Button>

          {distribution.status === DISTRIBUTION_STATUS.DRAFT && (
            <Button
              variant='text'
              size='xs'
              onClick={() => handlePublish(distribution.id)}
              loading={publishMutation.isPending}
            >
              <Icons name='IconSend' size={14} className='mr-1' />
              {t('actions.publish')}
            </Button>
          )}

          {(distribution.status === DISTRIBUTION_STATUS.SCHEDULED ||
            distribution.status === DISTRIBUTION_STATUS.DRAFT) && (
            <Button
              variant='text'
              size='xs'
              onClick={() => {
                const reason = prompt(t('distribution.cancel_reason_prompt'));
                if (reason) {
                  handleCancel(distribution.id, reason);
                }
              }}
              loading={cancelMutation.isPending}
            >
              <Icons name='IconX' size={14} className='mr-1' />
              {t('actions.cancel')}
            </Button>
          )}

          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/distributions/${distribution.id}/edit`)}
          >
            <Icons name='IconEdit' size={14} className='mr-1' />
            {t('actions.edit')}
          </Button>
        </div>
      )
    }
  ];

  // Grid item renderer
  const renderDistributionCard = (distribution: Distribution) => {
    const isSelectedItem = isSelected(distribution);

    return (
      <Card key={distribution.id} className='p-4 hover:shadow-md transition-shadow'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-start space-x-4'>
            <input
              type='checkbox'
              checked={isSelectedItem}
              onChange={() => handleToggleSelect(distribution)}
              className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <div className='flex-1'>
              <div className='flex items-center space-x-3 mb-2'>
                <h3 className='font-semibold text-gray-900'>
                  {distribution.topic?.title || t('distribution.unknown_topic')}
                </h3>
                {getStatusBadge(distribution.status)}
              </div>

              <div className='space-y-1 text-sm text-gray-600'>
                <div className='flex items-center space-x-4'>
                  <span>
                    <Icons name='IconBroadcast' size={14} className='inline mr-1' />
                    {distribution.channel?.name || t('distribution.unknown_channel')}
                  </span>
                  {distribution.scheduled_at && (
                    <span>
                      <Icons name='IconCalendar' size={14} className='inline mr-1' />
                      {t('distribution.scheduled')}: {formatDateTime(distribution.scheduled_at)}
                    </span>
                  )}
                </div>

                {distribution.published_at && (
                  <div>
                    <Icons name='IconCheck' size={14} className='inline mr-1' />
                    {t('distribution.published')}: {formatDateTime(distribution.published_at)}
                  </div>
                )}

                {distribution.error_details && (
                  <div className='text-red-600'>
                    <Icons name='IconAlertCircle' size={14} className='inline mr-1' />
                    {distribution.error_details}
                  </div>
                )}

                {distribution.external_url && (
                  <div>
                    <a
                      href={distribution.external_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 underline'
                    >
                      <Icons name='IconExternalLink' size={14} className='inline mr-1' />
                      {t('distribution.view_published')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center justify-end space-x-2 pt-3 border-t border-gray-100'>
          {distribution.status === DISTRIBUTION_STATUS.DRAFT && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePublish(distribution.id)}
              loading={publishMutation.isPending}
            >
              <Icons name='IconSend' size={16} className='mr-1' />
              {t('actions.publish')}
            </Button>
          )}

          {(distribution.status === DISTRIBUTION_STATUS.SCHEDULED ||
            distribution.status === DISTRIBUTION_STATUS.DRAFT) && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                const reason = prompt(t('distribution.cancel_reason_prompt'));
                if (reason) {
                  handleCancel(distribution.id, reason);
                }
              }}
              loading={cancelMutation.isPending}
            >
              <Icons name='IconX' size={16} className='mr-1' />
              {t('actions.cancel')}
            </Button>
          )}

          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate(`/content/distributions/${distribution.id}`)}
          >
            <Icons name='IconEye' size={16} className='mr-1' />
            {t('actions.view')}
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate(`/content/distributions/${distribution.id}/edit`)}
          >
            <Icons name='IconEdit' size={16} className='mr-1' />
            {t('actions.edit')}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <Page
      sidebar
      title={t('content.distributions.title')}
      topbar={
        <Topbar
          title={t('content.distributions.description')}
          right={[
            <Button
              variant='text'
              size='sm'
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <Icons name={viewMode === 'grid' ? 'IconList' : 'IconGrid'} size={16} />
            </Button>,
            <Button size='sm' onClick={() => navigate('/content/distributions/create')}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('content.distributions.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Search */}
      <ContentSearch
        onSearch={handleSearch}
        placeholder={t('content.distributions.search_placeholder')}
        showFilters={true}
        filterOptions={filterOptions}
      />

      {/* Distributions List */}
      <div>
        {isLoading ? (
          <div className='flex items-center justify-center h-48'>
            <Icons name='IconLoader2' className='animate-spin' size={24} />
          </div>
        ) : distributions.length > 0 ? (
          viewMode === 'list' ? (
            <TableView
              header={columns}
              selected
              data={distributions}
              onSelectRow={row => {
                handleToggleSelect(row);
              }}
              onSelectAllRows={rows => {
                setSelectedItems(rows);
              }}
            />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {distributions.map(renderDistributionCard)}
            </div>
          )
        ) : (
          <div className='text-center py-8'>
            <Icons name='IconBroadcast' size={32} className='mx-auto text-gray-400 mb-3' />
            <h3 className='text-base font-medium text-gray-900 mb-1'>
              {t('content.distributions.empty.title')}
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
              {t('content.distributions.empty.description')}
            </p>
            <Button size='sm' onClick={() => navigate('/content/distributions/create')}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('content.distributions.create')}
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedItems([])}
        onBulkDelete={handleBulkDelete}
        onBulkExport={ids => {
          console.log('Export distributions:', ids);
        }}
      />
    </Page>
  );
};
