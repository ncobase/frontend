import { PaginationResult } from '@ncobase/react';

import { ListSessionsParams, Session } from './session';

import { request } from '@/lib/api/request';

// Session API endpoints
const sessionEndpoint = '/sessions';

export const sessionService = {
  // List user sessions
  list: async (params?: ListSessionsParams): Promise<PaginationResult<Session>> => {
    const queryParams = new URLSearchParams();
    if (params?.cursor) queryParams.append('cursor', params.cursor);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.direction) queryParams.append('direction', params.direction);
    if (params?.is_active !== undefined)
      queryParams.append('is_active', params.is_active.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${sessionEndpoint}?${queryString}` : sessionEndpoint;

    return request.get(url);
  },

  // Get specific session
  get: async (sessionId: string): Promise<Session> => {
    return request.get(`${sessionEndpoint}/${sessionId}`);
  },

  // Delete session (logout from device)
  delete: async (sessionId: string): Promise<void> => {
    return request.delete(`${sessionEndpoint}/${sessionId}`);
  },

  // Deactivate all sessions (logout from all devices)
  deactivateAll: async (): Promise<void> => {
    return request.post(`${sessionEndpoint}/deactivate-all`);
  }
};

export const {
  list: listSessions,
  get: getSession,
  delete: deleteSession,
  deactivateAll: deactivateAllSessions
} = sessionService;
