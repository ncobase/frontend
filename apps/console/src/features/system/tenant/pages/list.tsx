import { useCallback, useEffect, useState } from 'react';

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

  const [viewType, setViewType] = useState<string | undefined>();
  const { mode } = useParams<{ mode: string; slug: string }>();
  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const [selectedRecord, setSelectedRecord] = useState<Tenant | null>(null);

  const handleView = useCallback(
    (record: Tenant | null, type: string) => {
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
      const mergedQueryParams = { ...queryParams, ...newQueryParams };
      if (!isEqual(mergedQueryParams, queryParams)) {
        setQueryParams({ ...mergedQueryParams });
      }
      return data;
    },
    [refetch, data]
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
      viewComponent={record => (
        <TenantViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
      )}
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
