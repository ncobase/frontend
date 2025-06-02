import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useOptionList } from '../hooks/useOptionList';
import { Option } from '../option';
import { useCreateOption, useDeleteOption, useUpdateOption } from '../service';

import { CreateOptionPage } from './create';
import { EditorOptionPage } from './editor';
import { OptionViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const OptionListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; id: string }>();
  const { vmode } = useLayoutContext();

  const { data, fetchData, loading, refetch } = useOptionList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Option | null>(null);

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Option>();

  const createOptionMutation = useCreateOption();
  const updateOptionMutation = useUpdateOption();
  const deleteOptionMutation = useDeleteOption();

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const onQuery = handleQuerySubmit(async queryData => {
    await fetchData({ ...queryData, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
  };

  const handleView = useCallback(
    (record: Option | null, type: string) => {
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
    (data: Option) => {
      createOptionMutation.mutate(data, { onSuccess });
    },
    [createOptionMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Option) => {
      updateOptionMutation.mutate(data, { onSuccess });
    },
    [updateOptionMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Option) => {
      if (record.id) {
        deleteOptionMutation.mutate(record.id, { onSuccess });
      }
    },
    [deleteOptionMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Option) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection,
    title: t('system.option.title', 'System Option')
  };

  return (
    <CurdView
      viewMode={vmode}
      title={tableConfig.title}
      topbarLeft={tableConfig.topbarLeft}
      topbarRight={tableConfig.topbarRight}
      columns={tableConfig.columns}
      data={data?.items || []}
      selected
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      fetchData={fetchData}
      loading={loading}
      createComponent={
        <CreateOptionPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => (
        <OptionViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
      )}
      editComponent={record => (
        <EditorOptionPage
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
