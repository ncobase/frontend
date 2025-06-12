import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  name?: string;
  type?: string;
  disabled?: boolean | string;
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
      label: t('space.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('space.placeholders.search', 'Search by name or slug')}
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
      label: t('space.fields.type', 'Type'),
      component: (
        <Controller
          name='type'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('common.types.private', 'Private'), value: 'private' },
                { label: t('common.types.public', 'Public'), value: 'public' },
                { label: t('common.types.internal', 'Internal'), value: 'internal' },
                { label: t('common.types.external', 'External'), value: 'external' },
                { label: t('common.types.other', 'Other'), value: 'other' }
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
      label: t('space.fields.status', 'Status'),
      component: (
        <Controller
          name='disabled'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('space.status.active', 'Active'), value: 'false' },
                { label: t('space.status.disabled', 'Disabled'), value: 'true' }
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
