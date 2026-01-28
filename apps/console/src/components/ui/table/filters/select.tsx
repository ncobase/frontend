import React, { useState, useEffect } from 'react';

import { cn } from '@ncobase/utils';

import { useTable } from '../table.context';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/forms';
import { Icons } from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface SelectFilterOption {
  label: string;
  value: string | number;
}

export interface SelectFilterProps {
  dataIndex: string;
  options: SelectFilterOption[];
  handleFilterChange: (_values: (string | number)[]) => void;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  dataIndex,
  options,
  handleFilterChange
}) => {
  const { filter: filterState } = useTable();
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize from filter state if it exists
  useEffect(() => {
    const values = filterState?.config?.[dataIndex]?.selectedValues;
    if (values && Array.isArray(values)) {
      setSelectedValues(values);
    }
  }, [filterState?.config, dataIndex]);

  const handleSelect = (value: string | number) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
  };

  const applyFilter = () => {
    handleFilterChange(selectedValues);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setSelectedValues([]);
    handleFilterChange([]);
    setIsOpen(false);
  };

  const hasActiveFilter = selectedValues.length > 0;
  // const selectedCount = selectedValues.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='unstyle'
          size='sm'
          className={cn(
            'h-8 px-2 py-1 flex items-center gap-1',
            hasActiveFilter && 'text-blue-500'
          )}
        >
          <Icons name='IconList' className={cn('h-4 w-4', hasActiveFilter && 'stroke-blue-500')} />
          {/* <span className='hidden sm:inline'>
            {hasActiveFilter ? `${selectedCount} selected` : ''}
          </span> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-60 p-2' align='start'>
        <div className='space-y-2'>
          <div className='max-h-60 overflow-auto'>
            {options.map(option => (
              <div key={option.value} className='flex items-center py-1'>
                <Checkbox
                  id={`option-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={() => handleSelect(option.value)}
                />
                <label htmlFor={`option-${option.value}`} className='ml-2 cursor-pointer w-full'>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          <div className='flex justify-between pt-2 border-t'>
            <Button variant='outline' size='sm' onClick={clearFilter} disabled={!hasActiveFilter}>
              Clear
            </Button>
            <Button size='sm' onClick={applyFilter}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
