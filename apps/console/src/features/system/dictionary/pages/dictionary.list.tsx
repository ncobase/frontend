import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateDictionary, useListDictionaries, useUpdateDictionary } from '../service';

import { CreateDictionaryPage } from './create.dictionary';
import { DictionaryViewerPage } from './dictionary.viewer';
import { EditorDictionaryPage } from './editor.dictionary';

import { CurdView } from '@/components/curd';
import { Dictionary } from '@/types';

export const DictionaryListPage = () => {
  const { t } = useTranslation();

  const [queryParams, setQueryParams] = useState<QueryFormParams>();
  const { items: dictionaries, refetch } = useListDictionaries(queryParams);

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

  const [selectedRecord, setSelectedRecord] = useState<Dictionary | null>(null);
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleView = (record: Dictionary | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Dictionary>({});

  const createDictionaryMutation = useCreateDictionary();
  const updateDictionaryMutation = useUpdateDictionary();
  const onSuccess = () => {
    handleClose();
  };

  const handleCreate = (data: Dictionary) => {
    createDictionaryMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Dictionary) => {
    updateDictionaryMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Dictionary) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[viewType](data);
  });

  return (
    <CurdView
      title={t('system.dictionary.title')}
      topbarLeft={topbarLeftSection(handleView)}
      topbarRight={topbarRightSection}
      data={dictionaries}
      columns={tableColumns(handleView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateDictionaryPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <DictionaryViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorDictionaryPage
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
