import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useMenuList } from '../hooks';
import { MenuTree } from '../menu';
import { useCreateMenu, useDeleteMenu, useUpdateMenu, useToggleMenuStatus } from '../service';

import { CreateMenuPage } from './create';
import { EditorMenuPage } from './editor';
import { MenuViewerPage } from './viewer';

import { CurdView } from '@/components/curd';

export const MenuListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();

  const { data, fetchData, loading, refetch } = useMenuList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<MenuTree | null>(null);

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<MenuTree>();

  const createMenuMutation = useCreateMenu();
  const updateMenuMutation = useUpdateMenu();
  const deleteMenuMutation = useDeleteMenu();
  const toggleStatusMutation = useToggleMenuStatus();

  const vmode = 'flatten' as 'flatten' | 'modal';

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const onQuery = handleQuerySubmit(async queryData => {
    await fetchData({ ...queryData, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
  };

  const handleView = useCallback(
    (record: MenuTree | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);

      if (vmode === 'flatten') {
        navigate(`${type}${record?.id ? `/${record.id}` : ''}`);
      }
    },
    [navigate, vmode]
  );

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();

    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const onSuccess = useCallback(() => {
    handleClose();
    refetch();
  }, [handleClose, refetch]);

  const handleCreate = useCallback(
    (data: MenuTree) => {
      createMenuMutation.mutate(data, { onSuccess });
    },
    [createMenuMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: MenuTree) => {
      updateMenuMutation.mutate(data, { onSuccess });
    },
    [updateMenuMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: MenuTree) => {
      if (record.id) {
        deleteMenuMutation.mutate(record.id, { onSuccess });
      }
    },
    [deleteMenuMutation, onSuccess]
  );

  const handleToggleStatus = useCallback(
    (record: MenuTree, action: 'enable' | 'disable' | 'show' | 'hide') => {
      if (record.id) {
        toggleStatusMutation.mutate({ id: record.id, action }, { onSuccess });
      }
    },
    [toggleStatusMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: MenuTree) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete, handleToggleStatus }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection,
    title: t('system.menus.title')
  };

  return (
    <CurdView
      viewMode={vmode}
      title={tableConfig.title}
      topbarLeft={tableConfig.topbarLeft}
      topbarRight={tableConfig.topbarRight}
      columns={tableConfig.columns}
      data={data?.items || []}
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      maxTreeLevel={-1} // Support unlimited nesting
      isAllExpanded
      paginated={false}
      fetchData={fetchData}
      loading={loading}
      createComponent={
        <CreateMenuPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => (
        <MenuViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
      )}
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
