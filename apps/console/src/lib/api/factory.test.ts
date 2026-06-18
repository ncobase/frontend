import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApi } from './factory';
import { request } from './request';

vi.mock('@ncobase/utils', () => ({
  buildQueryString: (params: Record<string, string>) => new URLSearchParams(params).toString()
}));

vi.mock('./request', () => ({
  request: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

interface TestEntity {
  id: string;
  name: string;
}

describe('createApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses default id based paths for standard CRUD operations', async () => {
    const api = createApi<TestEntity>('/items');

    await api.get('item-1');
    await api.update({ id: 'item-1', name: 'Updated' });
    await api.delete('item-1');

    expect(request.get).toHaveBeenCalledWith('/items/item-1');
    expect(request.put).toHaveBeenCalledWith('/items/item-1', { id: 'item-1', name: 'Updated' });
    expect(request.delete).toHaveBeenCalledWith('/items/item-1');
  });

  it('supports per-method path overrides without replacing the default implementation', async () => {
    const api = createApi<TestEntity>('/sys/menus', {
      paths: {
        update: '/sys/menus'
      }
    });

    await api.update({ id: 'menu-1', name: 'Settings' });

    expect(request.put).toHaveBeenCalledWith('/sys/menus', { id: 'menu-1', name: 'Settings' });
  });

  it('rejects default CRUD operations before issuing requests when IDs are missing', async () => {
    const api = createApi<TestEntity>('/items');

    await expect(api.get(undefined as unknown as string)).rejects.toThrow('ID is required');
    await expect(api.update({ name: 'Missing ID' } as TestEntity)).rejects.toThrow(
      'ID is required'
    );
    await expect(api.delete('')).rejects.toThrow('ID is required');

    expect(request.get).not.toHaveBeenCalled();
    expect(request.put).not.toHaveBeenCalled();
    expect(request.delete).not.toHaveBeenCalled();
  });
});
