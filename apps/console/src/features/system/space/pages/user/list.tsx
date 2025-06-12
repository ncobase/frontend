import { useCallback, useEffect, useState } from 'react';

import { AlertDialog, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { SpaceUserBulkActions } from '../../components/user_bulk_actions';
import { SpaceUserRoleManagement } from '../../components/user_role_management';
import { queryFields, QueryFormParams } from '../../config/user/query';
import { tableColumns } from '../../config/user/table';
import { topbarLeftSection, topbarRightSection } from '../../config/user/topbar';
import { useSpaceUserList } from '../../hooks/user';
import {
  useAddUserToSpaceRole,
  useRemoveUserFromSpaceRole,
  useBulkUpdateUserSpaceRoles
} from '../../service';

import { CreateSpaceUserPage } from './create';
import { EditSpaceUserPage } from './edit';
import { SpaceUserViewPage } from './view';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const SpaceUserListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceId, mode, userId } = useParams<{
    spaceId: string;
    mode: string;
    userId: string;
  }>();

  console.log('userId', userId, mode, userId);

  const { vmode } = useLayoutContext();
  const toast = useToastMessage();

  // Ensure spaceId exists
  if (!spaceId) {
    return (
      <div className='p-8 text-center'>
        <div className='text-red-500'>{t('space.users.errors.no_space_id')}</div>
      </div>
    );
  }

  const { data, fetchData, loading, refetch } = useSpaceUserList(spaceId);

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [roleManagementModal, setRoleManagementModal] = useState<{
    open: boolean;
    user: any | null;
  }>({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: any | null;
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

  const addUserMutation = useAddUserToSpaceRole();
  const removeUserMutation = useRemoveUserFromSpaceRole();
  const bulkUpdateMutation = useBulkUpdateUserSpaceRoles();

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

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

  const handleView = useCallback(
    (record: any | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);

      if (vmode === 'flatten') {
        navigate(
          `/sys/spaces/${spaceId}/users/${type}${record?.user_id ? `/${record.user_id}` : ''}`
        );
      }
    },
    [navigate, vmode, spaceId]
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
      setSelectedUsers([]);
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

  const handleCreate = useCallback(
    (data: any) => {
      addUserMutation.mutate(
        { spaceId, ...data },
        {
          onSuccess: () => onSuccess(t('space.users.messages.add_success')),
          onError
        }
      );
    },
    [addUserMutation, spaceId, onSuccess, onError, t]
  );

  const handleUpdate = useCallback(
    (data: any) => {
      // Update user space roles
      bulkUpdateMutation.mutate(
        {
          spaceId,
          updates: [
            {
              user_id: data.user_id,
              role_id: Array.isArray(data.role_ids) ? data.role_ids[0] : data.role_ids,
              operation: 'update'
            }
          ]
        },
        {
          onSuccess: () => onSuccess(t('space.users.messages.update_success')),
          onError
        }
      );
    },
    [bulkUpdateMutation, spaceId, onSuccess, onError, t]
  );

  const handleDelete = useCallback((record: any) => {
    setDeleteDialog({ open: true, user: record });
  }, []);

  const handleRoleManagement = useCallback((user: any) => {
    setRoleManagementModal({ open: true, user });
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteDialog.user) return;

    // Remove all roles for this user from space
    const userRoles = deleteDialog.user.role_ids || [];
    if (userRoles.length > 0) {
      Promise.all(
        userRoles.map((roleId: string) =>
          removeUserMutation.mutateAsync({
            spaceId,
            userId: deleteDialog.user.user_id,
            roleId
          })
        )
      )
        .then(() => {
          setDeleteDialog({ open: false, user: null });
          onSuccess(t('space.users.messages.remove_success'));
        })
        .catch(onError);
    }
  }, [deleteDialog.user, removeUserMutation, spaceId, onSuccess, onError, t]);

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
      handleRoleManagement
    }),
    topbarLeft: topbarLeftSection({
      handleView,
      handleBack: () => navigate('/sys/spaces')
    }),
    topbarRight: topbarRightSection,
    title: t('space.users.title')
  };

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={tableConfig.title}
        topbarLeft={tableConfig.topbarLeft}
        topbarRight={tableConfig.topbarRight}
        columns={tableConfig.columns}
        data={data?.users || []}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        createComponent={
          <CreateSpaceUserPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <SpaceUserViewPage viewMode={vmode} handleView={handleView} record={record?.user_id} />
        )}
        editComponent={record => (
          <EditSpaceUserPage
            viewMode={vmode}
            record={record?.user_id}
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

      {/* Bulk Actions */}
      <SpaceUserBulkActions
        spaceId={spaceId}
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
        onSuccess={() => {
          onSuccess(t('space.users.messages.bulk_success'));
        }}
      />

      {/* Role Management Modal */}
      <SpaceUserRoleManagement
        isOpen={roleManagementModal.open}
        onClose={() => setRoleManagementModal({ open: false, user: null })}
        spaceId={spaceId}
        user={roleManagementModal.user}
        onSuccess={() => {
          setRoleManagementModal({ open: false, user: null });
          refetch();
        }}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        title={t('space.users.dialogs.remove_title')}
        description={t('space.users.dialogs.remove_description')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !deleteDialog.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.remove')}
        onCancel={() => setDeleteDialog({ open: false, user: null })}
        onConfirm={confirmDelete}
      />
    </>
  );
};
