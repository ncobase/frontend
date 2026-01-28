import React from 'react';

import { FieldProps } from '../types';

import { HierarchicalSelect, HierarchicalSelectProps } from './hierarchical-select';

export interface MultiSelectProps extends Omit<HierarchicalSelectProps & FieldProps, 'type'> {
  options: Array<{ label: string; value: any }>;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
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
      disabled = false,
      className,
      ...rest
    },
    ref
  ) => {
    // Transform flat options array to hierarchical format if needed
    const processedOptions = React.useMemo(() => {
      // Check if the options are already in hierarchical format
      const hasHierarchy = options.some(option => option.children || option.parent !== undefined);

      if (hasHierarchy) {
        // Options already have hierarchy information
        return options;
      }

      // Convert flat array to hierarchical format
      return options.map(option => ({
        value: option.value,
        label: option.label,
        // No parent for flat options
        parent: null
      }));
    }, [options]);

    return (
      <HierarchicalSelect
        options={processedOptions}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        searchable={searchable}
        disabled={disabled}
        multiple={true}
        error={!!error || (!!errors && !!name && !!errors[name])}
        className={className}
        ref={ref}
        {...rest}
      />
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
