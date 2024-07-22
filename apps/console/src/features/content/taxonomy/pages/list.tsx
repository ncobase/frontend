import React, { useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import {
  useCreateTaxonomy,
  useDeleteTaxonomy,
  useListTaxonomies,
  useUpdateTaxonomy
} from '../service';

import { CreateTaxonomyPage } from './create';
import { EditorTaxonomyPage } from './editor';
import { TaxonomyViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/layout';
import { Taxonomy } from '@/types';

export const TaxonomyListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryFormParams>({ limit: 20 });
  const { data, refetch } = useListTaxonomies(queryParams);
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

  const [viewType, setViewType] = useState<'view' | 'edit' | 'create' | undefined>();
  const { mode } = useParams<{ mode: string; slug: string }>();
  useEffect(() => {
    if (mode) {
      setViewType(mode as 'view' | 'edit' | 'create');
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const [selectedRecord, setSelectedRecord] = useState<Taxonomy | null>(null);

  const handleView = useCallback(
    (record: Taxonomy | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Taxonomy>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const createTaxonomyMutation = useCreateTaxonomy();
  const updateTaxonomyMutation = useUpdateTaxonomy();
  const deleteTaxonomyMutation = useDeleteTaxonomy();

  const onSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: Taxonomy) => {
      createTaxonomyMutation.mutate(data, { onSuccess });
    },
    [createTaxonomyMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Taxonomy) => {
      updateTaxonomyMutation.mutate(data, { onSuccess });
    },
    [updateTaxonomyMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Taxonomy) => {
      deleteTaxonomyMutation.mutate(record.id, { onSuccess });
    },
    [deleteTaxonomyMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Taxonomy) => {
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
      title={t('system.taxonomy.title')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      columns={tableColumns({ handleView, handleDelete })}
      selected
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      fetchData={fetchData}
      createComponent={
        <CreateTaxonomyPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => <TaxonomyViewerPage viewMode={vmode} record={record?.id} />}
      editComponent={record => (
        <EditorTaxonomyPage
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
