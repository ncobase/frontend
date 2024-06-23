import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormData } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateTenant, useListTenants, useUpdateTenant } from '../service';

import { CreateTenantPage } from './create.tenant';
import { EditorTenantPage } from './editor.tenant';
import { TenantViewerPage } from './tenant.viewer';

import { CurdView } from '@/components/curd';
import { Tenant } from '@/types';

export const TenantListPage = () => {
  const { t } = useTranslation();
  const { tenants } = useListTenants();

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

  const [selectedRecord, setSelectedRecord] = useState<Tenant | null>(null);
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Tenant | null, type: 'view' | 'edit' | 'create') => {
    setSelectedRecord(record);
    setViewType(type);
  };

  const handleDialogClose = () => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
  };

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Tenant>({});

  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();
  const onSuccess = () => {
    handleDialogClose();
  };

  const handleCreate = (data: Tenant) => {
    createTenantMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Tenant) => {
    updateTenantMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Tenant) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[viewType](data);
  });

  return (
    <CurdView
      title={t('system.tenant.title')}
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={tenants}
      columns={tableColumns(handleDialogView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreateTenantPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <TenantViewerPage record={record} />}
      editComponent={record => (
        <EditorTenantPage
          record={record}
          onSubmit={handleConfirm}
          control={formControl}
          setValue={setFormValue}
          errors={formErrors}
        />
      )}
      type={viewType}
      record={selectedRecord}
      onConfirm={handleConfirm}
      onCancel={handleDialogClose}
    />
  );
};
