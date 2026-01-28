import React from 'react';

import { cn } from '@ncobase/utils';

import { FieldProps } from '../types';

import { Field } from './field';

import { Switch } from '@/components/ui/switch';

export const SwitchField = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ onChange, defaultValue, elementClassName, type: _, ...rest }, ref) => {
    return (
      <Field {...rest} ref={ref}>
        <Switch
          onCheckedChange={onChange}
          defaultChecked={defaultValue}
          className={cn('my-3.5', elementClassName)}
          {...rest}
        />
      </Field>
    );
  }
);

SwitchField.displayName = 'SwitchField';
