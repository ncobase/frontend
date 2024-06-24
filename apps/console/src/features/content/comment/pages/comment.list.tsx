import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateComment, useListComments, useUpdateComment } from '../service';

import { CommentViewerPage } from './comment.viewer';
import { CreateCommentPage } from './create.comment';
import { EditorCommentPage } from './editor.comment';

import { CurdView } from '@/components/curd';
import { Comment } from '@/types';

export const CommentListPage = () => {
  const { t } = useTranslation();
  const [queryKey, setQueryKey] = useState<QueryFormParams>({});
  const { comments, refetch } = useListComments(queryKey);

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(data => {
    setQueryKey(data);
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [selectedRecord, setSelectedRecord] = useState<Comment | null>(null);
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleView = (record: Comment | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Comment>({});

  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const onSuccess = () => {
    handleClose();
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
    }[viewType](data);
  });

  return (
    <CurdView
      title={t('content:comment.title')}
      topbarLeft={topbarLeftSection(handleView)}
      topbarRight={topbarRightSection}
      data={comments}
      columns={tableColumns(handleView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateCommentPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <CommentViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorCommentPage
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
