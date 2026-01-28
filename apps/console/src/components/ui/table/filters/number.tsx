import React, { useState, useEffect } from 'react';

import { cn } from '@ncobase/utils';

import { useTable } from '../table.context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/forms';
import { Icons } from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

export interface NumberFilterProps {
  dataIndex: string;
  min?: number;
  max?: number;
  step?: number;
  handleFilterChange: (_range: [number | null, number | null]) => void;
}

export const NumberFilter: React.FC<NumberFilterProps> = ({
  dataIndex,
  min = 0,
  max = 100,
  step = 1,
  handleFilterChange
}) => {
  const { filter: filterState, internalData } = useTable();
  const [range, setRange] = useState<[number | null, number | null]>([null, null]);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate min/max from data if not provided
  useEffect(() => {
    if (min === undefined || max === undefined) {
      const values = internalData?.map(item => Number(item[dataIndex])).filter(val => !isNaN(val));

      if (values && values.length > 0) {
        const dataMin = Math.min(...values);
        const dataMax = Math.max(...values);

        if (min === undefined) min = dataMin;
        if (max === undefined) max = dataMax;
      }
    }
  }, [internalData, dataIndex, min, max]);

  // Initialize from filter state if it exists
  useEffect(() => {
    const numberRange = filterState?.config?.[dataIndex]?.numberRange;
    if (numberRange && Array.isArray(numberRange)) {
      setRange(numberRange as [number | null, number | null]);
    }
  }, [filterState?.config, dataIndex]);

  const handleInputChange = (index: 0 | 1, value: string) => {
    const newValue = value === '' ? null : Number(value);
    const newRange = [...range] as [number | null, number | null];
    newRange[index] = newValue;
    setRange(newRange);
  };

  const handleSliderChange = (values: number[]) => {
    setRange([values[0], values[1]]);
  };

  const applyFilter = () => {
    handleFilterChange(range);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setRange([null, null]);
    handleFilterChange([null, null]);
    setIsOpen(false);
  };

  const hasActiveFilter = range[0] !== null || range[1] !== null;

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
          <Icons
            name='IconFilter'
            className={cn('h-4 w-4', hasActiveFilter && 'stroke-blue-500')}
          />
          {/* <span className='hidden sm:inline'>
            {hasActiveFilter
              ? `${range[0] !== null ? range[0] : 'Min'} - ${range[1] !== null ? range[1] : 'Max'}`
              : ''}
          </span> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-4' align='start'>
        <div className='space-y-4'>
          <div className='pt-2 pb-4'>
            <Slider
              defaultValue={[range[0] ?? min, range[1] ?? max]}
              min={min}
              max={max}
              step={step}
              onValueChange={handleSliderChange}
              className='my-4'
            />
          </div>

          <div className='flex justify-between space-x-2'>
            <div className='w-full'>
              <p className='text-xs mb-1'>Min</p>
              <Input
                type='number'
                value={range[0] === null ? '' : range[0].toString()}
                onChange={e => handleInputChange(0, e.target.value)}
                className='h-8'
                min={min}
                max={range[1] !== null ? range[1] : max}
                step={step}
              />
            </div>
            <div className='w-full'>
              <p className='text-xs mb-1'>Max</p>
              <Input
                type='number'
                value={range[1] === null ? '' : range[1].toString()}
                onChange={e => handleInputChange(1, e.target.value)}
                className='h-8'
                min={range[0] !== null ? range[0] : min}
                max={max}
                step={step}
              />
            </div>
          </div>

          <div className='flex justify-between pt-2'>
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
