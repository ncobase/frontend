import { createApi } from '@/apis/factory';
import { Permission } from '@/types';

export const permissionApi = createApi<Permission>('/iam/permissions');

export const createPermission = permissionApi.create;
export const getPermission = permissionApi.get;
export const updatePermission = permissionApi.update;
export const deletePermission = permissionApi.delete;
export const getPermissions = permissionApi.list;
