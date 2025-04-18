import { Tag } from './tag';

import { createApi } from '@/lib/api/factory';

export const tagApi = createApi<Tag>('/cms/tags');

export const createTag = tagApi.create;
export const getTag = tagApi.get;
export const updateTag = tagApi.update;
export const deleteTag = tagApi.delete;
export const getTags = tagApi.list;

// Example of how to extend this API in the future:
//
// export const tagApiExtended = createApi<Tag, Tag, Tag, Tag, PaginationResult<Tag>>('/cms/tags', {
//   // Override the list implementation to add special filtering
//   list: async (params, { endpoint, request }) => {
//     const queryString = buildQueryString({
//       ...params,
//       // Add special filtering parameters
//       active: true
//     });
//     return request.get(`${endpoint}${queryString ? `?${queryString}` : ''}`);
//   },
//
//   // Add custom methods
//   extensions: ({ endpoint, request }) => ({
//     // Get tags by category
//     getTagsByCategory: async (categoryId: string): Promise<PaginationResult<Tag>> => {
//       return request.get(`${endpoint}/category/${categoryId}`);
//     },
//
//     // Bulk tag operations
//     bulkCreate: async (tags: Omit<Tag, 'id'>[]): Promise<Tag[]> => {
//       return request.post(`${endpoint}/bulk`, { tags });
//     }
//   })
// });
