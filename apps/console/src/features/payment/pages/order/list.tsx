import { useCallback, useState } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { OrderQueryParams, queryFields } from '../../config/order/query';
import { tableColumns } from '../../config/order/table';
import { OrderViewer } from '../../forms/order_viewer';
import { RefundDialog } from '../../forms/refund_dialog';
import { useOrderList } from '../../hooks';
import { PaymentOrder } from '../../payment';
import { useRefundOrder } from '../../service';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const OrderListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();
  const { vmode } = useLayoutContext();
  const toast = useToastMessage();

  const { data, fetchData, loading, refetch } = useOrderList();
  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<PaymentOrder | null>(null);
  const [refundDialog, setRefundDialog] = useState<{ open: boolean; order: PaymentOrder | null }>({
    open: false,
    order: null
  });

  const { handleSubmit, control: queryControl, reset: queryReset } = useForm<OrderQueryParams>();
  const refundMutation = useRefundOrder();

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
    (record: PaymentOrder | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);
      if (vmode === 'flatten') navigate(`${type}${record?.id ? `/${record.id}` : ''}`);
    },
    [navigate, vmode]
  );

  const handleRefund = useCallback((record: PaymentOrder) => {
    setRefundDialog({ open: true, order: record });
  }, []);

  const confirmRefund = useCallback(
    (orderId: string, amount?: number, reason?: string) => {
      refundMutation.mutate(
        { id: orderId, amount, reason },
        {
          onSuccess: () => {
            setRefundDialog({ open: false, order: null });
            toast.success(t('messages.success'), {
              description: t('payment.messages.refund_success', 'Refund processed')
            });
            refetch();
          },
          onError: (error: any) => {
            toast.error(t('messages.error'), {
              description: error?.message || t('messages.unknown_error')
            });
          }
        }
      );
    },
    [refundMutation, refetch, t, toast]
  );

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={t('payment.order.title', 'Orders')}
        topbarLeft={[]}
        topbarRight={[]}
        columns={tableColumns({ handleView, handleRefund })}
        data={data?.items || []}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        viewComponent={record => <OrderViewer record={record} />}
        type={viewType}
        record={selectedRecord}
        onCancel={() => {
          setSelectedRecord(null);
          setViewType(undefined);
          if (vmode === 'flatten' && viewType) navigate(-1);
        }}
      />

      <RefundDialog
        isOpen={refundDialog.open}
        order={refundDialog.order}
        onClose={() => setRefundDialog({ open: false, order: null })}
        onConfirm={confirmRefund}
      />
    </>
  );
};
