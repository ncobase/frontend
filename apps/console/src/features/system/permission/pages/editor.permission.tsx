import React, { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryPermission } from '../service';

export const EditorPermissionPage = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryPermission(record.id);

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
    setValue('group', data?.group);
    setValue('parent', data?.parent);
    setValue('action', data?.action);
    setValue('subject', data?.subject);
    setValue('description', data?.description);
    setValue('default', data?.default);
    setValue('disabled', data?.disabled);
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
