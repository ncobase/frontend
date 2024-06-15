import React, { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useQueryApplication } from '../service';

export const EditorApplicationPage = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryApplication(record.id);

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
      title: '标识',
      name: 'slug',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '类型',
      name: 'type',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '图标',
      name: 'icon',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '网站',
      name: 'url',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '是否系统应用',
      name: 'system',
      defaultValue: false,
      type: 'switch'
    },
    {
      title: '密钥',
      name: 'secret',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '描述',
      defaultValue: '',
      name: 'description',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: '所属租户',
      name: 'tenant',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: '是否禁用',
      name: 'disabled',
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: '创建时间',
      name: 'created_at',
      defaultValue: '',
      type: 'date',
      disabled: true
    },
    {
      title: '更新时间',
      name: 'updated_at',
      defaultValue: '',
      type: 'date',
      disabled: true
    }
  ];

  useEffect(() => {
    if (!data) return;
    setValue('id', data?.id);
    setValue('name', data?.name);
    setValue('slug', data?.slug);
    setValue('type', data?.type);
    setValue('icon', data?.icon);
    setValue('url', data?.url);
    setValue('system', data?.system);
    setValue('secret', data?.secret);
    setValue('description', data?.description);
    setValue('disabled', data?.disabled);
    setValue('tenant', data?.tenant);
    setValue('created_at', data?.created_at);
    setValue('updated_at', data?.updated_at);
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
