import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
  bulkSchedule,
  cancelSchedule,
  checkConflicts,
  executeNow,
  getCalendarEvents,
  getContentSchedules
} from './apis';
import { ContentSchedule } from './schedule';

// Schedule query keys
export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters: any) => [...scheduleKeys.lists(), filters] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
  calendar: (start: string, end: string, types?: string[]) =>
    ['schedules', 'calendar', start, end, types] as const,
  content: (contentId: string, contentType: string) =>
    ['schedules', 'content', contentId, contentType] as const,
  conflicts: (schedule: Partial<ContentSchedule>) => ['schedules', 'conflicts', schedule] as const
};

// Schedule queries
export const useSchedules = (params: any = {}) => {
  return useQuery({
    queryKey: scheduleKeys.list(params),
    queryFn: () => getSchedules(params),
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

export const useSchedule = (scheduleId: string) => {
  return useQuery({
    queryKey: scheduleKeys.detail(scheduleId),
    queryFn: () => getSchedule(scheduleId),
    enabled: !!scheduleId
  });
};

export const useCalendarEvents = (startDate: string, endDate: string, contentTypes?: string[]) => {
  return useQuery({
    queryKey: scheduleKeys.calendar(startDate, endDate, contentTypes),
    queryFn: () => getCalendarEvents(startDate, endDate, contentTypes),
    enabled: !!startDate && !!endDate,
    staleTime: 1 * 60 * 1000 // 1 minute
  });
};

export const useContentSchedules = (contentId: string, contentType: string) => {
  return useQuery({
    queryKey: scheduleKeys.content(contentId, contentType),
    queryFn: () => getContentSchedules(contentId, contentType),
    enabled: !!contentId && !!contentType
  });
};

export const useScheduleConflicts = (schedule: Partial<ContentSchedule>) => {
  return useQuery({
    queryKey: scheduleKeys.conflicts(schedule),
    queryFn: () => checkConflicts(schedule),
    enabled: !!schedule.content_id && !!schedule.scheduled_at,
    staleTime: 30 * 1000 // 30 seconds
  });
};

// Schedule mutations
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.content(variables.content_id, variables.content_type)
      });
      queryClient.invalidateQueries({ queryKey: ['schedules', 'calendar'] });
    }
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(variables.id) });
      }
      queryClient.invalidateQueries({ queryKey: ['schedules', 'calendar'] });
    }
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['schedules', 'calendar'] });
    }
  });
};

export const useExecuteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executeNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['schedules', 'calendar'] });
    }
  });
};

export const useCancelSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, reason }: { scheduleId: string; reason?: string }) =>
      cancelSchedule(scheduleId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['schedules', 'calendar'] });
    }
  });
};

export const useBulkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['schedules', 'calendar'] });
    }
  });
};
