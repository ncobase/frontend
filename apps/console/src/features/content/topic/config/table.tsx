import { Button, Badge, Tooltip, Icons, TableViewProps } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTaxonomy } from '../../taxonomy/service';
import { Topic } from '../topic';

import { useQueryUser } from '@/features/system/user/service';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('topic.fields.title', 'Title'),
      accessorKey: 'title',
      parser: (value: string, record: Topic) => (
        <Button variant='link' onClick={() => handleView(record, 'view')}>
          <div className='flex items-center space-x-2'>
            {value}
            {record.private && (
              <Badge variant='secondary' className='text-xs px-1'>
                Private
              </Badge>
            )}
            {record.temp && (
              <Badge variant='warning' className='text-xs px-1'>
                Temp
              </Badge>
            )}
          </div>
        </Button>
      ),
      icon: 'IconFlame'
    },
    {
      title: t('topic.fields.slug', 'Slug'),
      accessorKey: 'slug',
      parser: (value: string) => (
        <span className='text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded'>
          {value || '-'}
        </span>
      ),
      icon: 'IconAffiliate'
    },
    {
      title: t('topic.fields.taxonomy', 'Taxonomy'),
      accessorKey: 'taxonomy',
      parser: (value: string) => {
        const { data } = useQueryTaxonomy(value);
        return <span className='text-slate-600'>{data?.name || value || '-'}</span>;
      },
      icon: 'IconBookmark'
    },
    {
      title: t('topic.fields.status', 'Status'),
      accessorKey: 'status',
      parser: (status: number, record: Topic) => renderTopicStatus(status, record),
      icon: 'IconStatusChange'
    },
    {
      title: t('topic.fields.markdown', 'Format'),
      accessorKey: 'markdown',
      parser: (markdown: boolean) => (
        <Badge variant={markdown ? 'primary' : 'secondary'} className='text-xs'>
          {markdown ? 'Markdown' : 'HTML'}
        </Badge>
      ),
      icon: 'IconMarkdown'
    },
    {
      title: t('topic.fields.created_by', 'Author'),
      accessorKey: 'created_by',
      parser: (value: string) => {
        const { data } = useQueryUser(value);
        return <span className='text-slate-600'>{data?.username || value || '-'}</span>;
      },
      icon: 'IconUser'
    },
    {
      title: t('topic.fields.created_at', 'Created'),
      accessorKey: 'created_at',
      parser: (value: string) => (
        <Tooltip content={formatDateTime(value, 'dateTime')}>
          <span>{formatRelativeTime(new Date(value))}</span>
        </Tooltip>
      ),
      icon: 'IconCalendarPlus'
    },
    {
      title: t('common.actions', 'Actions'),
      accessorKey: 'operation-column',
      actions: [
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: Topic) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: Topic) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate', 'Duplicate'),
          icon: 'IconCopy',
          onClick: (record: Topic) => {
            // Create a copy without ID for duplication
            const duplicateRecord = {
              ...record,
              id: undefined,
              title: `${record.title} (Copy)`,
              slug: `${record.slug}-copy`,
              temp: true // Duplicated topics should be temporary
            };
            handleView(duplicateRecord, 'create');
          }
        },
        {
          title: t('actions.share', 'Share'),
          icon: 'IconShare2',
          onClick: () => console.log('share topic')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: Topic) => handleDelete(record)
        }
      ]
    }
  ];
};

// Status rendering helper
const renderTopicStatus = (status: number, _record: Topic) => {
  const statusConfig = {
    0: { variant: 'warning', label: 'Draft', icon: 'IconEdit' },
    1: { variant: 'success', label: 'Published', icon: 'IconCheck' },
    2: { variant: 'danger', label: 'Archived', icon: 'IconArchive' }
  };

  const config = statusConfig[status] || {
    variant: 'secondary',
    label: 'Unknown'
  };

  return (
    <div className='flex items-center space-x-1'>
      <Badge variant={config.variant as any}>{config.label}</Badge>
    </div>
  );
};
