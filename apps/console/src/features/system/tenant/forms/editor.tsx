import React, { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useQueryTenant } from '../service';

export const EditorTenantForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryTenant(record);

  const fields: FieldConfigProps[] = [
    {
      title: '编号',
      name: 'id',
      defaultValue: false,
      type: 'text',
      disabled: true
    },
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
      className: 'col-span-full',
      type: 'uploader',
      onChange: value => {
        console.log(value);
      }
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

  useEffect(() => {
    if (!data) return;
    setValue('id', data?.id);
    setValue('name', data?.name);
    setValue('type', data?.type);
    setValue('slug', data?.slug);
    setValue('url', data?.url);
    setValue('logo', data?.logo);
    setValue('logo_alt', data?.logo_alt);
    setValue('title', data?.title);
    setValue('description', data?.description);
    setValue('keywords', data?.keywords);
    setValue('copyright', data?.copyright);
    setValue('disabled', data?.disabled);
    setValue('expired_at', data?.expired_at);
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
