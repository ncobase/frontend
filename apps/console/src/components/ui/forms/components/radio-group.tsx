import React from 'react';

import { cn } from '@ncobase/utils';

import { Field } from '../fields';
import { useControlledState } from '../hooks';
import { FieldProps } from '../types';

import { RadioGroupRoot, RadioGroupItem } from './base';

export interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<FieldProps, 'children'> {
  options: RadioOption[];
  value?: any;
  defaultValue?: any;
  onChange?: (_value: any) => void;
  elementClassName?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      onChange,
      title,
      desc,
      error,
      errors,
      name,
      rules,
      required,
      className,
      elementClassName,
      ...rest
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = useControlledState<any>(value, defaultValue);

    const handleChange = (newValue: any) => {
      setSelectedValue(newValue);
      onChange?.(newValue);
    };

    return (
      <Field
        title={title}
        desc={desc}
        error={error}
        errors={errors}
        name={name}
        rules={rules}
        required={required}
        className={className}
        ref={ref}
        {...rest}
      >
        <RadioGroupRoot
          value={String(selectedValue)}
          onValueChange={handleChange}
          className={cn('flex flex-wrap gap-4 py-3.5', elementClassName)}
        >
          {options.map(option => {
            const id = `${name}-${option.value}`.replace(/\./g, '-');

            return (
              <div
                key={id}
                className='inline-flex items-center space-x-2 hover:[&>label]:cursor-pointer'
              >
                <RadioGroupItem id={id} value={String(option.value)} disabled={option.disabled} />
                <label
                  htmlFor={id}
                  className={cn(
                    'cursor-pointer',
                    option.disabled && 'cursor-not-allowed opacity-60'
                  )}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </RadioGroupRoot>
      </Field>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
