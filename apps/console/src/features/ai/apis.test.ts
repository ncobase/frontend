import { beforeEach, describe, expect, it, vi } from 'vitest';

import { completeAI, getAIRuns, runAIAction } from './apis';

import { request } from '@/lib/api/request';

vi.mock('@ncobase/utils', () => ({
  buildQueryString: (params: Record<string, string>) => new URLSearchParams(params).toString(),
  isBrowser: false,
  locals: {
    get: vi.fn()
  }
}));

vi.mock('@/features/account/token_service', () => ({
  checkAndRefreshToken: vi.fn()
}));

vi.mock('@/lib/api/request', () => ({
  Request: {
    baseConfig: {
      baseURL: '/api'
    }
  },
  request: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('AI APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('normalizes run list params for backend paging', async () => {
    await getAIRuns({
      limit: 50,
      action: 'content.summary',
      provider: '',
      model: undefined,
      status: null as any
    });

    expect(request.get).toHaveBeenCalledWith('/ai/runs?action=content.summary&page_size=50');
  });

  it('posts completion requests to the AI gateway', async () => {
    const payload = {
      prompt: 'Summarize this text',
      model: 'openai/gpt-4o-mini',
      max_output_tokens: 256
    };

    await completeAI(payload);

    expect(request.post).toHaveBeenCalledWith('/ai/complete', payload);
  });

  it('encodes action keys when running governed AI actions', async () => {
    const payload = {
      content: 'Draft content',
      instruction: 'Create a concise title'
    };

    await runAIAction('content.title', payload);

    expect(request.post).toHaveBeenCalledWith('/ai/actions/content.title', payload);
  });
});
