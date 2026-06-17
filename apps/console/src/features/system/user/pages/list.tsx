import { useCallback, useEffect, useState } from 'react';

import { Modal, AlertDialog, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { ApiKey } from '../components/api_key';
import { EmployeeManagement } from '../components/employee_management';
import { UserRole } from '../components/user_role';
import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useUserList } from '../hooks';
import { useCreateUserWithProfile, useUpdateUserWithProfile, useDeleteUser } from '../service';
import { User } from '../user';

import { CreateUserPage } from './create';
import { EditorUserPage } from './editor';
import { UserViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';
import { useAuthContext } from '@/features/account/context';
import { usePermissions } from '@/features/account/permissions';
import { useSpaceContext } from '@/features/space/context';

export const UserListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();
  const { space_id } = useSpaceContext();
  const { user: currentUser } = useAuthContext();
  const { hasPermission } = usePermissions();
  const toast = useToastMessage();
  const canCreate = hasPermission('create:users') || hasPermission('manage:users');
  const canUpdate = hasPermission('update:users') || hasPermission('manage:users');
  const canDelete = hasPermission('delete:users') || hasPermission('manage:users');
  const canReadUsers = hasPermission('read:users') || hasPermission('manage:users');
  const canManageRoles = hasPermission('manage:roles');
  const canReadApiKeys = canReadUsers;
  const canDeleteAnyApiKeys = hasPermission('delete:users') || hasPermission('manage:users');
  const canManageOwnApiKeys =
    hasPermission('manage:profile') ||
    hasPermission('create:users') ||
    hasPermission('manage:users');
  const canReadEmployees =
    hasPermission('read:employees') ||
    hasPermission('manage:employees') ||
    hasPermission('manage:hr');
  const canCreateEmployees =
    hasPermission('create:employees') ||
    hasPermission('manage:employees') ||
    hasPermission('manage:hr');
  const canUpdateEmployees =
    hasPermission('update:employees') ||
    hasPermission('manage:employees') ||
    hasPermission('manage:hr');
  const canDeleteEmployees = hasPermission('manage:employees') || hasPermission('manage:hr');

  const { data, fetchData, loading, refetch } = useUserList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<User | null>(null);
  const [roleManagementModal, setRoleManagementModal] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [apiKeyModal, setApiKeyModal] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [employeeModal, setEmployeeModal] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

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
  } = useForm<any>();

  const createUserMutation = useCreateUserWithProfile();
  const updateUserMutation = useUpdateUserWithProfile();
  const deleteUserMutation = useDeleteUser();

  useEffect(() => {
    if (mode === 'create' && !canCreate) {
      setViewType(undefined);
      if (vmode === 'flatten') {
        navigate('/system/users');
      }
      return;
    }

    if (mode === 'edit' && !canUpdate) {
      setViewType(undefined);
      if (vmode === 'flatten') {
        navigate('/system/users');
      }
      return;
    }

    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [canCreate, canUpdate, mode, navigate, vmode]);

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
    (record: User | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);

      if (vmode === 'flatten') {
        navigate(`${type}${record?.id ? `/${record.id}` : ''}`);
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
        description: error['message'] || t('messages.unknown_error')
      });
    },
    [t, toast]
  );

  const handleCreate = useCallback(
    (data: any) => {
      if (!canCreate) return;
      createUserMutation.mutate(data, {
        onSuccess: () => onSuccess(t('user.messages.create_success')),
        onError
      });
    },
    [canCreate, createUserMutation, onSuccess, onError, t]
  );

  const handleUpdate = useCallback(
    (data: any) => {
      if (!canUpdate) return;
      updateUserMutation.mutate(data, {
        onSuccess: () => onSuccess(t('user.messages.update_success')),
        onError
      });
    },
    [canUpdate, updateUserMutation, onSuccess, onError, t]
  );

  const handleDelete = useCallback(
    (record: User) => {
      if (!canDelete) return;
      setDeleteDialog({ open: true, user: record });
    },
    [canDelete]
  );

  const confirmDelete = useCallback(() => {
    if (!canDelete || !deleteDialog.user?.id) return;

    deleteUserMutation.mutate(deleteDialog.user.id, {
      onSuccess: () => {
        setDeleteDialog({ open: false, user: null });
        onSuccess(t('user.messages.delete_success'));
      },
      onError: error => {
        setDeleteDialog({ open: false, user: null });
        onError(error);
      }
    });
  }, [canDelete, deleteDialog.user, deleteUserMutation, onSuccess, onError, t]);

  const handleConfirm = useCallback(
    handleFormSubmit((data: any) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({
      handleView,
      handleDelete,
      setRoleManagementModal,
      setApiKeyModal,
      setEmployeeModal,
      canCreate,
      canUpdate,
      canDelete,
      canManageRoles,
      canReadApiKeys,
      canReadEmployees
    }),
    topbarLeft: topbarLeftSection({ handleView, canCreate }),
    topbarRight: topbarRightSection,
    title: t('system.users.title')
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
          <CreateUserPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <UserViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
        )}
        editComponent={record => (
          <EditorUserPage
            viewMode={vmode}
            record={record?.id}
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

      {/* Role Management Modal */}
      {canManageRoles && (
        <UserRole
          isOpen={roleManagementModal.open}
          onClose={() => setRoleManagementModal({ open: false, user: null })}
          user={roleManagementModal.user}
          currentSpaceId={space_id}
          onSuccess={() => {
            setRoleManagementModal({ open: false, user: null });
            refetch();
          }}
        />
      )}

      {/* API Key Management Modal */}
      <Modal
        isOpen={apiKeyModal.open}
        onCancel={() => setApiKeyModal({ open: false, user: null })}
        title={t('user.api_keys.manage_title')}
        className='max-w-4xl'
      >
        {apiKeyModal.user && (
          <ApiKey
            userId={apiKeyModal.user.id}
            currentUserId={currentUser?.id}
            canCreateOwn={canManageOwnApiKeys}
            canDeleteAny={canDeleteAnyApiKeys}
          />
        )}
      </Modal>

      {/* Employee Management Modal */}
      <Modal
        isOpen={employeeModal.open}
        onCancel={() => setEmployeeModal({ open: false, user: null })}
        title={t('user.employee.manage_title')}
        className='max-w-6xl'
      >
        {employeeModal.user && (
          <EmployeeManagement
            canCreate={canCreateEmployees}
            canUpdate={canUpdateEmployees}
            canDelete={canDeleteEmployees}
          />
        )}
      </Modal>

      {/* Delete confirmation dialog */}
      <AlertDialog
        title={t('user.dialogs.delete_title')}
        description={t('user.dialogs.delete_description')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !deleteDialog.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.delete')}
        onCancel={() => setDeleteDialog({ open: false, user: null })}
        onConfirm={confirmDelete}
      />
    </>
  );
};
