import React from 'react';

import { getValueByPath, cn } from '@ncobase/utils';

import { Input, Label } from '../components';
import { FieldProps } from '../types';

import { Icons } from '@/components/ui/icon';

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ title, className, error, errors, name, children, desc, rules, ...rest }, ref) => {
    const rendered = children || <Input {...rest} ref={ref as any} />;
    const errorMessage = errors
      ? getValueByPath(errors, name)?.message
      : error
        ? error?.message
        : null;
    const required = rules?.required || rest['required'] || false;

    if (rest['type'] === 'hidden') {
      return rendered;
    }

    return (
      <div className={cn('flex flex-col gap-y-2', className)} ref={ref}>
        {title && (
          <Label className='text-slate-900 font-medium'>
            {required && <span className='text-danger-400 pr-2'>*</span>}
            {title}
          </Label>
        )}
        {rendered}
        {errorMessage && <div className='text-danger-400'>{errorMessage}</div>}
        {desc && (
          <div className='text-slate-400/80 leading-5 text-wrap text-justify'>
            <Icons name='IconInfoCircle' className='mr-1 inline-block -mt-1' />
            {desc}
          </div>
        )}
      </div>
    );
  }
);

Field.displayName = 'Field';
