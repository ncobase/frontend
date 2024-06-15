import React from 'react';

import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useTenantContext } from '../../tenant/context';

import { FieldConfigProps } from '@/components/form';

export const CreateDictionaryPage = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { tenant_id } = useTenantContext();

  const fields: FieldConfigProps[] = [
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
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: '所属租户',
      name: 'tenant',
      defaultValue: tenant_id,
      type: 'hidden'
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
