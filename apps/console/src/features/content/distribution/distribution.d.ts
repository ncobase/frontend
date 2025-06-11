export interface Distribution {
  id?: string;
  topic_id?: string;
  channel_id?: string;
  status?: 0 | 1 | 2 | 3 | 4; // draft, scheduled, published, failed, cancelled
  scheduled_at?: string;
  published_at?: string;
  meta_data?: Record<string, any>;
  external_id?: string;
  external_url?: string;
  custom_data?: Record<string, any>;
  error_details?: string;
  space_id?: string;
  topic?: any;
  channel?: any;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export const DISTRIBUTION_STATUS = {
  DRAFT: 0,
  SCHEDULED: 1,
  PUBLISHED: 2,
  FAILED: 3,
  CANCELLED: 4
} as const;

export const DISTRIBUTION_STATUS_LABELS = {
  [DISTRIBUTION_STATUS.DRAFT]: 'Draft',
  [DISTRIBUTION_STATUS.SCHEDULED]: 'Scheduled',
  [DISTRIBUTION_STATUS.PUBLISHED]: 'Published',
  [DISTRIBUTION_STATUS.FAILED]: 'Failed',
  [DISTRIBUTION_STATUS.CANCELLED]: 'Cancelled'
} as const;
