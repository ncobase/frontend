import { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTaxonomy } from '../service';

export const EditorTaxonomyForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryTaxonomy(record);

  const fields: FieldConfigProps[] = [
    {
      title: '名称',
      name: 'name',
      defaultValue: '',
      placeholder: '请输入名称',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: '上级菜单',
      name: 'parent',
      defaultValue: '',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('appendIconClick');
      }
    },
    {
      title: 'i18n 标签',
      name: 'label',
      placeholder: '请输入 i18n 标签',
      defaultValue: '',
      type: 'text'
    },
    {
      title: '图标',
      name: 'icon',
      defaultValue: '',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('appendIconClick');
      }
    },
    { title: '别名', name: 'slug', defaultValue: '', type: 'text' },
    { title: '路径 / URL', name: 'path', defaultValue: '', type: 'text' },
    { title: '类型', name: 'type', defaultValue: '', type: 'text' },
    {
      title: '打开方式',
      name: 'target',
      defaultValue: '_self',
      type: 'select',
      options: [
        { label: '当前窗口', value: '_self' },
        { label: '新窗口', value: '_blank' }
      ]
    },
    { title: '权限标识', name: 'perms', defaultValue: '', type: 'text' },
    {
      title: '是否显示',
      name: 'hidden',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
    },
    { title: '排序', name: 'order', defaultValue: 99, type: 'number' },
    {
      title: '是否停用',
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
    },
    {
      title: '扩展字段',
      name: 'extras',
      defaultValue: [],
      type: 'hidden'
    }
  ];

  useEffect(() => {
    if (!data) return;
    setValue('id', data?.id);
    setValue('name', data?.name);
    // setValue('parent', data?.parent);
    // setValue('label', data?.label);
    // setValue('icon', data?.icon);
    // setValue('slug', data?.slug);
    // setValue('path', data?.path);
    // setValue('type', data?.type);
    // setValue('target', data?.target);
    // setValue('perms', data?.perms);
    // setValue('hidden', data?.hidden);
    // setValue('order', data?.order);
    // setValue('disabled', data?.disabled);
    setValue('extras', data?.extras);
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
