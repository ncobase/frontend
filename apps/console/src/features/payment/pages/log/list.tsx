import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { PaymentLogQueryParams, queryFields } from '../../config/log/query';
import { tableColumns } from '../../config/log/table';
import { usePaymentLogs } from '../../service';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const PaymentLogListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vmode } = useLayoutContext();

  const [queryParams, setQueryParams] = useState<PaymentLogQueryParams>({ page_size: 20 });
  const { data, isLoading, refetch } = usePaymentLogs(queryParams);
  const {
    handleSubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<PaymentLogQueryParams>();

  const fetchData = useCallback(
    async (params: PaymentLogQueryParams) => {
      setQueryParams(prev => ({ ...prev, ...params }));
      return data;
    },
    [data]
  );

  const onQuery = handleSubmit(async queryData => {
    const cleaned = Object.entries(queryData).reduce((acc: Record<string, any>, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    setQueryParams({ page_size: 20, ...cleaned, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
    setQueryParams({ page_size: 20 });
    refetch();
  };

  const handleViewOrder = useCallback(
    (orderId: string) => {
      navigate(`/pay/orders/view/${orderId}`);
    },
    [navigate]
  );

  return (
    <CurdView
      viewMode={vmode}
      title={t('payment.log.title', 'Payment Logs')}
      topbarLeft={[]}
      topbarRight={[]}
      columns={tableColumns({ handleViewOrder })}
      data={data?.items || []}
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      fetchData={fetchData}
      loading={isLoading}
    />
  );
};
