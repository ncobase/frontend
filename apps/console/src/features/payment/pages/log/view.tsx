import { Button, Icons } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { useGetPaymentLog } from '../../service';

import { Page, Topbar } from '@/components/layout';

const formatPayload = (value?: string | Record<string, any>) => {
  if (!value) return '';
  if (typeof value !== 'string') return JSON.stringify(value, null, 2);

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

const DetailItem = ({ label, value }: { label: string; value?: string | number }) => (
  <div className='space-y-1'>
    <dt className='text-xs font-medium text-slate-500'>{label}</dt>
    <dd className='break-all text-sm text-slate-900'>{value || '-'}</dd>
  </div>
);

const PayloadBlock = ({
  label,
  value
}: {
  label: string;
  value?: string | Record<string, any>;
}) => {
  const formatted = formatPayload(value);

  return (
    <section className='rounded-lg border bg-white p-4'>
      <h3 className='mb-3 text-sm font-semibold text-slate-900'>{label}</h3>
      {formatted ? (
        <pre className='max-h-96 overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100'>
          {formatted}
        </pre>
      ) : (
        <div className='text-sm text-slate-500'>-</div>
      )}
    </section>
  );
};

export const PaymentLogViewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { data: log, isLoading, isError, refetch } = useGetPaymentLog(slug || '');

  return (
    <Page
      sidebar
      title={t('payment.log.view_title', 'Payment Log Details')}
      topbar={
        <Topbar
          title={t('payment.log.view_title', 'Payment Log Details')}
          left={[
            <Button key='back' variant='outline-slate' size='sm' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' className='mr-1 h-4 w-4' />
              {t('actions.back', 'Back')}
            </Button>
          ]}
          right={[
            <Button key='refresh' variant='outline-slate' size='sm' onClick={() => refetch()}>
              <Icons name='IconRefresh' className='mr-1 h-4 w-4' />
              {t('actions.refresh', 'Refresh')}
            </Button>
          ]}
        />
      }
    >
      <div className='space-y-6 p-6'>
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
                    {t('payment.log.load_failed', 'Unable to load payment log')}
                  </p>
                  <p className='text-sm text-red-700'>
                    {t(
                      'payment.log.load_failed_hint',
                      'Check payment administration permissions and try again.'
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

        {log && !isError && (
          <>
            <section className='rounded-lg border bg-white p-4'>
              <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <h2 className='text-base font-semibold text-slate-900'>
                    {t(`payment.log.types.${log.type}`, log.type)}
                  </h2>
                  <p className='font-mono text-xs text-slate-500'>{log.id}</p>
                </div>
                {log.order_id && (
                  <Button
                    variant='outline-slate'
                    size='sm'
                    onClick={() => navigate(`/pay/orders/view/${log.order_id}`)}
                  >
                    <Icons name='IconReceipt' className='mr-1 h-4 w-4' />
                    {t('payment.log.actions.view_order', 'View Order')}
                  </Button>
                )}
              </div>

              <dl className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <DetailItem
                  label={t('payment.log.fields.order_id', 'Order ID')}
                  value={log.order_id}
                />
                <DetailItem
                  label={t('payment.log.fields.channel_id', 'Channel ID')}
                  value={log.channel_id}
                />
                <DetailItem label={t('payment.log.fields.user_id', 'User')} value={log.user_id} />
                <DetailItem label={t('payment.log.fields.ip', 'IP')} value={log.ip} />
                <DetailItem
                  label={t('payment.log.fields.status_before', 'Status Before')}
                  value={log.status_before}
                />
                <DetailItem
                  label={t('payment.log.fields.status_after', 'Status After')}
                  value={log.status_after}
                />
                <DetailItem
                  label={t('payment.log.fields.created_at', 'Created')}
                  value={
                    log.created_at ? formatDateTime(new Date(log.created_at), 'dateTime') : '-'
                  }
                />
                <DetailItem
                  label={t('payment.log.fields.updated_at', 'Updated')}
                  value={
                    log.updated_at ? formatDateTime(new Date(log.updated_at), 'dateTime') : '-'
                  }
                />
              </dl>
            </section>

            {log.error && (
              <PayloadBlock label={t('payment.log.fields.error', 'Error')} value={log.error} />
            )}
            <PayloadBlock
              label={t('payment.log.fields.request_data', 'Request Data')}
              value={log.request_data}
            />
            <PayloadBlock
              label={t('payment.log.fields.response_data', 'Response Data')}
              value={log.response_data}
            />
            <PayloadBlock
              label={t('payment.log.fields.metadata', 'Metadata')}
              value={log.metadata}
            />
            <PayloadBlock
              label={t('payment.log.fields.user_agent', 'User Agent')}
              value={log.user_agent}
            />
          </>
        )}
      </div>
    </Page>
  );
};
