import { beforeEach, describe, expect, it, vi } from 'vitest';

import { addUserToSpaceRole, getUserSpaceRoles, removeUserFromSpaceRole } from './apis';

import { request } from '@/lib/api/request';

vi.mock('@ncobase/utils', () => ({
  buildQueryString: (params: Record<string, string>) => new URLSearchParams(params).toString()
}));

vi.mock('@/lib/api/request', () => ({
  request: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe('space APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects user role reads before building a URL when IDs are missing', async () => {
    await expect(getUserSpaceRoles(undefined as unknown as string, 'user-1')).rejects.toThrow(
      'Space ID is required'
    );
    await expect(getUserSpaceRoles('space-1', undefined as unknown as string)).rejects.toThrow(
      'User ID is required'
    );

    expect(request.get).not.toHaveBeenCalled();
  });

  it('rejects role mutations before building a URL when IDs are missing', async () => {
    await expect(
      addUserToSpaceRole('space-1', {
        user_id: undefined as unknown as string,
        role_id: 'role-1'
      })
    ).rejects.toThrow('User ID is required');
    await expect(
      removeUserFromSpaceRole('space-1', 'user-1', undefined as unknown as string)
    ).rejects.toThrow('Role ID is required');

    expect(request.post).not.toHaveBeenCalled();
    expect(request.delete).not.toHaveBeenCalled();
  });

  it('builds space role URLs and payloads from validated IDs', async () => {
    await getUserSpaceRoles('space-1', 'user-1');
    await addUserToSpaceRole('space-1', { user_id: 'user-1', role_id: 'role-1' });
    await removeUserFromSpaceRole('space-1', 'user-1', 'role-1');

    expect(request.get).toHaveBeenCalledWith('/sys/spaces/space-1/users/user-1/roles');
    expect(request.post).toHaveBeenCalledWith('/sys/spaces/space-1/users/roles', {
      user_id: 'user-1',
      role_id: 'role-1'
    });
    expect(request.delete).toHaveBeenCalledWith('/sys/spaces/space-1/users/user-1/roles/role-1');
  });
});
