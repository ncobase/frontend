import React, { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryDictionary } from '../service';

export const EditorDictionaryPage = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryDictionary(record);

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
      title: '值',
      name: 'value',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '描述',
      name: 'description',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '创建时间',
      name: 'created_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: '更新时间',
      name: 'updated_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    }
  ];

  useEffect(() => {
    if (!data) return;
    setValue('id', data?.id);
    setValue('name', data?.name);
    setValue('slug', data?.slug);
    setValue('type', data?.type);
    setValue('value', data?.value);
    setValue('description', data?.description);
    setValue('created_at', formatDateTime(data?.created_at));
    setValue('updated_at', formatDateTime(data?.updated_at));
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
