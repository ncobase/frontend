import React, { useState } from 'react';

import { Button, Icons, Card, Badge, TableView } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useTemplates, useDeleteTemplate } from '../service';
import { ContentTemplate } from '../template';

import { Page, Topbar } from '@/components/layout';

export const TemplateListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filters] = useState({
    search: '',
    type: '',
    category: '',
    limit: 50
  });

  const { data: templatesData, isLoading } = useTemplates(filters);
  const deleteTemplateMutation = useDeleteTemplate();

  const templates = templatesData?.items || [];

  const handleDelete = async (template: ContentTemplate) => {
    if (confirm(t('template.delete.confirm'))) {
      try {
        await deleteTemplateMutation.mutateAsync(template.id!);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      topic: 'IconFileText',
      taxonomy: 'IconTag',
      page: 'IconLayout',
      email: 'IconMail',
      custom: 'IconPuzzle'
    };
    return icons[type] || 'IconTemplate';
  };

  const columns = [
    {
      title: t('template.fields.name'),
      dataIndex: 'name',
      parser: (_: any, template: ContentTemplate) => (
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
            <Icons name={getTypeIcon(template.type)} size={20} className='text-blue-600' />
          </div>
          <div>
            <div className='font-medium text-gray-900'>{template.name}</div>
            <div className='text-sm text-gray-500'>{template.description}</div>
          </div>
        </div>
      )
    },
    {
      title: t('template.fields.type'),
      dataIndex: 'type',
      parser: (type: string) => (
        <Badge variant='primary' className='capitalize'>
          {t(`template.types.${type}`)}
        </Badge>
      )
    },
    {
      title: t('template.fields.category'),
      dataIndex: 'category',
      parser: (category: string) =>
        category ? <Badge variant='secondary'>{t(`template.categories.${category}`)}</Badge> : '-'
    },
    {
      title: t('template.fields.usage_count'),
      dataIndex: 'usage_count',
      parser: (count: number) => <span className='text-sm text-gray-600'>{count}</span>
    },
    {
      title: t('template.fields.created_at'),
      dataIndex: 'created_at',
      parser: (date: string) => (
        <span className='text-sm text-gray-500'>{formatDateTime(date)}</span>
      )
    },
    {
      title: t('common.actions'),
      filter: false,
      parser: (_: any, template: ContentTemplate) => (
        <div className='flex space-x-1'>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/templates/${template.id}`)}
          >
            <Icons name='IconEye' size={14} className='mr-1' />
            {t('actions.view')}
          </Button>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/templates/${template.id}/edit`)}
          >
            <Icons name='IconEdit' size={14} className='mr-1' />
            {t('actions.edit')}
          </Button>
          <Button
            variant='text'
            size='xs'
            onClick={() => handleDelete(template)}
            className='text-red-600'
          >
            <Icons name='IconTrash' size={14} className='mr-1' />
            {t('actions.delete')}
          </Button>
        </div>
      )
    }
  ];

  return (
    <Page
      sidebar
      title={t('template.title')}
      topbar={
        <Topbar
          title={t('template.title')}
          left={[
            <span className='text-muted-foreground text-xs'>{t('template.list.description')}</span>
          ]}
          right={[
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate('/content/templates/market')}
            >
              <Icons name='IconStore' size={16} className='mr-2' />
              {t('template.market.browse')}
            </Button>,
            <Button onClick={() => navigate('/content/templates/create')} size='sm'>
              <Icons name='IconPlus' size={16} className='mr-2' />
              {t('template.create.action')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {isLoading ? (
        <div className='flex items-center justify-center h-48'>
          <Icons name='IconLoader2' className='animate-spin' size={24} />
        </div>
      ) : templates.length > 0 ? (
        <TableView header={columns} data={templates} />
      ) : (
        <Card className='text-center py-12'>
          <Icons name='IconTemplate' size={48} className='mx-auto text-gray-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {t('template.list.empty.title')}
          </h3>
          <p className='text-gray-500 mb-6'>{t('template.list.empty.description')}</p>
          <div className='flex items-center justify-center gap-3'>
            <Button onClick={() => navigate('/content/templates/create')}>
              <Icons name='IconPlus' size={16} className='mr-2' />
              {t('template.create.action')}
            </Button>
            <Button variant='outline' onClick={() => navigate('/content/templates/market')}>
              <Icons name='IconStore' size={16} className='mr-2' />
              {t('template.market.browse')}
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
};
