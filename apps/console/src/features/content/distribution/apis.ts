import { Distribution } from './distribution';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  publish: async (id: string) => {
    return request.post(`${endpoint}/${id}/publish`);
  },
  cancel: async (id: string, reason: string) => {
    return request.post(`${endpoint}/${id}/cancel`, { reason });
  }
});

export const distributionApi = createApi<Distribution>('/cms/distributions', {
  extensions: extensionMethods
});

export const {
  create: createDistribution,
  get: getDistribution,
  update: updateDistribution,
  delete: deleteDistribution,
  list: getDistributions,
  publish: publishDistribution,
  cancel: cancelDistribution
} = distributionApi;
