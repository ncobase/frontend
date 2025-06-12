import { Button, TableViewProps, Badge, Tooltip, Icons } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Space } from '../space';

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
      title: t('space.fields.name', 'Name'),
      dataIndex: 'name',
      parser: (value, record: Space) => (
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
                  {t('space.status.disabled')}
                </Badge>
              )}
              {record.expired_at && new Date(record.expired_at) < new Date() && (
                <Badge variant='danger' size='xs'>
                  {t('space.status.expired')}
                </Badge>
              )}
            </div>
          </div>
        </Button>
      ),
      icon: 'IconSignature'
    },
    {
      title: t('space.fields.type', 'Type'),
      dataIndex: 'type',
      parser: value => renderSpaceType(value, t),
      icon: 'IconCategory2'
    },
    {
      title: t('space.fields.slug', 'Slug'),
      dataIndex: 'slug',
      parser: value => (
        <span className='text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded'>
          {value}
        </span>
      ),
      icon: 'IconRouteAltLeft'
    },
    {
      title: t('space.fields.url', 'Website'),
      dataIndex: 'url',
      parser: value => renderWebsite(value),
      icon: 'IconWorldWww'
    },
    {
      title: t('space.fields.status', 'Status'),
      dataIndex: 'disabled',
      parser: (value, record: Space) => renderSpaceStatus(value, record, t),
      icon: 'IconStatusChange'
    },
    {
      title: t('space.fields.updated_at', 'Updated'),
      dataIndex: 'updated_at',
      parser: value => (
        <Tooltip content={formatDateTime(value, 'dateTime')}>
          <span className='text-sm'>{formatRelativeTime(new Date(value))}</span>
        </Tooltip>
      ),
      icon: 'IconHistory'
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      actions: [
        {
          title: t('space.actions.users', 'Manage Users'),
          icon: 'IconUsers',
          onClick: (record: Space) => handleUsers(record)
        },
        {
          title: t('space.actions.settings', 'Settings'),
          icon: 'IconSettings',
          onClick: (record: Space) => handleSettings(record)
        },
        {
          title: t('space.actions.quotas', 'Quotas'),
          icon: 'IconGauge',
          onClick: (record: Space) => handleQuotas(record)
        },
        {
          title: t('space.actions.billing', 'Billing'),
          icon: 'IconCreditCard',
          onClick: (record: Space) => handleBilling(record)
        },
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: Space) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: Space) => handleView(record, 'edit')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: Space) => handleDelete(record)
        }
      ]
    }
  ];
};

// Helper rendering functions
const renderSpaceType = (type: string, t: any) => {
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
      {t(`common.types.${type}`, type.charAt(0).toUpperCase() + type.slice(1))}
    </Badge>
  );
};

const renderSpaceStatus = (disabled: boolean, record: Space, t: any) => {
  const isExpired = record.expired_at && new Date(record.expired_at) < new Date();

  if (isExpired) {
    return <Badge variant='danger'>{t('space.status.expired')}</Badge>;
  }

  return disabled ? (
    <Badge variant='warning'>{t('space.status.disabled')}</Badge>
  ) : (
    <Badge variant='success'>{t('space.status.active')}</Badge>
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
