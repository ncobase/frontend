import { createApi } from '@/apis/factory';
import { Role } from '@/types';

export const roleApi = createApi<Role>('/iam/roles');

export const createRole = roleApi.create;
export const getRole = roleApi.get;
export const updateRole = roleApi.update;
export const deleteRole = roleApi.delete;
export const getRoles = roleApi.list;
