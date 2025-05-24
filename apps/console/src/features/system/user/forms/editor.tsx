import { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useQueryUserMeshes } from '../service';

export const EditorUserForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useQueryUserMeshes(record);
  const { user, profile } = data || {};

  const fields: FieldConfigProps[] = [
    {
      title: 'ID',
      name: 'user.id',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: 'Username',
      name: 'user.username',
      defaultValue: '',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: 'Email',
      name: 'user.email',
      defaultValue: '',
      type: 'email'
    },
    {
      title: 'Phone',
      name: 'user.phone',
      defaultValue: '',
      type: 'text'
    },
    {
      title: 'First Name',
      name: 'profile.first_name',
      defaultValue: '',
      type: 'text'
    },
    {
      title: 'Last Name',
      name: 'profile.last_name',
      defaultValue: '',
      type: 'text'
    },
    {
      title: 'Display Name',
      name: 'profile.display_name',
      defaultValue: '',
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
      title: 'Short Bio',
      name: 'profile.short_bio',
      defaultValue: '',
      type: 'textarea'
    },
    {
      title: 'About',
      name: 'profile.about',
      defaultValue: '',
      type: 'textarea',
      className: 'col-span-full'
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
    }
  ];

  useEffect(() => {
    if (!data || isLoading) return;

    // Set user fields
    setValue('user.id', user?.id);
    setValue('user.username', user?.username);
    setValue('user.email', user?.email);
    setValue('user.phone', user?.phone);
    setValue('user.status', user?.status?.toString() || '0');

    // Set profile fields
    setValue('profile.first_name', profile?.first_name);
    setValue('profile.last_name', profile?.last_name);
    setValue('profile.display_name', profile?.display_name);
    setValue('profile.short_bio', profile?.short_bio);
    setValue('profile.about', profile?.about);
    setValue('profile.language', profile?.language || 'en');
    setValue('profile.links', profile?.links || []);
  }, [setValue, data, user, profile, isLoading]);

  if (isLoading) {
    return <div className='p-4 text-center'>Loading user data...</div>;
  }

  return (
    <Form
      id='edit-user'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
