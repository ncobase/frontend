import { PaginationResult } from '@ncobase/react';

export interface PaymentChannel {
  id: string;
  name: string;
  type: 'stripe' | 'alipay' | 'wechat' | 'paypal';
  status: 'active' | 'inactive' | 'error';
  config?: Record<string, any>;
  created_at?: number;
  updated_at?: number;
}

export interface PaymentOrder {
  id: string;
  order_number: string;
  order_no?: string;
  channel_id: string;
  channel_type?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  user_id?: string;
  product_id?: string;
  product_name?: string;
  description?: string;
  metadata?: Record<string, any>;
  paid_at?: number;
  refunded_at?: number;
  created_at?: number;
  updated_at?: number;
}

export interface PaymentProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  type: 'one_time' | 'recurring';
  interval?: 'month' | 'year';
  status: 'active' | 'inactive' | 'archived';
  features?: string[];
  metadata?: Record<string, any>;
  created_at?: number;
  updated_at?: number;
}

export interface PaymentSubscription {
  id: string;
  user_id: string;
  product_id: string;
  product_name?: string;
  channel_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'expired' | 'trialing';
  current_period_start?: number;
  current_period_end?: number;
  cancel_at?: number;
  cancelled_at?: number;
  created_at?: number;
  updated_at?: number;
}

export interface PaymentStats {
  total_revenue: number;
  total_orders: number;
  successful_payments?: number;
  failed_payments?: number;
  total_refunds: number;
  active_subscriptions: number;
  revenue_by_channel: Record<string, number>;
  revenue_by_period: Array<{ date: string; amount: number }>;
  currency?: string;
  period_start?: string;
  period_end?: string;
}

export interface PaymentLog {
  id: string;
  order_id?: string;
  channel_id?: string;
  type: 'create' | 'update' | 'verify' | 'callback' | 'notify' | 'refund' | 'error';
  status_before?: string;
  status_after?: string;
  request_data?: string;
  response_data?: string;
  ip?: string;
  user_agent?: string;
  user_id?: string;
  error?: string;
  metadata?: Record<string, any>;
  created_at?: number;
  updated_at?: number;
}

export type OrderListResponse = PaginationResult<PaymentOrder>;
export type ProductListResponse = PaginationResult<PaymentProduct>;
export type SubscriptionListResponse = PaginationResult<PaymentSubscription>;
export type ChannelListResponse = PaginationResult<PaymentChannel>;
export type PaymentLogListResponse = PaginationResult<PaymentLog>;
