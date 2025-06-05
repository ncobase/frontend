import { useCallback, useEffect, useState } from 'react';

import { Modal } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { DictionaryImportExport } from '../components';
import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { Dictionary } from '../dictionary';
import { useDictionaryList } from '../hooks';
import { useCreateDictionary, useDeleteDictionary, useUpdateDictionary } from '../service';

import { CreateDictionaryPage } from './create';
import { EditorDictionaryPage } from './editor';
import { DictionaryViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const DictionaryListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();

  const { data, fetchData, loading, refetch } = useDictionaryList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Dictionary | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);

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
  } = useForm<Dictionary>();

  const createDictionaryMutation = useCreateDictionary();
  const updateDictionaryMutation = useUpdateDictionary();
  const deleteDictionaryMutation = useDeleteDictionary();

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
    (record: Dictionary | null, type: string) => {
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
    (data: Dictionary) => {
      createDictionaryMutation.mutate(data, { onSuccess });
    },
    [createDictionaryMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Dictionary) => {
      updateDictionaryMutation.mutate(data, { onSuccess });
    },
    [updateDictionaryMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Dictionary) => {
      if (record.id) {
        deleteDictionaryMutation.mutate(record.id, { onSuccess });
      }
    },
    [deleteDictionaryMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Dictionary) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete }),
    topbarLeft: topbarLeftSection({ handleView, setShowImportExport }),
    topbarRight: topbarRightSection,
    title: t('system.dictionaries.title')
  };

  return (
    <>
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
          <CreateDictionaryPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <DictionaryViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
        )}
        editComponent={record => (
          <EditorDictionaryPage
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
      <Modal
        isOpen={showImportExport}
        onCancel={() => setShowImportExport(false)}
        title={t('dictionary.import_export.title')}
        className='max-w-4xl'
      >
        <DictionaryImportExport />
      </Modal>
    </>
  );
};
