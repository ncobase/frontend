import React, { useState } from 'react';

import { cn } from '@ncobase/utils';

import type { IconPickerComponentProps } from '../types';

import { Input } from './base';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';
import { IconPicker } from '@/components/ui/icon-picker';

export const IconPickerComponent: React.FC<IconPickerComponentProps> = ({
  value = '',
  onChange,
  className,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIconSelect = (iconName: string) => {
    onChange?.(iconName);
  };

  return (
    <div className={cn('relative', className)}>
      <div className='relative'>
        {value && (
          <Button
            className={cn(
              'absolute left-1 top-1/2 transform -translate-y-1/2 cursor-default outline-hidden'
            )}
            variant='unstyle'
            size='ratio'
          >
            <Icons name={value} />
          </Button>
        )}
        <Input
          type='text'
          value={value}
          placeholder={placeholder}
          className={cn(value && 'pl-9!', className)}
          readOnly
          onClick={() => setIsOpen(true)}
        />
        <div
          className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'
          onClick={() => setIsOpen(true)}
        >
          <Icons name='IconChevronDown' className='w-4 h-4' />
        </div>
      </div>
      <IconPicker
        opened={isOpen}
        onVisible={setIsOpen}
        onSelected={handleIconSelect}
        translations={{
          title: 'Select Icon',
          outline: 'Outline Icons',
          filled: 'Filled Icons',
          searchPlaceholder: 'Search...'
        }}
      />
    </div>
  );
};
