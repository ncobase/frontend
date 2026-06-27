import { ExplicitAny } from '@ncobase/types';
import { isBrowser, locals } from '@ncobase/utils';
import { $Fetch, $fetch, FetchError, FetchOptions } from 'ofetch';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, TENANT_KEY } from '@/features/account/context';
import { checkAndRefreshToken } from '@/features/account/token_service';
import { BearerKey, XMdSpaceKey } from '@/lib/constants';
import { eventEmitter } from '@/lib/events';
import { isPublicRoute } from '@/router/helpers/utils';

type RequestOptions = FetchOptions & {
  timestamp?: boolean;
  dedupe?: boolean;
  skipRedirect?: boolean;
  skipGlobalError?: boolean;
};

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
  private pendingRedirects = new Map<string, ReturnType<typeof setTimeout>>();

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
    const space = isBrowser && locals.get(TENANT_KEY);

    return {
      ...this.defaultHeaders,
      ...(token && space && { [XMdSpaceKey]: space }),
      ...(token && { Authorization: `${BearerKey}${token}` })
    };
  }

  private mergeHeaders(headers?: FetchOptions['headers']) {
    const merged: Record<string, string | undefined> = { ...this.getHeaders() };

    if (!headers) return merged;

    if (typeof Headers !== 'undefined' && headers instanceof Headers) {
      headers.forEach((value, key) => {
        merged[key] = value;
      });
      return merged;
    }

    if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        merged[key] = value;
      });
      return merged;
    }

    return {
      ...merged,
      ...(headers as Record<string, string | undefined>)
    };
  }

  private removeJsonContentType(headers: Record<string, string | undefined>) {
    Object.keys(headers).forEach(key => {
      if (key.toLowerCase() !== 'content-type') return;
      const value = headers[key];
      if (!value || value.toLowerCase().includes('application/json')) {
        delete headers[key];
      }
    });
  }

  private isFormDataBody(data: ExplicitAny): data is FormData {
    return typeof FormData !== 'undefined' && data instanceof FormData;
  }

  private isUrlSearchParamsBody(data: ExplicitAny): data is URLSearchParams {
    return typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams;
  }

  private isBlobBody(data: ExplicitAny): data is Blob {
    return typeof Blob !== 'undefined' && data instanceof Blob;
  }

  private isArrayBufferBody(data: ExplicitAny): data is ArrayBuffer {
    return typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer;
  }

  private isBinaryViewBody(data: ExplicitAny): data is ArrayBufferView {
    return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(data);
  }

  private prepareBody(data: ExplicitAny, headers: Record<string, string | undefined>) {
    if (
      this.isFormDataBody(data) ||
      this.isUrlSearchParamsBody(data) ||
      this.isBlobBody(data) ||
      this.isArrayBufferBody(data) ||
      this.isBinaryViewBody(data)
    ) {
      this.removeJsonContentType(headers);
      return data;
    }

    return JSON.stringify(data);
  }

  private stableStringify(value: ExplicitAny): string {
    if (value === undefined) return '';
    if (value === null || typeof value !== 'object') return String(value);

    if (this.isFormDataBody(value)) {
      return Array.from(value.entries())
        .map(([key, entry]) => {
          const isFile = typeof File !== 'undefined' && entry instanceof File;
          return `${key}:${isFile ? entry.name : String(entry)}`;
        })
        .sort()
        .join('&');
    }

    if (this.isUrlSearchParamsBody(value)) return value.toString();
    if (this.isBlobBody(value)) return `blob:${value.type}:${value.size}`;
    if (this.isArrayBufferBody(value)) return `array-buffer:${value.byteLength}`;
    if (this.isBinaryViewBody(value)) return `array-buffer-view:${value.byteLength}`;

    if (Array.isArray(value)) {
      return `[${value.map(item => this.stableStringify(item)).join(',')}]`;
    }

    return `{${Object.keys(value)
      .sort()
      .map(key => `${key}:${this.stableStringify(value[key])}`)
      .join(',')}}`;
  }

  private shouldDeduplicate(method: string, options?: RequestOptions): boolean {
    if (options?.dedupe !== undefined) return options.dedupe;
    return ['GET', 'HEAD'].includes(method.toUpperCase());
  }

  private getRequestKey(
    method: string,
    url: string,
    data?: ExplicitAny,
    options?: RequestOptions
  ): string {
    const parts = [method.toUpperCase(), url];
    const params = (options as ExplicitAny)?.params || (options as ExplicitAny)?.query;

    if (params) {
      parts.push(`params:${this.stableStringify(params)}`);
    }

    if (!['GET', 'HEAD'].includes(method.toUpperCase()) && data !== undefined) {
      parts.push(`body:${this.stableStringify(data)}`);
    }

    return parts.join(':');
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

  private handleError(
    error: any,
    method: string,
    url: string,
    skipRedirect = false,
    skipGlobalError = false
  ): never {
    const endpoint = this.getEndpointKey(url);
    let status: number | undefined;
    let message = 'Request failed';
    let data: any = null;

    // Parse error details
    if (error instanceof FetchError) {
      status = error.status;
      data = error.data || error['_data'];
      message = data?.message || error['message'] || message;
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
      message = error['message'];
    }

    console.error(`[${method} ${url}] ${status || 'NETWORK'}: ${message}`);

    // Record failures for circuit breaker
    if (status && status >= 500) {
      CircuitBreaker.recordFailure(endpoint);
    }

    // Handle redirects (skip auth endpoints)
    let handledByRequest = false;
    if (!skipRedirect && !this.isAuthEndpoint(url)) {
      handledByRequest = this.handleRedirects(status, message);
    }

    // Emit events after local session cleanup so auth state listeners see the latest storage state.
    if (!skipGlobalError) {
      this.emitEvents(status, message, endpoint, data);
    }

    // Create an enhanced error without mutating Response or FetchError instances with readonly fields.
    const enhancedError = new Error(message);
    enhancedError.name = error?.name || 'RequestError';
    if (error instanceof Error && error.stack) {
      enhancedError.stack = error.stack;
    }
    Object.assign(enhancedError, {
      originalError: error,
      status,
      message,
      endpoint,
      method,
      data,
      handledByRequest,
      timestamp: Date.now()
    });

    throw enhancedError;
  }

  private emitEvents(
    status: number | undefined,
    message: string,
    endpoint: string,
    data: any
  ): void {
    const shouldEmit = EventThrottler.shouldEmit.bind(EventThrottler);

    if (status === 401) {
      eventEmitter.emit('unauthorized', { message, url: endpoint, data });
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

  private clearAuthenticationState(): void {
    locals.remove(ACCESS_TOKEN_KEY);
    locals.remove(REFRESH_TOKEN_KEY);
    locals.remove(TENANT_KEY);
  }

  private handleRedirects(status: number | undefined, _message?: string): boolean {
    if (!isBrowser) return false;

    const redirectToError = (errorPath: string, delay = 100) => {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath === errorPath) return false;
      if (errorPath.startsWith('/error/') && window.location.pathname.startsWith('/error/')) {
        return false;
      }

      const existingTimer = this.pendingRedirects.get(errorPath);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        this.pendingRedirects.delete(errorPath);
        try {
          const latestPath = window.location.pathname + window.location.search;
          if (latestPath === errorPath) return;
          if (errorPath.startsWith('/error/') && window.location.pathname.startsWith('/error/')) {
            return;
          }

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

      this.pendingRedirects.set(errorPath, timer);
      return true;
    };

    // Handle different error types
    switch (status) {
      case 401:
        // Clear local credentials and let AuthProvider/Guard perform a single React navigation.
        this.clearAuthenticationState();
        return !isPublicRoute(window.location.pathname);

      case 403:
        // Delayed redirect for forbidden
        return redirectToError('/error/403', 1500);

      case 404:
        // Delayed redirect for not found
        return redirectToError('/error/404', 1500);

      case undefined: // Network error
        // Delayed redirect for network issues
        return redirectToError('/error/network', 2000);

      default:
        if (status && status >= 500) {
          // Delayed redirect for server errors
          return redirectToError('/error/500', 2000);
        }
        return false;
    }
  }

  private async executeRequest(
    method: string,
    url: string,
    data?: ExplicitAny,
    options?: RequestOptions
  ): Promise<ExplicitAny> {
    const {
      timestamp,
      dedupe: _dedupe,
      skipRedirect,
      skipGlobalError,
      headers: optionHeaders,
      ...optionOverrides
    } = options || {};
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
    const headers = this.mergeHeaders(optionHeaders);
    let finalUrl = url;

    if (timestamp !== false) {
      finalUrl += (url.includes('?') ? '&' : '?') + `_t=${Date.now()}`;
    }

    const bodySource =
      data !== undefined
        ? data
        : (optionOverrides as ExplicitAny).body !== undefined
          ? (optionOverrides as ExplicitAny).body
          : undefined;
    const hasBody = bodySource !== undefined;

    if (hasBody) {
      delete (optionOverrides as ExplicitAny).body;
    }

    const fetchOptions: FetchOptions = {
      ...Request.baseConfig,
      ...optionOverrides,
      method,
      headers,
      ...(hasBody && { body: this.prepareBody(bodySource, headers) })
    };

    try {
      const response = await this.$fetch(finalUrl, fetchOptions);
      CircuitBreaker.clearFailures(endpoint);
      return response;
    } catch (error) {
      this.handleError(error, method, finalUrl, skipRedirect, skipGlobalError);
    }
  }

  protected async request(
    method: string,
    url: string,
    data?: ExplicitAny,
    options?: RequestOptions
  ): Promise<ExplicitAny> {
    if (!this.shouldDeduplicate(method, options)) {
      return this.executeRequest(method, url, data, options);
    }

    const requestKey = this.getRequestKey(method, url, data, options);

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
  public get(url: string, options?: RequestOptions) {
    return this.request('GET', url, undefined, options);
  }

  public post(url: string, data?: ExplicitAny, options?: RequestOptions) {
    return this.request('POST', url, data, options);
  }

  public put(url: string, data?: ExplicitAny, options?: RequestOptions) {
    return this.request('PUT', url, data, options);
  }

  public patch(url: string, data?: ExplicitAny, options?: RequestOptions) {
    return this.request('PATCH', url, data, options);
  }

  public delete(url: string, options?: RequestOptions) {
    return this.request('DELETE', url, undefined, options);
  }

  // Utilities
  public clearState(): void {
    CircuitBreaker.clearFailures();
    this.pendingRequests.clear();
    this.pendingRedirects.forEach(timer => clearTimeout(timer));
    this.pendingRedirects.clear();
  }
}

export const request = new Request($fetch);
