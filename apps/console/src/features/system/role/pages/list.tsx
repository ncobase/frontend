import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useRoleList } from '../hooks';
import { Role } from '../role';
import { useCreateRole, useDeleteRole, useUpdateRole } from '../service';

import { CreateRolePage } from './create';
import { EditorRolePage } from './editor';
import { RoleViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const RoleListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();

  const { data, fetchData, loading, refetch } = useRoleList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Role | null>(null);

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
  } = useForm<Role>();

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

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
    (record: Role | null, type: string) => {
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
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: Role) => {
      createRoleMutation.mutate(data, { onSuccess });
    },
    [createRoleMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Role) => {
      updateRoleMutation.mutate(data, { onSuccess });
    },
    [updateRoleMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Role) => {
      if (record.id) {
        deleteRoleMutation.mutate(record.id, { onSuccess });
      }
    },
    [deleteRoleMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Role) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection,
    title: t('system.roles.title')
  };

  return (
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
        <CreateRolePage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => (
        <RoleViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
      )}
      editComponent={record => (
        <EditorRolePage
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
  );
};
