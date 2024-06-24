import React, { useState } from 'react';

import { Button, Icons, Tooltip, TooltipContent, TooltipTrigger } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { queryFields, QueryFormParams } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection } from '../config/topbar';
import { useCreatePermission, useListPermissions, useUpdatePermission } from '../service';

import { CreatePermissionPage } from './create.permission';
import { EditorPermissionPage } from './editor.permission';
import { PermissionViewerPage } from './permission.viewer';

import { CurdView } from '@/components/curd';
import { Permission } from '@/types';

export const PermissionListPage = () => {
  const { t } = useTranslation();
  const [queryKey, setQueryKey] = useState<QueryFormParams>({});
  const { permissions, refetch } = useListPermissions(queryKey);

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(data => {
    setQueryKey(data);
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [selectedRecord, setSelectedRecord] = useState<Permission | null>();
  const [viewType, setViewType] = useState<'create' | 'view' | 'edit'>(undefined);

  const handleView = (record: Permission | null, type: 'view' | 'edit' | 'create') => {
    setSelectedRecord(record);
    setViewType(type);
  };

  const handleClose = () => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    refetch();
  };

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Permission>({});

  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const onSuccess = () => {
    handleClose();
  };

  const handleCreate = (data: Permission) => {
    createPermissionMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Permission) => {
    updatePermissionMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Permission) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[viewType](data);
  });

  const topbarRightSection = [
    <div className='rounded-md flex items-center justify-between gap-x-1'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='unstyle' size='ratio'>
            <Icons name='IconFilter' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Filter</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='unstyle' size='ratio'>
            <Icons name='IconColumns' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Customized columns</TooltipContent>
      </Tooltip>
    </div>,
    <div className='bg-slate-100 p-1 rounded-md flex items-center justify-between gap-x-2'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='unstyle' size='ratio' className='p-1 hover:bg-white'>
            <Icons name='IconLayoutBoard' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Card Layout</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='unstyle' size='ratio' className='p-1 hover:bg-white'>
            <Icons name='IconTable' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Spreadsheet Layout</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='unstyle' size='ratio' className='p-1 hover:bg-white'>
            <Icons name='IconArrowsMaximize' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Full Screen</TooltipContent>
      </Tooltip>
    </div>
  ];

  return (
    <CurdView
      title={t('system.permission.title')}
      topbarLeft={topbarLeftSection(handleView)}
      topbarRight={topbarRightSection}
      data={permissions}
      columns={tableColumns(handleView)}
      queryFields={queryFields(queryControl)}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreatePermissionPage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <PermissionViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorPermissionPage
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
