import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  search?: string;
  type?: string;
  slug?: string;
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
      label: t('dictionary.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('dictionary.placeholders.search', 'Search by name or description')}
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
      label: t('dictionary.fields.type', 'Type'),
      component: (
        <Controller
          name='type'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('dictionary.types.config', 'Configuration'), value: 'config' },
                { label: t('dictionary.types.enum', 'Enumeration'), value: 'enum' },
                { label: t('dictionary.types.constant', 'Constant'), value: 'constant' },
                { label: t('dictionary.types.template', 'Template'), value: 'template' },
                { label: t('dictionary.types.other', 'Other'), value: 'other' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'slug',
      label: t('dictionary.fields.slug', 'Slug'),
      component: (
        <Controller
          name='slug'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('dictionary.placeholders.slug', 'Filter by slug')}
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    }
  ];
};
