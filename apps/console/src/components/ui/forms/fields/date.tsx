import React from 'react';

import { FieldProps } from '../types';

import { Field } from './field';

import { DatePicker } from '@/components/ui/datepicker';

export const DateField = React.forwardRef<HTMLDivElement, FieldProps>((props, ref) => (
  <Field {...props} ref={ref}>
    <DatePicker mode='single' {...props} />
  </Field>
));

DateField.displayName = 'DateField';
