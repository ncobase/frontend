import { Badge, Section } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { PaymentOrder } from '../payment';

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(
    amount / 100
  );

const FieldItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className='space-y-1'>
    <dt className='text-xs text-slate-500 font-medium'>{label}</dt>
    <dd className='text-sm text-slate-900'>{value || '-'}</dd>
  </div>
);

export const OrderViewer = ({ record }: { record: PaymentOrder }) => {
  const { t } = useTranslation();
  if (!record) return null;

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'secondary'> = {
    paid: 'success',
    pending: 'warning',
    failed: 'danger',
    refunded: 'secondary'
  };

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center gap-3'>
        <span className='text-lg font-semibold text-slate-900'>{record.order_no}</span>
        <Badge variant={statusVariant[record.status] || 'secondary'}>
          {t(`payment.status.${record.status}`, record.status)}
        </Badge>
      </div>

      <Section title={t('payment.order.sections.basic', 'Basic Information')} icon='IconReceipt'>
        <div className='grid grid-cols-2 gap-4'>
          <FieldItem
            label={t('payment.order.fields.order_no', 'Order No')}
            value={<span className='font-mono text-xs'>{record.order_no}</span>}
          />
          <FieldItem
            label={t('payment.order.fields.amount', 'Amount')}
            value={
              <span className='font-semibold text-slate-900'>
                {formatAmount(record.amount, record.currency)}
              </span>
            }
          />
          <FieldItem
            label={t('payment.order.fields.currency', 'Currency')}
            value={record.currency}
          />
          <FieldItem
            label={t('payment.order.fields.channel', 'Channel')}
            value={record.channel_type}
          />
          <FieldItem
            label={t('payment.order.fields.product', 'Product')}
            value={record.product_name}
          />
          <FieldItem
            label={t('payment.order.fields.user_id', 'User')}
            value={<span className='font-mono text-xs'>{record.user_id}</span>}
          />
        </div>
      </Section>

      {record.description && (
        <Section title={t('payment.order.fields.description', 'Description')} icon='IconNotes'>
          <p className='text-sm text-slate-700'>{record.description}</p>
        </Section>
      )}

      <Section title={t('payment.order.sections.timeline', 'Timeline')} icon='IconClock'>
        <div className='grid grid-cols-2 gap-4'>
          <FieldItem
            label={t('payment.order.fields.created_at', 'Created')}
            value={
              record.created_at ? formatDateTime(new Date(record.created_at), 'dateTime') : '-'
            }
          />
          <FieldItem
            label={t('payment.order.fields.paid_at', 'Paid At')}
            value={record.paid_at ? formatDateTime(new Date(record.paid_at), 'dateTime') : '-'}
          />
        </div>
      </Section>
    </div>
  );
};
