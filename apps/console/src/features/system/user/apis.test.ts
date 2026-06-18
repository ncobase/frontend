import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getUserSpaceRoles } from './apis';

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

describe('system user APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects user space role queries before building a URL when IDs are missing', async () => {
    await expect(getUserSpaceRoles(undefined as unknown as string, 'space-1')).rejects.toThrow(
      'User ID is required'
    );
    await expect(getUserSpaceRoles('user-1', undefined as unknown as string)).rejects.toThrow(
      'Space ID is required'
    );

    expect(request.get).not.toHaveBeenCalled();
  });

  it('builds the user space role URL from validated IDs', async () => {
    await getUserSpaceRoles('user-1', 'space-1');

    expect(request.get).toHaveBeenCalledWith('/sys/users/user-1/spaces/space-1/roles');
  });
});
