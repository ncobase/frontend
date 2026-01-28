import { Badge, Button, TableViewProps, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { PaymentOrder } from '../../payment';

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(
    amount / 100
  );
};

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'secondary'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'secondary',
  cancelled: 'secondary'
};

export const tableColumns = ({
  handleView,
  handleRefund
}: {
  handleView: (_record: PaymentOrder, _mode: string) => void;
  handleRefund: (_record: PaymentOrder) => void;
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('payment.order.fields.order_no', 'Order No'),
      dataIndex: 'order_no',
      parser: (value: string, record: PaymentOrder) => (
        <Button
          variant='link'
          size='xs'
          onClick={e => {
            e.stopPropagation();
            handleView(record, 'view');
          }}
        >
          <span className='font-mono'>{value}</span>
        </Button>
      ),
      icon: 'IconReceipt'
    },
    {
      title: t('payment.order.fields.amount', 'Amount'),
      dataIndex: 'amount',
      parser: (value: number, record: PaymentOrder) => (
        <span className='font-medium'>{formatAmount(value, record.currency)}</span>
      ),
      icon: 'IconCurrencyDollar'
    },
    {
      title: t('payment.order.fields.status', 'Status'),
      dataIndex: 'status',
      parser: (value: string) => (
        <Badge variant={statusVariant[value] || 'secondary'} size='xs'>
          {t(`payment.status.${value}`, value)}
        </Badge>
      ),
      icon: 'IconStatusChange'
    },
    {
      title: t('payment.order.fields.channel', 'Channel'),
      dataIndex: 'channel_type',
      parser: (value: string) => <span className='text-slate-600'>{value || '-'}</span>,
      icon: 'IconCreditCard'
    },
    {
      title: t('payment.order.fields.created_at', 'Created'),
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
          onClick: (record: PaymentOrder) => handleView(record, 'view')
        },
        {
          title: t('payment.actions.refund', 'Refund'),
          icon: 'IconReceiptRefund',
          onClick: (record: PaymentOrder) => handleRefund(record)
        }
      ]
    }
  ];
};
