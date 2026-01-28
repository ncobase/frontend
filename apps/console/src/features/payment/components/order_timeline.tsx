import { Icons } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { PaymentOrder } from '../payment';

const statusConfig: Record<string, { icon: string; color: string; label: string }> = {
  pending: { icon: 'IconClock', color: 'text-yellow-500', label: 'Order Created' },
  paid: { icon: 'IconCircleCheck', color: 'text-green-500', label: 'Payment Received' },
  failed: { icon: 'IconCircleX', color: 'text-red-500', label: 'Payment Failed' },
  refunded: { icon: 'IconReceiptRefund', color: 'text-slate-500', label: 'Refunded' },
  cancelled: { icon: 'IconBan', color: 'text-slate-400', label: 'Cancelled' }
};

interface OrderTimelineProps {
  order: PaymentOrder;
}

export const OrderTimeline = ({ order }: OrderTimelineProps) => {
  const { t } = useTranslation();

  const events: Array<{ time: number | undefined; status: string }> = [
    { time: order.created_at, status: 'pending' }
  ];

  if (order.status === 'paid' || order.status === 'refunded') {
    events.push({ time: order.paid_at, status: 'paid' });
  }
  if (order.status === 'refunded') {
    events.push({ time: order.refunded_at, status: 'refunded' });
  }
  if (order.status === 'failed') {
    events.push({ time: order.created_at, status: 'failed' });
  }
  if (order.status === 'cancelled') {
    events.push({ time: order.created_at, status: 'cancelled' });
  }

  return (
    <div className='space-y-1'>
      <h4 className='text-sm font-medium text-slate-700 mb-3'>
        {t('payment.order.timeline', 'Timeline')}
      </h4>
      <div className='space-y-4'>
        {events.map((event, index) => {
          const config = statusConfig[event.status] || statusConfig.pending;
          return (
            <div key={index} className='flex items-start gap-3'>
              <div className='flex-shrink-0 mt-0.5'>
                <Icons name={config.icon} className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <p className='text-sm text-slate-700'>
                  {t(`payment.timeline.${event.status}`, config.label)}
                </p>
                <p className='text-xs text-slate-400'>
                  {event.time ? formatDateTime(new Date(event.time), 'dateTime') : '-'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
