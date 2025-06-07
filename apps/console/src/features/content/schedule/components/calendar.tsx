import React, { useState, useMemo } from 'react';

import { Button, Icons, Badge, Card } from '@ncobase/react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { useTranslation } from 'react-i18next';

import { CalendarEvent } from '../schedule';
import { useCalendarEvents } from '../service';

interface ContentCalendarProps {
  onEventClick?: (_event: CalendarEvent) => void;
  onDateClick?: (_date: Date) => void;
  contentTypes?: string[];
  height?: string;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  onEventClick,
  onDateClick,
  contentTypes,
  height = 'h-96'
}) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const { data: eventsData, isLoading } = useCalendarEvents(
    monthStart.toISOString(),
    monthEnd.toISOString(),
    contentTypes
  );

  const events = eventsData?.items || [];

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [monthStart, monthEnd]);

  const getEventsForDate = (date: Date) => {
    return events.filter((event: CalendarEvent) => isSameDay(new Date(event.start), date));
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      scheduled: 'bg-blue-500',
      published: 'bg-green-500',
      deadline: 'bg-red-500',
      meeting: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => (direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)));
  };

  return (
    <Card className='p-6'>
      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-4'>
          <h3 className='text-lg font-semibold'>{format(currentDate, 'MMMM yyyy')}</h3>
          <div className='flex items-center space-x-1'>
            <Button variant='ghost' size='sm' onClick={() => navigateMonth('prev')}>
              <Icons name='IconChevronLeft' size={16} />
            </Button>
            <Button variant='ghost' size='sm' onClick={() => setCurrentDate(new Date())}>
              {t('schedule.calendar.today')}
            </Button>
            <Button variant='ghost' size='sm' onClick={() => navigateMonth('next')}>
              <Icons name='IconChevronRight' size={16} />
            </Button>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='flex items-center space-x-1 bg-gray-100 rounded-lg p-1'>
            {(['month', 'week', 'day'] as const).map(viewType => (
              <Button
                key={viewType}
                variant={view === viewType ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setView(viewType)}
                className='px-3'
              >
                {t(`schedule.calendar.view.${viewType}`)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {view === 'month' && (
        <div className={`${height} overflow-hidden`}>
          {/* Weekday Headers */}
          <div className='grid grid-cols-7 gap-1 mb-2'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className='p-2 text-center text-sm font-medium text-gray-700'>
                {t(`schedule.calendar.days.${day.toLowerCase()}`)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className='grid grid-cols-7 gap-1 h-full'>
            {calendarDays.map(date => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);

              return (
                <div
                  key={date.toISOString()}
                  className={`
                    p-2 border border-gray-200 cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 text-gray-400'}
                    ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''}
                  `}
                  onClick={() => onDateClick?.(date)}
                >
                  <div className='flex items-center justify-between mb-1'>
                    <span className={`text-sm ${isCurrentDay ? 'font-bold text-blue-600' : ''}`}>
                      {format(date, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <Badge variant='secondary' className='text-xs px-1'>
                        {dayEvents.length}
                      </Badge>
                    )}
                  </div>

                  {/* Event indicators */}
                  <div className='space-y-1'>
                    {dayEvents.slice(0, 3).map((event, _index) => (
                      <div
                        key={event.id}
                        className={`
                          text-xs p-1 rounded truncate cursor-pointer
                          ${getEventTypeColor(event.type)} text-white
                        `}
                        onClick={e => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className='text-xs text-gray-500'>
                        +{dayEvents.length - 3} {t('schedule.calendar.more')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className='flex items-center justify-center space-x-4 mt-4 pt-4 border-t'>
        {[
          { type: 'scheduled', label: t('schedule.calendar.legend.scheduled') },
          { type: 'published', label: t('schedule.calendar.legend.published') },
          { type: 'deadline', label: t('schedule.calendar.legend.deadline') },
          { type: 'meeting', label: t('schedule.calendar.legend.meeting') }
        ].map(({ type, label }) => (
          <div key={type} className='flex items-center space-x-2'>
            <div className={`w-3 h-3 rounded ${getEventTypeColor(type)}`} />
            <span className='text-sm text-gray-600'>{label}</span>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center'>
          <Icons name='IconLoader2' className='animate-spin' size={24} />
        </div>
      )}
    </Card>
  );
};
