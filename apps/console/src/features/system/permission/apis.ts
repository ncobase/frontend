import { Permission } from './permission';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({});

export const permissionApi = createApi<Permission>('/sys/permissions', {
  extensions: extensionMethods
});

export const createPermission = permissionApi.create;
export const getPermission = permissionApi.get;
export const updatePermission = permissionApi.update;
export const deletePermission = permissionApi.delete;
export const getPermissions = permissionApi.list;
