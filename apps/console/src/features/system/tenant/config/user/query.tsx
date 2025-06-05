import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  search?: string;
  role_id?: string;
  access_level?: string;
  is_active?: boolean | string;
  department?: string;
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
      label: t('tenant.users.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('tenant.users.placeholders.search', 'Search by username or email')}
              prependIcon='IconSearch'
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'role_id',
      label: t('tenant.users.fields.role', 'Role'),
      component: (
        <Controller
          name='role_id'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              placeholder={t('tenant.users.placeholders.role', 'Filter by role')}
              // Note: Options should be populated from useListRoles hook
              options={[]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'access_level',
      label: t('tenant.users.fields.access_level', 'Access Level'),
      component: (
        <Controller
          name='access_level'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('tenant.users.access_levels.limited'), value: 'limited' },
                { label: t('tenant.users.access_levels.standard'), value: 'standard' },
                { label: t('tenant.users.access_levels.elevated'), value: 'elevated' },
                { label: t('tenant.users.access_levels.admin'), value: 'admin' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'is_active',
      label: t('tenant.users.fields.status', 'Status'),
      component: (
        <Controller
          name='is_active'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('tenant.users.status.active'), value: 'true' },
                { label: t('tenant.users.status.inactive'), value: 'false' }
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
