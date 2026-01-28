import React from 'react';

import { cn } from '@ncobase/utils';

import { Textarea } from '../components';
import { FieldProps } from '../types';

import { Field } from './field';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';

export const TextareaField = React.forwardRef<HTMLTextAreaElement, FieldProps>(
  (
    { onChange, defaultValue, placeholder, appendIcon, appendIconClick, valueComponent, ...rest },
    ref
  ) => {
    if (rest['value'] === undefined && defaultValue !== undefined) {
      rest['value'] = defaultValue;
    }

    return (
      <Field {...rest} ref={ref as any}>
        <div className='relative'>
          <Textarea onChange={onChange} placeholder={placeholder} {...rest} ref={ref} />
          {appendIcon && (
            <Button
              className={cn(
                'absolute right-1 top-1 cursor-default outline-hidden',
                appendIconClick && 'cursor-pointer'
              )}
              variant='unstyle'
              onClick={appendIconClick}
              size='ratio'
            >
              <Icons name={appendIcon} />
            </Button>
          )}
        </div>
        {valueComponent && valueComponent({ onChange, ...rest })}
      </Field>
    );
  }
);

TextareaField.displayName = 'TextareaField';
