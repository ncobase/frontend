import { useEffect } from 'react';

import { Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryPermission } from '../service';

import { FieldConfigProps } from '@/components/form';

export const EditorPermissionForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryPermission(record);

  const fields: FieldConfigProps[] = [
    {
      title: t('permission.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter permission name',
      type: 'text',
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
      title: t('permission.fields.tenant', 'Tenant'),
      name: 'tenant',
      defaultValue: '',
      type: 'text',
      disabled: true
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
      title: t('permission.fields.created_at', 'Created At'),
      name: 'created_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: t('permission.fields.updated_at', 'Updated At'),
      name: 'updated_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    }
  ];

  useEffect(() => {
    if (!data || isLoading) return;

    setValue('id', data?.id);
    setValue('name', data?.name);
    setValue('action', data?.action);
    setValue('subject', data?.subject);
    setValue('group', data?.group);
    setValue('parent', data?.parent);
    setValue('tenant', data?.tenant);
    setValue('default', data?.default);
    setValue('disabled', data?.disabled);
    setValue('description', data?.description);
    setValue('created_at', formatDateTime(data?.created_at));
    setValue('updated_at', formatDateTime(data?.updated_at));
  }, [setValue, data, isLoading]);

  if (isLoading) {
    return <div className='p-4 text-center'>Loading permission data...</div>;
  }

  return (
    <Form
      id='edit-permission'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
