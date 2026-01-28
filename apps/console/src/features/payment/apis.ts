import {
  PaymentChannel,
  PaymentOrder,
  PaymentProduct,
  PaymentSubscription,
  PaymentStats
} from './payment';

import { ApiContext, createApi } from '@/lib/api/factory';
import { request } from '@/lib/api/request';

// Channels API
export const channelApi = createApi<PaymentChannel>('/pay/channels');
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
  extensions: orderExtensions
});
export const { get: getOrder, list: listOrders, verifyOrder, refundOrder } = orderApi;

// Products API
export const productApi = createApi<PaymentProduct>('/pay/products');
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
  extensions: subscriptionExtensions
});
export const {
  get: getSubscription,
  list: listSubscriptions,
  cancelSubscription
} = subscriptionApi;

// Stats & Logs
export const getPaymentStats = (): Promise<PaymentStats> => request.get('/pay/stats');

export const getPaymentLogs = (params?: Record<string, any>): Promise<any> => {
  const query = params ? new URLSearchParams(params).toString() : '';
  return request.get(`/pay/logs${query ? `?${query}` : ''}`);
};
