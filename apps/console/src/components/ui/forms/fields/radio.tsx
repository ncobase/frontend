import React from 'react';

import { cn } from '@ncobase/utils';

import { RadioGroupRoot, RadioGroupItem } from '../components';
import { FieldProps } from '../types';

import { Field } from './field';

export const RadioField = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, options = [], elementClassName, ...rest }, ref) => {
    const { onChange, defaultValue, value } = rest;

    return (
      <Field {...rest} ref={ref} className={className}>
        <RadioGroupRoot
          className={cn('flex flex-wrap gap-4 py-3.5', elementClassName)}
          defaultValue={defaultValue ? String(defaultValue) : undefined}
          value={value ? String(value) : undefined}
          onValueChange={onChange}
        >
          {options.length === 0 ? (
            <div className='inline-flex items-center space-x-2 hover:[&>label]:cursor-pointer'>
              <RadioGroupItem id={`${rest['name']}-default`} value='default' />
              <label htmlFor={`${rest['name']}-default`} className='cursor-pointer'>
                {rest['title'] || 'Option'}
              </label>
            </div>
          ) : (
            options.map(option => {
              const {
                label,
                value: optionValue,
                disabled
              } = typeof option === 'object'
                ? option
                : { label: option, value: option, disabled: false };

              const id = `${rest['name']}-${optionValue}`.replace(/\./g, '-');

              return (
                <div
                  key={id}
                  className='inline-flex items-center space-x-2 hover:[&>label]:cursor-pointer'
                >
                  <RadioGroupItem id={id} value={String(optionValue)} disabled={disabled} />
                  <label
                    htmlFor={id}
                    className={cn('cursor-pointer', disabled && 'cursor-not-allowed opacity-60')}
                  >
                    {label}
                  </label>
                </div>
              );
            })
          )}
        </RadioGroupRoot>
      </Field>
    );
  }
);

RadioField.displayName = 'RadioField';
