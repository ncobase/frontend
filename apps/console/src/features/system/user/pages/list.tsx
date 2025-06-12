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
import {
  useCreateUserWithProfile,
  useUpdateUserWithProfile,
  useDeleteUser,
  useUpdateStatus
} from '../service';
import { User } from '../user';

import { CreateUserPage } from './create';
import { EditorUserPage } from './editor';
import { UserViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';
import { useSpaceContext } from '@/features/space/context';

export const UserListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();
  const { space_id } = useSpaceContext();
  const toast = useToastMessage();

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
  const updateStatusMutation = useUpdateStatus();

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
      createUserMutation.mutate(data, {
        onSuccess: () => onSuccess(t('user.messages.create_success')),
        onError
      });
    },
    [createUserMutation, onSuccess, onError, t]
  );

  const handleUpdate = useCallback(
    (data: any) => {
      updateUserMutation.mutate(data, {
        onSuccess: () => onSuccess(t('user.messages.update_success')),
        onError
      });
    },
    [updateUserMutation, onSuccess, onError, t]
  );

  const handleDelete = useCallback((record: User) => {
    setDeleteDialog({ open: true, user: record });
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteDialog.user?.id) return;

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
  }, [deleteDialog.user, deleteUserMutation, onSuccess, onError, t]);

  const handleStatusToggle = useCallback(
    (user: User) => {
      const newStatus = user.status === 0 ? 2 : 0; // Toggle between active and disabled
      updateStatusMutation.mutate(
        { username: user.username, status: newStatus },
        {
          onSuccess: () => {
            toast.success(t('messages.success'), {
              description:
                newStatus === 0 ? t('user.messages.enabled') : t('user.messages.disabled')
            });
            refetch();
          },
          onError
        }
      );
    },
    [updateStatusMutation, toast, t, refetch, onError]
  );

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
      setEmployeeModal
    }),
    topbarLeft: topbarLeftSection({ handleView }),
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

      {/* API Key Management Modal */}
      <Modal
        isOpen={apiKeyModal.open}
        onCancel={() => setApiKeyModal({ open: false, user: null })}
        title={t('user.api_keys.manage_title')}
        className='max-w-4xl'
      >
        {apiKeyModal.user && <ApiKey userId={apiKeyModal.user.id} />}
      </Modal>

      {/* Employee Management Modal */}
      <Modal
        isOpen={employeeModal.open}
        onCancel={() => setEmployeeModal({ open: false, user: null })}
        title={t('user.employee.manage_title')}
        className='max-w-6xl'
      >
        {employeeModal.user && <EmployeeManagement />}
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
