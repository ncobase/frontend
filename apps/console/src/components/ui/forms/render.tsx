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
  ColorPickerField,
  IconPickerField,
  InputField
} from './fields';
import { Field } from './fields/field';
import { FieldProps } from './types';

const EditorField = React.lazy(() =>
  import('./fields/editor').then(module => ({ default: module.EditorField }))
);

const UploaderField = React.lazy(() =>
  import('./fields/uploader').then(module => ({ default: module.UploaderField }))
);

const EditorFieldFallback = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...rest }, ref) => (
    <Field {...rest} ref={ref} className={className}>
      <div className='min-h-[200px] rounded-md border border-slate-200 bg-slate-50 animate-pulse dark:border-slate-700 dark:bg-slate-800' />
    </Field>
  )
);

EditorFieldFallback.displayName = 'EditorFieldFallback';

const UploaderFieldFallback = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...rest }, ref) => (
    <Field {...rest} ref={ref} className={className}>
      <div className='flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400 animate-pulse dark:border-slate-700 dark:bg-slate-800'>
        Loading uploader...
      </div>
    </Field>
  )
);

UploaderFieldFallback.displayName = 'UploaderFieldFallback';

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
        return (
          <React.Suspense fallback={<UploaderFieldFallback ref={ref} {...rest} />}>
            <UploaderField ref={ref} {...rest} />
          </React.Suspense>
        );
      case 'color':
        return <ColorPickerField ref={ref} {...rest} />;
      case 'icon':
        return <IconPickerField ref={ref} {...rest} />;
      case 'editor':
        return (
          <React.Suspense fallback={<EditorFieldFallback ref={ref} {...rest} />}>
            <EditorField ref={ref} {...rest} />
          </React.Suspense>
        );
      default:
        return (
          <InputField type={type} ref={ref as React.ForwardedRef<HTMLInputElement>} {...rest} />
        );
    }
  }
);

FieldRender.displayName = 'FieldRender';
