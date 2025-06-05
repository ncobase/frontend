import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';

export const CreateRoleForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();

  const fields: FieldConfigProps[] = [
    {
      title: t('role.fields.name', 'Role Name'),
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter role name',
      type: 'text',
      rules: {
        required: t('forms.input_required'),
        minLength: { value: 2, message: 'Role name must be at least 2 characters' }
      }
    },
    {
      title: t('role.fields.slug', 'Slug'),
      name: 'slug',
      defaultValue: '',
      placeholder: 'role-slug',
      type: 'text',
      rules: {
        pattern: {
          value: /^[a-z0-9-]+$/,
          message: 'Slug can only contain lowercase letters, numbers, and hyphens'
        }
      }
    },
    {
      title: t('role.fields.disabled', 'Disabled'),
      name: 'disabled',
      defaultValue: false,
      type: 'switch',
      description: 'Disable this role to prevent it from being assigned'
    },
    {
      title: t('role.fields.description', 'Description'),
      name: 'description',
      defaultValue: '',
      placeholder: 'Describe the purpose and scope of this role',
      type: 'textarea',
      className: 'col-span-full',
      rules: {
        maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
      }
    }
  ];

  return (
    <Form
      id='create-role'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
