import React, { useState } from 'react';

import { Menu } from '@ncobase/types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { QueryFormData, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreateMenu, useListMenus, useUpdateMenu } from '../service';

import { CreateMenuPage } from './create.menu';
import { EditorMenuPage } from './editor.menu';
import { MenuViewerPage } from './menu.viewer';

import { CurdView } from '@/components/curd';

export const MenuListPage = () => {
  const { t } = useTranslation();
  const { menus } = useListMenus({
    type: 'header',
    children: true
  });

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
  const [dialogType, setDialogType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleDialogView = (record: Menu | null, type: 'view' | 'edit' | 'create') => {
    setSelectedRecord(record);
    setDialogType(type);
  };

  const handleDialogClose = () => {
    setSelectedRecord(null);
    setDialogType(undefined);
    formReset();
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
    }[dialogType](data);
  });

  return (
    <CurdView
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
        <CreateMenuPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <MenuViewerPage record={record} />}
      editComponent={record => (
        <EditorMenuPage
          record={record}
          onSubmit={handleConfirm}
          control={formControl}
          setValue={setFormValue}
          errors={formErrors}
        />
      )}
      dialogType={dialogType}
      record={selectedRecord}
      onConfirm={handleConfirm}
      onCancel={handleDialogClose}
    />
  );
};
