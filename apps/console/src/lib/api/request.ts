import { ExplicitAny } from '@ncobase/types';
import { isBrowser, locals } from '@ncobase/utils';
import { $Fetch, $fetch, FetchError, FetchOptions } from 'ofetch';

import { ACCESS_TOKEN_KEY, TENANT_KEY } from '@/features/account/context';
import { checkAndRefreshToken } from '@/features/account/token_service';
import { BearerKey, XMdTenantKey } from '@/lib/constants';
import { eventEmitter } from '@/lib/events';

export class Request {
  private readonly $fetch: $Fetch;
  private readonly defaultHeaders: Record<string, string | undefined>;
  private readonly csrfToken: string | null = null;

  // Tracks ongoing requests to prevent duplicates
  private requestsInProgress: Map<string, Promise<ExplicitAny>> = new Map();

  // Tracks failed endpoints to limit retries
  private readonly failedEndpoints: Map<
    string,
    {
      timestamp: number;
      retryCount: number;
      lastError: string;
    }
  > = new Map();

  // Throttles repeated error events
  private errorEventThrottler: Map<string, number> = new Map();

  // Flag to prevent concurrent token refreshes
  private isRefreshingToken = false;

  // Config constants
  private readonly MAX_RETRY_COUNT = 3;
  private readonly RETRY_RESET_TIME = 60000; // ms
  private readonly ERROR_EVENT_THROTTLE_TIME = 1000; // ms
  private readonly REQUEST_DEDUP_TIME = 100; // ms

  static baseConfig: FetchOptions = {
    baseURL:
      import.meta.env.VITE_API_PROXY &&
      (import.meta.env.VITE_API_PROXY === 'true' || import.meta.env.VITE_API_PROXY === '1')
        ? '/api'
        : import.meta.env.VITE_API_URL || '/api',
    timeout: 30000,
    retry: false // Disable ofetch's built-in retry logic
  };

  constructor(fetcher: $Fetch, defaultHeaders: Record<string, string | undefined> = {}) {
    this.$fetch = fetcher;
    this.defaultHeaders = {
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json;charset=utf-8',
      ...defaultHeaders
    };

    // Get CSRF token from meta tag if in browser
    if (isBrowser) {
      const csrfMeta = document.querySelector('meta[name="csrf-token"]');
      if (csrfMeta) {
        this.csrfToken = csrfMeta.getAttribute('content');
      }
    }
  }

  public getHeaders() {
    const token = isBrowser && locals.get(ACCESS_TOKEN_KEY);
    const tenant = isBrowser && locals.get(TENANT_KEY);

    return {
      ...this.defaultHeaders,
      ...(token && tenant && { [XMdTenantKey]: tenant }),
      ...(token && { Authorization: `${BearerKey}${token}` }),
      ...(this.csrfToken && { 'X-CSRF-Token': this.csrfToken })
    };
  }

  private getEndpointKey(url: string): string {
    // Remove query parameters and timestamps to get base endpoint
    return url.split('?')[0];
  }

  private getRequestKey(method: string, url: string, data?: ExplicitAny): string {
    // Create a unique key for request deduplication
    const dataHash = data ? JSON.stringify(data) : '';
    return `${method}:${this.getEndpointKey(url)}:${dataHash}`;
  }

  private shouldRetry(endpoint: string, errorType: string): boolean {
    const failedInfo = this.failedEndpoints.get(endpoint);
    const now = Date.now();

    // If no record, it's the first attempt
    if (!failedInfo) {
      this.recordFailure(endpoint, errorType);
      return true;
    }

    // Reset retry count if enough time has passed
    if (now - failedInfo.timestamp > this.RETRY_RESET_TIME) {
      this.recordFailure(endpoint, errorType);
      return true;
    }

    // Check if we've hit the retry limit
    if (failedInfo.retryCount >= this.MAX_RETRY_COUNT) {
      console.warn(
        `Endpoint ${endpoint} has failed ${this.MAX_RETRY_COUNT} times, blocking further requests`
      );
      return false;
    }

    // Increment retry count
    this.failedEndpoints.set(endpoint, {
      ...failedInfo,
      retryCount: failedInfo.retryCount + 1,
      timestamp: now,
      lastError: errorType
    });

    return true;
  }

