import { Badge, Button, Icons, TableViewProps, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { ResourceFile } from '../resource';

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '-';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

const categoryIcon: Record<string, string> = {
  image: 'IconPhoto',
  document: 'IconFileText',
  video: 'IconVideo',
  audio: 'IconMusic',
  archive: 'IconFileZip',
  other: 'IconFile'
};

export const tableColumns = ({
  handleView,
  handleDelete
}: {
  handleView: (record: ResourceFile, mode: string) => void;
  handleDelete: (record: ResourceFile) => void;
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('resource.fields.name', 'Name'),
      dataIndex: 'name',
      parser: (value: string, record: ResourceFile) => (
        <div className='flex items-center gap-2'>
          <Icons
            name={categoryIcon[record.category || 'other'] || 'IconFile'}
            className='w-4 h-4 text-slate-500'
          />
          <Button
            variant='link'
            size='xs'
            onClick={e => {
              e.stopPropagation();
              handleView(record, 'view');
            }}
          >
            <span className='truncate max-w-[200px]'>{record.original_name || value}</span>
          </Button>
        </div>
      ),
      icon: 'IconFile'
    },
    {
      title: t('resource.fields.category', 'Category'),
      dataIndex: 'category',
      parser: (value: string) => (
        <Badge variant='outline' size='xs'>
          {t(`resource.category.${value || 'other'}`, value || 'other')}
        </Badge>
      ),
      icon: 'IconCategory'
    },
    {
      title: t('resource.fields.size', 'Size'),
      dataIndex: 'size',
      parser: (value: number) => <span className='text-slate-600'>{formatFileSize(value)}</span>,
      icon: 'IconDatabase'
    },
    {
      title: t('resource.fields.type', 'Type'),
      dataIndex: 'type',
      parser: (value: string) => (
        <span className='text-slate-500 text-xs font-mono'>{value || '-'}</span>
      ),
      icon: 'IconFileInfo'
    },
    {
      title: t('resource.fields.access_level', 'Access'),
      dataIndex: 'access_level',
      parser: (value: string) => {
        const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
          public: 'success',
          private: 'warning',
          shared: 'secondary'
        };
        return (
          <Badge variant={variants[value] || 'secondary'} size='xs'>
            {t(`resource.access.${value || 'private'}`, value || 'private')}
          </Badge>
        );
      },
      icon: 'IconLock'
    },
    {
      title: t('resource.fields.created_at', 'Created'),
      dataIndex: 'created_at',
      parser: (value: number) =>
        value ? (
          <Tooltip content={formatDateTime(new Date(value), 'dateTime')}>
            <span>{formatRelativeTime(new Date(value))}</span>
          </Tooltip>
        ) : (
          '-'
        ),
      icon: 'IconCalendarPlus'
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      actions: [
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: ResourceFile) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: ResourceFile) => handleView(record, 'edit')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: ResourceFile) => handleDelete(record)
        }
      ]
    }
  ];
};
