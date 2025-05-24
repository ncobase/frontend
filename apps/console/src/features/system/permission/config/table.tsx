import { Button, Badge, Tooltip, Icons, TableViewProps } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Permission } from '../permission';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('permission.fields.name', 'Name'),
      accessorKey: 'name',
      parser: (value: string, record: Permission) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <div className='flex items-center space-x-2'>
            <span className='font-medium'>{value}</span>
            {record.default && (
              <Badge variant='primary' className='text-xs px-1'>
                Default
              </Badge>
            )}
          </div>
        </Button>
      ),
      icon: 'IconLock'
    },
    {
      title: t('permission.fields.action', 'Action'),
      accessorKey: 'action',
      parser: (value: string) => renderActionBadge(value),
      icon: 'IconCommand'
    },
    {
      title: t('permission.fields.subject', 'Subject/Resource'),
      accessorKey: 'subject',
      parser: (value: string) => (
        <span className='text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded'>
          {value || 'All'}
        </span>
      ),
      icon: 'IconTarget'
    },
    {
      title: t('permission.fields.group', 'Group'),
      accessorKey: 'group',
      parser: (value: string) => <span className='text-slate-600'>{value || '-'}</span>,
      icon: 'IconUsers'
    },
    {
      title: t('permission.fields.description', 'Description'),
      accessorKey: 'description',
      parser: (value: string) => (
        <Tooltip content={value || 'No description'}>
          <span className='truncate max-w-[200px] text-slate-600'>
            {value ? value.substring(0, 40) + (value.length > 40 ? '...' : '') : '-'}
          </span>
        </Tooltip>
      ),
      icon: 'IconFileText'
    },
    {
      title: t('permission.fields.status', 'Status'),
      accessorKey: 'disabled',
      parser: (disabled: boolean, record: Permission) =>
        renderPermissionStatus(disabled, record.default),
      icon: 'IconStatusChange'
    },
    {
      title: t('permission.fields.created_at', 'Created'),
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
          onClick: (record: Permission) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: Permission) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate', 'Duplicate'),
          icon: 'IconCopy',
          onClick: (record: Permission) => {
            // Create a copy without ID for duplication
            const duplicateRecord = {
              ...record,
              id: undefined,
              name: `${record.name} (Copy)`,
              default: false // Copied permissions should not be default
            };
            handleView(duplicateRecord, 'create');
          }
        },
        {
          title: t('actions.roles', 'Assign Roles'),
          icon: 'IconUserCheck',
          onClick: () => console.log('assign to roles')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: Permission) => handleDelete(record),
          disabled: (record: Permission) => record.default
        }
      ]
    }
  ];
};

// Action badge rendering helper
const renderActionBadge = (action: string) => {
  if (!action) return '-';

  const actionColors = {
    create: 'bg-green-100 text-green-800',
    read: 'bg-blue-100 text-blue-800',
    update: 'bg-yellow-100 text-yellow-800',
    delete: 'bg-red-100 text-red-800',
    manage: 'bg-purple-100 text-purple-800',
    execute: 'bg-orange-100 text-orange-800'
  };

  const actionIcons = {
    create: 'IconPlus',
    read: 'IconEye',
    update: 'IconPencil',
    delete: 'IconTrash',
    manage: 'IconSettings',
    execute: 'IconPlay'
  };

  const lowerAction = action.toLowerCase();
  const colorClass = actionColors[lowerAction] || 'bg-slate-100 text-slate-800';
  const iconName = actionIcons[lowerAction] || 'IconCommand';

  return (
    <div className='flex items-center space-x-1'>
      <Icons name={iconName} className='w-3 h-3' />
      <Badge className={colorClass}>{action.charAt(0).toUpperCase() + action.slice(1)}</Badge>
    </div>
  );
};

// Status rendering helper
const renderPermissionStatus = (disabled: boolean, isDefault: boolean) => {
  if (disabled) {
    return <Badge variant='danger'>Disabled</Badge>;
  }

  if (isDefault) {
    return (
      <div className='flex items-center space-x-1'>
        <Badge variant='success'>Enabled</Badge>
        <Badge variant='primary' className='text-xs'>
          System
        </Badge>
      </div>
    );
  }

  return <Badge variant='success'>Enabled</Badge>;
};
