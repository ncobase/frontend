import React, { useState, useCallback } from 'react';

import { Card, Button, Icons, Badge, TableView, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { BulkActions } from '../../components/BulkActions';
import { ContentSearch } from '../../components/ContentSearch';
import { useContentOperations } from '../../hooks/useContentOperations';
import { Channel } from '../channel';
import { useListChannels } from '../service';

import { Page, Topbar } from '@/components/layout';

export const ChannelListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({ search: '', type: '', limit: 50 });
  const [selectedItems, setSelectedItems] = useState<Channel[]>([]);

  const { data: channelData, isLoading, refetch } = useListChannels(searchParams);
  const { bulkDeleteChannels } = useContentOperations();

  const channels = channelData?.items || [];

  const handleSearch = useCallback((query: string, filters: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      type: filters.type || '',
      cursor: ''
    }));
  }, []);

  const handleToggleSelect = useCallback((item: Channel) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      return isSelected ? prev.filter(selected => selected.id !== item.id) : [...prev, item];
    });
  }, []);

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      const success = await bulkDeleteChannels(ids);
      if (success) {
        setSelectedItems([]);
        refetch();
      }
    },
    [bulkDeleteChannels, refetch]
  );

  const getStatusBadge = (status: number) => {
    return status === 0 ? (
      <Badge variant='success'>{t('common.enabled')}</Badge>
    ) : (
      <Badge variant='secondary'>{t('common.disabled')}</Badge>
    );
  };

  // Table columns configuration
  const columns = [
    {
      title: t('channel.fields.name'),
      dataIndex: 'name',
      parser: (_: any, channel: Channel) => (
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-blue-100 rounded flex items-center justify-center'>
            <Icons name='IconBroadcast' size={16} className='text-blue-600' />
          </div>
          <div>
            <div className='font-medium text-gray-900'>{channel.name}</div>
            <div className='text-sm text-gray-500'>{channel.type}</div>
          </div>
        </div>
      )
    },
    {
      title: t('channel.fields.status'),
      dataIndex: 'status',
      width: 120,
      parser: (status: number) => getStatusBadge(status)
    },
    {
      title: t('channel.fields.description'),
      dataIndex: 'description',
      parser: (description: string) => (
        <span className='text-sm text-gray-600 line-clamp-2'>{description || '-'}</span>
      )
    },
    {
      title: t('channel.fields.created_at'),
      dataIndex: 'created_at',
      width: 120,
      parser: (created_at: string) => (
        <Tooltip content={formatDateTime(created_at, 'dateTime')}>
          <span className='text-sm text-gray-500'>{formatRelativeTime(new Date(created_at))}</span>
        </Tooltip>
      )
    },
    {
      title: t('common.actions'),
      filter: false,
      parser: (_: any, channel: Channel) => (
        <div className='flex space-x-1'>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/channels/${channel.id}`)} // Updated route
          >
            <Icons name='IconEye' size={14} className='mr-1' />
            {t('actions.view')}
          </Button>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/channels/${channel.id}/edit`)} // Updated route
          >
            <Icons name='IconEdit' size={14} className='mr-1' />
            {t('actions.edit')}
          </Button>
        </div>
      )
    }
  ];

  const filterOptions = {
    types: [
      { label: t('channel.type.social'), value: 'social' },
      { label: t('channel.type.email'), value: 'email' },
      { label: t('channel.type.web'), value: 'web' },
      { label: t('channel.type.api'), value: 'api' }
    ]
  };

  return (
    <Page
      sidebar
      title={t('content.channels.title')}
      topbar={
        <Topbar
          title={t('content.channels.description')}
          right={[
            <Button size='sm' onClick={() => navigate('/content/channels/create')}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('content.channels.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Search */}
      <ContentSearch
        onSearch={handleSearch}
        placeholder={t('content.channels.search_placeholder')}
        showFilters={true}
        filterOptions={filterOptions}
      />

      {/* Channels List */}
      <div>
        {isLoading ? (
          <div className='flex items-center justify-center h-48'>
            <Icons name='IconLoader2' className='animate-spin' size={24} />
          </div>
        ) : channels.length > 0 ? (
          <TableView
            header={columns}
            selected
            data={channels}
            onSelectRow={row => handleToggleSelect(row)}
            onSelectAllRows={rows => setSelectedItems(rows)}
          />
        ) : (
          <Card className='text-center py-8'>
            <Icons name='IconBroadcast' size={32} className='mx-auto text-gray-400 mb-3' />
            <h3 className='text-base font-medium text-gray-900 mb-1'>
              {t('content.channels.empty.title')}
            </h3>
            <p className='text-sm text-gray-500 mb-4'>{t('content.channels.empty.description')}</p>
            <Button size='sm' onClick={() => navigate('/content/channels/create')}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('content.channels.create')}
            </Button>
          </Card>
        )}
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedItems([])}
        onBulkDelete={handleBulkDelete}
      />
    </Page>
  );
};