  private recordFailure(endpoint: string, errorType: string): void {
    this.failedEndpoints.set(endpoint, {
      timestamp: Date.now(),
      retryCount: 1,
      lastError: errorType
    });
  }

  private clearFailureRecord(endpoint: string): void {
    this.failedEndpoints.delete(endpoint);
  }

  private shouldEmitErrorEvent(eventType: string): boolean {
    const now = Date.now();
    const lastEmitted = this.errorEventThrottler.get(eventType);

    if (!lastEmitted || now - lastEmitted > this.ERROR_EVENT_THROTTLE_TIME) {
      this.errorEventThrottler.set(eventType, now);
      return true;
    }

    return false;
  }

  private isAuthEndpoint(url: string): boolean {
    return (
      url.includes('/iam/login') ||
      url.includes('/iam/refresh-token') ||
      url.includes('/iam/token-status') ||
      url.includes('/iam/register') ||
      url.includes('/iam/logout')
    );
  }

  private async handleErrors(
    err: Error | Response | FetchError,
    method: string,
    url: string
  ): Promise<never> {
    const endpoint = this.getEndpointKey(url);
    let status: number | undefined;
    let errorData: any = null;
    let errorMessage = 'Unknown error occurred';

    // Parse error information
    if (err instanceof FetchError) {
      status = err.status;
      try {
        errorData = err['data'] ?? err['_data'];
        errorMessage = errorData?.message || err.message || 'Unknown error occurred';
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e) {
        errorMessage = err.message || 'Unknown error occurred';
      }
    } else if (err instanceof Response) {
      status = err.status;
      if (err.bodyUsed === false) {
        try {
          errorData = await err.json();
          errorMessage = errorData?.message || 'Unknown error occurred';
        } catch (e) {
          console.error(`Error parsing error response: ${e}`);
        }
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    // Log error for debugging
    console.error(`Request failed [${method} ${url}]:`, {
      status,
      message: errorMessage,
      data: errorData
    });

    // Handle different error scenarios
    const errorType = `${status || 'network'}`;

    // Record failure for retry logic (only for server errors)
    if (status && status >= 500) {
      this.recordFailure(endpoint, errorType);
    }

    // Emit appropriate events with throttling
    if (status === 401) {
      if (this.shouldEmitErrorEvent('unauthorized')) {
        eventEmitter.emit('unauthorized', errorMessage);
      }
    } else if (status === 403) {
      if (this.shouldEmitErrorEvent('forbidden')) {
        eventEmitter.emit('forbidden', {
          method,
          url: endpoint,
          message: errorMessage,
          data: errorData
        });
      }
    } else if (status === 404) {
      if (this.shouldEmitErrorEvent('not-found')) {
        eventEmitter.emit('not-found', { url: endpoint, message: errorMessage });
      }
    } else if (status === 422) {
      if (this.shouldEmitErrorEvent('validation-error')) {
        eventEmitter.emit('validation-error', errorData?.errors || {});
      }
    } else if (status && status >= 500) {
      if (this.shouldEmitErrorEvent('server-error')) {
        eventEmitter.emit('server-error', {
          status,
          message: errorMessage,
          url: endpoint
        });
      }
    } else if (status && status >= 400) {
      if (this.shouldEmitErrorEvent('request-error')) {
        eventEmitter.emit('request-error', {
          status,
          message: errorMessage,
          url: endpoint
        });
      }
    } else if (!status) {
      // Network error
      if (this.shouldEmitErrorEvent('network-error')) {
        eventEmitter.emit('network-error', { method, url: endpoint, message: errorMessage });
      }
    }

    throw err;
  }

  protected async request(
    method: string,
    url: string,
    data?: ExplicitAny,
    fetchOptions?: FetchOptions & { timestamp?: boolean }
  ): Promise<ExplicitAny> {
    const endpoint = this.getEndpointKey(url);
    const requestKey = this.getRequestKey(method, url, data);

    // Check if we should retry this endpoint
    if (!this.shouldRetry(endpoint, 'blocked')) {
      const error = new Error(
        `Request to ${endpoint} is temporarily blocked due to multiple failures`
      );
      if (this.shouldEmitErrorEvent('request-blocked')) {
        eventEmitter.emit('request-blocked', {
          method,
          url: endpoint,
          message: error.message
        });
      }
      throw error;
    }

    // Check if this exact request is already in progress (deduplication)
    if (this.requestsInProgress.has(requestKey)) {
      console.debug(`Deduplicating request: ${requestKey}`);
      return this.requestsInProgress.get(requestKey)!;
    }

    try {
      // Only attempt token refresh for non-auth endpoints and when we have a token
      const shouldRefreshToken =
        !this.isAuthEndpoint(url) && !this.isRefreshingToken && locals.get(ACCESS_TOKEN_KEY);

      if (shouldRefreshToken) {
        this.isRefreshingToken = true;
        try {
          await checkAndRefreshToken();
        } catch (refreshError) {
          console.warn('Token refresh failed:', refreshError);
          // Don't throw here, let the original request proceed
        } finally {
          this.isRefreshingToken = false;
        }
      }

      const headers = this.getHeaders();
      const body = data ? { body: JSON.stringify(data) } : {};

      let finalUrl = url;
      if (fetchOptions?.timestamp !== false) {
        const separator = url.includes('?') ? '&' : '?';
        finalUrl = `${url}${separator}_t=${Date.now()}`;
      }

      const options: FetchOptions = {
        ...Request.baseConfig,
        method,
        headers,
        ...body,
        ...fetchOptions
      };

      // Create the request promise and store it for deduplication
      const requestPromise = this.$fetch(finalUrl, options)
        .then(response => {
          // Clear failure record on success
          this.clearFailureRecord(endpoint);
          return response;
        })
        .catch(async error => {
          return this.handleErrors(error, method, finalUrl);
        })
        .finally(() => {
          // Remove from in-progress requests when done
          this.requestsInProgress.delete(requestKey);
        });

      this.requestsInProgress.set(requestKey, requestPromise);
      return await requestPromise;
    } catch (err) {
      // Clean up the in-progress request on error
      this.requestsInProgress.delete(requestKey);
      throw err;
    }
  }

  public config = {
    ...Request.baseConfig
  };

  public async get(
    url: string,
    fetchOptions?: FetchOptions & { timestamp?: boolean }
  ): Promise<ExplicitAny> {
    return this.request('GET', url, undefined, fetchOptions);
  }

  public async post(
    url: string,
    data?: ExplicitAny,
    fetchOptions?: FetchOptions & { timestamp?: boolean }
  ): Promise<ExplicitAny> {
    return this.request('POST', url, data, fetchOptions);
  }

  public async put(
    url: string,
    data?: ExplicitAny,
    fetchOptions?: FetchOptions & { timestamp?: boolean }
  ): Promise<ExplicitAny> {
    return this.request('PUT', url, data, fetchOptions);
  }

  public async delete(
    url: string,
    fetchOptions?: FetchOptions & { timestamp?: boolean }
  ): Promise<ExplicitAny> {
    return this.request('DELETE', url, undefined, fetchOptions);
  }

  // Reset the state
  public reset(): void {
    this.requestsInProgress.clear();
    this.failedEndpoints.clear();
    this.errorEventThrottler.clear();
    this.isRefreshingToken = false;
  }

  // Get the current status
  public getStatus(): {
    pendingRequests: number;
    failedEndpoints: number;
    isRefreshingToken: boolean;
  } {
    return {
      pendingRequests: this.requestsInProgress.size,
      failedEndpoints: this.failedEndpoints.size,
      isRefreshingToken: this.isRefreshingToken
    };
  }
}

export const request = new Request($fetch);
