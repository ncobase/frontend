import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateUser, useListUsers, useUpdateUser } from '../service';

import { CreateUserPage } from './create.user';
import { EditorUserPage } from './editor.user';
import { UserViewerPage } from './user.viewer';

import { CurdView } from '@/components/curd';
import { Account, User } from '@/types';

export const UserListPage = () => {
  const { t } = useTranslation();
  const [queryParams, setQueryParams] = useState<
    QueryFormParams & { cursor?: string; limit?: number }
  >({});
  const { items: users, refetch } = useListUsers(queryParams);

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(data => {
    setQueryParams(data);
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [selectedRecord, setSelectedRecord] = useState<User | null>(null);
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleView = (record: User | null, type: 'view' | 'edit' | 'create') => {
    setSelectedRecord(record);
    setViewType(type);
  };

  const handleClose = () => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    refetch();
  };

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Account>({});

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const onSuccess = () => {
    handleClose();
  };

  const handleCreate = (data: Account) => {
    createUserMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Account) => {
    updateUserMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Account) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[viewType](data);
  });

  return (
    <CurdView
      title={t('system.user.title')}
      topbarLeft={topbarLeftSection(handleView)}
      topbarRight={topbarRightSection}
      data={users}
      columns={tableColumns(handleView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateUserPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <UserViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorUserPage
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
