import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  listResources,
  getResource,
  deleteResource,
  upload,
  updateResource,
  getQuota,
  getAdminStats,
  batchDelete,
  batchCleanup,
  getVersions,
  shareFile,
  updateAccess
} from './apis';
import { QueryFormParams } from './config/query';
import { ResourceFile } from './resource';

export const resourceKeys = {
  list: (params?: QueryFormParams) => ['resourceService', 'files', params],
  get: (id?: string) => ['resourceService', 'file', { id }],
  versions: (id?: string) => ['resourceService', 'versions', { id }],
  quota: () => ['resourceService', 'quota'],
  stats: () => ['resourceService', 'stats']
};

export const useListResources = (params: QueryFormParams) =>
  useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: () => listResources(params),
    staleTime: 5 * 60 * 1000
  });

export const useGetResource = (id: string) =>
  useQuery({
    queryKey: resourceKeys.get(id),
    queryFn: () => getResource(id),
    enabled: !!id
  });

export const useGetVersions = (id: string) =>
  useQuery({
    queryKey: resourceKeys.versions(id),
    queryFn: () => getVersions(id),
    enabled: !!id
  });

export const useGetQuota = () =>
  useQuery({
    queryKey: resourceKeys.quota(),
    queryFn: () => getQuota()
  });

export const useGetAdminStats = () =>
  useQuery({
    queryKey: resourceKeys.stats(),
    queryFn: () => getAdminStats()
  });

export const useUploadResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resourceService', 'files'] });
      queryClient.invalidateQueries({ queryKey: resourceKeys.quota() });
    }
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResourceFile) => updateResource(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resourceService', 'files'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: resourceKeys.get(variables.id) });
      }
    }
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: resourceKeys.get(deletedId) });
      queryClient.invalidateQueries({ queryKey: ['resourceService', 'files'] });
      queryClient.invalidateQueries({ queryKey: resourceKeys.quota() });
    }
  });
};

export const useShareFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; access_level: string; expires_at?: number }) =>
      shareFile(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resourceService', 'files'] });
    }
  });
};

export const useUpdateAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, access_level }: { id: string; access_level: string }) =>
      updateAccess(id, { access_level }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resourceService', 'files'] });
    }
  });
};

export const useBatchDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resourceService', 'files'] });
      queryClient.invalidateQueries({ queryKey: resourceKeys.quota() });
    }
  });
};

export const useBatchCleanup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { type: string; dry_run?: boolean }) => batchCleanup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resourceService'] });
    }
  });
};
