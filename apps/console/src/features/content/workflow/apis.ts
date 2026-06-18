import { Workflow, WorkflowInstance } from './workflow.d';

import { ApiContext, createApi } from '@/lib/api/factory';
import { assertRequiredApiValue } from '@/lib/api/guards';

const workflowExtensionMethods = ({ request, endpoint }: ApiContext) => ({
  startWorkflow: async (contentId: string, contentType: string, workflowId: string) => {
    return request.post(`${endpoint}/${assertRequiredApiValue(workflowId, 'Workflow ID')}/start`, {
      content_id: assertRequiredApiValue(contentId, 'Content ID'),
      content_type: assertRequiredApiValue(contentType, 'Content type')
    });
  },
  getWorkflowsForContentType: async (contentType: string) => {
    const params = new URLSearchParams({
      content_type: assertRequiredApiValue(contentType, 'Content type')
    });
    return request.get(`${endpoint}?${params.toString()}`);
  }
});

export const workflowApi = createApi<Workflow>('/cms/workflows', {
  extensions: workflowExtensionMethods
});

export const {
  create: createWorkflow,
  get: getWorkflow,
  update: updateWorkflow,
  delete: deleteWorkflow,
  list: getWorkflows,
  startWorkflow,
  getWorkflowsForContentType
} = workflowApi;

const workflowInstanceExtensionMethods = ({ request, endpoint }: ApiContext) => ({
  completeStep: async (instanceId: string, stepId: string, decision: string, comments?: string) => {
    return request.post(
      `${endpoint}/${assertRequiredApiValue(instanceId, 'Workflow instance ID')}/steps/${assertRequiredApiValue(stepId, 'Workflow step ID')}/complete`,
      {
        decision: assertRequiredApiValue(decision, 'Workflow decision'),
        comments
      }
    );
  },
  getPendingTasks: async (userId: string) => {
    const params = new URLSearchParams({
      assignee: assertRequiredApiValue(userId, 'User ID')
    });
    return request.get(`${endpoint}/pending?${params.toString()}`);
  }
});
export const workflowInstanceApi = createApi<WorkflowInstance>('/cms/workflow-instances', {
  extensions: workflowInstanceExtensionMethods
});

export const {
  create: createWorkflowInstance,
  get: getWorkflowInstance,
  update: updateWorkflowInstance,
  delete: deleteWorkflowInstance,
  list: getWorkflowInstances,
  completeStep,
  getPendingTasks
} = workflowInstanceApi;
