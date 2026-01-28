import React from 'react';

import { cn } from '@ncobase/utils';

import { Input } from '../components';
import { FieldProps } from '../types';

import { Field } from './field';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';

export const InputField = React.forwardRef<HTMLInputElement, FieldProps>(
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
    if (rest['value'] === undefined && defaultValue !== undefined) {
      rest['value'] = defaultValue;
    }

    return (
      <Field {...rest} ref={ref}>
        <div className='relative group'>
          {prependIcon && (
            <Button
              className={cn(
                'absolute left-2 top-1/2 transform -translate-y-1/2 cursor-default outline-hidden',
                'text-gray-400 dark:text-gray-500 transition-colors duration-200',
                'group-hover:text-gray-600 dark:group-hover:text-gray-300',
                prependIconClick &&
                  'cursor-pointer hover:text-primary-500 dark:hover:text-primary-400'
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
            className={cn(
              rest['className'],
              'transition-all duration-200 ease-in-out',
              'focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
              'hover:border-gray-400 dark:hover:border-gray-600',
              prependIcon && 'pl-10!',
              appendIcon && 'pr-10!'
            )}
          />
          {rest['type'] === 'number' && (
            <div
              className={cn(
                'flex flex-col absolute right-2 top-1/2 transform -translate-y-1/2',
                'opacity-70 group-hover:opacity-100 transition-opacity duration-200'
              )}
            >
              <Button
                className={cn(
                  'outline-hidden py-0 mt-0.5',
                  'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400',
                  'transition-colors duration-200'
                )}
                variant='unstyle'
                size='ratio'
                onClick={() => {
                  const newValue = parseInt(rest['value']) + 1 || 0;
                  onChange?.(newValue);
                }}
              >
                <Icons name='IconChevronUp' />
              </Button>
              <Button
                className={cn(
                  'outline-hidden py-0 -mt-0.5',
                  'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400',
                  'transition-colors duration-200'
                )}
                variant='unstyle'
                size='ratio'
                onClick={() => {
                  const newValue = parseInt(rest['value']) - 1 || 0;
                  onChange?.(newValue);
                }}
              >
                <Icons name='IconChevronDown' />
              </Button>
            </div>
          )}
          {rest['type'] !== 'number' && appendIcon && (
            <Button
              className={cn(
                'absolute right-2 top-1/2 transform -translate-y-1/2 cursor-default outline-hidden',
                'text-gray-400 dark:text-gray-500 transition-colors duration-200',
                'group-hover:text-gray-600 dark:group-hover:text-gray-300',
                appendIconClick &&
                  'cursor-pointer hover:text-primary-500 dark:hover:text-primary-400'
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

InputField.displayName = 'InputField';
