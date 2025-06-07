import { ContentTemplate, TemplateInstance } from './template';

import { ApiContext, createApi } from '@/lib/api/factory';

const templateExtensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Apply template to content
  applyTemplate: async (templateId: string, contentId: string, contentType: string, data: any) => {
    return request.post(`${endpoint}/${templateId}/apply`, {
      content_id: contentId,
      content_type: contentType,
      data
    });
  },
  // Get templates by category
  getTemplatesByCategory: async (category: string, type?: string) => {
    let url = `${endpoint}?category=${category}`;
    if (type) url += `&type=${type}`;
    return request.get(url);
  },
  // Duplicate template
  duplicateTemplate: async (templateId: string, name: string) => {
    return request.post(`${endpoint}/${templateId}/duplicate`, { name });
  },
  // Export template
  exportTemplate: async (templateId: string) => {
    return request.get(`${endpoint}/${templateId}/export`);
  },
  // Import template
  importTemplate: async (templateData: any) => {
    return request.post(`${endpoint}/import`, templateData);
  },
  // Get popular templates
  getPopularTemplates: async (type?: string, limit: number = 10) => {
    let url = `${endpoint}/popular?limit=${limit}`;
    if (type) url += `&type=${type}`;
    return request.get(url);
  }
});

export const templateApi = createApi<ContentTemplate>('/cms/templates', {
  extensions: templateExtensionMethods
});

export const {
  create: createTemplate,
  get: getTemplate,
  update: updateTemplate,
  delete: deleteTemplate,
  list: getTemplates,
  applyTemplate,
  getTemplatesByCategory,
  duplicateTemplate,
  exportTemplate,
  importTemplate,
  getPopularTemplates
} = templateApi;

export const templateInstanceApi = createApi<TemplateInstance>('/cms/template-instances');

export const {
  create: createTemplateInstance,
  get: getTemplateInstance,
  update: updateTemplateInstance,
  list: getTemplateInstances
} = templateInstanceApi;
