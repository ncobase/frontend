import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type ProductQueryParams = {
  search?: string;
  status?: string;
  type?: string;
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<ProductQueryParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();
  return [
    {
      name: 'search',
      label: t('payment.product.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('payment.product.placeholders.search', 'Search products')}
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
      label: t('payment.product.fields.status', 'Status'),
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
                { label: t('payment.status.inactive', 'Inactive'), value: 'inactive' },
                { label: t('payment.status.archived', 'Archived'), value: 'archived' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'type',
      label: t('payment.product.fields.type', 'Type'),
      component: (
        <Controller
          name='type'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('payment.product.type.one_time', 'One Time'), value: 'one_time' },
                { label: t('payment.product.type.recurring', 'Recurring'), value: 'recurring' }
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
