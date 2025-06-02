import { ExplicitAny } from '@ncobase/types';
import { isBrowser, locals } from '@ncobase/utils';
import { $Fetch, $fetch, FetchError, FetchOptions } from 'ofetch';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, TENANT_KEY } from '@/features/account/context';
import { checkAndRefreshToken } from '@/features/account/token_service';
import { BearerKey, XMdTenantKey } from '@/lib/constants';
import { eventEmitter } from '@/lib/events';
import { isPublicRoute } from '@/router/helpers/utils';

// Circuit breaker for failed endpoints
class CircuitBreaker {
  private static failures = new Map<
    string,
    { count: number; blocked: boolean; lastFail: number }
  >();
  private static readonly MAX_FAILURES = 3;
  private static readonly BLOCK_TIME = 30000; // 30s

  static canRequest(endpoint: string): boolean {
    const state = this.failures.get(endpoint);
    if (!state) return true;

    if (state.blocked && Date.now() - state.lastFail > this.BLOCK_TIME) {
      state.blocked = false;
      state.count = 0;
    }

    return !state.blocked;
  }

  static recordFailure(endpoint: string): void {
    const state = this.failures.get(endpoint) || { count: 0, blocked: false, lastFail: 0 };
    state.count++;
    state.lastFail = Date.now();

    if (state.count >= this.MAX_FAILURES) {
      state.blocked = true;
    }

    this.failures.set(endpoint, state);
  }

  static clearFailures(endpoint?: string): void {
    if (endpoint) {
      this.failures.delete(endpoint);
    } else {
      this.failures.clear();
    }
  }
}

// Event throttling to prevent event storms
class EventThrottler {
  private static events = new Map<string, number>();
  private static readonly THROTTLE_TIME = 2000; // 2s

  static shouldEmit(eventType: string): boolean {
    const now = Date.now();
    const lastEmit = this.events.get(eventType);

    if (!lastEmit || now - lastEmit > this.THROTTLE_TIME) {
      this.events.set(eventType, now);
      return true;
    }

    return false;
  }
}

export class Request {
  private readonly $fetch: $Fetch;
  private readonly defaultHeaders: Record<string, string | undefined>;
  private pendingRequests = new Map<string, Promise<any>>();
  private isRefreshingToken = false;

  static baseConfig: FetchOptions = {
    baseURL:
      import.meta.env.VITE_API_PROXY &&
      (import.meta.env.VITE_API_PROXY === 'true' || import.meta.env.VITE_API_PROXY === '1')
        ? '/api'
        : import.meta.env.VITE_API_URL || '/api',
    timeout: 30000,
    retry: false,
    credentials: 'include'
  };

  constructor(fetcher: $Fetch, defaultHeaders: Record<string, string | undefined> = {}) {
    this.$fetch = fetcher;
    this.defaultHeaders = {
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json;charset=utf-8',
      ...defaultHeaders
    };
  }

  private getHeaders() {
    const token = isBrowser && locals.get(ACCESS_TOKEN_KEY);
    const tenant = isBrowser && locals.get(TENANT_KEY);

    return {
      ...this.defaultHeaders,
      ...(token && tenant && { [XMdTenantKey]: tenant }),
      ...(token && { Authorization: `${BearerKey}${token}` })
    };
  }

  private getEndpointKey(url: string): string {
    return url.split('?')[0];
  }

  private isAuthEndpoint(url: string): boolean {
    return (
      url.includes('/login') ||
      url.includes('/refresh-token') ||
      url.includes('/register') ||
      url.includes('/logout')
    );
  }

