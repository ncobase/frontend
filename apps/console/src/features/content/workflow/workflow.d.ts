export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  type: 'approval' | 'review' | 'publishing' | 'custom';
  status: 0 | 1; // 0: active, 1: inactive
  steps: WorkflowStep[];
  conditions?: WorkflowCondition[];
  content_types?: string[]; // Which content types this workflow applies to
  space_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface WorkflowStep {
  id?: string;
  workflow_id?: string;
  name: string;
  description?: string;
  step_type: 'approval' | 'review' | 'notification' | 'automation';
  order: number;
  required: boolean;
  assignee_type: 'user' | 'role' | 'group';
  assignee_id?: string;
  due_days?: number; // Days to complete this step
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  created_at?: string;
  updated_at?: string;
}

export interface WorkflowAction {
  id?: string;
  name: string;
  action_type: 'approve' | 'reject' | 'request_changes' | 'assign' | 'notify';
  next_step_id?: string;
  auto_trigger?: boolean;
  conditions?: WorkflowCondition[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  logic?: 'and' | 'or';
}

export interface WorkflowInstance {
  id?: string;
  workflow_id: string;
  content_id: string;
  content_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  current_step_id?: string;
  steps: WorkflowInstanceStep[];
  initiated_by: string;
  started_at: string;
  completed_at?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowInstanceStep {
  id?: string;
  instance_id?: string;
  step_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'rejected';
  assignee_id?: string;
  assigned_at?: string;
  completed_at?: string;
  completed_by?: string;
  comments?: string;
  decision?: 'approve' | 'reject' | 'request_changes';
  due_date?: string;
}
