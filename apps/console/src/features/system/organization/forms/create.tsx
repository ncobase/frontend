import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useSpaceContext } from '../../space/context';

import { FieldConfigProps } from '@/components/form';

export const CreateOrgForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { space_id } = useSpaceContext();

  const fields: FieldConfigProps[] = [
    {
      title: '名称',
      name: 'name',
      defaultValue: '',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: 'Leader',
      name: 'leader',
      defaultValue: {},
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('appendIconClick');
      }
    },
    {
      title: '上级组织',
      name: 'parent',
      defaultValue: '',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('appendIconClick');
      }
    },
    {
      title: '是否停用',
      name: 'disabled',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: '描述',
      defaultValue: '',
      name: 'description',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: '所属空间',
      name: 'space',
      defaultValue: space_id,
      type: 'hidden'
    }
    // {
    //   title: '扩展字段',
    //   name: 'extras',
    //   defaultValue: [],
    //   type: 'hidden'
    // }
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
