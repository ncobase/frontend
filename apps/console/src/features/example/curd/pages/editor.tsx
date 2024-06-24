import React, { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';

import { useQueryRole } from '@/features/system/role/service';

export const EditorPage = ({ record, onSubmit, control, setValue, errors }) => {
  const { data = {} } = useQueryRole(record);

  const fields: FieldConfigProps[] = [
    {
      title: '编号',
      name: 'id',
      defaultValue: false,
      type: 'text',
      disabled: true
    }
  ];

  useEffect(() => {
    if (!data) return;
    setValue('id', data?.id);
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
