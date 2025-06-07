import { useState, useCallback } from 'react';

import { Card, Button, Icons, Badge, TableView, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { BulkActions } from '../../components/BulkActions';
import { ContentSearch } from '../../components/ContentSearch';
import { useContentOperations } from '../../hooks/useContentOperations';
import { TableRowOverflow } from '../components/table_row_overflow';
import { useListTopics } from '../service';
import { Topic } from '../topic';

import { Page, Topbar } from '@/components/layout';

export const TopicListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({ search: '', status: '', limit: 50 });
  const [selectedItems, setSelectedItems] = useState<Topic[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const { data: topicData, isLoading, refetch } = useListTopics(searchParams);
  const { bulkDeleteTopics } = useContentOperations();

  const topics = topicData?.items || [];

  const handleSearch = useCallback((query: string, filters: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      status: filters.status || '',
      taxonomy: filters.taxonomy || '',
      cursor: ''
    }));
  }, []);

  const handleToggleSelect = useCallback((item: Topic) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      return isSelected ? prev.filter(selected => selected.id !== item.id) : [...prev, item];
    });
  }, []);

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      const success = await bulkDeleteTopics(ids);
      if (success) {
        setSelectedItems([]);
        refetch();
      }
    },
    [bulkDeleteTopics, refetch]
  );

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: { variant: 'warning', label: t('topic.status.draft'), icon: 'IconEdit' },
      1: { variant: 'success', label: t('topic.status.published'), icon: 'IconCheck' },
      2: { variant: 'danger', label: t('topic.status.archived'), icon: 'IconArchive' }
    };
    const config = statusConfig[status] || statusConfig[0];
    return (
      <Badge variant={config.variant} className='flex items-center gap-1'>
        <Icons name={config.icon} size={12} />
        {config.label}
      </Badge>
    );
  };

  // Table columns configuration
  const columns = [
    {
      title: t('topic.fields.title'),
      dataIndex: 'title',
      parser: (_: any, topic: Topic) => (
        <div className='flex items-center space-x-3'>
          <div>
            <div className='font-medium text-black'>{topic.title}</div>
            <div className='text-sm text-gray-500'>{topic.name}</div>
          </div>
        </div>
      )
    },
    {
      title: t('topic.fields.status'),
      dataIndex: 'status',
      width: 120,
      parser: (_: any, topic: Topic) => getStatusBadge(topic.status)
    },
    {
      title: t('topic.fields.taxonomy'),
      dataIndex: 'taxonomy',
      parser: (taxonomy: string) => <span className='text-sm text-gray-600'>{taxonomy || '-'}</span>
    },
    {
      title: t('topic.fields.created_at'),
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
      parser: (_: any, topic: Topic) => (
        <div className='flex space-x-1'>
          <Button variant='text' size='xs' onClick={() => navigate(`/content/topics/${topic.id}`)}>
            <Icons name='IconEye' size={14} className='mr-1' />
            {t('actions.view')}
          </Button>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/topics/${topic.id}/edit`)}
          >
            <Icons name='IconEdit' size={14} className='mr-1' />
            {t('actions.edit')}
          </Button>
        </div>
      )
    }
  ];

  const filterOptions = {
    statuses: [
      { label: t('topic.status.draft'), value: '0' },
      { label: t('topic.status.published'), value: '1' },
      { label: t('topic.status.archived'), value: '2' }
    ]
  };

  return (
    <Page
      sidebar
      title={t('content.topics.title')}
      topbar={
        <Topbar
          title={t('content.topics.title')}
          right={[
            <Button
              size='sm'
              onClick={() => navigate('/content/topics/create')}
              className='flex items-center gap-2'
            >
              <Icons name='IconPlus' size={16} />
              {t('content.topics.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Search */}
      <ContentSearch
        onSearch={handleSearch}
        placeholder={t('content.topics.search_placeholder')}
        showFilters={true}
        filterOptions={filterOptions}
      />

      {/* Topics List */}
      <div>
        {isLoading ? (
          <div className='flex items-center justify-center h-48'>
            <Icons name='IconLoader2' className='animate-spin' size={24} />
          </div>
        ) : topics.length > 0 ? (
          <TableView
            header={columns}
            selected
            data={topics}
            onSelectRow={row => handleToggleSelect(row)}
            onSelectAllRows={rows => setSelectedItems(rows)}
            expandComponent={(item: Topic) => <TableRowOverflow item={item} />}
          />
        ) : (
          <Card className='text-center py-8'>
            <Icons name='IconFileText' size={32} className='mx-auto text-gray-400 mb-3' />
            <h3 className='text-base font-medium text-gray-900 mb-1'>
              {t('content.topics.empty.title')}
            </h3>
            <p className='text-sm text-gray-500 mb-4'>{t('content.topics.empty.description')}</p>
            <Button size='sm' onClick={() => navigate('/content/topics/create')}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('content.topics.create')}
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
