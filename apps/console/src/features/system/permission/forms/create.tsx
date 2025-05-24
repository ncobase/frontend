import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useTenantContext } from '../../tenant/context';

import { FieldConfigProps } from '@/components/form';

export const CreatePermissionForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { tenant_id } = useTenantContext();

  const fields: FieldConfigProps[] = [
    {
      title: t('permission.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter permission name',
      type: 'text',
      rules: {
        required: t('forms.input_required'),
        minLength: {
          value: 2,
          message: 'Permission name must be at least 2 characters'
        }
      }
    },
    {
      title: t('permission.fields.action', 'Action'),
      name: 'action',
      defaultValue: '',
      placeholder: 'e.g., create, read, update, delete',
      type: 'select',
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Read', value: 'read' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Manage', value: 'manage' },
        { label: 'Execute', value: 'execute' },
        { label: 'Custom', value: 'custom' }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: t('permission.fields.subject', 'Subject/Resource'),
      name: 'subject',
      defaultValue: '',
      placeholder: 'e.g., User, Post, Order, or * for all',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: t('permission.fields.group', 'Group'),
      name: 'group',
      defaultValue: '',
      placeholder: 'Select group',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('Search group');
      }
    },
    {
      title: t('permission.fields.parent', 'Parent Permission'),
      name: 'parent',
      defaultValue: '',
      placeholder: 'Select parent permission',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('Search parent permission');
      }
    },
    {
      title: t('permission.fields.default', 'Default Permission'),
      name: 'default',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3',
      description: 'Default permissions are automatically granted to new users'
    },
    {
      title: t('permission.fields.disabled', 'Disabled'),
      name: 'disabled',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3',
      description: 'Disable this permission to prevent it from being granted'
    },
    {
      title: t('permission.fields.description', 'Description'),
      name: 'description',
      defaultValue: '',
      placeholder: 'Describe what this permission allows',
      type: 'textarea',
      className: 'col-span-full',
      rules: {
        maxLength: {
          value: 500,
          message: 'Description cannot exceed 500 characters'
        }
      }
    },
    {
      title: 'Tenant ID',
      name: 'tenant',
      defaultValue: tenant_id,
      type: 'hidden'
    }
  ];

  return (
    <Form
      id='create-permission'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
