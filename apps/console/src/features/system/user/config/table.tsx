import { Button, TableViewProps, Badge, Tooltip, Icons } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { User } from '../user';

export const tableColumns = ({
  handleView,
  handleDelete,
  setRoleManagementModal,
  setApiKeyModal,
  setEmployeeModal
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('user.fields.username', 'Username'),
      dataIndex: 'username',
      parser: (value: string, record: User) => (
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <Button variant='link' size='xs' onClick={() => handleView(record, 'view')}>
              <span className='font-mono'>{value}</span>
            </Button>
            {record.is_admin && (
              <Badge variant='warning' size='xs' className='px-1'>
                Admin
              </Badge>
            )}
            {record.is_certified && (
              <Tooltip content='Verified User'>
                <Icons name='IconShieldCheck' className='w-4 h-4 text-green-500' />
              </Tooltip>
            )}
          </div>
          {record.id && <span className='text-gray-400 ml-1'>ID: {record.id}</span>}
        </div>
      ),
      icon: 'IconUser'
    },
    {
      title: t('user.fields.email', 'Email'),
      dataIndex: 'email',
      parser: (value: string) => (
        <span className='text-slate-600 truncate max-w-[200px]'>{value || '-'}</span>
      ),
      icon: 'IconMail'
    },
    {
      title: t('user.fields.phone', 'Phone'),
      dataIndex: 'phone',
      parser: (value: string) => <span className='text-slate-600'>{value || '-'}</span>,
      icon: 'IconPhone'
    },
    {
      title: t('user.fields.status', 'Status'),
      dataIndex: 'status',
      parser: (value: number) => renderUserStatus(value),
      icon: 'IconStatusChange'
    },
    {
      title: t('user.fields.created_at', 'Created'),
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
          title: t('actions.role', 'Roles'),
          icon: 'IconUserCheck',
          onClick: (record: User) => setRoleManagementModal({ open: true, user: record })
        },
        {
          title: t('actions.api_key', 'API Keys'),
          icon: 'IconKey',
          onClick: (record: User) => setApiKeyModal({ open: true, user: record })
        },
        {
          title: t('actions.employee', 'Employee'),
          icon: 'IconBriefcase',
          onClick: (record: User) => setEmployeeModal({ open: true, user: record })
        },
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
