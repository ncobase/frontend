import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Request } from './request';

vi.mock('@ncobase/utils', () => ({
  isBrowser: false,
  locals: {
    get: vi.fn(),
    remove: vi.fn()
  }
}));

vi.mock('@/features/account/context', () => ({
  ACCESS_TOKEN_KEY: 'access-token',
  REFRESH_TOKEN_KEY: 'refresh-token',
  TENANT_KEY: 'space-id'
}));

vi.mock('@/features/account/token_service', () => ({
  checkAndRefreshToken: vi.fn()
}));

vi.mock('@/lib/constants', () => ({
  BearerKey: 'Bearer ',
  XMdSpaceKey: 'x-md-sid'
}));

vi.mock('@/lib/events', () => ({
  eventEmitter: {
    emit: vi.fn()
  }
}));

vi.mock('@/router/helpers/utils', () => ({
  isPublicRoute: vi.fn(() => false)
}));

describe('Request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createFetcher = () => vi.fn(async (_url: string, _options: any) => ({ ok: true }));

  it('sends FormData without JSON serialization or JSON content type', async () => {
    const fetcher = createFetcher();
    const client = new Request(fetcher as any);
    const data = new FormData();
    data.append('file', new Blob(['hello'], { type: 'text/plain' }), 'hello.txt');

    await client.post('/res', data, { timestamp: false });

    const [, options] = fetcher.mock.calls[0];
    expect(options.body).toBe(data);
    expect(options.headers['Content-Type']).toBeUndefined();
  });

  it('preserves JSON serialization for plain object payloads', async () => {
    const fetcher = createFetcher();
    const client = new Request(fetcher as any);

    await client.post('/items', { name: 'one' }, { timestamp: false });

    const [, options] = fetcher.mock.calls[0];
    expect(options.body).toBe(JSON.stringify({ name: 'one' }));
    expect(options.headers['Content-Type']).toBe('application/json;charset=utf-8');
  });

  it('deduplicates identical GET requests but keeps distinct query requests separate', async () => {
    const fetcher = createFetcher();
    const client = new Request(fetcher as any);

    await Promise.all([
      client.get('/items?page=1', { timestamp: false }),
      client.get('/items?page=1', { timestamp: false })
    ]);
    expect(fetcher).toHaveBeenCalledTimes(1);

    await Promise.all([
      client.get('/items?page=1', { timestamp: false }),
      client.get('/items?page=2', { timestamp: false })
    ]);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it('does not deduplicate write requests by default', async () => {
    const fetcher = createFetcher();
    const client = new Request(fetcher as any);

    await Promise.all([
      client.post('/items', { name: 'one' }, { timestamp: false }),
      client.post('/items', { name: 'one' }, { timestamp: false })
    ]);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
