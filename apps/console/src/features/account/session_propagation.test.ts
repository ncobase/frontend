import type { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Permission } from './permissions/service';
import {
  propagateRbacChange,
  queryKeyMatchesSessionPrefix,
  refreshSessionForCurrentSpace
} from './session_propagation';
import { refreshAccessToken } from './token_service';

import { request } from '@/lib/api/request';
import { eventEmitter } from '@/lib/events';

vi.mock('./permissions/service', () => ({
  Permission: {
    refreshState: vi.fn(),
    clearAccountData: vi.fn()
  }
}));

vi.mock('@/lib/api/request', () => ({
  request: {
    clearState: vi.fn()
  }
}));

vi.mock('@/lib/events', () => ({
  eventEmitter: {
    emit: vi.fn()
  }
}));

vi.mock('./token_service', () => ({
  refreshAccessToken: vi.fn()
}));

const createQueryClientMock = () => ({
  cancelQueries: vi.fn().mockResolvedValue(undefined),
  removeQueries: vi.fn(),
  invalidateQueries: vi.fn().mockResolvedValue(undefined),
  refetchQueries: vi.fn().mockResolvedValue(undefined)
});

describe('session propagation query scopes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('classifies identity-sensitive query keys', () => {
    expect(queryKeyMatchesSessionPrefix(['accountService', 'currentUser'], 'identity')).toBe(true);
    expect(queryKeyMatchesSessionPrefix(['menuService', 'navigation', {}], 'identity')).toBe(true);
    expect(queryKeyMatchesSessionPrefix(['rolePermissions', 'role-1'], 'identity')).toBe(true);
    expect(queryKeyMatchesSessionPrefix(['permission', 'perm-1'], 'identity')).toBe(true);
  });

  it('classifies space-scoped product query keys', () => {
    expect(queryKeyMatchesSessionPrefix(['resourceService', 'files', {}], 'space')).toBe(true);
    expect(queryKeyMatchesSessionPrefix(['mediaService', 'media-list', {}], 'space')).toBe(true);
    expect(queryKeyMatchesSessionPrefix(['topicService', 'topics', {}], 'space')).toBe(true);
    expect(queryKeyMatchesSessionPrefix(['paymentService', 'orders', {}], 'space')).toBe(true);
    expect(queryKeyMatchesSessionPrefix(['realtimeNotificationService', 'list', {}], 'space')).toBe(
      true
    );
  });

  it('does not match unrelated local UI state keys', () => {
    expect(queryKeyMatchesSessionPrefix(['builderPreview', 'draft'], 'space')).toBe(false);
    expect(queryKeyMatchesSessionPrefix(['theme', 'preferences'], 'identity')).toBe(false);
  });

  it('refreshes tokens and active identity state for the current space', async () => {
    const queryClient = createQueryClientMock();
    const updateTokens = vi.fn();
    vi.mocked(refreshAccessToken).mockResolvedValue({
      access_token: 'access-token',
      refresh_token: 'refresh-token'
    });

    const tokens = await refreshSessionForCurrentSpace(
      queryClient as unknown as QueryClient,
      updateTokens
    );

    expect(tokens).toEqual({ access_token: 'access-token', refresh_token: 'refresh-token' });
    expect(updateTokens).toHaveBeenCalledWith('access-token', 'refresh-token');
    expect(Permission.refreshState).toHaveBeenCalled();
    expect(request.clearState).toHaveBeenCalled();
    expect(queryClient.cancelQueries).toHaveBeenCalledWith(
      { predicate: expect.any(Function) },
      { silent: true }
    );
    expect(queryClient.removeQueries).toHaveBeenCalledWith({
      predicate: expect.any(Function),
      type: 'inactive'
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      predicate: expect.any(Function),
      refetchType: 'active'
    });
    expect(queryClient.refetchQueries).toHaveBeenCalledWith({
      queryKey: ['accountService'],
      type: 'active'
    });
    expect(queryClient.refetchQueries).toHaveBeenCalledWith({
      queryKey: ['menuService', 'navigation'],
      type: 'active'
    });

    const [{ predicate }] = queryClient.cancelQueries.mock.calls[0];
    expect(predicate({ queryKey: ['resourceService', 'files', {}] })).toBe(true);
    expect(predicate({ queryKey: ['builderPreview', 'draft'] })).toBe(false);
  });

  it('emits RBAC propagation and invalidates affected identity records', async () => {
    const queryClient = createQueryClientMock();

    await propagateRbacChange(queryClient as unknown as QueryClient, {
      reason: 'role-users-assigned',
      affectedUserIds: ['user-1'],
      affectedSpaceIds: ['space-1']
    });

    expect(Permission.refreshState).toHaveBeenCalled();
    expect(request.clearState).toHaveBeenCalled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['accountService'],
      refetchType: 'active'
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['userService', 'userRoles', { user: 'user-1' }]
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['spaceService', 'spaceUsers', { spaceId: 'space-1' }]
    });
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'rbac-change',
      expect.objectContaining({
        reason: 'role-users-assigned',
        affectedUserIds: ['user-1'],
        affectedSpaceIds: ['space-1']
      })
    );
  });
});
