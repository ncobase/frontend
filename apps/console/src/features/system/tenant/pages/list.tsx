import React, { useCallback, useEffect, useState } from 'react';

import { PaginationParams } from '@ncobase/react';
import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateTenant, useListTenants, useUpdateTenant } from '../service';

import { CreateTenantPage } from './create';
import { EditorTenantPage } from './editor';
import { TenantViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/layout';
import { Tenant } from '@/types';

export const TenantListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<PaginationParams>({ limit: 20 });
  const { data, refetch } = useListTenants(queryParams);
  const { vmode } = useLayoutContext();
  const { mode, slug } = useParams<{ mode: string; slug: string }>();

  const [selectedRecord, setSelectedRecord] = useState<Tenant | null>(null);
  const [viewType, setViewType] = useState<'view' | 'edit' | 'create' | undefined>();

  useEffect(() => {
    if (data && data?.items?.length) {
      const record = slug
        ? data.items.find(item => item.id === slug || item.slug === slug) || null
        : null;
      setSelectedRecord(record);
      setViewType(slug ? (mode as 'view' | 'edit') : mode === 'create' ? 'create' : undefined);
    }
    return () => {};
  }, [data]);

  const handleView = useCallback(
    (record: Tenant | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Tenant>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();

  const onSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: Tenant) => {
      createTenantMutation.mutate(data, { onSuccess });
    },
    [createTenantMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Tenant) => {
      updateTenantMutation.mutate(data, { onSuccess });
    },
    [updateTenantMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Tenant) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const fetchData = useCallback(
    async (newQueryParams: PaginationParams) => {
      if (isEqual(newQueryParams, queryParams)) {
        return data;
      }
      setQueryParams(newQueryParams);
      const result = await refetch();
      return result.data || { items: [], total: 0, next: null, has_next: false };
    },
    [data, refetch, queryParams]
  );

  return (
    <CurdView
      viewMode={vmode}
      title={t('system.tenant.title')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      columns={tableColumns({ handleView })}
      pageSize={queryParams?.limit}
      fetchData={fetchData}
      createComponent={
        <CreateTenantPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => <TenantViewerPage viewMode={vmode} record={record?.id} />}
      editComponent={record => (
        <EditorTenantPage
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
