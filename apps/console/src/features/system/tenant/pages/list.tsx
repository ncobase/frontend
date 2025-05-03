import { useCallback, useEffect, useState } from 'react';

import { AlertDialog, useToastMessage } from '@ncobase/react';
import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateTenant, useDeleteTenant, useListTenants, useUpdateTenant } from '../service';
import { Tenant } from '../tenant';

import { CreateTenantPage } from './create';
import { EditorTenantPage } from './editor';
import { TenantViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const TenantListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryFormParams>({ limit: 20 });
  const { data, refetch, isLoading } = useListTenants(queryParams);
  const { vmode } = useLayoutContext();

  const toast = useToastMessage();

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    tenant: Tenant | null;
  }>({
    open: false,
    tenant: null
  });

  // Setup query form
  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(async data => {
    // Remove empty values from the query
    const cleanedData = Object.entries(data).reduce((acc: any, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    setQueryParams(prev => ({ ...prev, ...cleanedData, cursor: '' }));
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
    setQueryParams({ limit: 20 });
    refetch();
  };

  // View handling
  const [viewType, setViewType] = useState<string | undefined>();
  const { mode } = useParams<{ mode: string; slug: string }>();

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const [selectedRecord, setSelectedRecord] = useState<Tenant | null>(null);

  const handleView = useCallback(
    (record: Tenant | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);
      if (vmode === 'flatten') {
        navigate(`${type}${record ? `/${record.slug}` : ''}`);
      }
    },
    [navigate, vmode]
  );

  // Form handling
  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Tenant>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  // Mutations
  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();
  const deleteTenantMutation = useDeleteTenant();

  // Success handlers
  const onSuccess = useCallback(
    (message: string) => {
      toast.success(t('messages.success', 'Success'), {
        description: message
      });
      handleClose();
      refetch();
    },
    [handleClose, refetch, t]
  );

  // Error handler
  const onError = useCallback(
    (error: any) => {
      toast.error(t('message.error', 'Error'), {
        description: error.message || t('messages.unknown_error', 'An unknown error occurred')
      });
    },
    [t]
  );

  // Create tenant handler
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

  // Update tenant handler
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

  // Delete tenant handler
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

  // Form submission handler
  const handleConfirm = useCallback(
    handleFormSubmit((data: Tenant) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  // Data fetching handler
  const fetchData = useCallback(
    async (newQueryParams: QueryFormParams) => {
      const mergedQueryParams = { ...queryParams, ...newQueryParams };
      if (
        (isEqual(mergedQueryParams, queryParams) && Object.keys(data || {}).length) ||
        isEqual(newQueryParams, queryParams)
      ) {
        return data;
      }
      setQueryParams(mergedQueryParams);
      return await refetch().then(result => result.data);
    },
    [queryParams, data, refetch]
  );

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={t('tenant.title', 'Tenants')}
        topbarLeft={topbarLeftSection({ handleView })}
        topbarRight={topbarRightSection({ handleView })}
        columns={tableColumns({ handleView, handleDelete })}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={isLoading}
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
        cancelText='Discard'
        confirmText='Save'
        onCancel={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
        onConfirm={confirmDelete}
      />
    </>
  );
};
