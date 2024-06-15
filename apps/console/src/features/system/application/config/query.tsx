import React from 'react';

import { InputField, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';

export type QueryFormData = {
  code?: string;
  title?: string;
  status?: string;
};

export const queryFields = (queryControl: Control<QueryFormData, ExplicitAny>) => [
  {
    name: 'code',
    label: '编号',
    component: (
      <Controller
        name='code'
        control={queryControl}
        defaultValue=''
        render={({ field }) => <InputField className='py-1.5' {...field} />}
      />
    )
  },
  {
    name: 'title',
    label: '名称',
    component: (
      <Controller
        name='title'
        control={queryControl}
        defaultValue=''
        render={({ field }) => <InputField className='py-1.5' {...field} />}
      />
    )
  },
  {
    name: 'status',
    label: '状态',
    component: (
      <Controller
        name='status'
        control={queryControl}
        defaultValue=''
        render={({ field }) => (
          <SelectField
            options={[
              { label: '全部', value: 'all' },
              { label: '启用', value: 'enabled' },
              { label: '禁用', value: 'disabled' }
            ]}
            className='[&>button]:py-1.5'
            {...field}
          />
        )}
      />
    )
  }
];
