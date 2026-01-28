import { useCallback, useState } from 'react';

import { AlertDialog, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { ProductQueryParams, queryFields } from '../../config/product/query';
import { tableColumns } from '../../config/product/table';
import { topbarLeftSection } from '../../config/product/topbar';
import { ProductEditorForm } from '../../forms/product_editor';
import { PaymentProduct } from '../../payment';
import {
  useCreateProduct,
  useDeleteProduct,
  useListProducts,
  useUpdateProduct
} from '../../service';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const ProductListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();
  const { vmode } = useLayoutContext();
  const toast = useToastMessage();

  const [queryParams, setQueryParams] = useState<ProductQueryParams>({ limit: 20 });
  const { data, isLoading, refetch } = useListProducts(queryParams);

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<PaymentProduct | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: PaymentProduct | null;
  }>({ open: false, item: null });

  const { handleSubmit, control: queryControl, reset: queryReset } = useForm<ProductQueryParams>();
  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    handleSubmit: handleFormSubmit
  } = useForm<any>();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const fetchData = useCallback(
    async (params: ProductQueryParams) => {
      setQueryParams(prev => ({ ...prev, ...params }));
      return data;
    },
    [data]
  );

  const onQuery = handleSubmit(async queryData => {
    const cleaned = Object.entries(queryData).reduce((acc: any, [k, v]) => {
      if (v !== undefined && v !== null && v !== '') acc[k] = v;
      return acc;
    }, {});
    setQueryParams({ ...cleaned, cursor: '' });
    refetch();
  });

  const onResetQuery = () => {
    queryReset();
    setQueryParams({ limit: 20 });
    refetch();
  };

  const handleView = useCallback(
    (record: PaymentProduct | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);
      if (vmode === 'flatten') navigate(`${type}${record?.id ? `/${record.id}` : ''}`);
    },
    [navigate, vmode]
  );

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) navigate(-1);
  }, [formReset, navigate, vmode, viewType]);

  const onSuccess = useCallback(
    (msg: string) => {
      toast.success(t('messages.success'), { description: msg });
      handleClose();
      refetch();
    },
    [handleClose, refetch, t, toast]
  );

  const onError = useCallback(
    (error: any) => {
      toast.error(t('messages.error'), {
        description: error?.message || t('messages.unknown_error')
      });
    },
    [t, toast]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: any) => {
      if (viewType === 'create') {
        createMutation.mutate(data, {
          onSuccess: () => onSuccess(t('payment.messages.product_created', 'Product created')),
          onError
        });
      } else {
        updateMutation.mutate(data, {
          onSuccess: () => onSuccess(t('payment.messages.product_updated', 'Product updated')),
          onError
        });
      }
    }),
    [handleFormSubmit, viewType, createMutation, updateMutation, onSuccess, onError, t]
  );

  const handleDelete = useCallback((record: PaymentProduct) => {
    setDeleteDialog({ open: true, item: record });
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteDialog.item?.id) return;
    deleteMutation.mutate(deleteDialog.item.id, {
      onSuccess: () => {
        setDeleteDialog({ open: false, item: null });
        onSuccess(t('payment.messages.product_deleted', 'Product deleted'));
      },
      onError
    });
  }, [deleteDialog.item, deleteMutation, onSuccess, onError, t]);

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={t('payment.product.title', 'Products')}
        topbarLeft={topbarLeftSection({ handleView })}
        topbarRight={[]}
        columns={tableColumns({ handleView, handleDelete })}
        data={data?.items || []}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={isLoading}
        createComponent={
          <ProductEditorForm onSubmit={handleConfirm} control={formControl} errors={formErrors} />
        }
        editComponent={() => (
          <ProductEditorForm onSubmit={handleConfirm} control={formControl} errors={formErrors} />
        )}
        type={viewType}
        record={selectedRecord}
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />

      <AlertDialog
        title={t('payment.dialogs.delete_product_title', 'Delete Product')}
        description={t(
          'payment.dialogs.delete_product_description',
          'Are you sure you want to delete this product?'
        )}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel', 'Cancel')}
        confirmText={t('actions.delete', 'Delete')}
        onCancel={() => setDeleteDialog({ open: false, item: null })}
        onConfirm={confirmDelete}
      />
    </>
  );
};
