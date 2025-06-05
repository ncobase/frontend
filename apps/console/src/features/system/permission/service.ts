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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    }
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePermission,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['permission', variables.id] });
      }
    }
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ['permission', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    }
  });
};

// Role-Permission relationship hooks
export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      assignPermissionsToRole(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });
};

export const useRemovePermissionsFromRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      removePermissionsFromRole(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    }
  });
};

export const useBulkDeletePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeletePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    }
  });
};
