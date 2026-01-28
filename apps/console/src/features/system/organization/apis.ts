import { Org } from './org';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request: _request, endpoint: _endpoint }: ApiContext) => ({});

export const orgApi = createApi<Org>('/sys/orgs', {
  extensions: extensionMethods
});

export const createOrg = orgApi.create;
export const getOrg = orgApi.get;
export const updateOrg = orgApi.update;
export const deleteOrg = orgApi.delete;
export const getOrgs = orgApi.list;
