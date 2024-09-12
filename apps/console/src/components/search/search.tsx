import React, { useCallback } from 'react';

import { Form, InputField } from '@ncobase/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const Search = () => {
  const { t } = useTranslation();

  const { handleSubmit, control } = useForm<{
    globalSearch: string;
  }>();

  const onSubmit = handleSubmit(
    useCallback(async (values: {}) => {
      console.log(values);
    }, [])
  );

  return (
    <Form id='global-search-form' onSubmit={onSubmit} noValidate className='flex'>
      <Controller
        name='globalSearch'
        control={control}
        rules={{ required: t('search.required') }}
        defaultValue=''
        render={({ field }) => (
          <InputField
            className='mr-3 py-[3.5px] border-transparent focus:border-slate-600 text-slate-300 [&>*>input]:bg-slate-50/15 backdrop-blur-sm hover:[&>*>input]:border-slate-600 hover:[&>*>input]:bg-slate-50/15'
            placeholder={t('search.placeholder')}
            prependIcon='IconSearch'
            onChange={field.onChange}
            onBlur={field.onBlur}
            {...field}
          />
        )}
      />
    </Form>
  );
};
