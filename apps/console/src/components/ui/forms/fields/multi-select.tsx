import React from 'react';

import { HierarchicalSelectProps, MultiSelect } from '../components';
import { FieldProps } from '../types';

import { Field } from '.';

export interface MultiSelectFieldProps extends Omit<HierarchicalSelectProps & FieldProps, 'type'> {
  options: Array<{ label: string; value: any }>;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
}

export const MultiSelectField = React.forwardRef<HTMLDivElement, MultiSelectFieldProps>(
  (
    {
      title,
      desc,
      error,
      errors,
      name,
      rules,
      required,
      options = [],
      onChange,
      value,
      defaultValue,
      placeholder,
      searchable = false,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <Field
        title={title}
        desc={desc}
        error={error}
        errors={errors}
        name={name}
        rules={rules}
        required={required}
        ref={ref}
        className={className}
      >
        <MultiSelect
          options={options}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          searchable={searchable}
          error={!!error || (!!errors && !!name && !!errors[name])}
          {...rest}
        />
      </Field>
    );
  }
);

MultiSelectField.displayName = 'MultiSelectField';
