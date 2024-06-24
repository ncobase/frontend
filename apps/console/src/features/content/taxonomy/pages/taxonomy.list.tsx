import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormData } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateTaxonomy, useListTaxonomies, useUpdateTaxonomy } from '../service';

import { CreateTaxonomyPage } from './create.taxonomy';
import { EditorTaxonomyPage } from './editor.taxonomy';
import { TaxonomyViewerPage } from './taxonomy.viewer';

import { CurdView } from '@/components/curd';
import { Taxonomy } from '@/types';

export const TaxonomyListPage = () => {
  const { t } = useTranslation();
  const { taxonomies, refetch } = useListTaxonomies();

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
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleView = (record: Taxonomy | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Taxonomy>({});

  const createTaxonomyMutation = useCreateTaxonomy();
  const updateTaxonomyMutation = useUpdateTaxonomy();
  const onSuccess = () => {
    handleClose();
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
    }[viewType](data);
  });

  return (
    <CurdView
      title={t('content.taxonomy.title')}
      topbarLeft={topbarLeftSection(handleView)}
      topbarRight={topbarRightSection}
      data={taxonomies}
      columns={tableColumns(handleView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateTaxonomyPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <TaxonomyViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorTaxonomyPage
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
