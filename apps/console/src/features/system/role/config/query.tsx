import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  search?: string;
  group?: string;
  disabled?: boolean | string;
  tenant?: string;
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
      label: t('role.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('role.placeholders.search', 'Search by name or slug')}
              prependIcon='IconSearch'
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'group',
      label: t('role.fields.group', 'Group'),
      component: (
        <Controller
          name='group'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('role.placeholders.group', 'Filter by group')}
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'disabled',
      label: t('role.fields.status', 'Status'),
      component: (
        <Controller
          name='disabled'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('role.status.enabled', 'Enabled'), value: 'false' },
                { label: t('role.status.disabled', 'Disabled'), value: 'true' }
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
