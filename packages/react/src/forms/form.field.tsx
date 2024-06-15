import React, { HTMLInputTypeAttribute, forwardRef, memo } from 'react';

import { cn, getValueByPath } from '@ncobase/utils';
import { FieldError, FieldValues, RegisterOptions } from 'react-hook-form';

import { Button } from '../button';
import { DatePicker } from '../datepicker';
import { Icons } from '../icon';
import { Switch } from '../switch';

import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';
import { Textarea } from './textarea';

interface FieldConfigProps extends React.ComponentProps<any> {
  /**
   * The title of the field
   */
  title?: string;
  /**
   * The description of the field
   * @example
   *   desc='description'
   *   desc={<div>description</div>}
   */
  desc?: React.ReactNode;
  /**
   * The name of the field
   * @example
   *   name='name'
   *   name='profile.name'
   */
  name?: any;
  /**
   * The placeholder of the field, if type is 'input', 'password', 'textarea', 'number'
   */
  placeholder?: string;
  /**
   * The default value of the field
   */
  defaultValue?: any;
  /**
   * The type of the field
   * valid values: 'input | text', 'password', 'textarea', 'select', 'checkbox', 'radio', 'number', 'date', 'date-range', 'switch', 'hidden'
   */
  type?: 'date-range' | 'switch' | HTMLInputTypeAttribute | HTMLButtonElement['type'];
  /**
   * The prepend icon of the field
   */
  prependIcon?: string;
  /**
   * The click event of the prepend icon
   * @returns void
   */
  prependIconClick?: () => void;
  /**
   * The append icon of the field
   */
  appendIcon?: string;
  /**
   * The click event of the append icon
   * @returns void
   */
  appendIconClick?: () => void;
  /**
   * The rules of the field
   * @see https://react-hook-form.com/api/useform/register
   */
  rules?: RegisterOptions;
  /**
   * The errors of the form
   * @see https://react-hook-form.com/api/useform
   */
  errors?: FieldValues;
  /**
   * The options of the field, if type is 'select', 'checkbox', 'radio'
   * @example
   *   options={[{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }, { label: 'Option 3', value: 3 }]}
   */
  options?: Record<string, any>[];
  /**
   * If the field is required, the error message will be displayed
   */
  required?: boolean;
  /**
   * The value component of the field
   * @returns void
   * @example
   *   valueComponent={(onChange) => onChange('value')}
   */
  valueComponent?: any;
  /**
   * The className of the field
   */
  className?: string;
  /**
   * The className of the children wrapper, if type is 'checkbox', 'radio'
   */
  elementClassName?: string;
}

interface FieldProps extends FieldConfigProps {
  error?: FieldError;
}

