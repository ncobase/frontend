import React, { useState } from 'react';

import { Role } from '@ncobase/types';
import { useForm } from 'react-hook-form';

import { QueryFormData, queryFields } from './config/query';
import { tableColumns } from './config/table';
import { topbarLeftSection, topbarRightSection } from './config/topbar';
import { CreatePage } from './create';
import { EditorPage } from './editor';
import { ViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useListRoles, useUpdateRole, useCreateRole } from '@/features/system/role/service';

export const ListPage = () => {
  const { roles } = useListRoles();

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormData>();

  const onQuery = handleQuerySubmit(data => {
    console.log(data);
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [selectedRecord, setSelectedRecord] = useState<Role | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Role | null, type: 'view' | 'edit' | 'create') => {
    setSelectedRecord(record);
    setDialogType(type);
  };

  const handleDialogClose = () => {
    setSelectedRecord(null);
    setDialogType(undefined);
    formReset();
  };

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Role>({});

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const onSuccess = () => {
    handleDialogClose();
  };

  const handleCreate = (data: Role) => {
    createRoleMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Role) => {
    updateRoleMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Role) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[dialogType](data);
  });

  return (
    <CurdView
      title='角色管理'
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={roles}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreatePage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <ViewerPage record={record} />}
      editComponent={record => (
        <EditorPage
          record={record}
          onSubmit={handleConfirm}
          control={formControl}
          setValue={setFormValue}
          errors={formErrors}
        />
      )}
      dialogType={dialogType}
      record={selectedRecord}
      onConfirm={handleConfirm}
      onCancel={handleDialogClose}
    />
  );
};
