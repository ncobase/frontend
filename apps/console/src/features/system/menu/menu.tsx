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
import { useCreateMenu, useListMenus, useUpdateMenu } from './service';

import { CurdView } from '@/components/curd';
import { Menu } from '@/types';

export const MenuPage = () => {
  const { t } = useTranslation();
  const { menus } = useListMenus({});
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

  const handleDialogView = (record: Menu | null, type: 'view' | 'edit' | 'create') => {
    setSelectedRecord(record);
    setViewType(type);
    if (vmode === 'flatten') {
      navigate(`${type}${record ? `/${record.id}` : ''}`);
    }
  };

  const handleDialogClose = () => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten') {
      navigate('');
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
  const onSuccess = () => {
    handleDialogClose();
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
      topbarLeft={topbarLeftSection(handleDialogView)}
      topbarRight={topbarRightSection}
      data={menus}
      columns={tableColumns(handleDialogView)}
      selected
      queryFields={queryFields(queryControl)}
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
      onCancel={handleDialogClose}
    />
  );
};
