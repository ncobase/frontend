import { buildQueryString, isBrowser, locals } from '@ncobase/utils';

import type {
  AIActionDescriptor,
  AIActionRequest,
  AIActionResponse,
  AICompleteRequest,
  AICompleteResponse,
  AIEmbedRequest,
  AIEmbedResponse,
  AIModelsResponse,
  AIProviderHealth,
  AIProviderStatus,
  AIRun,
  AIRunListResponse,
  AIRunQuery,
  AIStatusResponse,
  AIStreamHandlers,
  AIUsageQuery,
  AIUsageSummary
} from './ai';

import { ACCESS_TOKEN_KEY, TENANT_KEY } from '@/features/account/context';
import { checkAndRefreshToken } from '@/features/account/token_service';
import { Request, request } from '@/lib/api/request';
import { BearerKey, XMdSpaceKey } from '@/lib/constants';

const cleanParams = <T extends Record<string, any> | undefined>(params?: T) => {
  if (!params) return undefined;

  const normalized: Record<string, any> = { ...params };
  if (normalized.page_size === undefined && normalized.limit !== undefined) {
    normalized.page_size = normalized.limit;
  }
  delete normalized.limit;

  Object.keys(normalized).forEach(key => {
    const value = normalized[key];
    if (value === undefined || value === null || value === '') {
      delete normalized[key];
    }
  });

  return normalized;
};

const getAIList = <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
  const normalized = cleanParams(params);
  const query = normalized ? buildQueryString(normalized) : '';
  return request.get(`${endpoint}${query ? `?${query}` : ''}`);
};

export const getAIStatus = (): Promise<AIStatusResponse> => request.get('/ai/status');

export const getAIProviders = (): Promise<AIProviderStatus[]> => request.get('/ai/providers');

export const getAIModels = (provider?: string): Promise<AIModelsResponse> =>
  getAIList('/ai/models', provider ? { provider } : undefined);

export const getAIActions = (): Promise<AIActionDescriptor[]> => request.get('/ai/actions');

export const getAIRuns = (params?: AIRunQuery): Promise<AIRunListResponse> =>
  getAIList('/ai/runs', params);

export const getAIRun = (id: string): Promise<AIRun> => request.get(`/ai/runs/${id}`);

export const getAIUsage = (params?: AIUsageQuery): Promise<AIUsageSummary> =>
  getAIList('/ai/usage', params);

export const getAIHealth = (): Promise<AIProviderHealth[]> => request.get('/ai/health');

export const completeAI = (payload: AICompleteRequest): Promise<AICompleteResponse> =>
  request.post('/ai/complete', payload);

export const embedAI = (payload: AIEmbedRequest): Promise<AIEmbedResponse> =>
  request.post('/ai/embed', payload);

export const runAIAction = (action: string, payload: AIActionRequest): Promise<AIActionResponse> =>
  request.post(`/ai/actions/${encodeURIComponent(action)}`, payload);

const nativeAPIURL = (path: string) => {
  const baseURL = String(Request.baseConfig.baseURL || '/api').replace(/\/$/, '');
  const timestamp = `_t=${Date.now()}`;
  return `${baseURL}${path}${path.includes('?') ? '&' : '?'}${timestamp}`;
};

const nativeHeaders = () => {
  const headers: Record<string, string> = {
    Accept: 'text/event-stream',
    'Content-Type': 'application/json;charset=utf-8'
  };

  const token = isBrowser && locals.get(ACCESS_TOKEN_KEY);
  const space = isBrowser && locals.get(TENANT_KEY);
  if (token) {
    headers.Authorization = `${BearerKey}${token}`;
  }
  if (token && space) {
    headers[XMdSpaceKey] = space;
  }
  return headers;
};

const parseSSEEvent = (raw: string) => {
  let event = 'message';
  const data: string[] = [];

  raw.split(/\r?\n/).forEach(line => {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
      return;
    }
    if (line.startsWith('data:')) {
      data.push(line.slice(5).trim());
    }
  });

  if (data.length === 0) return null;

  try {
    return { event, payload: JSON.parse(data.join('\n')) };
  } catch {
    return { event, payload: { error: data.join('\n') } };
  }
};

const dispatchSSEEvent = (
  raw: string,
  handlers: AIStreamHandlers,
  contentRef: { value: string }
) => {
  const parsed = parseSSEEvent(raw);
  if (!parsed) return;

  if (parsed.event === 'start') {
    handlers.onStart?.(parsed.payload);
    return;
  }

  if (parsed.event === 'chunk') {
    if (parsed.payload?.content) {
      contentRef.value += parsed.payload.content;
    }
    handlers.onChunk?.(parsed.payload);
    return;
  }

  if (parsed.event === 'run') {
    handlers.onRun?.(parsed.payload);
    return;
  }

  if (parsed.event === 'error') {
    handlers.onError?.(parsed.payload);
  }
};

export const streamAI = async (
  payload: AICompleteRequest,
  handlers: AIStreamHandlers = {}
): Promise<string> => {
  await checkAndRefreshToken();

  const response = await fetch(nativeAPIURL('/ai/stream'), {
    method: 'POST',
    headers: nativeHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include'
  });

  if (!response.ok) {
    let message = `AI stream failed with HTTP ${response.status}`;
    try {
      const errorPayload = await response.json();
      message = errorPayload?.message || message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw Object.assign(new Error(message), { status: response.status });
  }

  if (!response.body) {
    throw new Error('AI stream response body is unavailable');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const contentRef = { value: '' };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split(/\n\n/);
    buffer = events.pop() || '';

    events.forEach(event => dispatchSSEEvent(event, handlers, contentRef));
  }

  if (buffer.trim()) {
    dispatchSSEEvent(buffer, handlers, contentRef);
  }

  return contentRef.value;
};
