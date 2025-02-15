import { useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateTopic, useDeleteTopic, useListTopics, useUpdateTopic } from '../service';

import { CreateTopicPage } from './create';
import { EditorTopicPage } from './editor';
import { TopicViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/layout';
import { Topic } from '@/types';

export const TopicListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryFormParams>({ limit: 20 });
  const { data, refetch } = useListTopics(queryParams);
  const { vmode } = useLayoutContext();

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(async data => {
    setQueryParams(prev => ({ ...prev, ...data, cursor: '' }));
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [viewType, setViewType] = useState<string | undefined>();
  const { mode } = useParams<{ mode: string; slug: string }>();
  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const [selectedRecord, setSelectedRecord] = useState<Topic | null>(null);

  const handleView = useCallback(
    (record: Topic | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);
      if (vmode === 'flatten') {
        navigate(`${type}${record ? `/${record.id}` : ''}`);
      }
    },
    [navigate, vmode]
  );

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Topic>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const createTopicMutation = useCreateTopic();
  const updateTopicMutation = useUpdateTopic();
  const deleteTopicMutation = useDeleteTopic();

  const onSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: Topic) => {
      createTopicMutation.mutate(data, { onSuccess });
    },
    [createTopicMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Topic) => {
      updateTopicMutation.mutate(data, { onSuccess });
    },
    [updateTopicMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Topic) => {
      deleteTopicMutation.mutate(record.id, { onSuccess });
    },
    [deleteTopicMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Topic) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const fetchData = useCallback(
    async (newQueryParams: QueryFormParams) => {
      const mergedQueryParams = { ...queryParams, ...newQueryParams };
      if (
        (isEqual(mergedQueryParams, queryParams) && Object.keys(data || {}).length) ||
        isEqual(newQueryParams, queryParams)
      ) {
        return data;
      }
      setQueryParams({ ...mergedQueryParams });
    },
    [queryParams, data]
  );

  return (
    <CurdView
      viewMode={vmode}
      title={t('content.topic.title')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      columns={tableColumns({ handleView, handleDelete })}
      selected
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      fetchData={fetchData}
      createComponent={
        <CreateTopicPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => (
        <TopicViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
      )}
      editComponent={record => (
        <EditorTopicPage
          viewMode={vmode}
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
