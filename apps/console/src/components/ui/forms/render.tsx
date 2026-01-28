import React from 'react';

import {
  TextareaField,
  DateField,
  DateRangeField,
  SelectField,
  MultiSelectField,
  TreeSelectField,
  CheckboxField,
  SwitchField,
  RadioField,
  UploaderField,
  ColorPickerField,
  IconPickerField,
  InputField,
  EditorField
} from './fields';
import { FieldProps } from './types';

export const FieldRender = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ type, ...rest }, ref) => {
    switch (type) {
      case 'textarea':
        return <TextareaField ref={ref as any} {...rest} />;
      case 'date':
        return <DateField ref={ref} {...rest} />;
      case 'date-range':
        return <DateRangeField ref={ref} {...rest} />;
      case 'select':
        return <SelectField ref={ref} {...rest} />;
      case 'multi-select':
        return <MultiSelectField ref={ref} {...rest} />;
      case 'tree-select':
        return <TreeSelectField ref={ref} {...rest} />;
      case 'checkbox':
        return <CheckboxField ref={ref} {...rest} />;
      case 'switch':
        return <SwitchField ref={ref} {...rest} />;
      case 'radio':
        return <RadioField ref={ref} {...rest} />;
      case 'uploader':
        return <UploaderField ref={ref} {...rest} />;
      case 'color':
        return <ColorPickerField ref={ref} {...rest} />;
      case 'icon':
        return <IconPickerField ref={ref} {...rest} />;
      case 'editor':
        return <EditorField ref={ref} {...rest} />;
      default:
        return (
          <InputField type={type} ref={ref as React.ForwardedRef<HTMLInputElement>} {...rest} />
        );
    }
  }
);

FieldRender.displayName = 'FieldRender';
