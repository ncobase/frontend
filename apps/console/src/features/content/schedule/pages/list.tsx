import React, { useState } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { ScheduleForm } from '../components/form';
import { ScheduleList } from '../components/list';
import { ContentSchedule } from '../schedule';

import { Page, Topbar } from '@/components/layout';

export const ScheduleListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ContentSchedule | undefined>();

  const handleEditSchedule = (schedule: ContentSchedule) => {
    setEditingSchedule(schedule);
    setShowScheduleForm(true);
  };

  const handleCloseForm = () => {
    setShowScheduleForm(false);
    setEditingSchedule(undefined);
  };

  return (
    <Page
      sidebar
      title={t('schedule.title')}
      topbar={
        <Topbar
          title={t('schedule.title')}
          left={[
            <span className='text-muted-foreground text-xs'>{t('schedule.list.description')}</span>
          ]}
          right={[
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate('/content/schedule/calendar')}
            >
              <Icons name='IconCalendar' size={16} className='mr-1' />
              {t('schedule.calendar.view')}
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
      {/* Schedule List */}
      <ScheduleList onEditSchedule={handleEditSchedule} />

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <ScheduleForm
          isOpen={showScheduleForm}
          onClose={handleCloseForm}
          contentId='' // Will be filled when creating from content
          contentType='topic'
          initialData={editingSchedule}
        />
      )}
    </Page>
  );
};
