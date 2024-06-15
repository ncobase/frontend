import React, { useState } from 'react';

import { Comment } from '@ncobase/types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { QueryFormData, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateComment, useListComments, useUpdateComment } from '../service';

import { CommentViewerPage } from './comment.viewer';
import { CreateCommentPage } from './create.comment';
import { EditorCommentPage } from './editor.comment';

import { CurdView } from '@/components/curd';

export const CommentListPage = () => {
  const { t } = useTranslation();
  const { comments } = useListComments({
    type: 'header',
    children: true
  });

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

  const [selectedRecord, setSelectedRecord] = useState<Comment | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Comment | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Comment>({});

  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const onSuccess = () => {
    handleDialogClose();
  };

  const handleCreate = (data: Comment) => {
    createCommentMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Comment) => {
    updateCommentMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Comment) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[dialogType](data);
  });

  return (
    <CurdView
      title={t('content:comment.title')}
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={comments}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateCommentPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <CommentViewerPage record={record} />}
      editComponent={record => (
        <EditorCommentPage
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
