import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormData } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateGroup, useListGroups, useUpdateGroup } from '../service';

import { CreateGroupPage } from './create.group';
import { EditorGroupPage } from './editor.group';
import { GroupViewerPage } from './group.viewer';

import { CurdView } from '@/components/curd';
import { Group } from '@/types';

export const GroupListPage = () => {
  const { t } = useTranslation();
  const { groups } = useListGroups();

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

  const [selectedRecord, setSelectedRecord] = useState<Group | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Group | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Group>({});

  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const onSuccess = () => {
    handleDialogClose();
  };

  const handleCreate = (data: Group) => {
    createGroupMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Group) => {
    updateGroupMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Group) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[dialogType](data);
  });

  return (
    <CurdView
      title={t('system.group.title')}
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={groups}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateGroupPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <GroupViewerPage record={record} />}
      editComponent={record => (
        <EditorGroupPage
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
