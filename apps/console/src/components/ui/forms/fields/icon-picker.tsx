import React from 'react';

import { IconPickerComponent } from '../components';
import { FieldProps } from '../types';

import { Field } from './field';

export const IconPickerField = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ onChange, defaultValue, ...rest }, ref) => {
    return (
      <Field {...rest} ref={ref}>
        <IconPickerComponent value={rest['value'] || defaultValue} onChange={onChange} {...rest} />
      </Field>
    );
  }
);

IconPickerField.displayName = 'IconPickerField';
