import React, { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useQueryUser } from '../service';
// import { useForm } from 'react-hook-form';

export const EditorUserPage = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data } = useQueryUser(record.id);
  const { user, profile } = data || {};

  const fields: FieldConfigProps[] = [
    {
      title: '编号',
      name: 'user.id',
      defaultValue: false,
      type: 'text',
      disabled: true
    },
    {
      title: '用户名',
      name: 'user.username',
      defaultValue: false,
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: '邮箱',
      name: 'user.email',
      defaultValue: false,
      type: 'email'
    },
    {
      title: '手机',
      name: 'user.phone',
      defaultValue: false,
      type: 'text'
    },
    { title: '姓', name: 'profile.first_name', defaultValue: false, type: 'text' },
    { title: '名', name: 'profile.last_name', defaultValue: false, type: 'text' },
    {
      title: '状态',
      name: 'user.status',
      defaultValue: false,
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
      name: 'profile.about',
      defaultValue: false,
      type: 'textarea',
      className: 'col-span-full'
    }
  ];

  useEffect(() => {
    if (!data) return;
    setValue('user.id', user?.id);
    setValue('user.username', user?.username);
    setValue('user.email', user?.email);
    setValue('user.phone', user?.phone);
    setValue('profile.first_name', profile?.first_name);
    setValue('profile.last_name', profile?.last_name);
    setValue('profile.about', profile?.about);
    setValue('user.status', user?.status);
    setValue('profile.language', profile?.language);
    setValue('profile.links', profile?.links);
    setValue('profile.short_bio', profile?.short_bio);
    setValue('profile.display_name', profile?.display_name);
  }, [setValue, data]);

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
