import { Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { usePaymentStats } from '../service';

import { Page, Topbar } from '@/components/layout';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

const StatCard = ({
  icon,
  label,
  value,
  color
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) => (
  <div className='bg-white rounded-lg border p-6'>
    <div className='flex items-center gap-3'>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icons name={icon} className='w-5 h-5 text-white' />
      </div>
      <div>
        <p className='text-sm text-slate-500'>{label}</p>
        <p className='text-xl font-semibold text-slate-900'>{value}</p>
      </div>
    </div>
  </div>
);

export const PaymentOverviewPage = () => {
  const { t } = useTranslation();
  const { data: stats } = usePaymentStats();

  return (
    <Page
      sidebar
      title={t('payment.overview.title', 'Payment Overview')}
      topbar={<Topbar title={t('payment.overview.title', 'Payment Overview')} />}
    >
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <StatCard
            icon='IconCurrencyDollar'
            label={t('payment.stats.total_revenue', 'Total Revenue')}
            value={formatCurrency(stats?.total_revenue || 0)}
            color='bg-green-500'
          />
          <StatCard
            icon='IconReceipt'
            label={t('payment.stats.total_orders', 'Total Orders')}
            value={String(stats?.total_orders || 0)}
            color='bg-blue-500'
          />
          <StatCard
            icon='IconReceiptRefund'
            label={t('payment.stats.total_refunds', 'Total Refunds')}
            value={String(stats?.total_refunds || 0)}
            color='bg-orange-500'
          />
          <StatCard
            icon='IconRepeat'
            label={t('payment.stats.active_subscriptions', 'Active Subscriptions')}
            value={String(stats?.active_subscriptions || 0)}
            color='bg-purple-500'
          />
        </div>

        {stats?.revenue_by_channel && (
          <div className='bg-white rounded-lg border p-6'>
            <h3 className='text-lg font-medium text-slate-900 mb-4'>
              {t('payment.stats.revenue_by_channel', 'Revenue by Channel')}
            </h3>
            <div className='space-y-3'>
              {Object.entries(stats.revenue_by_channel).map(([channel, amount]) => (
                <div key={channel} className='flex items-center justify-between'>
                  <span className='text-sm text-slate-600 capitalize'>{channel}</span>
                  <span className='text-sm font-medium text-slate-900'>
                    {formatCurrency(amount as number)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};
