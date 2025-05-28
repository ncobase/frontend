import { useCallback } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

import { ListSessionsParams } from './session.d';
import { sessionService } from './session_service';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (params?: ListSessionsParams) => [...sessionKeys.lists(), params] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const
};

// Hook to list sessions
export const useSessions = (params?: ListSessionsParams) => {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: () => sessionService.list(params),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Hook to get specific session
export const useSession = (sessionId: string, enabled = true) => {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId),
    queryFn: () => sessionService.get(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 5 * 60 * 1000
  });
};

// Hook to delete session
export const useDeleteSession = (options?: Partial<UseMutationOptions<void, Error, string>>) => {
  const queryClient = useQueryClient();
  const toast = useToastMessage();

  return useMutation({
    mutationFn: sessionService.delete,
    onSuccess: (_, sessionId) => {
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });

      // Remove specific session from cache
      queryClient.removeQueries({ queryKey: sessionKeys.detail(sessionId) });

      toast.success('Session Deleted', {
        description: 'You have been logged out from that device.'
      });
    },
    onError: error => {
      toast.error('Delete Failed', {
        description: error.message || 'Failed to delete session.'
      });
    },
    ...options
  });
};

// Hook to deactivate all sessions
export const useDeactivateAllSessions = (
  options?: Partial<UseMutationOptions<void, Error, void>>
) => {
  const queryClient = useQueryClient();
  const toast = useToastMessage();

  return useMutation({
    mutationFn: sessionService.deactivateAll,
    onSuccess: () => {
      // Invalidate all session queries
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });

      toast.success('All Sessions Deactivated', {
        description: 'You have been logged out from all devices.'
      });
    },
    onError: error => {
      toast.error('Deactivation Failed', {
        description: error.message || 'Failed to deactivate all sessions.'
      });
    },
    ...options
  });
};

// Hook for session management utilities
export const useSessionPage = () => {
  const queryClient = useQueryClient();

  const refreshSessions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: sessionKeys.all });
  }, [queryClient]);

  const clearSessionCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: sessionKeys.all });
  }, [queryClient]);

  return {
    refreshSessions,
    clearSessionCache
  };
};
