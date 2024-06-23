import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormData } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateRole, useListRoles, useUpdateRole } from '../service';

import { CreateRolePage } from './create.role';
import { EditorRolePage } from './editor.role';
import { RoleViewerPage } from './role.viewer';

import { CurdView } from '@/components/curd';
import { Role } from '@/types';

export const RoleListPage = () => {
  const { t } = useTranslation();
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
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Role | null, type: 'view' | 'edit' | 'create') => {
    setSelectedRecord(record);
    setViewType(type);
  };

  const handleDialogClose = () => {
    setSelectedRecord(null);
    setViewType(undefined);
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
    }[viewType](data);
  });

  return (
    <CurdView
      title={t('system.role.title')}
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={roles}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateRolePage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <RoleViewerPage record={record} />}
      editComponent={record => (
        <EditorRolePage
          record={record}
          onSubmit={handleConfirm}
          control={formControl}
          setValue={setFormValue}
          errors={formErrors}
        />
      )}
      type={viewType}
      record={selectedRecord}
      onConfirm={handleConfirm}
      onCancel={handleDialogClose}
    />
  );
};
