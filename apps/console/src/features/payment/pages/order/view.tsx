import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { OrderTimeline } from '../../components/order_timeline';
import { OrderViewer } from '../../forms/order_viewer';
import { useGetOrder } from '../../service';

import { Page, Topbar } from '@/components/layout';

export const OrderViewPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(slug || '');

  if (isLoading) {
    return (
      <Page sidebar title={t('payment.order.view_title', 'Order Details')}>
        <div className='p-6 text-slate-400'>{t('common.loading', 'Loading...')}</div>
      </Page>
    );
  }

  if (!order) {
    return (
      <Page sidebar title={t('payment.order.view_title', 'Order Details')}>
        <div className='p-6 text-slate-400'>{t('payment.order.not_found', 'Order not found')}</div>
      </Page>
    );
  }

  return (
    <Page
      sidebar
      title={`${t('payment.order.view_title', 'Order')} ${order.order_no}`}
      topbar={
        <Topbar
          title={`${t('payment.order.view_title', 'Order')} ${order.order_no}`}
          left={[
            <Button key='back' variant='outline-slate' size='sm' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' className='w-4 h-4 mr-1' />
              {t('actions.back', 'Back')}
            </Button>
          ]}
        />
      }
    >
      <div className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <div className='bg-white border rounded-lg'>
            <OrderViewer record={order} />
          </div>
        </div>
        <div>
          <div className='bg-white border rounded-lg p-4'>
            <OrderTimeline order={order} />
          </div>
        </div>
      </div>
    </Page>
  );
};
