import { Badge, Section } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { PaymentSubscription } from '../payment';

const FieldItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className='space-y-1'>
    <dt className='text-xs text-slate-500 font-medium'>{label}</dt>
    <dd className='text-sm text-slate-900'>{value || '-'}</dd>
  </div>
);

export const SubscriptionViewer = ({ record }: { record: PaymentSubscription }) => {
  const { t } = useTranslation();
  if (!record) return null;

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'secondary'> = {
    active: 'success',
    trialing: 'success',
    past_due: 'warning',
    cancelled: 'secondary',
    expired: 'danger'
  };

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center gap-3'>
        <span className='text-lg font-semibold text-slate-900'>
          {record.product_name || record.id}
        </span>
        <Badge variant={statusVariant[record.status] || 'secondary'}>
          {t(`payment.status.${record.status}`, record.status)}
        </Badge>
      </div>

      <Section
        title={t('payment.subscription.sections.basic', 'Subscription Details')}
        icon='IconRepeat'
      >
        <div className='grid grid-cols-2 gap-4'>
          <FieldItem
            label={t('payment.subscription.fields.id', 'ID')}
            value={<span className='font-mono text-xs'>{record.id}</span>}
          />
          <FieldItem
            label={t('payment.subscription.fields.product', 'Product')}
            value={record.product_name}
          />
          <FieldItem
            label={t('payment.subscription.fields.user_id', 'User')}
            value={<span className='font-mono text-xs'>{record.user_id}</span>}
          />
          <FieldItem
            label={t('payment.subscription.fields.status', 'Status')}
            value={
              <Badge variant={statusVariant[record.status] || 'secondary'} size='xs'>
                {t(`payment.status.${record.status}`, record.status)}
              </Badge>
            }
          />
        </div>
      </Section>

      <Section
        title={t('payment.subscription.sections.period', 'Billing Period')}
        icon='IconCalendar'
      >
        <div className='grid grid-cols-2 gap-4'>
          <FieldItem
            label={t('payment.subscription.fields.period_start', 'Period Start')}
            value={
              record.current_period_start
                ? formatDateTime(new Date(record.current_period_start), 'dateTime')
                : '-'
            }
          />
          <FieldItem
            label={t('payment.subscription.fields.period_end', 'Period End')}
            value={
              record.current_period_end
                ? formatDateTime(new Date(record.current_period_end), 'dateTime')
                : '-'
            }
          />
          <FieldItem
            label={t('payment.subscription.fields.created_at', 'Created')}
            value={
              record.created_at ? formatDateTime(new Date(record.created_at), 'dateTime') : '-'
            }
          />
        </div>
      </Section>
    </div>
  );
};
