import { Badge, Button, TableViewProps, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { PaymentLog } from '../../payment';

const typeVariant: Record<string, 'success' | 'warning' | 'danger' | 'secondary' | 'outline'> = {
  create: 'success',
  update: 'secondary',
  verify: 'outline',
  callback: 'warning',
  notify: 'outline',
  refund: 'warning',
  error: 'danger'
};

export const tableColumns = ({
  handleViewOrder,
  handleViewLog
}: {
  handleViewOrder: (_orderId: string) => void;
  handleViewLog: (_log: PaymentLog) => void;
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('payment.log.fields.type', 'Type'),
      dataIndex: 'type',
      parser: (value: string) => (
        <Badge variant={typeVariant[value] || 'secondary'} size='xs'>
          {t(`payment.log.types.${value}`, value)}
        </Badge>
      ),
      icon: 'IconActivity'
    },
    {
      title: t('payment.log.fields.order_id', 'Order ID'),
      dataIndex: 'order_id',
      parser: (value: string) =>
        value ? (
          <Button
            variant='link'
            size='xs'
            onClick={event => {
              event.stopPropagation();
              handleViewOrder(value);
            }}
          >
            <span className='font-mono text-xs'>{value}</span>
          </Button>
        ) : (
          '-'
        ),
      icon: 'IconReceipt'
    },
    {
      title: t('payment.log.fields.status_change', 'Status Change'),
      dataIndex: 'status_after',
      parser: (_value: string, record: PaymentLog) => (
        <span className='text-xs text-slate-600'>
          {record.status_before || '-'} {'->'} {record.status_after || '-'}
        </span>
      ),
      icon: 'IconStatusChange'
    },
    {
      title: t('payment.log.fields.error', 'Error'),
      dataIndex: 'error',
      parser: (value: string) =>
        value ? (
          <Tooltip content={value}>
            <Badge variant='danger' size='xs'>
              {t('payment.log.labels.error', 'Error')}
            </Badge>
          </Tooltip>
        ) : (
          <Badge variant='success' size='xs'>
            {t('payment.log.labels.ok', 'OK')}
          </Badge>
        ),
      icon: 'IconAlertTriangle'
    },
    {
      title: t('payment.log.fields.user_id', 'User'),
      dataIndex: 'user_id',
      parser: (value: string) => <span className='font-mono text-xs'>{value || '-'}</span>,
      icon: 'IconUser'
    },
    {
      title: t('payment.log.fields.ip', 'IP'),
      dataIndex: 'ip',
      parser: (value: string) => <span className='font-mono text-xs'>{value || '-'}</span>,
      icon: 'IconNetwork'
    },
    {
      title: t('payment.log.fields.created_at', 'Created'),
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
          onClick: (record: PaymentLog) => handleViewLog(record)
        }
      ]
    }
  ];
};
