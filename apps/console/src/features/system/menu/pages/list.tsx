import React, { useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateMenu, useDeleteMenu, useListMenus, useUpdateMenu } from '../service';

import { CreateMenuPage } from './create';
import { EditorMenuPage } from './editor';
import { MenuViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { Menu } from '@/types';

export const MenuListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryFormParams>({ limit: 20 });
  const { data, refetch } = useListMenus(queryParams);
  // const { vmode } = useLayoutContext();

  // manually set the view type, the vmode in the layout context should be used by default.
  const vmode = 'flatten' as 'flatten' | 'modal';

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

  const [selectedRecord, setSelectedRecord] = useState<Menu | null>(null);

  const handleView = useCallback(
    (record: Menu | null, type: 'view' | 'edit' | 'create') => {
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
  } = useForm<Menu>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const createMenuMutation = useCreateMenu();
  const updateMenuMutation = useUpdateMenu();
  const deleteMenuMutation = useDeleteMenu();

  const onSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: Menu) => {
      createMenuMutation.mutate(data, { onSuccess });
    },
    [createMenuMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Menu) => {
      updateMenuMutation.mutate(data, { onSuccess });
    },
    [updateMenuMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Menu) => {
      deleteMenuMutation.mutate(record.id, { onSuccess });
    },
    [deleteMenuMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Menu) => {
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
      title={t('system.menu.title')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      columns={tableColumns({ handleView, handleDelete })}
      selected
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      fetchData={fetchData}
      createComponent={
        <CreateMenuPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => <MenuViewerPage viewMode={vmode} record={record?.id} />}
      editComponent={record => (
        <EditorMenuPage
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
