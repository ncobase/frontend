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
  private requestsInProgress: Map<string, Promise<ExplicitAny>> = new Map();
  private readonly failedEndpoints: Map<string, { timestamp: number; retryCount: number }> =
    new Map();
  private readonly MAX_RETRY_COUNT = 3;
  private readonly RETRY_RESET_TIME = 60000; // 1 minute

  static baseConfig: FetchOptions = {
    baseURL:
      import.meta.env.VITE_API_PROXY &&
      (import.meta.env.VITE_API_PROXY === 'true' || import.meta.env.VITE_API_PROXY === '1')
        ? '/api'
        : import.meta.env.VITE_API_URL || '/api',
    timeout: 30000
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

  private shouldRetry(endpoint: string): boolean {
    const failedInfo = this.failedEndpoints.get(endpoint);

    // If no record, it's the first attempt
    if (!failedInfo) return true;

    const now = Date.now();

    // Reset retry count if enough time has passed
    if (now - failedInfo.timestamp > this.RETRY_RESET_TIME) {
      this.failedEndpoints.set(endpoint, { timestamp: now, retryCount: 1 });
      return true;
    }

    // Check if we've hit the retry limit
    if (failedInfo.retryCount >= this.MAX_RETRY_COUNT) {
      return false;
    }

    // Increment retry count
    this.failedEndpoints.set(endpoint, {
      timestamp: now,
      retryCount: failedInfo.retryCount + 1
    });

    return true;
  }

  // Helper method to extract the base endpoint from a URL
  private getEndpointKey(url: string): string {
    // Remove query parameters and timestamps
    return url.split('?')[0];
  }

  private async handleErrors(
    err: Error | Response | FetchError,
    method: string,
    url: string
  ): Promise<never> {
    const endpoint = this.getEndpointKey(url);

    // Network error handling
    if (err instanceof Error && !(err instanceof FetchError)) {
      console.error(`Network error [${method} ${url}]: ${err.message}`);
      eventEmitter.emit('network-error', { method, url, message: err.message });
      throw err;
    }

    let status: number | undefined;
    let errorData: any = null;
    let errorMessage = 'Unknown error occurred';

    // Handle FetchError
    if (err instanceof FetchError) {
      status = err.status;
      try {
        errorData = err.data;
        errorMessage = errorData?.message || err.message || 'Unknown error occurred';
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e: any) {
        errorMessage = err.message || 'Unknown error occurred';
      }
    } else if (err instanceof Response) {
      status = err.status;

      // Only try to parse JSON if it hasn't been read yet
      if (err.bodyUsed === false) {
        try {
          errorData = await err.json();
          errorMessage = errorData?.message || 'Unknown error occurred';
        } catch (e) {
          // Body stream already read or not JSON
          console.error(
            `Error parsing error response [${method} ${url}]: ${e instanceof Error ? e.message : String(e)}`
          );
        }
      }
    }

    // Store information about this failed endpoint for retry limiting
    if (status === 500 || status === 503) {
      const existingInfo = this.failedEndpoints.get(endpoint);
      this.failedEndpoints.set(endpoint, {
        timestamp: Date.now(),
        retryCount: (existingInfo?.retryCount || 0) + 1
      });
    }

    // Handle different error scenarios
    if (status === 401) {
      eventEmitter.emit('unauthorized', errorMessage);
    } else if (status === 403) {
      eventEmitter.emit('forbidden', errorMessage);
    } else if (status === 404) {
      eventEmitter.emit('not-found', { url, message: errorMessage });
    } else if (status === 422) {
      eventEmitter.emit('validation-error', errorData?.errors || {});
    } else if (status && status >= 500) {
      eventEmitter.emit('server-error', {
        status,
        message: errorMessage,
        url: endpoint
      });
    } else if (status && status >= 400) {
      eventEmitter.emit('request-error', {
        status,
        message: errorMessage,
        url: endpoint
      });
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

    // Check if we should retry this endpoint
    if (!this.shouldRetry(endpoint)) {
      console.warn(`Request to ${endpoint} has failed multiple times. Skipping request.`);
      eventEmitter.emit('request-blocked', {
        method,
        url: endpoint,
        message: 'Request has failed multiple times and is temporarily blocked'
      });
      throw new Error(`Request to ${endpoint} is temporarily blocked due to multiple failures`);
    }

    // Generate a request key for deduplication
    const requestKey = `${method}:${url}:${JSON.stringify(data || {})}`;

    // Check if this exact request is already in progress
    if (this.requestsInProgress.has(requestKey)) {
      return this.requestsInProgress.get(requestKey)!;
    }

    try {
      // Skip token refresh for auth endpoints to avoid infinite loops
      if (
        !url.includes('/iam/login') &&
        !url.includes('/iam/refresh-token') &&
        !url.includes('/iam/token-status')
      ) {
        // Only attempt to refresh if not already doing an auth request
        await checkAndRefreshToken();
      }

      const headers = this.getHeaders();
      const body = data ? { body: JSON.stringify(data) } : {};

      let finalUrl = url;
      const AUT = true; // always use timestamp;
      if (fetchOptions?.timestamp || AUT) {
        const separator = url.includes('?') ? '&' : '?';
        finalUrl = `${url}${separator}_t=${Date.now()}`;
      }

      const options: FetchOptions = {
        ...Request.baseConfig,
        method,
        headers,
        ...body,
        ...fetchOptions,
        onRequestError: ({ error }) => this.handleErrors(error, method, finalUrl),
        onResponseError: ({ response }) => this.handleErrors(response, method, finalUrl),
        onResponse: async ({ response }) => {
          if (!response.ok) {
            await this.handleErrors(response, method, finalUrl);
          }
        }
      };

      // Create the request promise and store it
      const requestPromise = this.$fetch(finalUrl, options).finally(() => {
        // Remove from in-progress requests when done
        this.requestsInProgress.delete(requestKey);
      });

      this.requestsInProgress.set(requestKey, requestPromise);
      return await requestPromise;
    } catch (err) {
      // Clean up the in-progress request on error
      this.requestsInProgress.delete(requestKey);
      return await this.handleErrors(err as Error, method, url);
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
}

export const request = new Request($fetch);
