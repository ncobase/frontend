import React, { useState, useEffect } from 'react';

import { Icons, Form, Modal } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ContentSchedule } from '../schedule';
import { useCreateSchedule, useUpdateSchedule, useScheduleConflicts } from '../service';

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: string;
  initialData?: ContentSchedule;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  isOpen,
  onClose,
  contentId,
  contentType,
  initialData
}) => {
  const { t } = useTranslation();
  const [showRecurrence, setShowRecurrence] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ContentSchedule>({
    defaultValues: {
      content_id: contentId,
      content_type: contentType,
      action_type: 'publish',
      scheduled_at: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      status: 'pending'
    }
  });

  const createScheduleMutation = useCreateSchedule();
  const updateScheduleMutation = useUpdateSchedule();

  const watchedData = watch();
  const { data: conflicts } = useScheduleConflicts(watchedData);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setShowRecurrence(!!initialData.recurrence);
    }
  }, [initialData, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      if (initialData?.id) {
        await updateScheduleMutation.mutateAsync({ ...data, id: initialData.id });
      } else {
        await createScheduleMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  });

  const basicFields = [
    {
      title: t('schedule.fields.action_type'),
      name: 'action_type',
      type: 'select',
      options: [
        { label: t('schedule.actions.publish'), value: 'publish' },
        { label: t('schedule.actions.unpublish'), value: 'unpublish' },
        { label: t('schedule.actions.delete'), value: 'delete' },
        { label: t('schedule.actions.update'), value: 'update' },
        { label: t('schedule.actions.distribute'), value: 'distribute' }
      ],
      rules: { required: t('forms.field_required') }
    },
    {
      title: t('schedule.fields.scheduled_at'),
      name: 'scheduled_at',
      type: 'datetime-local',
      rules: { required: t('forms.field_required') }
    },
    {
      title: t('schedule.fields.timezone'),
      name: 'timezone',
      type: 'select',
      options: [
        { label: 'UTC', value: 'UTC' },
        { label: 'America/New_York', value: 'America/New_York' },
        { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
        { label: 'Europe/London', value: 'Europe/London' },
        { label: 'Asia/Tokyo', value: 'Asia/Tokyo' }
      ]
    }
  ];

  const recurrenceFields = [
    {
      title: t('schedule.recurrence.type'),
      name: 'recurrence.type',
      type: 'select',
      options: [
        { label: t('schedule.recurrence.daily'), value: 'daily' },
        { label: t('schedule.recurrence.weekly'), value: 'weekly' },
        { label: t('schedule.recurrence.monthly'), value: 'monthly' },
        { label: t('schedule.recurrence.yearly'), value: 'yearly' },
        { label: t('schedule.recurrence.custom'), value: 'custom' }
      ]
    },
    {
      title: t('schedule.recurrence.interval'),
      name: 'recurrence.interval',
      type: 'number',
      defaultValue: 1,
      description: t('schedule.recurrence.interval_desc')
    },
    {
      title: t('schedule.recurrence.end_date'),
      name: 'recurrence.end_date',
      type: 'date'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? t('schedule.edit.title') : t('schedule.create.title')}
      onCancel={onClose}
      confirmText={initialData ? t('actions.update') : t('actions.create')}
      onConfirm={onSubmit}
      loading={createScheduleMutation.isPending || updateScheduleMutation.isPending}
      size='lg'
    >
      <div className='space-y-6'>
        {/* Conflicts Warning */}
        {conflicts && conflicts.length > 0 && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <div className='flex items-start space-x-2'>
              <Icons name='IconAlertTriangle' size={20} className='text-yellow-600 mt-0.5' />
              <div>
                <h4 className='font-medium text-yellow-800'>{t('schedule.conflicts.title')}</h4>
                <ul className='mt-2 text-sm text-yellow-700'>
                  {conflicts.map((conflict, index) => (
                    <li key={index}>
                      {t('schedule.conflicts.message', {
                        type: conflict.conflict_type,
                        time: conflict.existing_schedule.scheduled_at
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Basic Schedule Fields */}
        <Form
          control={control}
          errors={errors}
          fields={basicFields}
          className='grid grid-cols-1 gap-4'
        />

        {/* Recurrence Toggle */}
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='show-recurrence'
            checked={showRecurrence}
            onChange={e => setShowRecurrence(e.target.checked)}
            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label htmlFor='show-recurrence' className='text-sm font-medium text-gray-700'>
            {t('schedule.recurrence.enable')}
          </label>
        </div>

        {/* Recurrence Fields */}
        {showRecurrence && (
          <div className='border border-gray-200 rounded-lg p-4'>
            <h4 className='font-medium text-gray-900 mb-4'>{t('schedule.recurrence.settings')}</h4>
            <Form
              control={control}
              errors={errors}
              fields={recurrenceFields}
              className='grid grid-cols-2 gap-4'
            />
          </div>
        )}

        {/* Content Info */}
        <div className='bg-gray-50 rounded-lg p-4'>
          <h4 className='font-medium text-gray-900 mb-2'>{t('schedule.content_info')}</h4>
          <div className='text-sm text-gray-600'>
            <div>
              {t('schedule.content_type')}: {contentType}
            </div>
            <div>
              {t('schedule.content_id')}: {contentId}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
