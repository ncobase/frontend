import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { PermissionBulkActions } from '../components/bulk_actions';
import { PermissionRoleAssignment } from '../components/role_assignment';
import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { usePermissionList } from '../hooks';
import { Permission } from '../permission';
import { useCreatePermission, useDeletePermission, useUpdatePermission } from '../service';

import { CreatePermissionPage } from './create';
import { EditorPermissionPage } from './editor';
import { PermissionViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const PermissionListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();

  const { data, fetchData, loading, refetch } = usePermissionList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Permission | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [roleAssignmentModal, setRoleAssignmentModal] = useState<{
    open: boolean;
    permission: Permission | null;
  }>({ open: false, permission: null });

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
  } = useForm<Permission>();

  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const onQuery = handleQuerySubmit(async queryData => {
    await fetchData({ ...queryData, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
  };

  const handleView = useCallback(
    (record: Permission | null, type: string) => {
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

  const onSuccess = useCallback(() => {
    handleClose();
    refetch();
    setSelectedPermissions([]);
  }, [handleClose, refetch]);

  const handleCreate = useCallback(
    (data: Permission) => {
      createPermissionMutation.mutate(data, { onSuccess });
    },
    [createPermissionMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Permission) => {
      updatePermissionMutation.mutate(data, { onSuccess });
    },
    [updatePermissionMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Permission) => {
      if (record.id) {
        deletePermissionMutation.mutate(record.id, { onSuccess });
      }
    },
    [deletePermissionMutation, onSuccess]
  );

  const handleAssignRoles = useCallback((permission: Permission) => {
    setRoleAssignmentModal({ open: true, permission });
  }, []);

  const handleConfirm = useCallback(
    handleFormSubmit((data: Permission) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({
      handleView,
      handleDelete,
      handleAssignRoles
    }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection,
    title: t('system.permissions.title')
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
        selected
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        createComponent={
          <CreatePermissionPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <PermissionViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
        )}
        editComponent={record => (
          <EditorPermissionPage
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

      {/* Bulk Actions */}
      <PermissionBulkActions
        selectedPermissions={selectedPermissions}
        onSelectionChange={setSelectedPermissions}
        onSuccess={onSuccess}
      />

      {/* Role Assignment Modal */}
      <PermissionRoleAssignment
        isOpen={roleAssignmentModal.open}
        onClose={() => setRoleAssignmentModal({ open: false, permission: null })}
        permission={roleAssignmentModal.permission}
        onSuccess={() => {
          setRoleAssignmentModal({ open: false, permission: null });
          refetch();
        }}
      />
    </>
  );
};
