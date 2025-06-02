import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useUserList } from '../hooks';
import { useCreateUser, useDeleteUser, useUpdateUser } from '../service';
import { User } from '../user';

import { CreateUserPage } from './create';
import { EditorUserPage } from './editor';
import { UserViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const UserListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();

  const { data, fetchData, loading, refetch } = useUserList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<User | null>(null);

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
  } = useForm<User>();

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

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

  const onSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: User) => {
      createUserMutation.mutate(data, { onSuccess });
    },
    [createUserMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: User) => {
      updateUserMutation.mutate(data, { onSuccess });
    },
    [updateUserMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: User) => {
      if (record.id) {
        deleteUserMutation.mutate(record.id, { onSuccess });
      }
    },
    [deleteUserMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: User) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection,
    title: t('system.users.title')
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
  );
};
