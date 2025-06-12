import { useCallback, useEffect, useState } from 'react';

import { AlertDialog, useToastMessage, Modal } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { SpaceBillingManagement } from '../components/billing_management';
import { SpaceQuotaManagement } from '../components/quota_management';
import { SpaceSettings } from '../components/settings';
import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { SpaceExportForm } from '../forms/export';
import { SpaceImportForm } from '../forms/import';
import { useSpaceList } from '../hooks';
import { useCreateSpace, useDeleteSpace, useUpdateSpace } from '../service';
import { Space } from '../space';

import { CreateSpacePage } from './create';
import { EditorSpacePage } from './editor';
import { SpaceViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const SpaceListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();
  const toast = useToastMessage();

  const { data, fetchData, loading, refetch } = useSpaceList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Space | null>(null);
  const [selectedSpaces, setSelectedSpaces] = useState<Space[]>([]);

  // Modal states
  const [settingsModal, setSettingsModal] = useState<{
    open: boolean;
    space: Space | null;
    activeTab?: string;
  }>({ open: false, space: null, activeTab: 'general' });

  const [quotasModal, setQuotasModal] = useState<{
    open: boolean;
    space: Space | null;
  }>({ open: false, space: null });

  const [billingModal, setBillingModal] = useState<{
    open: boolean;
    space: Space | null;
  }>({ open: false, space: null });

  const [importModal, setImportModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    space: Space | null;
  }>({ open: false, space: null });

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
  } = useForm<Space>();

  // Mutations
  const createSpaceMutation = useCreateSpace();
  const updateSpaceMutation = useUpdateSpace();
  const deleteSpaceMutation = useDeleteSpace();

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
    (record: Space | null, type: string) => {
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
    (data: Space) => {
      // Transform and validate data
      const transformedData = {
        ...data,
        slug: data.slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        expired_at: data.expired_at ? new Date(data.expired_at).getTime() : null,
        order: Number(data.order) || 0,
        disabled: Boolean(data.disabled)
      };

      createSpaceMutation.mutate(transformedData, {
        onSuccess: () => onSuccess(t('space.messages.create_success')),
        onError
      });
    },
    [createSpaceMutation, onSuccess, onError, t]
  );

  const handleUpdate = useCallback(
    (data: Space) => {
      const transformedData = {
        ...data,
        expired_at: data.expired_at ? new Date(data.expired_at).getTime() : null,
        order: Number(data.order) || 0,
        disabled: Boolean(data.disabled)
      };

      updateSpaceMutation.mutate(transformedData, {
        onSuccess: () => onSuccess(t('space.messages.update_success')),
        onError
      });
    },
    [updateSpaceMutation, onSuccess, onError, t]
  );

  const handleDelete = useCallback((record: Space) => {
    setDeleteDialog({ open: true, space: record });
  }, []);

  // Management handlers with tab support
  const handleSettings = useCallback((record: Space, activeTab = 'general') => {
    setSettingsModal({ open: true, space: record, activeTab });
  }, []);

  const handleUsers = useCallback((record: Space) => {
    navigate(`/sys/spaces/${record.slug}/users`);
  }, []);

  const handleQuotas = useCallback((record: Space) => {
    setQuotasModal({ open: true, space: record });
  }, []);

  const handleBilling = useCallback((record: Space) => {
    setBillingModal({ open: true, space: record });
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
        description: t('space.import.success')
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
        description: t('space.export.success')
      });
    },
    [toast, t]
  );

  const confirmDelete = useCallback(() => {
    if (!deleteDialog.space) return;

    deleteSpaceMutation.mutate(deleteDialog.space.slug || '', {
      onSuccess: () => {
        setDeleteDialog({ open: false, space: null });
        onSuccess(t('space.messages.delete_success'));
      },
      onError: error => {
        setDeleteDialog({ open: false, space: null });
        onError(error);
      }
    });
  }, [deleteDialog.space, deleteSpaceMutation, onSuccess, onError, t]);

  const handleConfirm = useCallback(
    handleFormSubmit((data: Space) => {
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
    title: t('space.title'),
    selectable: true,
    onSelectionChange: setSelectedSpaces
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
          <CreateSpacePage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            setValue={setFormValue}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <SpaceViewerPage viewMode={vmode} handleView={handleView} record={record?.slug} />
        )}
        editComponent={record => (
          <EditorSpacePage
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

      {/* Enhanced Space Settings Modal with tab support */}
      <SpaceSettings
        isOpen={settingsModal.open}
        onClose={() => setSettingsModal({ open: false, space: null, activeTab: 'general' })}
        space={settingsModal.space}
        initialTab={settingsModal.activeTab}
        onSuccess={() => {
          setSettingsModal({ open: false, space: null, activeTab: 'general' });
          refetch();
        }}
        // Navigation callbacks for cross-page interactions
        onNavigateToQuotas={space => {
          setSettingsModal({ open: false, space: null, activeTab: 'general' });
          setQuotasModal({ open: true, space });
        }}
        onNavigateToBilling={space => {
          setSettingsModal({ open: false, space: null, activeTab: 'general' });
          setBillingModal({ open: true, space });
        }}
        onNavigateToView={space => {
          setSettingsModal({ open: false, space: null, activeTab: 'general' });
          handleView(space, 'view');
        }}
        onNavigateToEdit={space => {
          setSettingsModal({ open: false, space: null, activeTab: 'general' });
          handleView(space, 'edit');
        }}
      />

      {/* Space Quotas Management Modal */}
      <Modal
        isOpen={quotasModal.open}
        onCancel={() => setQuotasModal({ open: false, space: null })}
        title={t('space.quotas.manage_title')}
        className='max-w-6xl'
      >
        {quotasModal.space && (
          <SpaceQuotaManagement
            space={quotasModal.space}
            onNavigateToSettings={space => {
              setQuotasModal({ open: false, space: null });
              setSettingsModal({ open: true, space, activeTab: 'quotas' });
            }}
          />
        )}
      </Modal>

      {/* Space Billing Management Modal */}
      <Modal
        isOpen={billingModal.open}
        onCancel={() => setBillingModal({ open: false, space: null })}
        title={t('space.billing.manage_title')}
        className='max-w-6xl'
      >
        {billingModal.space && (
          <SpaceBillingManagement
            space={billingModal.space}
            onNavigateToSettings={space => {
              setBillingModal({ open: false, space: null });
              setSettingsModal({ open: true, space, activeTab: 'billing' });
            }}
          />
        )}
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={importModal} title={t('space.import.title')}>
        <SpaceImportForm onSubmit={handleImportSubmit} onCancel={() => setImportModal(false)} />
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={exportModal} title={t('space.export.title')}>
        <SpaceExportForm
          onSubmit={handleExportSubmit}
          onCancel={() => setExportModal(false)}
          spaceCount={data?.total || 0}
          selectedSpaces={selectedSpaces}
        />
      </Modal>

      {/* Delete confirmation dialog */}
      <AlertDialog
        title={t('space.dialogs.delete_title')}
        description={t('space.dialogs.delete_description')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !deleteDialog.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.delete')}
        onCancel={() => setDeleteDialog({ open: false, space: null })}
        onConfirm={confirmDelete}
      />
    </>
  );
};
