import { useState, useCallback } from 'react';

import {
  Button,
  Icons,
  Badge,
  TableView,
  Tooltip,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  AlertDialog,
  useToastMessage,
  Modal
} from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { SpaceBillingManagement } from '../components/billing_management';
import { SpaceQuotaManagement } from '../components/quota_management';
import { SpaceSettings } from '../components/settings';
import { SpaceExportForm } from '../forms/export';
import { SpaceImportForm } from '../forms/import';
import { useSpaceList } from '../hooks';
import { useDeleteSpace, useUpdateSpace } from '../service';
import { Space } from '../space';

import { BulkActions } from '@/components/bulk_actions';
import { Page, Topbar } from '@/components/layout';
import { ContentSearch } from '@/components/search/content';

export const SpaceListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToastMessage();

  const [searchParams, setSearchParams] = useState({
    search: '',
    type: '',
    disabled: '',
    limit: 50
  });
  const [selectedItems, setSelectedItems] = useState<Space[]>([]);

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

  const { data: spaceData, loading, refetch } = useSpaceList(searchParams);
  const deleteSpaceMutation = useDeleteSpace();
  const updateSpaceMutation = useUpdateSpace();

  const spaces = spaceData?.items || [];

  const handleSearch = useCallback((query: string, filters: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      type: filters.type || '',
      disabled: filters.status || '',
      cursor: ''
    }));
  }, []);

  const handleToggleSelect = useCallback((item: Space) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      return isSelected ? prev.filter(selected => selected.id !== item.id) : [...prev, item];
    });
  }, []);

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(ids.map(id => deleteSpaceMutation.mutateAsync(id)));
        toast.success(t('messages.success'), {
          description: t('space.messages.bulk_delete_success')
        });
        setSelectedItems([]);
        refetch();
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('space.messages.bulk_delete_failed')
        });
      }
    },
    [deleteSpaceMutation, toast, t, refetch]
  );

  const handleDelete = useCallback((space: Space) => {
    setDeleteDialog({ open: true, space });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteDialog.space) return;

    try {
      await deleteSpaceMutation.mutateAsync(deleteDialog.space.id || '');
      toast.success(t('messages.success'), {
        description: t('space.messages.delete_success')
      });
      setDeleteDialog({ open: false, space: null });
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.messages.delete_failed')
      });
      setDeleteDialog({ open: false, space: null });
    }
  }, [deleteDialog.space, deleteSpaceMutation, toast, t, refetch]);

  const handleToggleStatus = useCallback(
    async (space: Space) => {
      try {
        await updateSpaceMutation.mutateAsync({
          ...space,
          disabled: !space.disabled
        });
        toast.success(t('messages.success'), {
          description: space.disabled
            ? t('space.messages.enable_success')
            : t('space.messages.disable_success')
        });
        refetch();
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('space.messages.status_toggle_failed')
        });
      }
    },
    [updateSpaceMutation, toast, t, refetch]
  );

  // Management handlers
  const handleSettings = useCallback((space: Space, activeTab = 'general') => {
    setSettingsModal({ open: true, space, activeTab });
  }, []);

  const handleUsers = useCallback(
    (space: Space) => {
      navigate(`/spaces/${space.id}/users`);
    },
    [navigate]
  );

  const handleQuotas = useCallback((space: Space) => {
    setQuotasModal({ open: true, space });
  }, []);

  const handleBilling = useCallback((space: Space) => {
    setBillingModal({ open: true, space });
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

  const getSpaceTypeBadge = (type: string) => {
    const typeConfig = {
      private: { variant: 'primary', label: t('common.types.private'), icon: 'IconLock' },
      public: { variant: 'success', label: t('common.types.public'), icon: 'IconWorld' },
      internal: { variant: 'warning', label: t('common.types.internal'), icon: 'IconBuilding' },
      external: { variant: 'info', label: t('common.types.external'), icon: 'IconExternalLink' },
      other: { variant: 'secondary', label: t('common.types.other'), icon: 'IconDots' }
    };
    const config = typeConfig[type] || typeConfig.other;
    return (
      <Badge variant={config.variant} className='flex items-center gap-1 px-2 py-1'>
        <Icons name={config.icon} size={12} />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (disabled: boolean, expired?: boolean) => {
    if (expired) {
      return (
        <Badge variant='danger' className='flex items-center gap-1 px-2 py-1'>
          <Icons name='IconCalendarX' size={12} />
          {t('space.status.expired')}
        </Badge>
      );
    }
    return (
      <Badge
        variant={disabled ? 'warning' : 'success'}
        className='flex items-center gap-1 px-2 py-1'
      >
        <Icons name={disabled ? 'IconCirclePause' : 'IconCircleCheck'} size={12} />
        {disabled ? t('space.status.disabled') : t('space.status.active')}
      </Badge>
    );
  };

  const renderSpaceActions = (space: Space) => (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
          <Icons name='IconDots' size={16} />
        </Button>
      </DropdownTrigger>
      <DropdownContent align='end' className='w-48'>
        <DropdownItem onClick={() => navigate(`/spaces/${space.id}`)}>
          <Icons name='IconEye' className='mr-2' size={16} />
          {t('space.actions.view_details')}
        </DropdownItem>
        <DropdownItem onClick={() => navigate(`/spaces/${space.id}/edit`)}>
          <Icons name='IconPencil' className='mr-2' size={16} />
          {t('space.actions.edit')}
        </DropdownItem>
        <DropdownItem onClick={() => handleUsers(space)}>
          <Icons name='IconUsers' className='mr-2' size={16} />
          {t('space.actions.users')}
        </DropdownItem>
        <DropdownItem onClick={() => handleSettings(space)}>
          <Icons name='IconSettings' className='mr-2' size={16} />
          {t('space.actions.settings')}
        </DropdownItem>
        <DropdownItem onClick={() => handleQuotas(space)}>
          <Icons name='IconGauge' className='mr-2' size={16} />
          {t('space.actions.quotas')}
        </DropdownItem>
        <DropdownItem onClick={() => handleBilling(space)}>
          <Icons name='IconCreditCard' className='mr-2' size={16} />
          {t('space.actions.billing')}
        </DropdownItem>
        <DropdownItem onClick={() => handleToggleStatus(space)}>
          <Icons
            name={space.disabled ? 'IconCircleCheck' : 'IconCirclePause'}
            className='mr-2'
            size={16}
          />
          {space.disabled ? t('space.actions.enable') : t('space.actions.disable')}
        </DropdownItem>
        <DropdownItem
          onClick={() => navigate(`/spaces/${space.id}/clone`)}
          className='border-t mt-1 pt-1'
        >
          <Icons name='IconCopy' className='mr-2' size={16} />
          {t('space.actions.clone')}
        </DropdownItem>
        <DropdownItem
          onClick={() => handleDelete(space)}
          className='text-red-600 focus:text-red-600'
        >
          <Icons name='IconTrash' className='mr-2' size={16} />
          {t('space.actions.delete')}
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );

  // Table columns configuration
  const columns = [
    {
      title: t('space.fields.name'),
      dataIndex: 'name',
      parser: (_: any, space: Space) => (
        <div className='flex items-center space-x-3'>
          {space.logo && (
            <div className='flex-shrink-0'>
              <img
                src={space.logo}
                alt={space.logo_alt || space.name}
                className='w-10 h-10 rounded-lg object-cover border shadow-sm'
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className='min-w-0 flex-1'>
            <Button
              variant='link'
              size='lg'
              className='px-0 h-auto min-h-auto font-semibold text-left'
              onClick={e => {
                e.stopPropagation();
                navigate(`/spaces/${space.id}`);
              }}
            >
              {space.name}
            </Button>
            <div className='flex items-center gap-2 mt-1'>
              <span className='text-xs text-gray-500 font-mono'>{space.slug}</span>
              {space.url && (
                <a
                  href={space.url.startsWith('http') ? space.url : `https://${space.url}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1'
                  onClick={e => e.stopPropagation()}
                >
                  <Icons name='IconExternalLink' size={12} />
                  {space.url}
                </a>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      title: t('space.fields.type'),
      dataIndex: 'type',
      width: 120,
      parser: (_: any, space: Space) => getSpaceTypeBadge(space.type)
    },
    {
      title: t('space.fields.status'),
      dataIndex: 'disabled',
      width: 120,
      parser: (_: any, space: Space) => {
        const isExpired = space.expired_at && new Date(space.expired_at) < new Date();
        return getStatusBadge(space.disabled, isExpired);
      }
    },
    {
      title: t('space.fields.updated_at'),
      dataIndex: 'updated_at',
      width: 140,
      parser: (updated_at: string) => (
        <Tooltip content={formatDateTime(updated_at, 'dateTime')}>
          <span className='text-sm text-gray-500'>{formatRelativeTime(new Date(updated_at))}</span>
        </Tooltip>
      )
    },
    {
      title: t('common.actions'),
      filter: false,
      width: 60,
      parser: (_: any, space: Space) => renderSpaceActions(space)
    }
  ];

  const filterOptions = {
    types: [
      { label: t('common.types.private'), value: 'private' },
      { label: t('common.types.public'), value: 'public' },
      { label: t('common.types.internal'), value: 'internal' },
      { label: t('common.types.external'), value: 'external' },
      { label: t('common.types.other'), value: 'other' }
    ],
    statuses: [
      { label: t('space.status.active'), value: 'active' },
      { label: t('space.status.disabled'), value: 'disabled' }
    ]
  };

  if (loading) {
    return (
      <Page>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <Icons name='IconLoader2' className='animate-spin mx-auto mb-4' size={40} />
            <p className='text-gray-600'>{t('common.loading')}</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={t('space.title')}
      topbar={
        <Topbar
          title={t('space.title')}
          right={[
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant='outline' size='sm' className='flex items-center gap-2'>
                  <Icons name='IconSettings' size={16} />
                  {t('space.actions.manage')}
                  <Icons name='IconChevronDown' size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownContent align='end' className='w-48'>
                <DropdownItem onClick={() => window.location.reload()}>
                  <Icons name='IconRefresh' className='mr-2' size={16} />
                  {t('space.actions.refresh')}
                </DropdownItem>
                <DropdownItem onClick={handleImport}>
                  <Icons name='IconUpload' className='mr-2' size={16} />
                  {t('space.actions.import')}
                </DropdownItem>
                <DropdownItem onClick={handleExport}>
                  <Icons name='IconDownload' className='mr-2' size={16} />
                  {t('space.actions.export')}
                </DropdownItem>
              </DropdownContent>
            </Dropdown>,
            <Button
              size='sm'
              onClick={() => navigate('/spaces/create')}
              className='flex items-center gap-2'
            >
              <Icons name='IconPlus' size={16} />
              {t('space.actions.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-6'
    >
      {/* Content Search */}
      <ContentSearch
        onSearch={handleSearch}
        placeholder={t('space.placeholders.search', 'Search by name or slug')}
        showFilters={true}
        filterOptions={filterOptions}
      />

      {/* Spaces List */}
      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        {spaces.length > 0 ? (
          <TableView
            header={columns}
            selected
            data={spaces}
            onSelectRow={row => handleToggleSelect(row)}
            onSelectAllRows={rows => setSelectedItems(rows)}
            className='[&_table]:border-0'
          />
        ) : (
          <div className='text-center py-16'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
              <Icons name='IconBuilding' size={32} className='text-white' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {t('space.empty.title', 'No spaces found')}
            </h3>
            <p className='text-sm text-gray-500 mb-6 max-w-sm mx-auto'>
              {t('space.empty.description', 'Get started by creating your first space.')}
            </p>
            <Button
              size='sm'
              onClick={() => navigate('/spaces/create')}
              className='inline-flex items-center gap-2'
            >
              <Icons name='IconPlus' size={16} />
              {t('space.actions.create')}
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedItems([])}
        onBulkDelete={handleBulkDelete}
      />

      {/* Modals */}
      <SpaceSettings
        isOpen={settingsModal.open}
        onClose={() => setSettingsModal({ open: false, space: null, activeTab: 'general' })}
        space={settingsModal.space}
        initialTab={settingsModal.activeTab}
        onSuccess={() => {
          setSettingsModal({ open: false, space: null, activeTab: 'general' });
          refetch();
        }}
        onNavigateToQuotas={space => {
          setSettingsModal({ open: false, space: null, activeTab: 'general' });
          setQuotasModal({ open: true, space });
        }}
        onNavigateToBilling={space => {
          setSettingsModal({ open: false, space: null, activeTab: 'general' });
          setBillingModal({ open: true, space });
        }}
        onNavigateToView={space => navigate(`/spaces/${space.id}`)}
        onNavigateToEdit={space => navigate(`/spaces/${space.id}/edit`)}
      />

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

      <Modal isOpen={importModal} title={t('space.import.title')}>
        <SpaceImportForm onSubmit={handleImportSubmit} onCancel={() => setImportModal(false)} />
      </Modal>

      <Modal isOpen={exportModal} title={t('space.export.title')}>
        <SpaceExportForm
          onSubmit={handleExportSubmit}
          onCancel={() => setExportModal(false)}
          spaceCount={spaceData?.total || 0}
          selectedSpaces={selectedItems}
        />
      </Modal>

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
    </Page>
  );
};
