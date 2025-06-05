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
      label: t('option.fields.name', 'Name'),
      component: (
        <Controller
          name='name'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('option.placeholders.name', 'Search by name...')}
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
      label: t('option.fields.type', 'Type'),
      component: (
        <Controller
          name='type'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              placeholder='Filter by type'
              option={[
                { label: t('option.types.string', 'String'), value: 'string' },
                { label: t('option.types.number', 'Number'), value: 'number' },
                { label: t('option.types.boolean', 'Boolean'), value: 'boolean' },
                { label: t('option.types.object', 'Object'), value: 'object' },
                { label: t('option.types.array', 'Array'), value: 'array' }
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
      label: t('option.fields.autoload', 'Auto Load'),
      component: (
        <Controller
          name='autoload'
          control={queryControl}
          render={({ field }) => (
            <SelectField
              allowClear
              placeholder='Filter by auto load'
              option={[
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
      label: t('option.fields.prefix', 'Prefix'),
      component: (
        <Controller
          name='prefix'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('option.placeholders.prefix', 'Filter by name prefix (e.g., app.)')}
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    }
  ];
};
