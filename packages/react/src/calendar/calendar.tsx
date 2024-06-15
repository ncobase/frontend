import React from 'react';

import { cn } from '@ncobase/utils';
import { zhCN } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';

import { getButtonStyling } from '../button/styles';
import { Icons } from '../icon';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          getButtonStyling('slate', 'md'),
          'h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-0.5 first:mt-0 last:mb-0',
        cell: 'h-8 w-8 m-0.5 text-center p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          getButtonStyling('unstyle', 'md'),
          'h-8 w-8 m-1 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_end: 'day-range-end',
        day_selected: '!bg-primary-600 text-white hover:!bg-primary-600/55 focus:!bg-primary-600',
        day_today: '', // bg-red-500 text-white hover:bg-red-500/55 focus:bg-red-500',
        day_outside: 'day-outside opacity-50 aria-selected:opacity-30',
        day_disabled: 'opacity-50',
        day_range_middle: 'aria-selected:!bg-slate-100 aria-selected:!text-slate-500',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: () => <Icons name='IconArrowLeft' className='h-4 w-4' />,
        IconRight: () => <Icons name='IconArrowRight' className='h-4 w-4' />
      }}
      locale={zhCN}
      {...props}
    />
  );
};
Calendar.displayName = 'Calendar';

export { Calendar };
