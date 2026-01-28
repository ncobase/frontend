import { Badge, Button, TableViewProps, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { PaymentSubscription } from '../../payment';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'secondary'> = {
  active: 'success',
  trialing: 'success',
  past_due: 'warning',
  cancelled: 'secondary',
  expired: 'danger'
};

export const tableColumns = ({
  handleView,
  handleCancel
}: {
  handleView: (record: PaymentSubscription, mode: string) => void;
  handleCancel: (record: PaymentSubscription) => void;
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('payment.subscription.fields.id', 'ID'),
      dataIndex: 'id',
      parser: (value: string, record: PaymentSubscription) => (
        <Button
          variant='link'
          size='xs'
          onClick={e => {
            e.stopPropagation();
            handleView(record, 'view');
          }}
        >
          <span className='font-mono text-xs'>{value?.substring(0, 8)}...</span>
        </Button>
      ),
      icon: 'IconId'
    },
    {
      title: t('payment.subscription.fields.product', 'Product'),
      dataIndex: 'product_name',
      parser: (value: string) => <span>{value || '-'}</span>,
      icon: 'IconPackage'
    },
    {
      title: t('payment.subscription.fields.status', 'Status'),
      dataIndex: 'status',
      parser: (value: string) => (
        <Badge variant={statusVariant[value] || 'secondary'} size='xs'>
          {t(`payment.status.${value}`, value)}
        </Badge>
      ),
      icon: 'IconStatusChange'
    },
    {
      title: t('payment.subscription.fields.period_end', 'Period End'),
      dataIndex: 'current_period_end',
      parser: (value: number) =>
        value ? (
          <Tooltip content={formatDateTime(new Date(value), 'dateTime')}>
            <span>{formatRelativeTime(new Date(value))}</span>
          </Tooltip>
        ) : (
          '-'
        ),
      icon: 'IconCalendar'
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      actions: [
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: PaymentSubscription) => handleView(record, 'view')
        },
        {
          title: t('payment.actions.cancel', 'Cancel'),
          icon: 'IconX',
          onClick: (record: PaymentSubscription) => handleCancel(record)
        }
      ]
    }
  ];
};
