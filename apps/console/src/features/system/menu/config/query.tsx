import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  name?: string;
  type?: string;
  status?: string;
  parent?: string;
  perms?: string;
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
      label: t('menu.fields.name', 'Name'),
      component: (
        <Controller
          name='name'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('menu.placeholders.name', 'Search by name')}
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
      label: t('menu.fields.type', 'Type'),
      component: (
        <Controller
          name='type'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('menu.types.menu', 'Menu'), value: 'menu' },
                { label: t('menu.types.button', 'Button'), value: 'button' },
                { label: t('menu.types.submenu', 'Submenu'), value: 'submenu' },
                { label: t('menu.types.header', 'Header'), value: 'header' },
                { label: t('menu.types.group', 'Group'), value: 'group' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'status',
      label: t('menu.fields.status', 'Status'),
      component: (
        <Controller
          name='status'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('menu.status.active', 'Active'), value: 'active' },
                { label: t('menu.status.disabled', 'Disabled'), value: 'disabled' },
                { label: t('menu.status.hidden', 'Hidden'), value: 'hidden' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'perms',
      label: t('menu.fields.perms', 'Permissions'),
      component: (
        <Controller
          name='perms'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('menu.placeholders.perms', 'Filter by permission code')}
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    }
  ];
};
