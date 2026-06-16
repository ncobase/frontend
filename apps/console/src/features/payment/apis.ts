import { buildQueryString } from '@ncobase/utils';

import type {
  PaymentChannel,
  PaymentLog,
  PaymentLogListResponse,
  PaymentOrder,
  PaymentProduct,
  PaymentSubscription,
  PaymentStats
} from './payment';

import { ApiContext, createApi } from '@/lib/api/factory';
import { request } from '@/lib/api/request';

const normalizePaymentListParams = (params?: Record<string, any>) => {
  if (!params) return undefined;

  const normalized = { ...params };
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

const getPaymentList = <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
  const normalizedParams = normalizePaymentListParams(params);
  const query = normalizedParams ? buildQueryString(normalizedParams) : '';
  return request.get(`${endpoint}${query ? `?${query}` : ''}`);
};

const listPaymentResource = (
  params: Record<string, any> | undefined,
  ctx: ApiContext
): Promise<any> => getPaymentList(ctx.endpoint, params);

const listPaymentOrders = (
  params: Record<string, any> | undefined,
  ctx: ApiContext
): Promise<any> => {
  const normalized = { ...(params || {}) };
  if (normalized.order_number === undefined && normalized.search) {
    normalized.order_number = normalized.search;
  }
  delete normalized.search;
  return getPaymentList(ctx.endpoint, normalized);
};

// Channels API
export const channelApi = createApi<PaymentChannel>('/pay/channels', {
  list: listPaymentResource
});
export const {
  create: createChannel,
  get: getChannel,
  update: updateChannel,
  delete: deleteChannel,
  list: listChannels
} = channelApi;

// Orders API
const orderExtensions = ({ request: req, endpoint }: ApiContext) => ({
  verifyOrder: async (id: string): Promise<PaymentOrder> => {
    return req.post(`${endpoint}/${id}/verify`);
  },
  refundOrder: async (
    id: string,
    payload?: { amount?: number; reason?: string }
  ): Promise<PaymentOrder> => {
    return req.post(`${endpoint}/${id}/refund`, payload);
  }
});

export const orderApi = createApi<PaymentOrder>('/pay/orders', {
  list: listPaymentOrders,
  extensions: orderExtensions
});
export const { get: getOrder, list: listOrders, verifyOrder, refundOrder } = orderApi;

// Products API
export const productApi = createApi<PaymentProduct>('/pay/products', {
  list: listPaymentResource
});
export const {
  create: createProduct,
  get: getProduct,
  update: updateProduct,
  delete: deleteProduct,
  list: listProducts
} = productApi;

// Subscriptions API
const subscriptionExtensions = ({ request: req, endpoint }: ApiContext) => ({
  cancelSubscription: async (id: string): Promise<PaymentSubscription> => {
    return req.post(`${endpoint}/${id}/cancel`);
  }
});

export const subscriptionApi = createApi<PaymentSubscription>('/pay/subscriptions', {
  list: listPaymentResource,
  extensions: subscriptionExtensions
});
export const {
  get: getSubscription,
  list: listSubscriptions,
  cancelSubscription
} = subscriptionApi;

// Stats & Logs
export const getPaymentStats = (): Promise<PaymentStats> => request.get('/pay/stats');

export const getPaymentLog = (id: string): Promise<PaymentLog> => request.get(`/pay/logs/${id}`);

export const getPaymentLogs = (params?: Record<string, any>): Promise<PaymentLogListResponse> =>
  getPaymentList('/pay/logs', params);
