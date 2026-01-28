import React, { useEffect, useState } from 'react';

import { cn, formatDateTime } from '@ncobase/utils';
import type { DateRange } from 'react-day-picker';

import { Button } from '../button';
import { Calendar } from '../calendar';
import { Icons } from '../icon';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

interface IDatePickerProps {
  mode?: 'single' | 'range';
  className?: string;
  defaultValue?: Date | DateRange | string;
  onChange?: (_date: Date | DateRange | undefined) => void;
  disabled?: boolean;
}

const datePickerStyles = `
'flex px-3 py-2 w-full bg-slate-50/55 hover:bg-slate-50/25 border border-slate-200/65 shadow-[0.03125rem_0.03125rem_0.125rem_0_rgba(0,0,0,0.03)] focus:border-primary-600 text-slate-500 gap-3 justify-start text-left font-normal disabled:cursor-not-allowed disabled:opacity-55 disabled:pointer-events-none'`;

const SingleDatePicker: React.FC<IDatePickerProps> = ({
  className,
  defaultValue,
  onChange,
  disabled
}) => {
  const [date, setDate] = useState<Date | undefined>((defaultValue as Date) || undefined);

  useEffect(() => {
    if (defaultValue) {
      setDate(defaultValue as Date);
    }
  }, [defaultValue]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='unstyle' className={cn(datePickerStyles, className)} disabled={disabled}>
          <Icons name='IconCalendar' />
          {date ? (
            formatDateTime(date, 'date')
          ) : (
            <span className='text-gray-400 font-normal'>请选择日期</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 bg-white z-999!' align='start'>
        <Calendar mode='single' selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};

const RangeDatePicker: React.FC<IDatePickerProps> = ({
  className,
  defaultValue,
  onChange,
  disabled
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    (defaultValue as DateRange) || undefined
  );

  useEffect(() => {
    if (defaultValue) {
      setDateRange(defaultValue as DateRange);
    }
  }, [defaultValue]);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setDateRange(selectedRange);
    onChange?.(selectedRange);
  };

  return (
    <Popover>
      <PopoverTrigger asChild disabled>
        <Button
          id='date'
          variant='outline'
          className={cn(datePickerStyles, !dateRange && 'text-slate-400', className)}
          disabled={disabled}
        >
          <Icons name='IconCalendar' />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {formatDateTime(dateRange.from, 'date')} - {formatDateTime(dateRange.to, 'date')}
              </>
            ) : (
              formatDateTime(dateRange.from, 'date')
            )
          ) : (
            <span className='text-slate-400'>查询范围</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 bg-white' align='start'>
        <Calendar
          mode='range'
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={date => {
            return date >= new Date();
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export const DatePicker: React.FC<IDatePickerProps> = ({ mode = 'single', ...rest }) => {
  if (mode === 'range') {
    return <RangeDatePicker {...rest} />;
  }
  return <SingleDatePicker {...rest} />;
};
