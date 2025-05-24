import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  search?: string;
  action?: string;
  subject?: string;
  group?: string;
  disabled?: boolean | string;
  default?: boolean | string;
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
      label: t('permission.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('permission.placeholders.search', 'Search by name or description')}
              prependIcon='IconSearch'
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'action',
      label: t('permission.fields.action', 'Action'),
      component: (
        <Controller
          name='action'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: 'Create', value: 'create' },
                { label: 'Read', value: 'read' },
                { label: 'Update', value: 'update' },
                { label: 'Delete', value: 'delete' },
                { label: 'Manage', value: 'manage' },
                { label: 'Execute', value: 'execute' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'subject',
      label: t('permission.fields.subject', 'Subject'),
      component: (
        <Controller
          name='subject'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('permission.placeholders.subject', 'Filter by subject')}
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'disabled',
      label: t('permission.fields.status', 'Status'),
      component: (
        <Controller
          name='disabled'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('permission.status.enabled', 'Enabled'), value: 'false' },
                { label: t('permission.status.disabled', 'Disabled'), value: 'true' }
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
