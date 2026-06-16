import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
  getPermissions,
  assignPermissionsToRole,
  removePermissionsFromRole,
  getRolePermissions,
  getPermissionsByAction,
  getPermissionsBySubject,
  getDefaultPermissions,
  bulkUpdatePermissions,
  bulkDeletePermissions
} from './apis';

import { propagateRbacChange } from '@/features/account/session_propagation';

// Permission CRUD hooks
export const useQueryPermission = (permissionId: string) =>
  useQuery({
    queryKey: ['permission', permissionId],
    queryFn: () => getPermission(permissionId),
    enabled: !!permissionId
  });

export const useListPermissions = (params: any) =>
  useQuery({
    queryKey: ['permissions', params],
    queryFn: () => getPermissions(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPermission,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      await propagateRbacChange(queryClient, { reason: 'permission-created' });
    }
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePermission,
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['permission', variables.id] });
      }
      await propagateRbacChange(queryClient, { reason: 'permission-updated' });
    }
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: async (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ['permission', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      await propagateRbacChange(queryClient, { reason: 'permission-deleted' });
    }
  });
};

// Role-Permission relationship hooks
export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      assignPermissionsToRole(roleId, permissionIds),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      await propagateRbacChange(queryClient, { reason: 'permission-assigned-to-role' });
    }
  });
};

export const useRemovePermissionsFromRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      removePermissionsFromRole(roleId, permissionIds),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      await propagateRbacChange(queryClient, { reason: 'permission-removed-from-role' });
    }
  });
};

export const useQueryRolePermissions = (roleId: string) =>
  useQuery({
    queryKey: ['rolePermissions', roleId],
    queryFn: () => getRolePermissions(roleId),
    enabled: !!roleId
  });

// Advanced permission queries
export const useQueryPermissionsByAction = (action: string) =>
  useQuery({
    queryKey: ['permissionsByAction', action],
    queryFn: () => getPermissionsByAction(action),
    enabled: !!action
  });

export const useQueryPermissionsBySubject = (subject: string) =>
  useQuery({
    queryKey: ['permissionsBySubject', subject],
    queryFn: () => getPermissionsBySubject(subject),
    enabled: !!subject
  });

export const useQueryDefaultPermissions = () =>
  useQuery({
    queryKey: ['defaultPermissions'],
    queryFn: getDefaultPermissions,
    staleTime: 10 * 60 * 1000
  });

// Bulk operations
export const useBulkUpdatePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkUpdatePermissions,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      await propagateRbacChange(queryClient, { reason: 'permissions-bulk-updated' });
    }
  });
};

export const useBulkDeletePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeletePermissions,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      await propagateRbacChange(queryClient, { reason: 'permissions-bulk-deleted' });
    }
  });
};
