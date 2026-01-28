import React, { useState, useCallback } from 'react';

import { cn } from '@ncobase/utils';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components';
import { FieldProps } from '../types';

import { Field } from './field';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';

export interface SelectFieldProps extends FieldProps {}

export const SelectField = React.forwardRef<HTMLDivElement, SelectFieldProps>(
  (
    {
      options,
      onChange,
      defaultValue,
      placeholder,
      prependIcon,
      prependIconClick,
      allowClear = false,
      emptyValue = '',
      ...rest
    },
    ref
  ) => {
    const [value, setValue] = useState(rest['value'] === undefined ? defaultValue : rest['value']);

    if (rest['value'] !== undefined && rest['value'] !== value) {
      setValue(rest['value']);
    }

    const handleValueChange = useCallback(
      (newValue: string) => {
        setValue(newValue);
        onChange?.(newValue);
      },
      [onChange]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue(emptyValue);
        onChange?.(emptyValue);
      },
      [onChange, emptyValue]
    );

    return (
      <Field {...rest} ref={ref}>
        <Select
          {...rest}
          value={value}
          onValueChange={handleValueChange}
          defaultValue={defaultValue}
        >
          <SelectTrigger
            className={cn('relative', prependIcon && 'pl-9!')}
            allowClear={allowClear}
            onClear={handleClear}
            value={value}
          >
            {prependIcon && (
              <Button
                className={cn(
                  'absolute left-1 top-1/2 transform -translate-y-1/2 cursor-default outline-hidden',
                  prependIconClick && 'cursor-pointer'
                )}
                onClick={prependIconClick}
                variant='unstyle'
                size='ratio'
              >
                <Icons name={prependIcon} />
              </Button>
            )}
            <SelectValue placeholder={placeholder || 'Please select'} />
          </SelectTrigger>
          <SelectContent>
            {(options || []).map((option, index) => (
              <SelectItem key={index} value={String(option.value)}>
                {option.label || option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }
);

SelectField.displayName = 'SelectField';
