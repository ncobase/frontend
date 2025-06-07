export interface ContentSchedule {
  id?: string;
  content_id: string;
  content_type: string;
  action_type: 'publish' | 'unpublish' | 'delete' | 'update' | 'distribute';
  scheduled_at: string;
  timezone?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  executed_at?: string;
  error_message?: string;
  recurrence?: RecurrenceRule;
  metadata?: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number; // Every N days/weeks/months
  days_of_week?: number[]; // 0-6, Sunday = 0
  day_of_month?: number; // 1-31
  end_date?: string;
  max_occurrences?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  type: 'scheduled' | 'published' | 'deadline' | 'meeting';
  content_id?: string;
  content_type?: string;
  status?: string;
  color?: string;
  description?: string;
  url?: string;
}

export interface ScheduleConflict {
  content_id: string;
  content_type: string;
  existing_schedule: ContentSchedule;
  conflicting_schedule: ContentSchedule;
  conflict_type: 'same_time' | 'overlapping' | 'resource_conflict';
}
