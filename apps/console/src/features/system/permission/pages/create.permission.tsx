import React from 'react';

import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useTenantContext } from '../../tenant/context';

import { FieldConfigProps } from '@/components/form';

export const CreatePermissionPage = ({ onSubmit, control, errors }) => {
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
      title: '所属部门',
      name: 'group',
      defaultValue: '',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('appendIconClick');
      }
    },
    {
      title: '操作',
      name: 'action',
      defaultValue: '',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: '主题',
      name: 'subject',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '上级权限',
      name: 'parent',
      defaultValue: '',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('appendIconClick');
      }
    },
    {
      title: '描述',
      defaultValue: '',
      name: 'description',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: '是否默认',
      name: 'default',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: '是否禁用',
      name: 'disabled',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
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
