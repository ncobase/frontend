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
  const [queryParams, setQueryParams] = useState<QueryFormParams>();

  const { data, refetch } = useListMenus(queryParams);
  const { mode, slug } = useParams<{ mode: string; slug: string }>();
  const vmode = 'flatten' as 'flatten' | 'modal';

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(data => {
    setQueryParams(prev => ({ ...prev, ...data, cursor: '' }));
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [selectedRecord, setSelectedRecord] = useState<Menu | null>(null);
  const [viewType, setViewType] = useState<'view' | 'edit' | 'create'>();

  useEffect(() => {
    if (slug && data) {
      const record = data.items.find(menu => menu.id === slug || menu.slug === slug) || null;
      setSelectedRecord(record);
      setViewType(mode as 'view' | 'edit');
    } else if (mode === 'create') {
      setSelectedRecord(null);
      setViewType('create');
    } else {
      setSelectedRecord(null);
      setViewType(undefined);
    }
  }, [mode, slug, data]);

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
      if (!queryParams || !data) return data;
      const mergedParams = { ...queryParams, ...newQueryParams };
      if (isEqual(mergedParams, queryParams)) {
        return data;
      }
      setQueryParams(mergedParams);
      const result = await refetch();
      return result.data || { items: [], total: 0, next: null, has_next: false };
    },
    [data, refetch, queryParams]
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
