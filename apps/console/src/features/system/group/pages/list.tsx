import { useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { Group } from '../group';
import { useCreateGroup, useDeleteGroup, useListGroups, useUpdateGroup } from '../service';

import { CreateGroupPage } from './create';
import { EditorGroupPage } from './editor';
import { GroupViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const GroupListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryFormParams>({ children: true });
  const { data } = useListGroups(queryParams);
  const { vmode } = useLayoutContext();

  const [viewType, setViewType] = useState<string | undefined>();
  const { mode } = useParams<{ mode: string; slug: string }>();
  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const [selectedRecord, setSelectedRecord] = useState<Group | null>(null);

  const handleView = useCallback(
    (record: Group | null, type: string) => {
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
  } = useForm<Group>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();

  const onSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: Group) => {
      createGroupMutation.mutate(data, { onSuccess });
    },
    [createGroupMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Group) => {
      updateGroupMutation.mutate(data, { onSuccess });
    },
    [updateGroupMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Group) => {
      deleteGroupMutation.mutate(record.id, { onSuccess });
    },
    [deleteGroupMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Group) => {
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
      title={t('system.group.title')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      columns={tableColumns({ handleView, handleDelete })}
      paginated={false}
      selected
      fetchData={fetchData}
      maxTreeLevel={-1}
      isAllExpanded
      createComponent={
        <CreateGroupPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => (
        <GroupViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
      )}
      editComponent={record => (
        <EditorGroupPage
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
