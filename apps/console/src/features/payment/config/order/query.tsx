import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type OrderQueryParams = {
  search?: string;
  status?: string;
  channel_type?: string;
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<OrderQueryParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();
  return [
    {
      name: 'search',
      label: t('payment.order.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('payment.order.placeholders.search', 'Search by order number')}
              prependIcon='IconSearch'
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'status',
      label: t('payment.order.fields.status', 'Status'),
      component: (
        <Controller
          name='status'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('payment.status.pending', 'Pending'), value: 'pending' },
                { label: t('payment.status.paid', 'Paid'), value: 'paid' },
                { label: t('payment.status.failed', 'Failed'), value: 'failed' },
                { label: t('payment.status.refunded', 'Refunded'), value: 'refunded' }
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
