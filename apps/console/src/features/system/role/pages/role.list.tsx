import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormParams } from '../config/query';
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

  const [queryParams, setQueryParams] = useState<QueryFormParams>();
  const { items: roles, refetch } = useListRoles(queryParams);

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

  const [selectedRecord, setSelectedRecord] = useState<Role | null>(null);
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleView = (record: Role | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Role>({});

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const onSuccess = () => {
    handleClose();
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
      topbarLeft={topbarLeftSection(handleView)}
      topbarRight={topbarRightSection}
      data={roles}
      columns={tableColumns(handleView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateRolePage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <RoleViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorRolePage
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
