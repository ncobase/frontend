import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useOrgList } from '../hooks';
import { Org } from '../org';
import { useCreateOrg, useDeleteOrg, useUpdateOrg } from '../service';

import { CreateOrgPage } from './create';
import { EditorOrgPage } from './editor';
import { OrgViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const OrgListPage = () => {
  const { t } = useTranslation();
  const { vmode } = useLayoutContext();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();

  const { data, fetchData, loading } = useOrgList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Org | null>(null);

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<Org>();

  const createOrgMutation = useCreateOrg();
  const updateOrgMutation = useUpdateOrg();
  const deleteOrgMutation = useDeleteOrg();

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const handleView = useCallback(
    (record: Org | null, type: string) => {
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
  }, [handleClose]);

  const handleCreate = useCallback(
    (data: Org) => {
      createOrgMutation.mutate(data, { onSuccess });
    },
    [createOrgMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Org) => {
      updateOrgMutation.mutate(data, { onSuccess });
    },
    [updateOrgMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Org) => {
      if (record.id) {
        deleteOrgMutation.mutate(record.id, { onSuccess });
      }
    },
    [deleteOrgMutation, onSuccess]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Org) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection,
    title: t('system.orgs.title')
  };

  return (
    <CurdView
      viewMode={vmode}
      title={tableConfig.title}
      topbarLeft={tableConfig.topbarLeft}
      topbarRight={tableConfig.topbarRight}
      columns={tableConfig.columns}
      data={data?.items || []}
      paginated={false}
      selected
      fetchData={fetchData}
      loading={loading}
      maxTreeLevel={-1}
      isAllExpanded
      createComponent={
        <CreateOrgPage
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => (
        <OrgViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
      )}
      editComponent={record => (
        <EditorOrgPage
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
