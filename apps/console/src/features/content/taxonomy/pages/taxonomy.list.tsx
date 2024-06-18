import React, { useState } from 'react';

import { Taxonomy } from '@ncobase/types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { QueryFormData, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateTaxonomy, useListTaxonomies, useUpdateTaxonomy } from '../service';

import { CreateTaxonomyPage } from './create.taxonomy';
import { EditorTaxonomyPage } from './editor.taxonomy';
import { TaxonomyViewerPage } from './taxonomy.viewer';

import { CurdView } from '@/components/curd';

export const TaxonomyListPage = () => {
  const { t } = useTranslation();
  const { taxonomies } = useListTaxonomies({
    type: 'header'
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

  const [selectedRecord, setSelectedRecord] = useState<Taxonomy | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Taxonomy | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Taxonomy>({});

  const createTaxonomyMutation = useCreateTaxonomy();
  const updateTaxonomyMutation = useUpdateTaxonomy();
  const onSuccess = () => {
    handleDialogClose();
  };

  const handleCreate = (data: Taxonomy) => {
    createTaxonomyMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Taxonomy) => {
    updateTaxonomyMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Taxonomy) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[dialogType](data);
  });

  return (
    <CurdView
      title={t('content.taxonomy.title')}
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={taxonomies}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateTaxonomyPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <TaxonomyViewerPage record={record} />}
      editComponent={record => (
        <EditorTaxonomyPage
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
