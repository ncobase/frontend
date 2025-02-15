import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { queryFields, QueryFormParams } from './config/query';
import { tableColumns } from './config/table';
import { topbarLeftSection, topbarRightSection } from './config/topbar';
import { CreatePage } from './create';
import { EditorPage } from './editor';
import { ViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useCreateRole, useListRoles, useUpdateRole } from '@/features/system/role/service';
import { Role } from '@/types';

export const ListPage = () => {
  const [queryParams, setQueryParams] = useState<QueryFormParams>({ limit: 20 });
  const { data, refetch } = useListRoles(queryParams);

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(data => {
    setQueryParams(data);
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [selectedRecord, setSelectedRecord] = useState<Role | null>(null);
  const [viewType, setViewType] = useState<string | undefined>(undefined);

  const handleView = (record: Role | null, type: string) => {
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
  } = useForm<Role>({});

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const onSuccess = () => {
    handleClose();
  };

  const handleCreate = (data: Role) => {
    createRoleMutation.mutate(data, {
      onSuccess
    });
  };
  const handleUpdate = (data: Role) => {
    updateRoleMutation.mutate(data, {
      onSuccess
    });
  };

  const handleConfirm = handleFormSubmit((data: Role) => {
    return {
      create: handleCreate,
      edit: handleUpdate
    }[viewType](data);
  });

  return (
    <CurdView
      title='角色管理'
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      data={data?.items}
      pageSize={queryParams?.limit}
      columns={tableColumns({ handleView })}
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      createComponent={
        <CreatePage onSubmit={handleConfirm} control={formControl} errors={formErrors} />
      }
      viewComponent={record => <ViewerPage record={record?.id} />}
      editComponent={record => (
        <EditorPage
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
