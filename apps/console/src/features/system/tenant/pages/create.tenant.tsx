import React from 'react';

import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';

export const CreateTenantPage = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();

  const fields: FieldConfigProps[] = [
    {
      title: '名称',
      name: 'name',
      defaultValue: '',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: '租户类型',
      name: 'type',
      defaultValue: '',
      type: 'select',
      options: [
        { label: '私有', value: 'private' },
        { label: '公共', value: 'public' },
        { label: '内部', value: 'internal' },
        { label: '外部', value: 'external' },
        { label: '其他', value: 'other' }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: '标识',
      name: 'slug',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '域名',
      name: 'url',
      defaultValue: '',
      type: 'text'
    },
    {
      title: 'Logo',
      name: 'logo',
      defaultValue: '',
      type: 'file'
    },
    {
      title: 'Logo 标题',
      name: 'logo_alt',
      defaultValue: '',
      type: 'text'
    },
    {
      title: 'SEO 标题',
      name: 'title',
      defaultValue: '',
      type: 'text'
    },
    {
      title: 'SEO 描述',
      defaultValue: '',
      name: 'description',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: 'SEO 关键字',
      defaultValue: '',
      name: 'keywords',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: '版权信息',
      defaultValue: '',
      name: 'copyright',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: '是否禁用',
      name: 'disabled',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: '到期时间',
      name: 'expired_at',
      defaultValue: '',
      type: 'date'
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
