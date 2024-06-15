import React, { useState } from 'react';

import { Application } from '@ncobase/types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { QueryFormData, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateApplication, useListApplications, useUpdateApplication } from '../service';

import { ApplicationViewerPage } from './application.viewer';
import { CreateApplicationPage } from './create.application';
import { EditorApplicationPage } from './editor.application';

import { CurdView } from '@/components/curd';

export const ApplicationListPage = () => {
  const { t } = useTranslation();
  const { applications } = useListApplications();

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

  const [selectedRecord, setSelectedRecord] = useState<Application | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (
    record: Application | null,
    type: 'view' | 'edit' | 'create' | null
  ) => {
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
  } = useForm<Application>({});

  const createApplicationMutation = useCreateApplication();
  const updateApplicationMutation = useUpdateApplication();
  const onSuccess = () => {
    handleDialogClose();
  };

  const handleCreate = (data: Application) => {
    createApplicationMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Application) => {
    updateApplicationMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Application) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[dialogType](data);
  });

  return (
    <CurdView
      title={t('system.application.title')}
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={applications}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateApplicationPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <ApplicationViewerPage record={record} />}
      editComponent={record => (
        <EditorApplicationPage
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
