import { Button, Badge, Tooltip, Icons, TableViewProps } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Permission } from '../permission';

interface TableColumnsProps {
  handleView: (_record: Permission, _type: string) => void;
  handleDelete: (_record: Permission) => void;
  handleAssignRoles: (_record: Permission) => void;
}

export const tableColumns = ({
  handleView,
  handleDelete,
  handleAssignRoles
}: TableColumnsProps): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('permission.fields.name', 'Name'),
      dataIndex: 'name',
      parser: (value: string, record: Permission) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <div className='flex items-center space-x-2'>
            <span className='font-medium'>{value}</span>
            {record.default && (
              <Badge variant='primary' className='text-xs px-1'>
                {t('permission.labels.default')}
              </Badge>
            )}
            {record.disabled && (
              <Badge variant='danger' className='text-xs px-1'>
                {t('common.disabled')}
              </Badge>
            )}
          </div>
        </Button>
      ),
      icon: 'IconLock'
    },
    {
      title: t('permission.fields.action', 'Action'),
      dataIndex: 'action',
      parser: (value: string) => renderActionBadge(value),
      icon: 'IconCommand'
    },
    {
      title: t('permission.fields.subject', 'Subject/Resource'),
      dataIndex: 'subject',
      parser: (value: string) => (
        <span className='text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded'>
          {value || t('permission.labels.all_resources')}
        </span>
      ),
      icon: 'IconTarget'
    },
    {
      title: t('permission.fields.group', 'Group'),
      dataIndex: 'group',
      parser: (value: string) => <span className='text-slate-600'>{value || '-'}</span>,
      icon: 'IconUsers'
    },
    {
      title: t('permission.fields.description', 'Description'),
      dataIndex: 'description',
      parser: (value: string) => (
        <Tooltip content={value || t('permission.labels.no_description')}>
          <span className='truncate max-w-[200px] text-slate-600'>
            {value ? value.substring(0, 40) + (value.length > 40 ? '...' : '') : '-'}
          </span>
        </Tooltip>
      ),
      icon: 'IconFileText'
    },
    {
      title: t('permission.fields.status', 'Status'),
      dataIndex: 'disabled',
      parser: (disabled: boolean, record: Permission) =>
        renderPermissionStatus(disabled, record.default, t),
      icon: 'IconStatusChange'
    },
    {
      title: t('permission.fields.created_at', 'Created'),
      dataIndex: 'created_at',
      parser: (value: string) => (
        <Tooltip content={formatDateTime(value, 'dateTime')}>
          <span>{formatRelativeTime(new Date(value))}</span>
        </Tooltip>
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
            const duplicateRecord = {
              ...record,
              id: undefined,
              name: `${record.name} (Copy)`
            };
            handleView(duplicateRecord, 'create');
          }
        },
        {
          title: t('permission.actions.assign_roles', 'Assign to Roles'),
          icon: 'IconUserCheck',
          onClick: (record: Permission) => handleAssignRoles(record)
        },
        {
          title: t('actions.export', 'Export'),
          icon: 'IconDownload',
          onClick: (record: Permission) => {
            const dataStr = JSON.stringify(record, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `permission-${record.id || record.name}.json`;
            link.click();
            URL.revokeObjectURL(url);
          }
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

  const lowerAction = action.toLowerCase();
  const colorClass = actionColors[lowerAction] || 'bg-slate-100 text-slate-800';

  return (
    <div className='flex items-center space-x-1'>
      <Badge className={colorClass}>{action.charAt(0).toUpperCase() + action.slice(1)}</Badge>
    </div>
  );
};

// Status rendering helper
const renderPermissionStatus = (disabled: boolean, isDefault: boolean, t: any) => {
  if (disabled) {
    return <Badge variant='danger'>{t('common.disabled')}</Badge>;
  }

  if (isDefault) {
    return (
      <div className='flex items-center space-x-1'>
        <Badge variant='success'>{t('common.enabled')}</Badge>
        <Badge variant='primary' className='text-xs'>
          {t('permission.labels.system')}
        </Badge>
      </div>
    );
  }

  return <Badge variant='success'>{t('common.enabled')}</Badge>;
};
