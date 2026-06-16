import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { usePaymentStats } from '../service';

import { Page, Topbar } from '@/components/layout';

const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

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
  const { data: stats, isLoading, isError, isFetching, refetch } = usePaymentStats();
  const currency = stats?.currency || 'USD';
  const hasChannelRevenue =
    !!stats?.revenue_by_channel && Object.keys(stats.revenue_by_channel).length > 0;

  return (
    <Page
      sidebar
      title={t('payment.overview.title', 'Payment Overview')}
      topbar={
        <Topbar
          title={t('payment.overview.title', 'Payment Overview')}
          right={[
            <Button
              key='refresh'
              variant='outline-slate'
              size='sm'
              onClick={() => refetch()}
              isLoading={isFetching}
            >
              <Icons name='IconRefresh' className='w-4 h-4 mr-1' />
              {t('actions.refresh', 'Refresh')}
            </Button>
          ]}
        />
      }
    >
      <div className='p-6'>
        {isLoading && (
          <div className='rounded-lg border bg-white p-6 text-sm text-slate-500'>
            {t('common.loading', 'Loading...')}
          </div>
        )}

        {isError && !isLoading && (
          <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
            <div className='flex items-start gap-3'>
              <Icons name='IconAlertCircle' className='mt-0.5 h-5 w-5 text-red-500' />
              <div className='space-y-3'>
                <div>
                  <p className='font-medium text-red-900'>
                    {t('payment.stats.load_failed', 'Unable to load payment statistics')}
                  </p>
                  <p className='text-sm text-red-700'>
                    {t(
                      'payment.stats.load_failed_hint',
                      'Check payment permissions and try again.'
                    )}
                  </p>
                </div>
                <Button size='sm' variant='outline-slate' onClick={() => refetch()}>
                  {t('actions.retry', 'Retry')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
              <StatCard
                icon='IconCurrencyDollar'
                label={t('payment.stats.total_revenue', 'Total Revenue')}
                value={formatCurrency(stats?.total_revenue || 0, currency)}
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

            <div className='bg-white rounded-lg border p-6'>
              <h3 className='text-lg font-medium text-slate-900 mb-4'>
                {t('payment.stats.revenue_by_channel', 'Revenue by Channel')}
              </h3>
              {hasChannelRevenue ? (
                <div className='space-y-3'>
                  {Object.entries(stats.revenue_by_channel).map(([channel, amount]) => (
                    <div key={channel} className='flex items-center justify-between'>
                      <span className='text-sm text-slate-600 capitalize'>{channel}</span>
                      <span className='text-sm font-medium text-slate-900'>
                        {formatCurrency(amount as number, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-6 text-sm text-slate-500'>
                  {t('payment.stats.no_channel_revenue', 'No channel revenue in this period')}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};
