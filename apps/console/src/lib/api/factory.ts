/* eslint-disable no-unused-vars */
import { PaginationResult } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/lib/api/request';

/**
 * API Context provided to extension functions
 */
export interface ApiContext {
  endpoint: string;
  request: typeof request;
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
 * Creates a standard CRUD API for a given endpoint and model type
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

  // Define default implementations
  const defaultImplementations = {
    // Create operation with proper type for payload (no ID required)
    create: async (payload: Omit<T, 'id'>): Promise<CreateResult> => {
      return request.post(endpoint, { ...payload });
    },

    // Get operation
    get: async (id: string): Promise<T> => {
      return request.get(`${endpoint}/${id}`);
    },

    // Update operation
    update: async (payload: T): Promise<UpdateResult> => {
      return request.put(`${endpoint}/${payload['id']}`, { ...payload });
    },

    // Delete operation
    delete: async (id: string): Promise<DeleteResult> => {
      return request.delete(`${endpoint}/${id}`);
    },

    // List operation
    list: async (params?: ExplicitAny): Promise<ListResult> => {
      const queryString = params ? buildQueryString(params) : '';
      return request.get(`${endpoint}${queryString ? `?${queryString}` : ''}`);
    }
  };

  // Build the API object
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
