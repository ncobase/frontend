import { ContentSchedule } from './schedule';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Get calendar events for date range
  getCalendarEvents: async (startDate: string, endDate: string, contentTypes?: string[]) => {
    let url = `${endpoint}/calendar?start=${startDate}&end=${endDate}`;
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
    return request.post(`${endpoint}/${scheduleId}/execute`);
  },
  // Cancel scheduled action
  cancelSchedule: async (scheduleId: string, reason?: string) => {
    return request.post(`${endpoint}/${scheduleId}/cancel`, { reason });
  },
  // Get schedules for specific content
  getContentSchedules: async (contentId: string, contentType: string) => {
    return request.get(`${endpoint}?content_id=${contentId}&content_type=${contentType}`);
  },
  // Bulk schedule operations
  bulkSchedule: async (schedules: Partial<ContentSchedule>[]) => {
    return request.post(`${endpoint}/bulk`, { schedules });
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
