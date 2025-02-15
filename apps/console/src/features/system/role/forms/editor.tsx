import { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useQueryRole } from '../service';

export const EditorRoleForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryRole(record);

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
      placeholder: '标识',
      type: 'text'
    },
    {
      title: '上级角色',
      name: 'parent',
      defaultValue: '',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('appendIconClick');
      }
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
      title: '是否禁用',
      name: 'disabled',
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: '描述',
      defaultValue: '',
      name: 'description',
      type: 'textarea',
      className: 'col-span-full'
    }
  ];

  useEffect(() => {
    if (!data) return;
    setValue('id', data?.id);
    setValue('name', data?.name);
    setValue('parent', data?.parent);
    setValue('group', data?.group);
    setValue('disabled', data?.disabled);
    setValue('description', data?.description);
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
