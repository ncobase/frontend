import React, { useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateUser, useDeleteUser, useListUsers, useUpdateUser } from '../service';

import { CreateUserPage } from './create';
import { EditorUserPage } from './editor';
import { UserViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/layout';
import { User } from '@/types';

export const UserListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryFormParams>({ limit: 20 });
  const { data, refetch } = useListUsers(queryParams);
  const { vmode } = useLayoutContext();

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(async data => {
    setQueryParams(prev => ({ ...prev, ...data, cursor: '' }));
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [viewType, setViewType] = useState<string | undefined>();
  const { mode } = useParams<{ mode: string; slug: string }>();
  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const [selectedRecord, setSelectedRecord] = useState<User | null>(null);

  const handleView = useCallback(
    (record: User | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);
      if (vmode === 'flatten') {
        navigate(`${type}${record ? `/${record.id}` : ''}`);
      }
    },
    [navigate, vmode]
  );

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<User>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

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
      deleteUserMutation.mutate(record.id, { onSuccess });
    },
    [deleteUserMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: User) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const fetchData = useCallback(
    async (newQueryParams: QueryFormParams) => {
      const mergedQueryParams = { ...queryParams, ...newQueryParams };
      if (
        (isEqual(mergedQueryParams, queryParams) && Object.keys(data || {}).length) ||
        isEqual(newQueryParams, queryParams)
      ) {
        return data;
      }
      setQueryParams({ ...mergedQueryParams });
    },
    [queryParams, data]
  );

  return (
    <CurdView
      viewMode={vmode}
      title={t('system.user.title')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      columns={tableColumns({ handleView, handleDelete })}
      selected
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      fetchData={fetchData}
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
