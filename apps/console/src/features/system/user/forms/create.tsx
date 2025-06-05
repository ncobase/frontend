import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';

export const CreateUserForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();

  const fields: FieldConfigProps[] = [
    {
      title: t('user.fields.username', 'Username'),
      name: 'user.username',
      defaultValue: '',
      placeholder: 'Enter username',
      type: 'text',
      rules: {
        required: t('forms.input_required'),
        minLength: { value: 3, message: 'Username must be at least 3 characters' },
        pattern: {
          value: /^[a-zA-Z0-9_-]+$/,
          message: 'Username can only contain letters, numbers, underscores and hyphens'
        }
      }
    },
    {
      title: t('user.fields.email', 'Email'),
      name: 'user.email',
      defaultValue: '',
      placeholder: 'Enter email address',
      type: 'email',
      rules: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      }
    },
    {
      title: t('user.fields.phone', 'Phone'),
      name: 'user.phone',
      defaultValue: '',
      placeholder: 'Enter phone number',
      type: 'text'
    },
    {
      title: t('user.fields.is_certified', 'Certified'),
      name: 'user.is_certified',
      defaultValue: false,
      type: 'switch',
      description: 'Mark user as certified/verified'
    },
    {
      title: t('user.fields.is_admin', 'Administrator'),
      name: 'user.is_admin',
      defaultValue: false,
      type: 'switch',
      description: 'Grant administrative privileges'
    },
    {
      title: t('user.fields.status', 'Status'),
      name: 'user.status',
      defaultValue: 0,
      type: 'select',
      options: [
        { label: 'Active', value: 0 },
        { label: 'Inactive', value: 1 },
        { label: 'Disabled', value: 2 }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: t('profile.fields.display_name', 'Display Name'),
      name: 'profile.display_name',
      defaultValue: '',
      placeholder: 'Enter display name',
      type: 'text'
    },
    {
      title: t('profile.fields.first_name', 'First Name'),
      name: 'profile.first_name',
      defaultValue: '',
      placeholder: 'Enter first name',
      type: 'text'
    },
    {
      title: t('profile.fields.last_name', 'Last Name'),
      name: 'profile.last_name',
      defaultValue: '',
      placeholder: 'Enter last name',
      type: 'text'
    },
    {
      title: t('profile.fields.title', 'Title'),
      name: 'profile.title',
      defaultValue: '',
      placeholder: 'Enter job title',
      type: 'text'
    },
    {
      title: t('profile.fields.short_bio', 'Short Bio'),
      name: 'profile.short_bio',
      defaultValue: '',
      placeholder: 'Brief description about the user',
      type: 'textarea'
    },
    {
      title: t('profile.fields.about', 'About'),
      name: 'profile.about',
      defaultValue: '',
      placeholder: 'Detailed information about the user',
      type: 'textarea',
      className: 'col-span-full'
    }
  ];

  return (
    <Form
      id='create-user'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
