import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  name?: string;
  type?: string;
  disabled?: boolean;
  search?: string;
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
      label: t('tenant.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('tenant.placeholders.search', 'Search by name or slug')}
              prependIcon='IconSearch'
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'type',
      label: t('tenant.fields.type', 'Type'),
      component: (
        <Controller
          name='type'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('tenant.types.private', 'Private'), value: 'private' },
                { label: t('tenant.types.public', 'Public'), value: 'public' },
                { label: t('tenant.types.internal', 'Internal'), value: 'internal' },
                { label: t('tenant.types.external', 'External'), value: 'external' },
                { label: t('tenant.types.other', 'Other'), value: 'other' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'disabled',
      label: t('tenant.fields.status', 'Status'),
      component: (
        <Controller
          name='disabled'
          control={queryControl}
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('tenant.status.active', 'Active'), value: 'false' },
                { label: t('tenant.status.disabled', 'Disabled'), value: 'true' }
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
