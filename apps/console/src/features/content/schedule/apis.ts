import { ContentSchedule } from './schedule';

import { ApiContext, createApi } from '@/lib/api/factory';
import { assertRequiredApiArray, assertRequiredApiValue } from '@/lib/api/guards';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Get calendar events for date range
  getCalendarEvents: async (startDate: string, endDate: string, contentTypes?: string[]) => {
    let url = `${endpoint}/calendar?start=${assertRequiredApiValue(startDate, 'Start date')}&end=${assertRequiredApiValue(endDate, 'End date')}`;
    if (contentTypes?.length) {
      url += `&content_types=${contentTypes.join(',')}`;
    }
    return request.get(url);
  },
  // Check for scheduling conflicts
  checkConflicts: async (schedule: Partial<ContentSchedule>) => {
    return request.post(`${endpoint}/conflicts`, schedule);
  },
  // Execute scheduled action immediately
  executeNow: async (scheduleId: string) => {
    return request.post(`${endpoint}/${assertRequiredApiValue(scheduleId, 'Schedule ID')}/execute`);
  },
  // Cancel scheduled action
  cancelSchedule: async (scheduleId: string, reason?: string) => {
    return request.post(`${endpoint}/${assertRequiredApiValue(scheduleId, 'Schedule ID')}/cancel`, {
      reason
    });
  },
  // Get schedules for specific content
  getContentSchedules: async (contentId: string, contentType: string) => {
    return request.get(
      `${endpoint}?content_id=${assertRequiredApiValue(contentId, 'Content ID')}&content_type=${assertRequiredApiValue(contentType, 'Content type')}`
    );
  },
  // Bulk schedule operations
  bulkSchedule: async (schedules: Partial<ContentSchedule>[]) => {
    return request.post(`${endpoint}/bulk`, {
      schedules: assertRequiredApiArray(schedules, 'Schedules')
    });
  }
});

export const scheduleApi = createApi<ContentSchedule>('/cms/schedules', {
  extensions: extensionMethods
});

export const {
  create: createSchedule,
  get: getSchedule,
  update: updateSchedule,
  delete: deleteSchedule,
  list: getSchedules,
  executeNow,
  cancelSchedule,
  getContentSchedules,
  bulkSchedule,
  checkConflicts,
  getCalendarEvents
} = scheduleApi;
