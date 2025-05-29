import { useCallback } from 'react';

import { cn, Form, InputField } from '@ncobase/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface SearchProps {
  placeholder?: string;
  onSearch?: (_value: string) => void;
  className?: string;
  fieldClassName?: string;
  value?: string;
}

export const Search = ({
  placeholder,
  onSearch,
  className,
  fieldClassName,
  value
}: SearchProps) => {
  const { t } = useTranslation();

  const { handleSubmit, control } = useForm<{
    globalSearch: string;
  }>({
    defaultValues: {
      globalSearch: value || ''
    }
  });

  const onSubmit = handleSubmit(
    useCallback(
      async (values: { globalSearch: string }) => {
        onSearch?.(values.globalSearch);
      },
      [onSearch]
    )
  );

  return (
    <Form
      id='global-search-form'
      onSubmit={onSubmit}
      noValidate
      className={`flex ${className || ''}`}
    >
      <Controller
        name='globalSearch'
        control={control}
        rules={{ required: t('search.required') }}
        render={({ field }) => (
          <InputField
            className={cn(
              'mr-3 py-[3.5px] border-transparent focus:border-slate-600 text-slate-300 [&>*>input]:bg-slate-50/15 backdrop-blur-xs [&>*>input]:hover:border-slate-600 [&>*>input]:hover:bg-slate-50/15',
              fieldClassName
            )}
            placeholder={placeholder || t('search.placeholder')}
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
