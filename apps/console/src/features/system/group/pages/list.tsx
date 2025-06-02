import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { Group } from '../group';
import { useGroupList } from '../hooks';
import { useCreateGroup, useDeleteGroup, useUpdateGroup } from '../service';

import { CreateGroupPage } from './create';
import { EditorGroupPage } from './editor';
import { GroupViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const GroupListPage = () => {
  const { t } = useTranslation();
  const { vmode } = useLayoutContext();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();

  const { data, fetchData, loading } = useGroupList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Group | null>(null);

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Group>();

  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const handleView = useCallback(
    (record: Group | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);

      if (vmode === 'flatten') {
        navigate(`${type}${record?.id ? `/${record.id}` : ''}`);
      }
    },
    [navigate, vmode]
  );

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();

    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

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
      if (record.id) {
        deleteGroupMutation.mutate(record.id, { onSuccess });
      }
    },
    [deleteGroupMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Group) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection,
    title: t('system.groups.title')
  };

  return (
    <CurdView
      viewMode={vmode}
      title={tableConfig.title}
      topbarLeft={tableConfig.topbarLeft}
      topbarRight={tableConfig.topbarRight}
      columns={tableConfig.columns}
      data={data?.items || []}
      paginated={false}
      selected
      fetchData={fetchData}
      loading={loading}
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