  private handleError(error: any, method: string, url: string): never {
    const endpoint = this.getEndpointKey(url);
    let status: number | undefined;
    let message = 'Request failed';
    let data: any = null;

    // Parse error details
    if (error instanceof FetchError) {
      status = error.status;
      data = error.data || error['_data'];
      message = data?.message || error.message || message;
    } else if (error instanceof Response) {
      status = error.status;
      try {
        data = error.json?.();
        message = data?.message || message;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e) {
        // Ignore parse errors
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    console.error(`[${method} ${url}] ${status || 'NETWORK'}: ${message}`);

    // Record failures for circuit breaker
    if (status && status >= 500) {
      CircuitBreaker.recordFailure(endpoint);
    }

    // Create enhanced error object
    const enhancedError = Object.assign(error, {
      status,
      message,
      endpoint,
      method,
      data,
      timestamp: Date.now()
    });

    // Emit events for error handling
    this.emitEvents(status, message, endpoint, data);

    // Handle redirects (skip auth endpoints)
    if (!this.isAuthEndpoint(url)) {
      this.handleRedirects(status, message);
    }

    throw enhancedError;
  }

  private emitEvents(
    status: number | undefined,
    message: string,
    endpoint: string,
    data: any
  ): void {
    const shouldEmit = EventThrottler.shouldEmit.bind(EventThrottler);

    if (status === 401 && shouldEmit('unauthorized')) {
      eventEmitter.emit('unauthorized', message);
    } else if (status === 403 && shouldEmit('forbidden')) {
      eventEmitter.emit('forbidden', { url: endpoint, message, data });
    } else if (status === 404 && shouldEmit('not-found')) {
      eventEmitter.emit('not-found', { url: endpoint, message });
    } else if (status === 422 && shouldEmit('validation-error')) {
      eventEmitter.emit('validation-error', data?.errors || {});
    } else if (status && status >= 500 && shouldEmit('server-error')) {
      eventEmitter.emit('server-error', { status, message, url: endpoint });
    } else if (!status && shouldEmit('network-error')) {
      eventEmitter.emit('network-error', { url: endpoint, message });
    }
  }

  private handleRedirects(status: number | undefined, _message?: string): void {
    if (!isBrowser) return;

    const redirectToError = (errorPath: string, delay = 100) => {
      if (window.location.pathname.startsWith('/error/')) return; // Already on error page

      setTimeout(() => {
        try {
          // Use history API for SPA navigation
          if (window.history?.pushState) {
            window.history.pushState(null, '', errorPath);
            window.dispatchEvent(new PopStateEvent('popstate'));
          } else {
            window.location.href = errorPath;
          }
        } catch (e) {
          console.warn('Navigation failed:', e);
          window.location.href = errorPath;
        }
      }, delay);
    };

    // Handle different error types
    switch (status) {
      case 401:
        // Clear tokens and redirect to login for protected routes
        locals.remove(ACCESS_TOKEN_KEY);
        locals.remove(REFRESH_TOKEN_KEY);

        if (!isPublicRoute(window.location.pathname)) {
          const currentPath = window.location.pathname + window.location.search;
          const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
          redirectToError(loginUrl, 100);
        }
        break;

      case 403:
        // Delayed redirect for forbidden
        setTimeout(() => redirectToError('/error/403'), 1500);
        break;

      case 404:
        // Delayed redirect for not found
        setTimeout(() => redirectToError('/error/404'), 1500);
        break;

      case undefined: // Network error
        // Delayed redirect for network issues
        setTimeout(() => redirectToError('/error/network'), 2000);
        break;

      default:
        if (status && status >= 500) {
          // Delayed redirect for server errors
          setTimeout(() => redirectToError('/error/500'), 2000);
        }
        break;
    }
  }

  private async executeRequest(
    method: string,
    url: string,
    data?: ExplicitAny,
    options?: FetchOptions & { timestamp?: boolean }
  ): Promise<ExplicitAny> {
    const endpoint = this.getEndpointKey(url);

    // Circuit breaker check
    if (!CircuitBreaker.canRequest(endpoint)) {
      throw new Error(`Endpoint ${endpoint} temporarily blocked`);
    }

    // Token refresh for protected endpoints
    if (!this.isAuthEndpoint(url) && !this.isRefreshingToken) {
      this.isRefreshingToken = true;
      try {
        await checkAndRefreshToken();
      } catch (e) {
        console.warn('Token refresh failed:', e);
      } finally {
        this.isRefreshingToken = false;
      }
    }

    // Prepare request
    const headers = this.getHeaders();
    let finalUrl = url;

    if (options?.timestamp !== false) {
      finalUrl += (url.includes('?') ? '&' : '?') + `_t=${Date.now()}`;
    }

    const fetchOptions: FetchOptions = {
      ...Request.baseConfig,
      method,
      headers,
      ...(data && { body: JSON.stringify(data) }),
      ...options
    };

    try {
      const response = await this.$fetch(finalUrl, fetchOptions);
      CircuitBreaker.clearFailures(endpoint);
      return response;
    } catch (error) {
      this.handleError(error, method, finalUrl);
    }
  }

  protected async request(
    method: string,
    url: string,
    data?: ExplicitAny,
    options?: FetchOptions & { timestamp?: boolean }
  ): Promise<ExplicitAny> {
    const requestKey = `${method}:${this.getEndpointKey(url)}`;

    // Deduplicate concurrent requests
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey)!;
    }

    const promise = this.executeRequest(method, url, data, options).finally(() =>
      this.pendingRequests.delete(requestKey)
    );

    this.pendingRequests.set(requestKey, promise);
    return promise;
  }

  // HTTP methods
  public get(url: string, options?: FetchOptions & { timestamp?: boolean }) {
    return this.request('GET', url, undefined, options);
  }

  public post(url: string, data?: ExplicitAny, options?: FetchOptions & { timestamp?: boolean }) {
    return this.request('POST', url, data, options);
  }

  public put(url: string, data?: ExplicitAny, options?: FetchOptions & { timestamp?: boolean }) {
    return this.request('PUT', url, data, options);
  }

  public patch(url: string, data?: ExplicitAny, options?: FetchOptions & { timestamp?: boolean }) {
    return this.request('PATCH', url, data, options);
  }

  public delete(url: string, options?: FetchOptions & { timestamp?: boolean }) {
    return this.request('DELETE', url, undefined, options);
  }

  // Utilities
  public clearState(): void {
    CircuitBreaker.clearFailures();
    this.pendingRequests.clear();
  }
}

export const request = new Request($fetch);
