import { useState, useCallback } from 'react';

import { Button, Icons, Badge, TableView, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { BulkActions } from '../../components/BulkActions';
import { ContentSearch } from '../../components/ContentSearch';
import { useContentOperations } from '../../hooks/useContentOperations';
import { useListTaxonomies } from '../service';
import { Taxonomy } from '../taxonomy';

import { Page, Topbar } from '@/components/layout';

export const TaxonomyListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({ search: '', type: '', limit: 50 });
  const [selectedItems, setSelectedItems] = useState<Taxonomy[]>([]);

  const { data: taxonomyData, isLoading, refetch } = useListTaxonomies(searchParams);
  const { bulkDeleteTaxonomies } = useContentOperations();

  const taxonomies = taxonomyData?.items || [];

  const handleSearch = useCallback((query: string, filters: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      type: filters.type || '',
      cursor: ''
    }));
  }, []);

  const handleToggleSelect = useCallback((item: Taxonomy) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      return isSelected ? prev.filter(selected => selected.id !== item.id) : [...prev, item];
    });
  }, []);

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      const success = await bulkDeleteTaxonomies(ids);
      if (success) {
        setSelectedItems([]);
        refetch();
      }
    },
    [bulkDeleteTaxonomies, refetch]
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
      title: t('taxonomy.fields.name'),
      dataIndex: 'name',
      parser: (_: any, taxonomy: Taxonomy) => (
        <div className='flex items-center space-x-3'>
          <div
            className='w-8 h-8 rounded flex items-center justify-center'
            style={{ backgroundColor: taxonomy.color || '#3B82F6' }}
          >
            <Icons name={taxonomy.icon || 'IconFolder'} size={16} color='#fff' />
          </div>
          <div>
            <Button
              variant='link'
              size='lg'
              className='px-0 h-auto min-h-auto'
              onClick={e => {
                e.stopPropagation();
                navigate(`/content/topics/${taxonomy.id}`);
              }}
            >
              {taxonomy.name}
            </Button>
            <div className='text-xs px-1.5 text-gray-500'>{taxonomy.description}</div>
          </div>
        </div>
      )
    },
    {
      title: t('taxonomy.fields.type'),
      dataIndex: 'type',
      width: 120,
      parser: (type: string) => (
        <Badge variant='primary' className='capitalize'>
          {type}
        </Badge>
      )
    },
    {
      title: t('taxonomy.fields.status'),
      dataIndex: 'status',
      width: 120,
      parser: (status: number) => getStatusBadge(status)
    },
    {
      title: t('taxonomy.fields.description'),
      dataIndex: 'description',
      parser: (description: string) => (
        <span className='text-sm text-gray-600 line-clamp-2'>{description || '-'}</span>
      )
    },
    {
      title: t('taxonomy.fields.created_at'),
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
      parser: (_: any, taxonomy: Taxonomy) => (
        <div className='flex space-x-1'>
          <Button
            variant='text'
            size='xs'
            onClick={e => {
              e.stopPropagation();
              navigate(`/content/taxonomies/${taxonomy.id}`);
            }}
          >
            <Icons name='IconEye' size={14} className='mr-1' />
            {t('actions.view')}
          </Button>
          <Button
            variant='text'
            size='xs'
            onClick={e => {
              e.stopPropagation();
              navigate(`/content/taxonomies/${taxonomy.id}/edit`);
            }}
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
      { label: t('taxonomy.type.category'), value: 'category' },
      { label: t('taxonomy.type.tag'), value: 'tag' },
      { label: t('taxonomy.type.topic'), value: 'topic' },
      { label: t('taxonomy.type.section'), value: 'section' }
    ]
  };

  return (
    <Page
      sidebar
      title={t('content.taxonomies.title')}
      topbar={
        <Topbar
          title={t('content.taxonomies.title')}
          right={[
            <Button size='sm' onClick={() => navigate('/content/taxonomies/create')}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('content.taxonomies.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Search */}
      <ContentSearch
        onSearch={handleSearch}
        placeholder={t('content.taxonomies.search_placeholder')}
        showFilters={true}
        filterOptions={filterOptions}
      />

      {/* Taxonomies List */}
      <div>
        {isLoading ? (
          <div className='flex items-center justify-center h-48'>
            <Icons name='IconLoader2' className='animate-spin' size={24} />
          </div>
        ) : taxonomies.length > 0 ? (
          <TableView
            header={columns}
            selected
            data={taxonomies}
            onSelectRow={row => handleToggleSelect(row)}
            onSelectAllRows={rows => setSelectedItems(rows)}
          />
        ) : (
          <div className='text-center py-8'>
            <Icons name='IconBookmark' size={32} className='mx-auto text-gray-400 mb-3' />
            <h3 className='text-base font-medium text-gray-900 mb-1'>
              {t('content.taxonomies.empty.title')}
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
              {t('content.taxonomies.empty.description')}
            </p>
            <Button size='sm' onClick={() => navigate('/content/taxonomies/create')}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('content.taxonomies.create')}
            </Button>
          </div>
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
