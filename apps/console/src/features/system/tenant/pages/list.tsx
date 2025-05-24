import { useCallback, useEffect, useState } from 'react';

import { AlertDialog, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useTenantList } from '../hooks';
import { useCreateTenant, useDeleteTenant, useUpdateTenant } from '../service';
import { Tenant } from '../tenant';

import { CreateTenantPage } from './create';
import { EditorTenantPage } from './editor';
import { TenantViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const TenantListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();

  const { data, fetchData, loading, refetch } = useTenantList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Tenant | null>(null);

  const toast = useToastMessage();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    tenant: Tenant | null;
  }>({
    open: false,
    tenant: null
  });

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Tenant>();

  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();
  const deleteTenantMutation = useDeleteTenant();

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const onQuery = handleQuerySubmit(async queryData => {
    // Remove empty values from the query
    const cleanedData = Object.entries(queryData).reduce((acc: any, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    await fetchData({ ...cleanedData, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
    fetchData({ limit: 20 });
    refetch();
  };

  const handleView = useCallback(
    (record: Tenant | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);

      if (vmode === 'flatten') {
        navigate(`${type}${record?.slug ? `/${record.slug}` : ''}`);
      }
    },
    [navigate, vmode]
  );

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();

    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const onSuccess = useCallback(
    (message: string) => {
      toast.success(t('messages.success', 'Success'), {
        description: message
      });
      handleClose();
      refetch();
    },
    [handleClose, refetch, t, toast]
  );

  const onError = useCallback(
    (error: any) => {
      toast.error(t('messages.error', 'Error'), {
        description: error.message || t('messages.unknown_error', 'An unknown error occurred')
      });
    },
    [t, toast]
  );

  const handleCreate = useCallback(
    (data: Tenant) => {
      createTenantMutation.mutate(data, {
        onSuccess: () =>
          onSuccess(t('tenant.messages.create_success', 'Tenant created successfully')),
        onError
      });
    },
    [createTenantMutation, onSuccess, onError, t]
  );

  const handleUpdate = useCallback(
    (data: Tenant) => {
      updateTenantMutation.mutate(data, {
        onSuccess: () =>
          onSuccess(t('tenant.messages.update_success', 'Tenant updated successfully')),
        onError
      });
    },
    [updateTenantMutation, onSuccess, onError, t]
  );

  const handleDelete = useCallback((record: Tenant) => {
    setDeleteDialog({
      open: true,
      tenant: record
    });
  }, []);

  // Confirm deletion
  const confirmDelete = useCallback(() => {
    if (!deleteDialog.tenant) return;

    deleteTenantMutation.mutate(deleteDialog.tenant.slug || '', {
      onSuccess: () => {
        setDeleteDialog({ open: false, tenant: null });
        onSuccess(t('tenant.messages.delete_success', 'Tenant deleted successfully'));
      },
      onError: error => {
        setDeleteDialog({ open: false, tenant: null });
        onError(error);
      }
    });
  }, [deleteDialog.tenant, deleteTenantMutation, onSuccess, onError, t]);

  const handleConfirm = useCallback(
    handleFormSubmit((data: Tenant) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection({ handleView }),
    title: t('tenant.title', 'Tenants')
  };

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={tableConfig.title}
        topbarLeft={tableConfig.topbarLeft}
        topbarRight={tableConfig.topbarRight}
        columns={tableConfig.columns}
        data={data?.items || []}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        createComponent={
          <CreateTenantPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <TenantViewerPage viewMode={vmode} handleView={handleView} record={record?.slug} />
        )}
        editComponent={record => (
          <EditorTenantPage
            viewMode={vmode}
            record={record?.slug}
            onSubmit={handleConfirm}
            control={formControl}
            setValue={setFormValue}
            errors={formErrors}
          />
        )}
        type={viewType}
        record={selectedRecord}
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        title={t('tenant.dialogs.delete_title', 'Delete Tenant')}
        description={t(
          'tenant.dialogs.delete_description',
          'Are you sure you want to delete this tenant? This action cannot be undone.'
        )}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !deleteDialog.open }))}
        cancelText={t('actions.cancel', 'Cancel')}
        confirmText={t('actions.delete', 'Delete')}
        onCancel={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
        onConfirm={confirmDelete}
      />
    </>
  );
};
