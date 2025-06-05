import { Button, TableViewProps, Badge, Tooltip, Icons } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Tenant } from '../tenant';

export const tableColumns = ({
  handleView,
  handleDelete,
  handleSettings,
  handleQuotas,
  handleBilling,
  handleUsers
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('tenant.fields.name', 'Name'),
      accessorKey: 'name',
      parser: (value, record: Tenant) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <div className='flex items-center space-x-2'>
            {record.logo && (
              <img
                src={record.logo}
                alt={record.logo_alt || record.name}
                className='w-6 h-6 rounded object-cover'
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span className='font-medium'>{value}</span>
            <div className='flex space-x-1'>
              {record.disabled && (
                <Badge variant='warning' size='xs'>
                  {t('tenant.status.disabled')}
                </Badge>
              )}
              {record.expired_at && new Date(record.expired_at) < new Date() && (
                <Badge variant='danger' size='xs'>
                  {t('tenant.status.expired')}
                </Badge>
              )}
            </div>
          </div>
        </Button>
      ),
      icon: 'IconSignature'
    },
    {
      title: t('tenant.fields.type', 'Type'),
      accessorKey: 'type',
      parser: value => renderTenantType(value, t),
      icon: 'IconCategory2'
    },
    {
      title: t('tenant.fields.slug', 'Slug'),
      accessorKey: 'slug',
      parser: value => (
        <span className='text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded'>
          {value}
        </span>
      ),
      icon: 'IconRouteAltLeft'
    },
    {
      title: t('tenant.fields.url', 'Website'),
      accessorKey: 'url',
      parser: value => renderWebsite(value),
      icon: 'IconWorldWww'
    },
    {
      title: t('tenant.fields.status', 'Status'),
      accessorKey: 'disabled',
      parser: (value, record: Tenant) => renderTenantStatus(value, record, t),
      icon: 'IconStatusChange'
    },
    {
      title: t('tenant.fields.updated_at', 'Updated'),
      accessorKey: 'updated_at',
      parser: value => (
        <Tooltip content={formatDateTime(value, 'dateTime')}>
          <span className='text-sm'>{formatRelativeTime(new Date(value))}</span>
        </Tooltip>
      ),
      icon: 'IconHistory'
    },
    {
      title: t('common.actions', 'Actions'),
      accessorKey: 'operation-column',
      actions: [
        {
          title: t('tenant.actions.users', 'Manage Users'),
          icon: 'IconUsers',
          onClick: (record: Tenant) => handleUsers(record)
        },
        {
          title: t('tenant.actions.settings', 'Settings'),
          icon: 'IconSettings',
          onClick: (record: Tenant) => handleSettings(record)
        },
        {
          title: t('tenant.actions.quotas', 'Quotas'),
          icon: 'IconGauge',
          onClick: (record: Tenant) => handleQuotas(record)
        },
        {
          title: t('tenant.actions.billing', 'Billing'),
          icon: 'IconCreditCard',
          onClick: (record: Tenant) => handleBilling(record)
        },
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: Tenant) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: Tenant) => handleView(record, 'edit')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: Tenant) => handleDelete(record)
        }
      ]
    }
  ];
};

// Helper rendering functions
const renderTenantType = (type: string, t: any) => {
  if (!type) return '-';

  const typeColors = {
    private: 'bg-blue-100 text-blue-800',
    public: 'bg-green-100 text-green-800',
    internal: 'bg-purple-100 text-purple-800',
    external: 'bg-amber-100 text-amber-800',
    other: 'bg-slate-100 text-slate-800'
  };

  return (
    <Badge className={typeColors[type] || 'bg-slate-100'}>
      {t(`tenant.types.${type}`, type.charAt(0).toUpperCase() + type.slice(1))}
    </Badge>
  );
};

const renderTenantStatus = (disabled: boolean, record: Tenant, t: any) => {
  const isExpired = record.expired_at && new Date(record.expired_at) < new Date();

  if (isExpired) {
    return <Badge variant='danger'>{t('tenant.status.expired')}</Badge>;
  }

  return disabled ? (
    <Badge variant='warning'>{t('tenant.status.disabled')}</Badge>
  ) : (
    <Badge variant='success'>{t('tenant.status.active')}</Badge>
  );
};

const renderWebsite = (url: string) => {
  if (!url) return '-';

  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  return (
    <a
      href={fullUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center text-blue-500 hover:underline'
      onClick={e => e.stopPropagation()}
    >
      <span className='truncate max-w-[150px]'>{url}</span>
      <Icons name='IconExternalLink' className='ml-1 w-3 h-3' />
    </a>
  );
};
