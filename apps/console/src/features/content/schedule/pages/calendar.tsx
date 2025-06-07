import React, { useState } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { ContentCalendar } from '../components/calendar';
import { ScheduleForm } from '../components/form';
import { CalendarEvent } from '../schedule';

import { Page, Topbar } from '@/components/layout';

export const ScheduleCalendarPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [, setSelectedDate] = useState<Date | null>(null);
  const [, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowScheduleForm(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    // Could open event details modal or navigate to content
    if (event.content_id) {
      navigate(`/content/${event.content_type}s/${event.content_id}`);
    }
  };

  const handleCloseForm = () => {
    setShowScheduleForm(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  return (
    <Page
      sidebar
      title={t('schedule.calendar.title')}
      topbar={
        <Topbar
          title={t('schedule.calendar.title')}
          left={[
            <span className='text-muted-foreground text-xs'>
              {t('schedule.calendar.description')}
            </span>
          ]}
          right={[
            <Button variant='outline' size='sm' onClick={() => navigate('/content/schedule')}>
              <Icons name='IconList' size={16} className='mr-1' />
              {t('schedule.list.view')}
            </Button>,
            <Button size='sm' onClick={() => setShowScheduleForm(true)}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('schedule.create.action')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='space-y-6'>
        {/* Calendar */}
        <ContentCalendar
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          height='h-[600px]'
        />

        {/* Schedule Form Modal */}
        {showScheduleForm && (
          <ScheduleForm
            isOpen={showScheduleForm}
            onClose={handleCloseForm}
            contentId=''
            contentType='topic'
          />
        )}
      </div>
    </Page>
  );
};
