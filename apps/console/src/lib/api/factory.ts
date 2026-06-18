/* eslint-disable no-unused-vars */
import { PaginationResult } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { assertRequiredApiValue } from '@/lib/api/guards';
import { request } from '@/lib/api/request';

/**
 * API Context provided to extension functions
 */
export interface ApiContext {
  endpoint: string;
  request: typeof request;
}

type ApiPathResolver<Arg> = string | ((arg: Arg, ctx: ApiContext) => string);

export interface ApiPaths<T> {
  create?: ApiPathResolver<Omit<T, 'id'>>;
  get?: ApiPathResolver<string>;
  update?: ApiPathResolver<T>;
  delete?: ApiPathResolver<string>;
  list?: ApiPathResolver<ExplicitAny | undefined>;
}

/**
 * Standard CRUD operations interface
 */
export interface CrudApi<
  T,
  CreateResult = T,
  UpdateResult = T,
  DeleteResult = T,
  ListResult = PaginationResult<T>
> {
  /**
   * Create a new resource
   */
  create: (payload: Omit<T, 'id'>) => Promise<CreateResult>;

  /**
   * Get a resource by ID
   */
  get: (id: string) => Promise<T>;

  /**
   * Update an existing resource
   */
  update: (payload: T) => Promise<UpdateResult>;

  /**
   * Delete a resource by ID
   */
  delete: (id: string) => Promise<DeleteResult>;

  /**
   * List resources with optional filtering
   */
  list: (params?: ExplicitAny) => Promise<ListResult>;
}

/**
 * Configuration options for creating an API
 */
export interface ApiOptions<
  T,
  CreateResult = T,
  UpdateResult = T,
  DeleteResult = T,
  ListResult = PaginationResult<T>
> {
  /**
   * Override default CRUD paths while keeping the default request body and response handling.
   */
  paths?: ApiPaths<T>;

  /**
   * Override the default create method implementation
   */
  create?: (payload: Omit<T, 'id'>, ctx: ApiContext) => Promise<CreateResult>;

  /**
   * Override the default get method implementation
   */
  get?: (id: string, ctx: ApiContext) => Promise<T>;

  /**
   * Override the default update method implementation
   */
  update?: (payload: T, ctx: ApiContext) => Promise<UpdateResult>;

  /**
   * Override the default delete method implementation
   */
  delete?: (id: string, ctx: ApiContext) => Promise<DeleteResult>;

  /**
   * Override the default list method implementation
   */
  list?: (params: ExplicitAny, ctx: ApiContext) => Promise<ListResult>;

  /**
   * Additional custom methods to add to the API
   */
  extensions?: (ctx: ApiContext) => Record<string, (...args: any[]) => Promise<any>>;
}

/**
 * Creates a standard CRUD API for a given endpoint and model type with extensibility options
 *
 * @param endpoint The API endpoint path
 * @param options Optional configuration to customize or extend API behavior
 * @returns An object with CRUD operations and any custom extensions
 */
export function createApi<
  T,
  CreateResult = T,
  UpdateResult = T,
  DeleteResult = T,
  ListResult = PaginationResult<T>
>(
  endpoint: string,
  options: ApiOptions<T, CreateResult, UpdateResult, DeleteResult, ListResult> = {}
): CrudApi<T, CreateResult, UpdateResult, DeleteResult, ListResult> &
  Record<string, (...args: any[]) => Promise<any>> {
  // Create API context that will be passed to all method implementations
  const apiContext: ApiContext = {
    endpoint,
    request
  };

  const resolvePath = <Arg>(
    resolver: ApiPathResolver<Arg> | undefined,
    fallback: string,
    arg: Arg
  ) => {
    if (!resolver) return fallback;
    return typeof resolver === 'function' ? resolver(arg, apiContext) : resolver;
  };

  // Define default implementations
  const defaultImplementations = {
    // Create operation with proper type for payload (no ID required)
    create: async (payload: Omit<T, 'id'>): Promise<CreateResult> => {
      const path = resolvePath(options.paths?.create, endpoint, payload);
      return request.post(path, { ...payload });
    },

    // Get operation
    get: async (id: string): Promise<T> => {
      const entityId = assertRequiredApiValue(id, 'ID');
      const path = resolvePath(options.paths?.get, `${endpoint}/${entityId}`, entityId);
      return request.get(path);
    },

    // Update operation
    update: async (payload: T): Promise<UpdateResult> => {
      const entityId = assertRequiredApiValue((payload as ExplicitAny).id, 'ID');
      const path = resolvePath(options.paths?.update, `${endpoint}/${entityId}`, payload);
      return request.put(path, { ...payload });
    },

    // Delete operation
    delete: async (id: string): Promise<DeleteResult> => {
      const entityId = assertRequiredApiValue(id, 'ID');
      const path = resolvePath(options.paths?.delete, `${endpoint}/${entityId}`, entityId);
      return request.delete(path);
    },

    // List operation with optional params
    list: async (params?: ExplicitAny): Promise<ListResult> => {
      const queryString = params ? buildQueryString(params) : '';
      const path = resolvePath(
        options.paths?.list,
        `${endpoint}${queryString ? `?${queryString}` : ''}`,
        params
      );
      return request.get(path);
    }
  };

  // Build the API object with overridden methods and extensions
  const api = {
    // Expose context for advanced usage
    _context: apiContext,

    // Apply CRUD operations (using overrides if provided)
    create: options.create
      ? (payload: Omit<T, 'id'>) => options.create!(payload, apiContext)
      : defaultImplementations.create,

    get: options.get ? (id: string) => options.get!(id, apiContext) : defaultImplementations.get,

    update: options.update
      ? (payload: T) => options.update!(payload, apiContext)
      : defaultImplementations.update,

    delete: options.delete
      ? (id: string) => options.delete!(id, apiContext)
      : defaultImplementations.delete,

    list: options.list
      ? (params?: ExplicitAny) => options.list!(params || {}, apiContext)
      : defaultImplementations.list,

    // Add any custom extensions
    ...(options.extensions ? options.extensions(apiContext) : {})
  };

  return api as unknown as CrudApi<T, CreateResult, UpdateResult, DeleteResult, ListResult> &
    Record<string, (...args: any[]) => Promise<any>>;
}
