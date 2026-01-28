import { Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { PaymentStats } from '../payment';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

interface PaymentStatsCardsProps {
  stats: PaymentStats | null | undefined;
}

export const PaymentStatsCards = ({ stats }: PaymentStatsCardsProps) => {
  const { t } = useTranslation();

  const cards = [
    {
      icon: 'IconCurrencyDollar',
      label: t('payment.stats.total_revenue', 'Total Revenue'),
      value: formatCurrency(stats?.total_revenue || 0),
      color: 'bg-green-500'
    },
    {
      icon: 'IconReceipt',
      label: t('payment.stats.total_orders', 'Total Orders'),
      value: String(stats?.total_orders || 0),
      color: 'bg-blue-500'
    },
    {
      icon: 'IconReceiptRefund',
      label: t('payment.stats.total_refunds', 'Total Refunds'),
      value: String(stats?.total_refunds || 0),
      color: 'bg-orange-500'
    },
    {
      icon: 'IconRepeat',
      label: t('payment.stats.active_subscriptions', 'Active Subscriptions'),
      value: String(stats?.active_subscriptions || 0),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {cards.map(card => (
        <div key={card.label} className='bg-white rounded-lg border p-6'>
          <div className='flex items-center gap-3'>
            <div className={`p-2 rounded-lg ${card.color}`}>
              <Icons name={card.icon} className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='text-sm text-slate-500'>{card.label}</p>
              <p className='text-xl font-semibold text-slate-900'>{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
