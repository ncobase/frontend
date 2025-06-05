import { Button, TableViewProps, Badge, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

export const tableColumns = ({
  handleView,
  handleDelete,
  handleRoleManagement
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('tenant.users.fields.username', 'Username'),
      accessorKey: 'username',
      parser: (value: string, record: any) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <div className='flex items-center space-x-2'>
            <span className='font-medium'>{value}</span>
            {record.is_admin && (
              <Badge variant='warning' className='text-xs px-1'>
                Admin
              </Badge>
            )}
          </div>
        </Button>
      ),
      icon: 'IconUser'
    },
    {
      title: t('tenant.users.fields.email', 'Email'),
      accessorKey: 'email',
      parser: (value: string) => (
        <span className='text-slate-600 truncate max-w-[200px]'>{value || '-'}</span>
      ),
      icon: 'IconMail'
    },
    {
      title: t('tenant.users.fields.roles', 'Roles'),
      accessorKey: 'role_ids',
      parser: (roleIds: string[]) => renderRoles(roleIds),
      icon: 'IconUserCheck'
    },
    {
      title: t('tenant.users.fields.access_level', 'Access Level'),
      accessorKey: 'access_level',
      parser: (value: string) => renderAccessLevel(value, t),
      icon: 'IconShield'
    },
    {
      title: t('tenant.users.fields.status', 'Status'),
      accessorKey: 'is_active',
      parser: (value: boolean) => renderTenantUserStatus(value, t),
      icon: 'IconStatusChange'
    },
    {
      title: t('tenant.users.fields.joined_at', 'Joined'),
      accessorKey: 'joined_at',
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
          onClick: (record: any) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: any) => handleView(record, 'edit')
        },
        {
          title: t('tenant.users.actions.manage_roles', 'Manage Roles'),
          icon: 'IconUserCheck',
          onClick: (record: any) => handleRoleManagement(record)
        },
        {
          title: t('actions.remove', 'Remove from Tenant'),
          icon: 'IconTrash',
          onClick: (record: any) => handleDelete(record)
        }
      ]
    }
  ];
};

// Rendering helper functions
const renderRoles = (roleIds: string[]) => {
  if (!roleIds || roleIds.length === 0) {
    return <span className='text-slate-500'>No roles</span>;
  }

  return (
    <div className='flex flex-wrap gap-1'>
      {roleIds.slice(0, 2).map(roleId => (
        <Badge key={roleId} variant='outline-primary' size='sm'>
          {roleId}
        </Badge>
      ))}
      {roleIds.length > 2 && (
        <Badge variant='outline-slate' size='sm'>
          +{roleIds.length - 2}
        </Badge>
      )}
    </div>
  );
};

const renderAccessLevel = (level: string, t: any) => {
  if (!level) return '-';

  const levelColors = {
    limited: 'bg-red-100 text-red-800',
    standard: 'bg-blue-100 text-blue-800',
    elevated: 'bg-purple-100 text-purple-800',
    admin: 'bg-orange-100 text-orange-800'
  };

  return (
    <Badge className={levelColors[level] || 'bg-slate-100'}>
      {t(`tenant.users.access_levels.${level}`)}
    </Badge>
  );
};

const renderTenantUserStatus = (isActive: boolean, t: any) => {
  return isActive ? (
    <Badge variant='success'>{t('tenant.users.status.active')}</Badge>
  ) : (
    <Badge variant='danger'>{t('tenant.users.status.inactive')}</Badge>
  );
};
