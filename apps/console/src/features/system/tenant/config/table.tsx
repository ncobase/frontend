import { Button, TableViewProps, Badge, Tooltip, Icons } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Tenant } from '../tenant';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('tenant.fields.name', 'Name'),
      accessorKey: 'name',
      parser: (value, record) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <span className='font-medium'>{value}</span>
        </Button>
      ),
      icon: 'IconSignature'
    },
    {
      title: t('tenant.fields.type', 'Type'),
      accessorKey: 'type',
      parser: value => renderTenantType(value),
      icon: 'IconCategory2'
    },
    {
      title: t('tenant.fields.slug', 'Slug'),
      accessorKey: 'slug',
      parser: value => <span className='text-slate-600 font-mono text-xs'>{value}</span>,
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
      parser: value => renderStatus(value),
      icon: 'IconStatusChange'
    },
    {
      title: t('tenant.fields.expired_at', 'Expires'),
      accessorKey: 'expired_at',
      parser: value => formatExpirationDate(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: t('tenant.fields.updated_at', 'Updated'),
      accessorKey: 'updated_at',
      parser: value => (
        <Tooltip content={formatDateTime(value, 'dateTime')}>
          <span>{formatRelativeTime(value)}</span>
        </Tooltip>
      ),
      icon: 'IconHistory'
    },
    {
      title: t('common.actions', 'Actions'),
      accessorKey: 'operation-column',
      actions: [
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

const renderTenantType = type => {
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
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

const renderStatus = disabled => {
  return disabled ? (
    <Badge variant='danger'>Disabled</Badge>
  ) : (
    <Badge variant='success'>Active</Badge>
  );
};

const renderWebsite = url => {
  if (!url) return '-';

  return (
    <a
      href={url.startsWith('http') ? url : `https://${url}`}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center text-blue-500 hover:underline'
    >
      <span className='truncate max-w-[150px]'>{url}</span>
      <Icons name='IconExternalLink' className='ml-1 w-3 h-3' />
    </a>
  );
};

const formatExpirationDate = date => {
  if (!date) return <span className='text-slate-400'>No expiration</span>;

  const expirationDate = new Date(date);
  const now = new Date();

  // Check if expired
  if (expirationDate < now) {
    return (
      <span className='text-red-500 flex items-center'>
        <Icons name='IconAlertTriangle' className='mr-1 w-3 h-3' />
        Expired
      </span>
    );
  }

  // Check if expiring soon (within 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  if (expirationDate < thirtyDaysFromNow) {
    return (
      <Tooltip content={formatDateTime(date, 'date')}>
        <span className='text-amber-500 flex items-center'>
          <Icons name='IconClock' className='mr-1 w-3 h-3' />
          Expiring soon
        </span>
      </Tooltip>
    );
  }

  // Normal expiration date
  return (
    <Tooltip content={formatDateTime(date, 'date')}>
      <span>{formatDateTime(date, 'date')}</span>
    </Tooltip>
  );
};

const formatRelativeTime = dateString => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // Difference in seconds

  if (diff < 60) {
    return 'Just now';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}m ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h ago`;
  } else if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    return `${days}d ago`;
  } else if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    return `${months}mo ago`;
  } else {
    const years = Math.floor(diff / 31536000);
    return `${years}y ago`;
  }
};
