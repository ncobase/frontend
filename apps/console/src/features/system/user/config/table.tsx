import { Button, TableViewProps, Badge, Tooltip, Icons } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { User } from '../user';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('user.fields.id', 'ID'),
      accessorKey: 'id',
      parser: (value: string, record: User) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <span className='font-mono text-xs'>{value.slice(0, 8)}...</span>
        </Button>
      ),
      icon: 'IconHash'
    },
    {
      title: t('user.fields.username', 'Username'),
      accessorKey: 'username',
      parser: (value: string, record: User) => (
        <div className='flex items-center space-x-2'>
          <span className='font-medium'>{value}</span>
          {record.is_admin && (
            <Badge variant='warning' className='text-xs px-1'>
              Admin
            </Badge>
          )}
          {record.is_certified && (
            <Tooltip content='Verified User'>
              <Icons name='IconShieldCheck' className='w-4 h-4 text-green-500' />
            </Tooltip>
          )}
        </div>
      ),
      icon: 'IconUser'
    },
    {
      title: t('user.fields.email', 'Email'),
      accessorKey: 'email',
      parser: (value: string) => (
        <span className='text-slate-600 truncate max-w-[200px]'>{value || '-'}</span>
      ),
      icon: 'IconMail'
    },
    {
      title: t('user.fields.phone', 'Phone'),
      accessorKey: 'phone',
      parser: (value: string) => <span className='text-slate-600'>{value || '-'}</span>,
      icon: 'IconPhone'
    },
    {
      title: t('user.fields.status', 'Status'),
      accessorKey: 'status',
      parser: (value: number) => renderUserStatus(value),
      icon: 'IconStatusChange'
    },
    {
      title: t('user.fields.created_at', 'Created'),
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
          onClick: (record: User) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: User) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate', 'Duplicate'),
          icon: 'IconCopy',
          onClick: (record: User) => {
            // Create a copy without ID for duplication
            const duplicateRecord = {
              ...record,
              id: undefined,
              username: `${record.username}_copy`
            };
            handleView(duplicateRecord, 'create');
          }
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: User) => handleDelete(record)
        }
      ]
    }
  ];
};

// Status rendering helper
const renderUserStatus = (status: number) => {
  const statusConfig = {
    0: { label: 'Active', variant: 'success' as const },
    1: { label: 'Inactive', variant: 'warning' as const },
    2: { label: 'Disabled', variant: 'danger' as const }
  };

  const config = statusConfig[status] || { label: 'Unknown', variant: 'secondary' as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
