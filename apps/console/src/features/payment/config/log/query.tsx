import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type PaymentLogQueryParams = {
  order_id?: string;
  channel_id?: string;
  type?: string;
  has_error?: string;
  page_size?: number;
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<PaymentLogQueryParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();

  return [
    {
      name: 'order_id',
      label: t('payment.log.fields.order_id', 'Order ID'),
      component: (
        <Controller
          name='order_id'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('payment.log.placeholders.order_id', 'Filter by order ID')}
              prependIcon='IconReceipt'
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'type',
      label: t('payment.log.fields.type', 'Type'),
      component: (
        <Controller
          name='type'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('payment.log.types.create', 'Create'), value: 'create' },
                { label: t('payment.log.types.update', 'Update'), value: 'update' },
                { label: t('payment.log.types.verify', 'Verify'), value: 'verify' },
                { label: t('payment.log.types.callback', 'Callback'), value: 'callback' },
                { label: t('payment.log.types.notify', 'Notify'), value: 'notify' },
                { label: t('payment.log.types.refund', 'Refund'), value: 'refund' },
                { label: t('payment.log.types.error', 'Error'), value: 'error' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'has_error',
      label: t('payment.log.fields.has_error', 'Errors'),
      component: (
        <Controller
          name='has_error'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('payment.log.filters.with_errors', 'With errors'), value: 'true' },
                { label: t('payment.log.filters.without_errors', 'Without errors'), value: 'false' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    }
  ];
};
