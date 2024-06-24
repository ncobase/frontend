import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { QueryFormData, queryFields } from './config/query';
import { tableColumns } from './config/table';
import { topbarLeftSection, topbarRightSection } from './config/topbar';
import { CreateMenuPage } from './pages/create';
import { EditorMenuPage } from './pages/editor';
import { MenuViewerPage } from './pages/viewer';
import { useCreateMenu, useDeleteMenu, useListMenus, useUpdateMenu } from './service';

import { CurdView } from '@/components/curd';
import { Menu } from '@/types';

export const MenuPage = () => {
  const { t } = useTranslation();
  const { menus, refetch } = useListMenus();

  const { mode, slug } = useParams<{ mode: string; slug: string }>();
  const navigate = useNavigate();

  // manually set the view type, the vmode in the layout context should be used by default.
  const vmode = 'flatten' as 'flatten' | 'modal';

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

  const [selectedRecord, setSelectedRecord] = useState<Menu | null>(null);
  const [viewType, setViewType] = useState<'view' | 'edit' | 'create'>();

  useEffect(() => {
    if (slug) {
      const record = menus.find(menu => menu.id === slug || menu.slug === slug) || null;
      setSelectedRecord(record);
      setViewType(mode as 'view' | 'edit');
    } else if (mode === 'create') {
      setSelectedRecord(null);
      setViewType('create');
    } else {
      setSelectedRecord(null);
      setViewType(undefined);
    }
  }, [mode, slug]);

  const handleView = (record: Menu | null, type: 'view' | 'edit' | 'create') => {
    setSelectedRecord(record);
    setViewType(type);
    if (vmode === 'flatten') {
      navigate(`${type}${record ? `/${record.id}` : ''}`);
    }
  };

  const handleClose = () => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    refetch();
    if (vmode === 'flatten' && viewType.length > 0) {
      navigate(-1);
    }
  };

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Menu>({});

  const createMenuMutation = useCreateMenu();
  const updateMenuMutation = useUpdateMenu();
  const deleteMenuMutation = useDeleteMenu();
  const onSuccess = () => {
    handleClose();
  };

  const handleCreate = (data: Menu) => {
    createMenuMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Menu) => {
    updateMenuMutation.mutate(data, {
      onSuccess
    });
  };

  const handleDelete = (record: Menu) => {
    deleteMenuMutation.mutate(record.id, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Menu) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[viewType](data);
  });

  return (
    <CurdView
      viewMode={vmode}
      title={t('system.menu.title')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      data={menus}
      columns={tableColumns({ handleView, handleDelete })}
      selected
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
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
