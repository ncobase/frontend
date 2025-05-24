import { Button, TableViewProps, Badge, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Role } from '../role';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('role.fields.name', 'Name'),
      accessorKey: 'name',
      parser: (value: string, record: Role) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <span className='font-medium'>{value}</span>
        </Button>
      ),
      icon: 'IconShield'
    },
    {
      title: t('role.fields.slug', 'Slug'),
      accessorKey: 'slug',
      parser: (value: string) => (
        <span className='text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded'>
          {value || '-'}
        </span>
      ),
      icon: 'IconTag'
    },
    {
      title: t('role.fields.group', 'Group'),
      accessorKey: 'group',
      parser: (value: string) => <span className='text-slate-600'>{value || '-'}</span>,
      icon: 'IconUsers'
    },
    {
      title: t('role.fields.tenant', 'Tenant'),
      accessorKey: 'tenant',
      parser: (value: string) => <span className='text-slate-600'>{value || '-'}</span>,
      icon: 'IconBuilding'
    },
    {
      title: t('role.fields.status', 'Status'),
      accessorKey: 'disabled',
      parser: (value: boolean) => renderRoleStatus(value),
      icon: 'IconStatusChange'
    },
    {
      title: t('role.fields.description', 'Description'),
      accessorKey: 'description',
      parser: (value: string) => (
        <Tooltip content={value || 'No description'}>
          <span className='truncate max-w-[200px] text-slate-600'>
            {value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : '-'}
          </span>
        </Tooltip>
      ),
      icon: 'IconFileText'
    },
    {
      title: t('role.fields.created_at', 'Created'),
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
          onClick: (record: Role) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: Role) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate', 'Duplicate'),
          icon: 'IconCopy',
          onClick: (record: Role) => {
            // Create a copy without ID for duplication
            const duplicateRecord = {
              ...record,
              id: undefined,
              name: `${record.name} (Copy)`,
              slug: `${record.slug}-copy`
            };
            handleView(duplicateRecord, 'create');
          }
        },
        {
          title: t('actions.permissions', 'Permissions'),
          icon: 'IconLock',
          onClick: () => console.log('manage permissions')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: Role) => handleDelete(record)
        }
      ]
    }
  ];
};

// Status rendering helper
const renderRoleStatus = (disabled: boolean) => {
  return disabled ? (
    <Badge variant='danger'>Disabled</Badge>
  ) : (
    <Badge variant='success'>Enabled</Badge>
  );
};
