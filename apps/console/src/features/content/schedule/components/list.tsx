import React, { useState } from 'react';

import { Button, Icons, Badge, TableView, Card } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { ContentSchedule } from '../schedule';
import { useSchedules, useExecuteSchedule, useCancelSchedule } from '../service';

interface ScheduleListProps {
  contentId?: string;
  contentType?: string;
  onEditSchedule?: (_schedule: ContentSchedule) => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  contentId,
  contentType,
  onEditSchedule
}) => {
  const { t } = useTranslation();
  const [filters] = useState({
    content_id: contentId,
    content_type: contentType,
    status: '',
    limit: 50
  });

  const { data: schedulesData, isLoading } = useSchedules(filters);
  const executeScheduleMutation = useExecuteSchedule();
  const cancelScheduleMutation = useCancelSchedule();

  const schedules = schedulesData?.items || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'warning',
      processing: 'primary',
      completed: 'success',
      failed: 'danger',
      cancelled: 'secondary'
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>{t(`schedule.status.${status}`)}</Badge>
    );
  };

  const getActionIcon = (actionType: string) => {
    const icons = {
      publish: 'IconEye',
      unpublish: 'IconEyeOff',
      delete: 'IconTrash',
      update: 'IconEdit',
      distribute: 'IconSend'
    };
    return icons[actionType] || 'IconClock';
  };

  const handleExecute = async (schedule: ContentSchedule) => {
    if (confirm(t('schedule.execute.confirm'))) {
      try {
        await executeScheduleMutation.mutateAsync(schedule.id!);
      } catch (error) {
        console.error('Failed to execute schedule:', error);
      }
    }
  };

  const handleCancel = async (schedule: ContentSchedule) => {
    const reason = prompt(t('schedule.cancel.reason_prompt'));
    if (reason !== null) {
      try {
        await cancelScheduleMutation.mutateAsync({
          scheduleId: schedule.id!,
          reason
        });
      } catch (error) {
        console.error('Failed to cancel schedule:', error);
      }
    }
  };

  const columns = [
    {
      title: t('schedule.fields.content'),
      dataIndex: 'content_id',
      parser: (_: any, schedule: ContentSchedule) => (
        <div className='flex items-center space-x-2'>
          <Icons name={getActionIcon(schedule.action_type)} size={16} className='text-gray-500' />
          <div>
            <div className='font-medium text-sm'>{schedule.content_type}</div>
            <div className='text-xs text-gray-500'>{schedule.content_id}</div>
          </div>
        </div>
      )
    },
    {
      title: t('schedule.fields.action'),
      dataIndex: 'action_type',
      parser: (actionType: string) => (
        <Badge variant='primary' className='capitalize'>
          {t(`schedule.actions.${actionType}`)}
        </Badge>
      )
    },
    {
      title: t('schedule.fields.scheduled_at'),
      dataIndex: 'scheduled_at',
      parser: (scheduledAt: string) => (
        <div>
          <div className='text-sm'>{formatDateTime(scheduledAt)}</div>
          <div className='text-xs text-gray-500'>{formatRelativeTime(new Date(scheduledAt))}</div>
        </div>
      )
    },
    {
      title: t('schedule.fields.status'),
      dataIndex: 'status',
      parser: (status: string) => getStatusBadge(status)
    },
    {
      title: t('common.actions'),
      filter: false,
      parser: (_: any, schedule: ContentSchedule) => (
        <div className='flex space-x-1'>
          {schedule.status === 'pending' && (
            <>
              <Button
                variant='text'
                size='xs'
                onClick={() => handleExecute(schedule)}
                loading={executeScheduleMutation.isPending}
              >
                <Icons name='IconPlay' size={14} className='mr-1' />
                {t('schedule.actions.execute')}
              </Button>
              <Button variant='text' size='xs' onClick={() => onEditSchedule?.(schedule)}>
                <Icons name='IconEdit' size={14} className='mr-1' />
                {t('actions.edit')}
              </Button>
              <Button
                variant='text'
                size='xs'
                onClick={() => handleCancel(schedule)}
                loading={cancelScheduleMutation.isPending}
                className='text-red-600'
              >
                <Icons name='IconX' size={14} className='mr-1' />
                {t('actions.cancel')}
              </Button>
            </>
          )}
          {schedule.status === 'failed' && schedule.error_message && (
            <Button variant='text' size='xs' title={schedule.error_message}>
              <Icons name='IconAlertCircle' size={14} className='text-red-500' />
            </Button>
          )}
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <Icons name='IconLoader2' className='animate-spin' size={24} />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {schedules.length > 0 ? (
        <TableView header={columns} data={schedules} />
      ) : (
        <Card className='text-center py-8'>
          <Icons name='IconClock' size={32} className='mx-auto text-gray-400 mb-3' />
          <h3 className='text-base font-medium text-gray-900 mb-1'>
            {t('schedule.list.empty.title')}
          </h3>
          <p className='text-sm text-gray-500'>{t('schedule.list.empty.description')}</p>
        </Card>
      )}
    </div>
  );
};
