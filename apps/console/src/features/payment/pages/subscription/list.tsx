import { useCallback, useState } from 'react';

import { AlertDialog, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { SubscriptionQueryParams, queryFields } from '../../config/subscription/query';
import { tableColumns } from '../../config/subscription/table';
import { SubscriptionViewer } from '../../forms/subscription_viewer';
import { useSubscriptionList } from '../../hooks';
import { PaymentSubscription } from '../../payment';
import { useCancelSubscription } from '../../service';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const SubscriptionListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();
  const { vmode } = useLayoutContext();
  const toast = useToastMessage();

  const { data, fetchData, loading, refetch } = useSubscriptionList();
  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<PaymentSubscription | null>(null);
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    item: PaymentSubscription | null;
  }>({ open: false, item: null });

  const {
    handleSubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<SubscriptionQueryParams>();
  const cancelMutation = useCancelSubscription();

  const onQuery = handleSubmit(async queryData => {
    const cleaned = Object.entries(queryData).reduce((acc: any, [k, v]) => {
      if (v !== undefined && v !== null && v !== '') acc[k] = v;
      return acc;
    }, {});
    await fetchData({ ...cleaned, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
    fetchData({ limit: 20 });
    refetch();
  };

  const handleView = useCallback(
    (record: PaymentSubscription | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);
      if (vmode === 'flatten') navigate(`${type}${record?.id ? `/${record.id}` : ''}`);
    },
    [navigate, vmode]
  );

  const handleCancel = useCallback((record: PaymentSubscription) => {
    setCancelDialog({ open: true, item: record });
  }, []);

  const confirmCancel = useCallback(() => {
    if (!cancelDialog.item?.id) return;
    cancelMutation.mutate(cancelDialog.item.id, {
      onSuccess: () => {
        setCancelDialog({ open: false, item: null });
        toast.success(t('messages.success'), {
          description: t('payment.messages.subscription_cancelled', 'Subscription cancelled')
        });
        refetch();
      },
      onError: (error: any) => {
        toast.error(t('messages.error'), {
          description: error?.message || t('messages.unknown_error')
        });
      }
    });
  }, [cancelDialog.item, cancelMutation, refetch, t, toast]);

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={t('payment.subscription.title', 'Subscriptions')}
        topbarLeft={[]}
        topbarRight={[]}
        columns={tableColumns({ handleView, handleCancel })}
        data={data?.items || []}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        viewComponent={record => <SubscriptionViewer record={record} />}
        type={viewType}
        record={selectedRecord}
        onCancel={() => {
          setSelectedRecord(null);
          setViewType(undefined);
          if (vmode === 'flatten' && viewType) navigate(-1);
        }}
      />

      <AlertDialog
        title={t('payment.dialogs.cancel_subscription_title', 'Cancel Subscription')}
        description={t(
          'payment.dialogs.cancel_subscription_description',
          'Are you sure you want to cancel this subscription?'
        )}
        isOpen={cancelDialog.open}
        onChange={() => setCancelDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel', 'Cancel')}
        confirmText={t('payment.actions.confirm_cancel', 'Confirm Cancel')}
        onCancel={() => setCancelDialog({ open: false, item: null })}
        onConfirm={confirmCancel}
      />
    </>
  );
};
