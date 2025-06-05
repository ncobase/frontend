import { PaginationResult } from '@ncobase/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createOption,
  deleteOption,
  getOptions,
  getOption,
  updateOption,
  getByName,
  getByType,
  batchGetByNames,
  deleteByPrefix,
  exportOptions,
  validateValue
} from './apis';
import { QueryFormParams } from './config/query';
import { Option, OptionBody } from './option';

interface OptionKeys {
  create: ['optionService', 'create'];
  get: (_option?: { option?: string }) => ['optionService', 'option', { option?: string }];
  getByName: (_name?: string) => ['optionService', 'option', 'name', string];
  getByType: (_type?: string) => ['optionService', 'option', 'type', string];
  batch: (_names?: string[]) => ['optionService', 'batch', string];
  update: ['optionService', 'update'];
  list: (_option?: QueryFormParams) => ['optionService', 'option', QueryFormParams];
  export: ['optionService', 'export'];
}

export const optionKeys: OptionKeys = {
  create: ['optionService', 'create'],
  get: ({ option } = {}) => ['optionService', 'option', { option }],
  getByName: (name = '') => ['optionService', 'option', 'name', name],
  getByType: (type = '') => ['optionService', 'option', 'type', type],
  batch: (names = []) => ['optionService', 'batch', names.sort().join(',')],
  update: ['optionService', 'update'],
  list: (queryParams = {}) => ['optionService', 'option', queryParams],
  export: ['optionService', 'export']
};

// Query specific option by ID or name
export const useQueryOption = (option: string) =>
  useQuery({
    queryKey: optionKeys.get({ option }),
    queryFn: async () => {
      return await getOption(option);
    },
    enabled: !!option,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404s
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    }
  });

// Query option by name specifically
export const useQueryOptionByName = (name: string) =>
  useQuery({
    queryKey: optionKeys.getByName(name),
    queryFn: () => getByName(name),
    enabled: !!name,
    staleTime: 5 * 60 * 1000
  });

// Query option by type
export const useQueryOptionByType = (type: string) =>
  useQuery({
    queryKey: optionKeys.getByType(type),
    queryFn: () => getByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000
  });

// Batch get option by names
export const useBatchOption = (names: string[]) =>
  useQuery({
    queryKey: optionKeys.batch(names),
    queryFn: () => batchGetByNames(names),
    enabled: names.length > 0,
    staleTime: 5 * 60 * 1000
  });

// List option
export const useListOption = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: optionKeys.list(queryParams),
    queryFn: async (): Promise<PaginationResult<Option>> => {
      return await getOptions(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: previousData => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 400) return false;
      return failureCount < 2;
    }
  });
};

// Export options hook
export const useExportOptions = () => {
  return useQuery({
    queryKey: optionKeys.export,
    queryFn: () => exportOptions(),
    enabled: false, // Only run when manually triggered
    staleTime: 0 // Always fresh when triggered
  });
};

// Create option mutation
export const useCreateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OptionBody): Promise<Option> => {
      const optionWithDefaults: Omit<Option, 'id'> = {
        autoload: false,
        ...payload
      };
      return await createOption(optionWithDefaults);
    },
    onMutate: async newOption => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['optionService', 'option'] });

      // Snapshot the previous value
      const previousOptions = queryClient.getQueriesData({ queryKey: ['optionService', 'option'] });

      // Optimistically update the cache
      queryClient.setQueriesData(
        { queryKey: ['optionService', 'option'], type: 'active' },
        (old: any) => {
          if (old?.items) {
            const tempId = `temp-${Date.now()}`;
            const optimisticOption = {
              ...newOption,
              id: tempId,
              created_at: Date.now(),
              updated_at: Date.now()
            };
            return {
              ...old,
              items: [optimisticOption, ...old.items],
              total: old.total + 1
            };
          }
          return old;
        }
      );

      return { previousOptions };
    },
    onSuccess: (data, _variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['optionService', 'option'] });

      // Update specific queries
      queryClient.setQueryData(optionKeys.get({ option: data.id }), data);
      if (data.name) {
        queryClient.setQueryData(optionKeys.getByName(data.name), data);
      }
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousOptions) {
        context.previousOptions.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
      console.error('Failed to create option:', error);
    }
  });
};

// Update option mutation
export const useUpdateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Option> & { id: string }): Promise<Option> => {
      return await updateOption(payload as Option);
    },
    onMutate: async updatedOption => {
      await queryClient.cancelQueries({ queryKey: ['optionService', 'option'] });

      const previousOptions = queryClient.getQueriesData({ queryKey: ['optionService', 'option'] });

      // Update the specific option in all relevant queries
      queryClient.setQueriesData(
        { queryKey: ['optionService', 'option'], type: 'active' },
        (old: any) => {
          if (old?.items) {
            return {
              ...old,
              items: old.items.map((item: Option) =>
                item.id === updatedOption.id
                  ? { ...item, ...updatedOption, updated_at: Date.now() }
                  : item
              )
            };
          }
          return old;
        }
      );

      return { previousOptions };
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['optionService', 'option'] });

      // Update specific queries
      queryClient.setQueryData(optionKeys.get({ option: data.id }), data);
      if (data.name) {
        queryClient.setQueryData(optionKeys.getByName(data.name), data);
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousOptions) {
        context.previousOptions.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
      console.error('Failed to update option:', error);
    }
  });
};

// Delete option mutation
export const useDeleteOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await deleteOption(id);
    },
    onMutate: async deletedId => {
      await queryClient.cancelQueries({ queryKey: ['optionService', 'option'] });

      const previousOptions = queryClient.getQueriesData({ queryKey: ['optionService', 'option'] });

      // Remove the option from all relevant queries
      queryClient.setQueriesData(
        { queryKey: ['optionService', 'option'], type: 'active' },
        (old: any) => {
          if (old?.items) {
            return {
              ...old,
              items: old.items.filter((item: Option) => item.id !== deletedId),
              total: Math.max(0, old.total - 1)
            };
          }
          return old;
        }
      );

      return { previousOptions };
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: optionKeys.get({ option: deletedId })
      });
      queryClient.invalidateQueries({ queryKey: ['optionService', 'option'] });
    },
    onError: (error, variables, context) => {
      if (context?.previousOptions) {
        context.previousOptions.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
      console.error('Failed to delete option:', error);
    }
  });
};

// Delete option by prefix mutation
export const useDeleteOptionByPrefix = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prefix: string) => deleteByPrefix(prefix),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optionService', 'option'] });
    },
    onError: error => {
      console.error('Failed to delete options by prefix:', error);
    }
  });
};

// Validate option value mutation
export const useValidateOptionValue = () => {
  return useMutation({
    mutationFn: ({ type, value }: { type: string; value: string }) => validateValue(type, value),
    onError: error => {
      console.error('Failed to validate option value:', error);
    }
  });
};

// Custom hook for option management
export const useOptionManagement = () => {
  const queryClient = useQueryClient();

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['optionService'] });
  };

  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ['optionService'] });
  };

  const prefetchOption = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: optionKeys.get({ option: id }),
      queryFn: () => getOption(id),
      staleTime: 5 * 60 * 1000
    });
  };

  return {
    refreshAll,
    clearCache,
    prefetchOption
  };
};
