import React from 'react';

import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';

export const CreateUserForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();

  const fields: FieldConfigProps[] = [
    {
      title: '用户名',
      name: 'user.username',
      defaultValue: '',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: '密码',
      name: 'user.password',
      defaultValue: '',
      type: 'password'
    },
    {
      title: '邮箱',
      name: 'user.email',
      defaultValue: '',
      type: 'email'
    },
    {
      title: '手机',
      name: 'user.phone',
      defaultValue: '',
      type: 'text'
    },
    { title: '姓', name: 'profile.first_name', defaultValue: '', type: 'text' },
    { title: '名', name: 'profile.last_name', defaultValue: '', type: 'text' },
    {
      title: '状态',
      name: 'user.status',
      defaultValue: '0',
      type: 'select',
      options: [
        { label: '激活', value: '0' },
        { label: '未激活', value: '1' },
        { label: '禁用', value: '2' }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: '关于',
      defaultValue: '',
      name: 'profile.about',
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
