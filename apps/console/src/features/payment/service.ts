import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  listOrders,
  getOrder,
  refundOrder,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listSubscriptions,
  getSubscription,
  cancelSubscription,
  listChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  getPaymentStats
} from './apis';
import { PaymentChannel, PaymentProduct } from './payment';

export const paymentKeys = {
  orders: (params?: any) => ['paymentService', 'orders', params],
  order: (id?: string) => ['paymentService', 'order', { id }],
  products: (params?: any) => ['paymentService', 'products', params],
  product: (id?: string) => ['paymentService', 'product', { id }],
  subscriptions: (params?: any) => ['paymentService', 'subscriptions', params],
  subscription: (id?: string) => ['paymentService', 'subscription', { id }],
  channels: (params?: any) => ['paymentService', 'channels', params],
  channel: (id?: string) => ['paymentService', 'channel', { id }],
  stats: () => ['paymentService', 'stats']
};

// Orders
export const useListOrders = (params: any) =>
  useQuery({
    queryKey: paymentKeys.orders(params),
    queryFn: () => listOrders(params),
    staleTime: 5 * 60 * 1000
  });

export const useGetOrder = (id: string) =>
  useQuery({
    queryKey: paymentKeys.order(id),
    queryFn: () => getOrder(id),
    enabled: !!id
  });

export const useRefundOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; amount?: number; reason?: string }) =>
      refundOrder(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentService', 'orders'] });
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
    }
  });
};

// Products
export const useListProducts = (params: any) =>
  useQuery({
    queryKey: paymentKeys.products(params),
    queryFn: () => listProducts(params),
    staleTime: 5 * 60 * 1000
  });

export const useGetProduct = (id: string) =>
  useQuery({
    queryKey: paymentKeys.product(id),
    queryFn: () => getProduct(id),
    enabled: !!id
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<PaymentProduct, 'id'>) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentService', 'products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentProduct) => updateProduct(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['paymentService', 'products'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: paymentKeys.product(variables.id) });
      }
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: paymentKeys.product(deletedId) });
      queryClient.invalidateQueries({ queryKey: ['paymentService', 'products'] });
    }
  });
};

// Subscriptions
export const useListSubscriptions = (params: any) =>
  useQuery({
    queryKey: paymentKeys.subscriptions(params),
    queryFn: () => listSubscriptions(params),
    staleTime: 5 * 60 * 1000
  });

export const useGetSubscription = (id: string) =>
  useQuery({
    queryKey: paymentKeys.subscription(id),
    queryFn: () => getSubscription(id),
    enabled: !!id
  });

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentService', 'subscriptions'] });
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
    }
  });
};

// Channels
export const useListChannels = (params: any) =>
  useQuery({
    queryKey: paymentKeys.channels(params),
    queryFn: () => listChannels(params),
    staleTime: 5 * 60 * 1000
  });

export const useGetChannel = (id: string) =>
  useQuery({
    queryKey: paymentKeys.channel(id),
    queryFn: () => getChannel(id),
    enabled: !!id
  });

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<PaymentChannel, 'id'>) => createChannel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentService', 'channels'] });
    }
  });
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentChannel) => updateChannel(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['paymentService', 'channels'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: paymentKeys.channel(variables.id) });
      }
    }
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteChannel(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: paymentKeys.channel(deletedId) });
      queryClient.invalidateQueries({ queryKey: ['paymentService', 'channels'] });
    }
  });
};

// Stats
export const usePaymentStats = () =>
  useQuery({
    queryKey: paymentKeys.stats(),
    queryFn: () => getPaymentStats(),
    staleTime: 5 * 60 * 1000
  });
