import React, { useState } from 'react';

import { Topic } from '@ncobase/types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { QueryFormData, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateTopic, useListTopics, useUpdateTopic } from '../service';

import { CreateTopicPage } from './create.topic';
import { EditorTopicPage } from './editor.topic';
import { TopicViewerPage } from './topic.viewer';

import { CurdView } from '@/components/curd';

export const TopicListPage = () => {
  const { t } = useTranslation();
  const { topics } = useListTopics();

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

  const [selectedRecord, setSelectedRecord] = useState<Topic | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Topic | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Topic>({});

  const createTopicMutation = useCreateTopic();
  const updateTopicMutation = useUpdateTopic();
  const onSuccess = () => {
    handleDialogClose();
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
    }[dialogType](data);
  });

  return (
    <CurdView
      title={t('content.topic.title')}
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={topics}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateTopicPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <TopicViewerPage record={record} />}
      editComponent={record => (
        <EditorTopicPage
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
