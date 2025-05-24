import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  search?: string;
  status?: string;
  role?: string;
  is_admin?: boolean;
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<QueryFormParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();
  return [
    {
      name: 'search',
      label: t('user.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('user.placeholders.search', 'Search by username or email')}
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
      label: t('user.fields.status', 'Status'),
      component: (
        <Controller
          name='status'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('user.status.active', 'Active'), value: '0' },
                { label: t('user.status.inactive', 'Inactive'), value: '1' },
                { label: t('user.status.disabled', 'Disabled'), value: '2' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'is_admin',
      label: t('user.fields.user_type', 'User Type'),
      component: (
        <Controller
          name='is_admin'
          control={queryControl}
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('user.types.regular', 'Regular User'), value: 'false' },
                { label: t('user.types.admin', 'Administrator'), value: 'true' }
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
