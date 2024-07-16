import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateTopic, useListTopics, useUpdateTopic } from '../service';

import { CreateTopicPage } from './create.topic';
import { EditorTopicPage } from './editor.topic';
import { TopicViewerPage } from './topic.viewer';

import { CurdView } from '@/components/curd';
import { Topic } from '@/types';

export const TopicListPage = () => {
  const { t } = useTranslation();
  const [queryParams, setQueryParams] = useState<
    QueryFormParams & { cursor?: string; limit?: number }
  >({});
  const { items: topics, refetch } = useListTopics(queryParams);

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

  const [selectedRecord, setSelectedRecord] = useState<Topic | null>(null);
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleView = (record: Topic | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Topic>({});

  const createTopicMutation = useCreateTopic();
  const updateTopicMutation = useUpdateTopic();
  const onSuccess = () => {
    handleClose();
  };

  const handleCreate = (data: Topic) => {
    createTopicMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Topic) => {
    updateTopicMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Topic) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[viewType](data);
  });

  return (
    <CurdView
      title={t('content.topic.title')}
      topbarLeft={topbarLeftSection(handleView)}
      topbarRight={topbarRightSection}
      data={topics}
      columns={tableColumns(handleView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateTopicPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <TopicViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorTopicPage
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
