import { useCallback, useEffect, useState } from 'react';

import { AlertDialog, useToastMessage, Modal } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { TenantBillingManagement } from '../components/billing_management';
import { TenantQuotaManagement } from '../components/quota_management';
import { TenantSettings } from '../components/settings';
import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { TenantExportForm } from '../forms/export';
import { TenantImportForm } from '../forms/import';
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
  const toast = useToastMessage();

  const { data, fetchData, loading, refetch } = useTenantList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Tenant | null>(null);
  const [selectedTenants, setSelectedTenants] = useState<Tenant[]>([]);

  // Modal states
  const [settingsModal, setSettingsModal] = useState<{
    open: boolean;
    tenant: Tenant | null;
    activeTab?: string;
  }>({ open: false, tenant: null, activeTab: 'general' });

  const [quotasModal, setQuotasModal] = useState<{
    open: boolean;
    tenant: Tenant | null;
  }>({ open: false, tenant: null });

  const [billingModal, setBillingModal] = useState<{
    open: boolean;
    tenant: Tenant | null;
  }>({ open: false, tenant: null });

  const [importModal, setImportModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    tenant: Tenant | null;
  }>({ open: false, tenant: null });

  // Form controls
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

  // Mutations
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

  // Query handlers
  const onQuery = handleQuerySubmit(async queryData => {
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

  // View handlers
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

  // Success/Error handlers
  const onSuccess = useCallback(
    (message: string) => {
      toast.success(t('messages.success'), {
        description: message
      });
      handleClose();
      refetch();
    },
    [handleClose, refetch, t, toast]
  );

  const onError = useCallback(
    (error: any) => {
      toast.error(t('messages.error'), {
        description: error.message || t('messages.unknown_error')
      });
    },
    [t, toast]
  );

  // CRUD handlers with enhanced validation
  const handleCreate = useCallback(
    (data: Tenant) => {
      // Transform and validate data
      const transformedData = {
        ...data,
        slug: data.slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        expired_at: data.expired_at ? new Date(data.expired_at).getTime() : null,
        order: Number(data.order) || 0,
        disabled: Boolean(data.disabled)
      };

      createTenantMutation.mutate(transformedData, {
        onSuccess: () => onSuccess(t('tenant.messages.create_success')),
        onError
      });
    },
    [createTenantMutation, onSuccess, onError, t]
  );

  const handleUpdate = useCallback(
    (data: Tenant) => {
      const transformedData = {
        ...data,
        expired_at: data.expired_at ? new Date(data.expired_at).getTime() : null,
        order: Number(data.order) || 0,
        disabled: Boolean(data.disabled)
      };

      updateTenantMutation.mutate(transformedData, {
        onSuccess: () => onSuccess(t('tenant.messages.update_success')),
        onError
      });
    },
    [updateTenantMutation, onSuccess, onError, t]
  );

  const handleDelete = useCallback((record: Tenant) => {
    setDeleteDialog({ open: true, tenant: record });
  }, []);

  // Management handlers with tab support
  const handleSettings = useCallback((record: Tenant, activeTab = 'general') => {
    setSettingsModal({ open: true, tenant: record, activeTab });
  }, []);

  const handleUsers = useCallback((record: Tenant) => {
    navigate(`/sys/tenants/${record.slug}/users`);
  }, []);

  const handleQuotas = useCallback((record: Tenant) => {
    setQuotasModal({ open: true, tenant: record });
  }, []);

  const handleBilling = useCallback((record: Tenant) => {
    setBillingModal({ open: true, tenant: record });
  }, []);

  // Import/Export handlers
  const handleImport = useCallback(() => {
    setImportModal(true);
  }, []);

  const handleExport = useCallback(() => {
    setExportModal(true);
  }, []);

  const handleImportSubmit = useCallback(
    (data: any) => {
      console.log('Import data:', data);
      setImportModal(false);
      toast.success(t('messages.success'), {
        description: t('tenant.import.success')
      });
      refetch();
    },
    [toast, t, refetch]
  );

  const handleExportSubmit = useCallback(
    (data: any) => {
      console.log('Export data:', data);
      setExportModal(false);
      toast.success(t('messages.success'), {
        description: t('tenant.export.success')
      });
    },
    [toast, t]
  );

  const confirmDelete = useCallback(() => {
    if (!deleteDialog.tenant) return;

    deleteTenantMutation.mutate(deleteDialog.tenant.slug || '', {
      onSuccess: () => {
        setDeleteDialog({ open: false, tenant: null });
        onSuccess(t('tenant.messages.delete_success'));
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

  // Table configuration with enhanced actions
  const tableConfig = {
    columns: tableColumns({
      handleView,
      handleDelete,
      handleSettings,
      handleQuotas,
      handleBilling,
      handleUsers
    }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection({ handleImport, handleExport }),
    title: t('tenant.title'),
    selectable: true,
    onSelectionChange: setSelectedTenants
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
        selected={tableConfig.selectable}
        // onSelectionChange={tableConfig.onSelectionChange}
        createComponent={
          <CreateTenantPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            setValue={setFormValue}
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

      {/* Enhanced Tenant Settings Modal with tab support */}
      <TenantSettings
        isOpen={settingsModal.open}
        onClose={() => setSettingsModal({ open: false, tenant: null, activeTab: 'general' })}
        tenant={settingsModal.tenant}
        initialTab={settingsModal.activeTab}
        onSuccess={() => {
          setSettingsModal({ open: false, tenant: null, activeTab: 'general' });
          refetch();
        }}
        // Navigation callbacks for cross-page interactions
        onNavigateToQuotas={tenant => {
          setSettingsModal({ open: false, tenant: null, activeTab: 'general' });
          setQuotasModal({ open: true, tenant });
        }}
        onNavigateToBilling={tenant => {
          setSettingsModal({ open: false, tenant: null, activeTab: 'general' });
          setBillingModal({ open: true, tenant });
        }}
        onNavigateToView={tenant => {
          setSettingsModal({ open: false, tenant: null, activeTab: 'general' });
          handleView(tenant, 'view');
        }}
        onNavigateToEdit={tenant => {
          setSettingsModal({ open: false, tenant: null, activeTab: 'general' });
          handleView(tenant, 'edit');
        }}
      />

      {/* Tenant Quotas Management Modal */}
      <Modal
        isOpen={quotasModal.open}
        onCancel={() => setQuotasModal({ open: false, tenant: null })}
        title={t('tenant.quotas.manage_title')}
        className='max-w-6xl'
      >
        {quotasModal.tenant && (
          <TenantQuotaManagement
            tenant={quotasModal.tenant}
            onNavigateToSettings={tenant => {
              setQuotasModal({ open: false, tenant: null });
              setSettingsModal({ open: true, tenant, activeTab: 'quotas' });
            }}
          />
        )}
      </Modal>

      {/* Tenant Billing Management Modal */}
      <Modal
        isOpen={billingModal.open}
        onCancel={() => setBillingModal({ open: false, tenant: null })}
        title={t('tenant.billing.manage_title')}
        className='max-w-6xl'
      >
        {billingModal.tenant && (
          <TenantBillingManagement
            tenant={billingModal.tenant}
            onNavigateToSettings={tenant => {
              setBillingModal({ open: false, tenant: null });
              setSettingsModal({ open: true, tenant, activeTab: 'billing' });
            }}
          />
        )}
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={importModal} title={t('tenant.import.title')}>
        <TenantImportForm onSubmit={handleImportSubmit} onCancel={() => setImportModal(false)} />
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={exportModal} title={t('tenant.export.title')}>
        <TenantExportForm
          onSubmit={handleExportSubmit}
          onCancel={() => setExportModal(false)}
          tenantCount={data?.total || 0}
          selectedTenants={selectedTenants}
        />
      </Modal>

      {/* Delete confirmation dialog */}
      <AlertDialog
        title={t('tenant.dialogs.delete_title')}
        description={t('tenant.dialogs.delete_description')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !deleteDialog.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.delete')}
        onCancel={() => setDeleteDialog({ open: false, tenant: null })}
        onConfirm={confirmDelete}
      />
    </>
  );
};
