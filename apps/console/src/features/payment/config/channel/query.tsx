import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type ChannelQueryParams = {
  search?: string;
  status?: string;
  type?: string;
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<ChannelQueryParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();
  return [
    {
      name: 'search',
      label: t('payment.channel.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('payment.channel.placeholders.search', 'Search channels')}
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
      label: t('payment.channel.fields.status', 'Status'),
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
                { label: t('payment.status.inactive', 'Inactive'), value: 'inactive' }
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
