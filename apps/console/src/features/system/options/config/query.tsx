import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  name?: string;
  type?: string;
  autoload?: boolean;
  prefix?: string;
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<QueryFormParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();
  return [
    {
      name: 'name',
      label: t('options.fields.name', 'Name'),
      component: (
        <Controller
          name='name'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('options.placeholders.name', 'Search by name')}
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
      label: t('options.fields.type', 'Type'),
      component: (
        <Controller
          name='type'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('options.types.string', 'String'), value: 'string' },
                { label: t('options.types.number', 'Number'), value: 'number' },
                { label: t('options.types.boolean', 'Boolean'), value: 'boolean' },
                { label: t('options.types.object', 'Object'), value: 'object' },
                { label: t('options.types.array', 'Array'), value: 'array' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'autoload',
      label: t('options.fields.autoload', 'Autoload'),
      component: (
        <Controller
          name='autoload'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('common.yes', 'Yes'), value: true },
                { label: t('common.no', 'No'), value: false }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'prefix',
      label: t('options.fields.prefix', 'Prefix'),
      component: (
        <Controller
          name='prefix'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('options.placeholders.prefix', 'Filter by name prefix')}
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    }
  ];
};
