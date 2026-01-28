import React from 'react';

import { Field } from './fields';
import type { FieldConfigProps } from './types';

export const FieldViewer = React.forwardRef<HTMLDivElement, FieldConfigProps>(
  ({ children, ...rest }, ref) => {
    return (
      <Field {...rest} ref={ref}>
        <div className='border-b border-slate-100 py-2.5 overflow-auto w-full inline-block text-slate-600'>
          {children || '-'}
        </div>
      </Field>
    );
  }
);

FieldViewer.displayName = 'FieldViewer';
