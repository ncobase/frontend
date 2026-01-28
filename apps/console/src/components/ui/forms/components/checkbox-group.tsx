import React from 'react';

import { cn } from '@ncobase/utils';

import { Field } from '../fields';
import { useControlledState } from '../hooks';
import { FieldProps } from '../types';

import { Checkbox } from './base';

export interface CheckboxOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<FieldProps, 'children' | 'onChange'> {
  options: CheckboxOption[];
  value?: any[];
  defaultValue?: any[];
  onChange?: (_value: any[]) => void;
  elementClassName?: string;
}

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      options = [],
      value,
      defaultValue = [],
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
    const [selectedValues, setSelectedValues] = useControlledState<any[]>(value, defaultValue);

    const handleChange = (optionValue: any, checked: boolean) => {
      const newValues = checked
        ? [...selectedValues, optionValue]
        : selectedValues.filter(v => v !== optionValue);

      setSelectedValues(newValues);
      onChange?.(newValues);
    };

    // Render a single checkbox
    const renderOption = (option: CheckboxOption) => {
      const id = `${name}-${option.value}`.replace(/\./g, '-');
      const isChecked = selectedValues.includes(option.value);

      return (
        <div key={id} className='inline-flex items-center space-x-2 hover:[&>label]:cursor-pointer'>
          <Checkbox
            id={id}
            checked={isChecked}
            onCheckedChange={checked => handleChange(option.value, !!checked)}
            disabled={option.disabled}
          />
          <label
            htmlFor={id}
            className={cn('cursor-pointer', option.disabled && 'cursor-not-allowed opacity-60')}
          >
            {option.label}
          </label>
        </div>
      );
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
        <div className={cn('flex flex-wrap gap-4 py-3.5', elementClassName)}>
          {options.map(renderOption)}
        </div>
      </Field>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
