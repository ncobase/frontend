import { useCallback } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

// List sessions hook
export const useSessions = (params?: ListSessionsParams) => {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: () => sessionService.list(params),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Get specific session hook
export const useSession = (sessionId: string, enabled = true) => {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId),
    queryFn: () => sessionService.get(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 5 * 60 * 1000
  });
};

// Delete session hook
export const useDeleteSession = () => {
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
    onError: (error: Error) => {
      toast.error('Delete Failed', {
        description: error['message'] || 'Failed to delete session.'
      });
    }
  });
};

// Deactivate all sessions hook
export const useDeactivateAllSessions = () => {
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
    onError: (error: Error) => {
      toast.error('Deactivation Failed', {
        description: error['message'] || 'Failed to deactivate all sessions.'
      });
    }
  });
};

// Session management utilities hook
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