const Field = forwardRef<any, FieldProps>(
  ({ title, className, error, errors, name, children, desc, rules, ...rest }, ref) => {
    const rendered = children || <Input {...rest} ref={ref} />;
    const errorMessage = errors
      ? getValueByPath(errors, name)?.message
      : error
        ? error?.message
        : null;
    const required = rules?.required || rest.required || false;

    if (rest.type === 'hidden') {
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

const FieldViewer = forwardRef<HTMLDivElement, FieldConfigProps>(({ children, ...rest }, ref) => {
  return (
    <Field {...rest} ref={ref}>
      <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
        {children || '-'}
      </div>
    </Field>
  );
});

const FieldRender = memo(
  forwardRef<any, FieldConfigProps>(({ type, ...props }, ref) => {
    switch (type) {
      case 'textarea':
        return <TextareaField ref={ref} {...props} />;
      case 'date':
        return <DateField ref={ref} {...props} />;
      case 'date-range':
        return <DateRangeField ref={ref} {...props} />;
      case 'select':
        return <SelectField ref={ref} {...props} />;
      case 'checkbox':
        return <CheckboxField ref={ref} {...props} />;
      case 'switch':
        return <SwitchField ref={ref} {...props} />;
      case 'radio':
        return <RadioField ref={ref} {...props} />;
      default:
        return <InputField type={type} ref={ref} {...props} />;
    }
  })
);

const InputField = forwardRef<HTMLInputElement, FieldConfigProps>(
  (
    {
      onChange,
      defaultValue,
      placeholder,
      prependIcon,
      prependIconClick,
      appendIcon,
      appendIconClick,
      valueComponent,
      ...rest
    },
    ref
  ) => {
    if (rest.value === undefined && defaultValue !== undefined) {
      rest.value = defaultValue;
    }

    return (
      <Field {...rest} ref={ref}>
        <div className='relative'>
          {prependIcon && (
            <Button
              className={cn(
                'absolute left-1 top-1/2 transform -translate-y-1/2 cursor-default outline-none',
                prependIconClick && 'cursor-pointer'
              )}
              onClick={prependIconClick}
              variant='unstyle'
              size='ratio'
            >
              <Icons name={prependIcon} />
            </Button>
          )}
          <Input
            onChange={onChange}
            placeholder={placeholder}
            {...rest}
            ref={ref}
            className={cn(rest.className, prependIcon && 'pl-9', appendIcon && 'pr-9')}
          />
          {rest.type === 'number' && (
            <div
              className={cn('flex flex-col absolute right-1 top-1/2 transform -translate-y-1/2')}
            >
              <Button
                className={cn('outline-none py-0 mt-0.5')}
                variant='unstyle'
                size='ratio'
                onClick={() => {
                  const newValue = parseInt(rest.value) + 1 || 0;
                  onChange(newValue);
                }}
              >
                <Icons name='IconChevronUp' />
              </Button>
              <Button
                className={cn('outline-none py-0 -mt-0.5')}
                variant='unstyle'
                size='ratio'
                onClick={() => {
                  const newValue = parseInt(rest.value) - 1 || 0;
                  onChange(newValue);
                }}
              >
                <Icons name='IconChevronDown' />
              </Button>
            </div>
          )}
          {rest.type !== 'number' && appendIcon && (
            <Button
              className={cn(
                'absolute right-1 top-1/2 transform -translate-y-1/2 cursor-default outline-none',
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

const TextareaField = forwardRef<HTMLTextAreaElement, FieldConfigProps>(
  (
    { onChange, defaultValue, placeholder, appendIcon, appendIconClick, valueComponent, ...rest },
    ref
  ) => {
    if (rest.value === undefined && defaultValue !== undefined) {
      rest.value = defaultValue;
    }
    return (
      <Field {...rest} ref={ref}>
        <div className='relative'>
          <Textarea onChange={onChange} placeholder={placeholder} {...rest} ref={ref} />
          {appendIcon && (
            <Button
              className={cn(
                'absolute right-1 top-1 cursor-default outline-none',
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

const DateField = forwardRef<HTMLDivElement, FieldConfigProps>((props, ref) => (
  <Field {...props} ref={ref}>
    <DatePicker mode='single' {...props} />
  </Field>
));

const DateRangeField = forwardRef<HTMLDivElement, FieldConfigProps>((props, ref) => (
  <Field {...props} ref={ref}>
    <DatePicker mode='range' {...props} />
  </Field>
));

const SelectField = forwardRef<HTMLDivElement, FieldConfigProps>(
  (
    { options, onChange, defaultValue, placeholder, prependIcon, prependIconClick, ...rest },
    ref
  ) => {
    if (rest.value === undefined && defaultValue !== undefined) {
      rest.value = defaultValue;
    }
    return (
      <Field {...rest} ref={ref}>
        <Select {...rest} onValueChange={onChange} defaultValue={defaultValue}>
          <SelectTrigger className={cn('relative', prependIcon && 'pl-9')}>
            {prependIcon && (
              <Button
                className={cn(
                  'absolute left-1 top-1/2 transform -translate-y-1/2 cursor-default outline-none',
                  prependIconClick && 'cursor-pointer'
                )}
                onClick={prependIconClick}
                variant='unstyle'
                size='ratio'
              >
                <Icons name={prependIcon} />
              </Button>
            )}
            <SelectValue placeholder={placeholder || '请选择'} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option, index) => (
              <SelectItem key={index} value={option.value as string}>
                {option.label || option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }
);

const RenderOption = memo(
  forwardRef<any, any>(({ option, type, onChange, defaultValue, ...rest }, _ref) => {
    const { label, value } = typeof option === 'object' ? option : { label: option, value: option };
    const id = `${rest.name}-${value}`.replace(/\./g, '-');

    return (
      <div className='inline-flex items-center space-x-2 [&>label]:hover:cursor-pointer'>
        {type === 'checkbox' ? (
          <Checkbox
            id={id}
            onCheckedChange={checked => {
              const updatedValue = checked
                ? [...(defaultValue || []), value]
                : (defaultValue || []).filter((val: any) => val !== value);
              onChange(updatedValue);
            }}
            defaultChecked={defaultValue?.includes(value)}
            {...rest}
          />
        ) : (
          <RadioGroupItem id={id} value={value} />
        )}
        <Label htmlFor={id}>{label}</Label>
      </div>
    );
  })
);

const CheckboxField = forwardRef<HTMLDivElement, FieldConfigProps>(
  // Discard:
  //   - type
  ({ className, options = [], elementClassName, type: _, ...rest }, ref) => {
    const renderSingleOption = (label: string) => (
      <div className='inline-flex items-center space-x-2 [&>label]:hover:cursor-pointer'>
        <Checkbox
          id={`${rest.name}`}
          onCheckedChange={rest.onChange}
          defaultChecked={rest.defaultValue}
          {...rest}
        />
        <Label htmlFor={`${rest.name}`}>{label || rest.title}</Label>
      </div>
    );
    return (
      <Field {...rest} ref={ref} className={className}>
        <div className={cn('flex flex-wrap gap-4', elementClassName)}>
          {options.length === 0 && renderSingleOption(rest.label)}
          {options.length === 1 && renderSingleOption(options[0]['label'] || '')}
          {options.length > 1 &&
            options.map((option, index) => (
              <RenderOption key={index} option={option} type='checkbox' {...rest} />
            ))}
        </div>
      </Field>
    );
  }
);

const RadioField = forwardRef<HTMLDivElement, FieldConfigProps>(
  ({ className, onChange, defaultValue, options = [], elementClassName, ...rest }, ref) => {
    return (
      <Field {...rest} ref={ref} className={className}>
        <RadioGroup
          {...rest}
          className={cn('flex flex-wrap gap-4', elementClassName)}
          defaultValue={defaultValue}
          onValueChange={onChange}
        >
          {options.length === 0 && (
            <RenderOption type='radio' option={{ label: rest.title, value: '0' }} {...rest} />
          )}
          {options.length === 1 && <RenderOption type='radio' option={options[0]} {...rest} />}
          {options.length > 1 &&
            options?.map((option, index) => (
              <RenderOption key={index} option={option} type='radio' {...rest} />
            ))}
        </RadioGroup>
      </Field>
    );
  }
);

const SwitchField = forwardRef<HTMLDivElement, FieldConfigProps>(
  // Discard:
  //   - type
  ({ onChange, defaultValue, elementClassName, type: _, ...rest }, ref) => (
    <Field {...rest} ref={ref}>
      <Switch
        onCheckedChange={onChange}
        defaultChecked={defaultValue}
        className={elementClassName}
        {...rest}
      />
    </Field>
  )
);

export {
  Field,
  FieldViewer,
  FieldRender,
  InputField,
  TextareaField,
  DateField,
  DateRangeField,
  SelectField,
  CheckboxField,
  RadioField,
  type FieldConfigProps
};
