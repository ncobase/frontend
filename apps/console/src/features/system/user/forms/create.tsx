import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';

export const CreateUserForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();

  const fields: FieldConfigProps[] = [
    {
      title: 'Username',
      name: 'user.username',
      defaultValue: '',
      placeholder: 'Enter username',
      type: 'text',
      rules: {
        required: t('forms.input_required'),
        minLength: {
          value: 3,
          message: 'Username must be at least 3 characters'
        }
      }
    },
    {
      title: 'Password',
      name: 'user.password',
      defaultValue: '',
      placeholder: 'Enter password',
      type: 'password',
      rules: {
        required: t('forms.input_required'),
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters'
        }
      }
    },
    {
      title: 'Email',
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
      title: 'Phone',
      name: 'user.phone',
      defaultValue: '',
      placeholder: 'Enter phone number',
      type: 'text'
    },
    {
      title: 'First Name',
      name: 'profile.first_name',
      defaultValue: '',
      placeholder: 'Enter first name',
      type: 'text'
    },
    {
      title: 'Last Name',
      name: 'profile.last_name',
      defaultValue: '',
      placeholder: 'Enter last name',
      type: 'text'
    },
    {
      title: 'Display Name',
      name: 'profile.display_name',
      defaultValue: '',
      placeholder: 'Enter display name',
      type: 'text'
    },
    {
      title: 'Status',
      name: 'user.status',
      defaultValue: '0',
      type: 'select',
      options: [
        { label: 'Active', value: '0' },
        { label: 'Inactive', value: '1' },
        { label: 'Disabled', value: '2' }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: 'Language',
      name: 'profile.language',
      defaultValue: 'en',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: '中文', value: 'zh' },
        { label: 'Español', value: 'es' },
        { label: 'Français', value: 'fr' }
      ]
    },
    {
      title: 'Short Bio',
      name: 'profile.short_bio',
      defaultValue: '',
      placeholder: 'Brief description about the user',
      type: 'textarea'
    },
    {
      title: 'About',
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
