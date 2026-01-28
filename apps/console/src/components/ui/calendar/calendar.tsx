'use client';

import * as React from 'react';

import { cn } from '@ncobase/utils';
import { DayFlag, DayPicker, SelectionState, UI } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-4', className)}
      classNames={{
        [UI.Root]: cn(''),
        [UI.Months]: 'flex gap-x-4 space-y-4',
        [UI.Month]: 'space-y-6',
        [UI.MonthCaption]: 'flex justify-center relative items-center',
        [UI.CaptionLabel]: 'text-base font-medium',
        [UI.Nav]:
          'space-x-1 flex items-center absolute top-3 left-0 w-full justify-between px-4 z-999',
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: 'ghost', size: 'ratio' }),
          'h-8 w-8 bg-background p-0 hover:bg-muted hover:text-foreground'
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: 'ghost', size: 'ratio' }),
          'h-8 w-8 bg-background p-0 hover:bg-muted hover:text-foreground'
        ),
        [UI.MonthGrid]: 'w-full border-collapse space-y-2',
        [UI.Weekdays]: 'flex justify-between',
        [UI.Weekday]: 'text-center w-10 font-medium text-muted-foreground',
        [UI.Week]: 'flex w-full justify-between',
        [UI.Day]: 'flex h-8 w-8 overflow-hidden justify-center items-center p-0 m-1 relative',
        [UI.DayButton]: cn(
          buttonVariants({ variant: 'ghost', size: 'ratio' }),
          'h-8 w-8 font-normal rounded-md aria-selected:opacity-100'
        ),
        [SelectionState.range_end]: 'day-range-end',
        [SelectionState.selected]:
          'bg-primary-600 hover:bg-primary-600 text-white focus:bg-primary-600 focus:text-white rounded-md',
        [SelectionState.range_middle]: 'aria-selected:bg-slate-100 aria-selected:text-slate-500',
        [DayFlag.today]: 'border rounded-md border-primary-600',
        [DayFlag.outside]: 'text-muted-foreground opacity-50 aria-selected:opacity-30',
        [DayFlag.disabled]: 'opacity-50',
        [DayFlag.hidden]: 'invisible',
        ...classNames
      }}
      components={{
        Chevron: props => (
          <Icons
            name={props.orientation === 'left' ? 'IconArrowLeft' : 'IconArrowRight'}
            className='h-5 w-5'
            {...props}
          />
        )
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';
