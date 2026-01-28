import React from 'react';

import { cn } from '@ncobase/utils';
import { Controller } from 'react-hook-form';

import { FormProvider } from './context';
import { FieldRender } from './render';
import type { FormProps, FormLayout } from './types';

const ControllerC = Controller as any;

const getLayoutClasses = (layout: FormLayout) => {
  switch (layout) {
    case 'default':
      return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
    case 'single':
      return 'grid grid-cols-1 gap-4';
    case 'inline':
      return 'flex flex-wrap gap-4 items-end';
    case 'custom':
      return '';
    default:
      return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
  }
};

export const Form = React.forwardRef<HTMLFormElement, FormProps<any>>(
  (
    { id, children, className, onSubmit, fields, control, errors, layout = 'default', ...rest },
    ref
  ) => {
    if (!fields && !children) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!onSubmit) {
        return;
      }
      e.stopPropagation();
      // Get form values from control if available
      const formValues = control?._formValues;
      // Call onSubmit with form values if control exists, otherwise just pass the event
      onSubmit(e, formValues);
    };

    return (
      <form
        id={id}
        ref={ref}
        className={cn(getLayoutClasses(layout), className)}
        {...rest}
        onSubmit={handleSubmit}
      >
        <FormProvider control={control} errors={errors}>
          {children}
          {fields &&
            fields.map(item => {
              return (
                <ControllerC
                  key={String(item.name)}
                  name={item.name}
                  rules={item.rules}
                  control={control}
                  defaultValue={item.defaultValue}
                  render={({ field }) => {
                    return <FieldRender type={item.type} {...rest} {...item} {...field} />;
                  }}
                />
              );
            })}
        </FormProvider>
      </form>
    );
  }
);

Form.displayName = 'Form';
