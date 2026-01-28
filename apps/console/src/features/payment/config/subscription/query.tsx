import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type SubscriptionQueryParams = {
  search?: string;
  status?: string;
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<SubscriptionQueryParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();
  return [
    {
      name: 'search',
      label: t('payment.subscription.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('payment.subscription.placeholders.search', 'Search subscriptions')}
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
      label: t('payment.subscription.fields.status', 'Status'),
      component: (
        <Controller
          name='status'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('payment.status.active', 'Active'), value: 'active' },
                { label: t('payment.status.cancelled', 'Cancelled'), value: 'cancelled' },
                { label: t('payment.status.past_due', 'Past Due'), value: 'past_due' },
                { label: t('payment.status.expired', 'Expired'), value: 'expired' }
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
