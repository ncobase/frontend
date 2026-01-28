import React from 'react';

import { ColorPickerComponent } from '../components';
import { FieldProps } from '../types';

import { Field } from './field';

export const ColorPickerField = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ onChange, defaultValue, ...rest }, ref) => {
    return (
      <Field {...rest} ref={ref}>
        <ColorPickerComponent value={rest['value'] || defaultValue} onChange={onChange} {...rest} />
      </Field>
    );
  }
);

ColorPickerField.displayName = 'ColorPickerField';
