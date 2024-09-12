import React, { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import {
  useCreatePermission,
  useDeletePermission,
  useListPermissions,
  useUpdatePermission
} from '../service';

import { CreatePermissionPage } from './create';
import { EditorPermissionPage } from './editor';
import { PermissionViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/layout';
import { Permission } from '@/types';

export const PermissionListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryFormParams>();
  const { data, refetch, isLoading } = useListPermissions(queryParams);

  // const vmode = useMemo(() => 'flatten', []) as 'flatten' | 'modal';

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

  const [selectedRecord, setSelectedRecord] = useState<Permission | null>(null);

  const handleView = useCallback(
    (record: Permission | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Permission>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  const onSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: Permission) => {
      createPermissionMutation.mutate(data, { onSuccess });
    },
    [createPermissionMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Permission) => {
      updatePermissionMutation.mutate(data, { onSuccess });
    },
    [updatePermissionMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Permission) => {
      deletePermissionMutation.mutate(record.id, { onSuccess });
    },
    [deletePermissionMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Permission) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  // const fetchData = useCallback(
  //   async (newQueryParams: QueryFormParams) => {
  //     const mergedQueryParams = { ...queryParams, ...newQueryParams };
  //     if (
  //       (isEqual(mergedQueryParams, queryParams) && Object.keys(data || {}).length) ||
  //       isEqual(newQueryParams, queryParams)
  //     ) {
  //       return data;
  //     }
  //     setQueryParams({ ...mergedQueryParams });
  //   },
  //   [queryParams, data]
  // );

  return (
    <CurdView
      viewMode={vmode}
      title={t('system.permission.title')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      columns={tableColumns({ handleView, handleDelete })}
      selected
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      data={data?.items}
      loading={isLoading}
      createComponent={
        <CreatePermissionPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => <PermissionViewerPage viewMode={vmode} record={record?.id} />}
      editComponent={record => (
        <EditorPermissionPage
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
