import { Workflow, WorkflowInstance } from './workflow.d';

import { ApiContext, createApi } from '@/lib/api/factory';

const workflowExtensionMethods = ({ request, endpoint }: ApiContext) => ({
  startWorkflow: async (contentId: string, contentType: string, workflowId: string) => {
    return request.post(`${endpoint}/${workflowId}/start`, {
      content_id: contentId,
      content_type: contentType
    });
  },
  getWorkflowsForContentType: async (contentType: string) => {
    return request.get(`${endpoint}?content_type=${contentType}`);
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
    return request.post(`${endpoint}/${instanceId}/steps/${stepId}/complete`, {
      decision,
      comments
    });
  },
  getPendingTasks: async (userId: string) => {
    return request.get(`${endpoint}/pending?assignee=${userId}`);
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
