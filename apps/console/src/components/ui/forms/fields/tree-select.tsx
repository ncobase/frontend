import React from 'react';

import { HierarchicalSelectProps, TreeSelect } from '../components';
import { FieldProps } from '../types';

import { Field } from '.';

export interface TreeSelectFieldProps extends Omit<
  HierarchicalSelectProps & FieldProps,
  'children'
> {
  options: Array<{ label: string; value: any; children?: any[] }>;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  allowParentSelection?: boolean;
  disabled?: boolean;
}

export const TreeSelectField = React.forwardRef<HTMLDivElement, TreeSelectFieldProps>(
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
      multiple = false,
      allowParentSelection = false,
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
        <TreeSelect
          options={options}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          searchable={searchable}
          multiple={multiple}
          allowParentSelection={allowParentSelection}
          error={!!error || (!!errors && !!name && !!errors[name])}
          {...rest}
        />
      </Field>
    );
  }
);

TreeSelectField.displayName = 'TreeSelectField';
