import { Distribution } from './distribution';

import { ApiContext, createApi } from '@/lib/api/factory';
import { assertRequiredApiValue } from '@/lib/api/guards';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  publish: async (id: string) => {
    return request.post(`${endpoint}/${assertRequiredApiValue(id, 'Distribution ID')}/publish`);
  },
  cancel: async (id: string, reason: string) => {
    return request.post(`${endpoint}/${assertRequiredApiValue(id, 'Distribution ID')}/cancel`, {
      reason: assertRequiredApiValue(reason, 'Cancellation reason')
    });
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
