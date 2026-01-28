import React from 'react';

import { cn } from '@ncobase/utils';

import { Checkbox, Label } from '../components';
import { FieldProps } from '../types';

import { Field } from './field';
import { RenderOption } from './render-option';

export const CheckboxField = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, options = [], elementClassName, type: _, ...rest }, ref) => {
    const renderSingleOption = (label: string) => (
      <div className='inline-flex items-center space-x-2 hover:[&>label]:cursor-pointer'>
        <Checkbox
          id={`${rest['name']}`}
          onCheckedChange={rest['onChange']}
          defaultChecked={rest['defaultValue']}
          {...rest}
        />
        <Label htmlFor={`${rest['name']}`}>{label || rest['title']}</Label>
      </div>
    );

    return (
      <Field {...rest} ref={ref} className={className}>
        <div className={cn('flex flex-wrap gap-4 py-3.5', elementClassName)}>
          {options.length === 0 && renderSingleOption(rest['label'])}
          {options.length === 1 && renderSingleOption(options[0]['label'] || '')}
          {options.length > 1 &&
            options.map((option: unknown, index: React.Key | null | undefined) => (
              <RenderOption key={index} option={option} type='checkbox' {...rest} />
            ))}
        </div>
      </Field>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';
