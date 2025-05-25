import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useTenantContext } from '../../tenant/context';

import { FieldConfigProps } from '@/components/form';
import { useMenusByType } from '@/components/layout/layout.hooks';

export const CreateMenuForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { tenant_id } = useTenantContext();

  // Get existing menus for parent selection
  const allMenus = useMenusByType('sidebars'); // or get all menus

  const fields: FieldConfigProps[] = [
    {
      title: t('menu.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter menu name',
      type: 'text',
      rules: {
        required: t('forms.input_required'),
        minLength: {
          value: 2,
          message: 'Menu name must be at least 2 characters'
        }
      }
    },
    {
      title: t('menu.fields.parent', 'Parent Menu'),
      name: 'parent_id',
      defaultValue: '',
      type: 'select',
      options: [
        { label: t('menu.no_parent', 'No Parent (Root Level)'), value: 'root' },
        ...allMenus.map(menu => ({
          label: menu.name || menu.label || 'Unnamed',
          value: menu.id || ''
        }))
      ],
      help: 'Select a parent menu to create a nested structure'
    },
    {
      title: t('menu.fields.label', 'i18n Label'),
      name: 'label',
      placeholder: 'Enter i18n label key',
      defaultValue: '',
      type: 'text',
      help: 'Translation key for internationalization'
    },
    {
      title: t('menu.fields.icon', 'Icon'),
      name: 'icon',
      defaultValue: '',
      type: 'icon'
    },
    {
      title: t('menu.fields.slug', 'Slug'),
      name: 'slug',
      defaultValue: '',
      type: 'text',
      rules: {
        pattern: {
          value: /^[a-z0-9-_]*$/,
          message: 'Slug can only contain lowercase letters, numbers, hyphens and underscores'
        }
      },
      help: 'Unique identifier for the menu item'
    },
    {
      title: t('menu.fields.path', 'Path/URL'),
      name: 'path',
      defaultValue: '',
      type: 'text',
      placeholder: '/path/to/page or https://external.com',
      help: 'Internal path or external URL'
    },
    {
      title: t('menu.fields.type', 'Type'),
      name: 'type',
      defaultValue: 'menu',
      type: 'select',
      options: [
        { label: t('menu.types.header', 'Header'), value: 'header' },
        { label: t('menu.types.sidebar', 'Sidebar'), value: 'sidebar' },
        { label: t('menu.types.menu', 'Menu'), value: 'menu' },
        { label: t('menu.types.button', 'Button'), value: 'button' },
        { label: t('menu.types.submenu', 'Submenu'), value: 'submenu' },
        { label: t('menu.types.divider', 'Divider'), value: 'divider' },
        { label: t('menu.types.group', 'Group'), value: 'group' },
        { label: t('menu.types.account', 'Account'), value: 'account' },
        { label: t('menu.types.tenant', 'Tenant'), value: 'tenant' }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: t('menu.fields.target', 'Open Mode'),
      name: 'target',
      defaultValue: '_self',
      type: 'select',
      options: [
        { label: t('menu.target.self', 'Current Window'), value: '_self' },
        { label: t('menu.target.blank', 'New Window'), value: '_blank' }
      ]
    },
    {
      title: t('menu.fields.perms', 'Permission Code'),
      name: 'perms',
      defaultValue: '',
      type: 'text',
      placeholder: 'permission.code',
      help: 'Required permission to access this menu'
    },
    {
      title: t('menu.fields.hidden', 'Hidden'),
      name: 'hidden',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3',
      help: 'Hide this menu from navigation'
    },
    {
      title: t('menu.fields.order', 'Sort Order'),
      name: 'order',
      defaultValue: 99,
      type: 'number',
      rules: {
        min: {
          value: 0,
          message: 'Order must be a positive number'
        }
      },
      help: 'Lower numbers appear first'
    },
    {
      title: t('menu.fields.disabled', 'Disabled'),
      name: 'disabled',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3',
      help: 'Disable this menu item'
    },
    {
      title: 'Tenant ID',
      name: 'tenant_id',
      defaultValue: tenant_id,
      type: 'hidden'
    }
  ];

  return (
    <Form
      id='create-menu'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
