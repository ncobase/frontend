import { isBrowser, locals } from '@ncobase/utils';
import { t } from 'i18next';
import { $Fetch, $fetch, FetchOptions } from 'ofetch';

import { ACCESS_TOKEN_KEY } from '@/features/account/context';
import { checkAndRefreshToken } from '@/features/account/token_service';
import { TENANT_KEY } from '@/features/system/tenant/context';
import { BearerKey, XMdTenantKey } from '@/helpers/constants';
import { eventEmitter } from '@/helpers/events';
import { ExplicitAny } from '@/types';

export class Request {
  private readonly $fetch: $Fetch;
  private readonly defaultHeaders: Record<string, string | undefined>;
  private readonly csrfToken: string | null = null;

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

  private async handleErrors(err: Error | Response, method: string, url: string): Promise<void> {
    if (err instanceof Error) {
      console.error(`${t('errors.request.label')} [${method} ${url}]: ${err.message}`);
    } else {
      const { status } = err;
      // console.error(`${t('errors.response.label')} [${method} ${url}]: ${status} ${statusText}`);
      if (status === 401) {
        eventEmitter.emit('unauthorized');
      } else if (status === 403) {
        eventEmitter.emit('forbidden');
      } else if (status === 500) {
        eventEmitter.emit('server-error');
      } else if (status === 503) {
        eventEmitter.emit('server-unavailable');
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
    try {
      // For non-auth endpoints, check and refresh token if needed
      if (!url.includes('/iam/login') && !url.includes('/iam/refresh')) {
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

      return await this.$fetch(finalUrl, options);
    } catch (err) {
      await this.handleErrors(err as Error, method, url);
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
