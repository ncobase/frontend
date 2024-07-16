import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormParams } from '../config/query';
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

  const [queryParams, setQueryParams] = useState<
    QueryFormParams & { cursor?: string; limit?: number }
  >({});
  const { items: groups, refetch } = useListGroups(queryParams);

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

  const [selectedRecord, setSelectedRecord] = useState<Group | null>(null);
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleView = (record: Group | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Group>({});

  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const onSuccess = () => {
    handleClose();
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
    }[viewType](data);
  });

  return (
    <CurdView
      title={t('system.group.title')}
      topbarLeft={topbarLeftSection(handleView)}
      topbarRight={topbarRightSection}
      data={groups}
      columns={tableColumns(handleView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateGroupPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <GroupViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorGroupPage
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
