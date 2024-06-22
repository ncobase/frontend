import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormData } from '../config/query';
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
  const { dictionaries } = useListDictionaries();

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

  const [selectedRecord, setSelectedRecord] = useState<Dictionary | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Dictionary | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Dictionary>({});

  const createDictionaryMutation = useCreateDictionary();
  const updateDictionaryMutation = useUpdateDictionary();
  const onSuccess = () => {
    handleDialogClose();
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
    }[dialogType](data);
  });

  return (
    <CurdView
      title={t('system.dictionary.title')}
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={dictionaries}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateDictionaryPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <DictionaryViewerPage record={record} />}
      editComponent={record => (
        <EditorDictionaryPage
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
