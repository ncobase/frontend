import React from 'react';

import { FieldProps } from '../types';

import { HierarchicalSelect, HierarchicalSelectProps } from './hierarchical-select';

export interface TreeSelectProps extends Omit<HierarchicalSelectProps & FieldProps, 'children'> {
  options: Array<{ label: string; value: any; children?: any[] }>;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  allowParentSelection?: boolean;
  disabled?: boolean;
}

export const TreeSelect = React.forwardRef<HTMLDivElement, TreeSelectProps>(
  (
    {
      error,
      errors,
      name,
      options = [],
      value,
      defaultValue,
      onChange,
      placeholder,
      searchable = false,
      multiple = false,
      allowParentSelection = false,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) => {
    // Transform nested options array to flat format
    const processedOptions = React.useMemo(() => {
      const result: Array<any> = [];

      // Process options recursively
      const processOption = (option: any, parent: any = null) => {
        const { children, ...rest } = option;
        const processedOption = {
          ...rest,
          parent: parent ? parent.value : null
        };

        result.push(processedOption);

        if (children && children.length > 0) {
          children.forEach((child: any) => processOption(child, processedOption));
        }
      };

      // Process all top-level options
      options.forEach(option => processOption(option));

      return result;
    }, [options]);

    return (
      <HierarchicalSelect
        options={processedOptions}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        searchable={searchable}
        multiple={multiple}
        allowParentSelection={allowParentSelection}
        disabled={disabled}
        error={!!error || (!!errors && !!name && !!errors[name])}
        className={className}
        ref={ref}
        {...rest}
      />
    );
  }
);

TreeSelect.displayName = 'TreeSelect';
