import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { SubscriptionStatus } from '../../components/subscription_status';
import { SubscriptionViewer } from '../../forms/subscription_viewer';
import { useGetSubscription } from '../../service';

import { Page, Topbar } from '@/components/layout';

export const SubscriptionViewPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: subscription, isLoading } = useGetSubscription(slug || '');

  if (isLoading) {
    return (
      <Page sidebar title={t('payment.subscription.view_title', 'Subscription Details')}>
        <div className='p-6 text-slate-400'>{t('common.loading', 'Loading...')}</div>
      </Page>
    );
  }

  if (!subscription) {
    return (
      <Page sidebar title={t('payment.subscription.view_title', 'Subscription Details')}>
        <div className='p-6 text-slate-400'>
          {t('payment.subscription.not_found', 'Subscription not found')}
        </div>
      </Page>
    );
  }

  return (
    <Page
      sidebar
      title={t('payment.subscription.view_title', 'Subscription Details')}
      topbar={
        <Topbar
          title={t('payment.subscription.view_title', 'Subscription Details')}
          left={[
            <Button key='back' variant='outline-slate' size='sm' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' className='w-4 h-4 mr-1' />
              {t('actions.back', 'Back')}
            </Button>
          ]}
        />
      }
    >
      <div className='p-6'>
        <div className='bg-white border rounded-lg'>
          <SubscriptionViewer record={subscription} />
        </div>
      </div>
    </Page>
  );
};
