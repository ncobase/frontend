import { Permission } from './permission';

import { createApi } from '@/lib/api/factory';

export const permissionApi = createApi<Permission>('/iam/permissions');

export const createPermission = permissionApi.create;
export const getPermission = permissionApi.get;
export const updatePermission = permissionApi.update;
export const deletePermission = permissionApi.delete;
export const getPermissions = permissionApi.list;
