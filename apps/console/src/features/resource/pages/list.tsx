import { useCallback, useState } from 'react';

import { AlertDialog, Modal, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection } from '../config/topbar';
import { ResourceEditorForm } from '../forms/editor';
import { UploadForm } from '../forms/upload';
import { ResourceViewer } from '../forms/viewer';
import { useResourceList } from '../hooks';
import { ResourceBatchUploadResult, ResourceFile, ResourceUploadSubmission } from '../resource';
import {
  useBatchUploadResources,
  useDeleteResource,
  useGetUsage,
  useUpdateResource,
  useUploadResource
} from '../service';
import { buildResourceUploadFormData } from '../upload_payload';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const ResourceListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();
  const { vmode } = useLayoutContext();
  const toast = useToastMessage();

  const { data, fetchData, loading, refetch } = useResourceList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<ResourceFile | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; file: ResourceFile | null }>({
    open: false,
    file: null
  });
  const [uploadModal, setUploadModal] = useState(false);

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    handleSubmit: handleFormSubmit
  } = useForm<any>();

  const updateMutation = useUpdateResource();
  const deleteMutation = useDeleteResource();
  const uploadMutation = useUploadResource();
  const batchUploadMutation = useBatchUploadResources();
  const { data: usage } = useGetUsage(uploadModal);
  const uploading = uploadMutation.isPending || batchUploadMutation.isPending;

  const onQuery = handleQuerySubmit(async queryData => {
    const cleanedData = Object.entries(queryData).reduce((acc: any, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    await fetchData({ ...cleanedData, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
    fetchData({ limit: 20 });
    refetch();
  };

  const handleView = useCallback(
    (record: ResourceFile | null, type: string) => {
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

  const onSuccess = useCallback(
    (message: string) => {
      toast.success(t('messages.success'), { description: message });
      handleClose();
      refetch();
    },
    [handleClose, refetch, t, toast]
  );

  const onError = useCallback(
    (error: any) => {
      toast.error(t('messages.error'), {
        description: error['message'] || t('messages.unknown_error')
      });
    },
    [t, toast]
  );

  const handleUpdate = useCallback(
    (data: any) => {
      updateMutation.mutate(data, {
        onSuccess: () => onSuccess(t('resource.messages.update_success', 'File updated')),
        onError
      });
    },
    [updateMutation, onSuccess, onError, t]
  );

  const handleDelete = useCallback((record: ResourceFile) => {
    setDeleteDialog({ open: true, file: record });
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteDialog.file?.id) return;
    deleteMutation.mutate(deleteDialog.file.id, {
      onSuccess: () => {
        setDeleteDialog({ open: false, file: null });
        onSuccess(t('resource.messages.delete_success', 'File deleted'));
      },
      onError: error => {
        setDeleteDialog({ open: false, file: null });
        onError(error);
      }
    });
  }, [deleteDialog.file, deleteMutation, onSuccess, onError, t]);

  const handleUpload = useCallback(() => {
    setUploadModal(true);
  }, []);

  const handleFileUpload = useCallback(
    ({ files, options }: ResourceUploadSubmission) => {
      if (files.length === 0) return;

      if (files.length === 1) {
        const formData = buildResourceUploadFormData(files, options, 'file');
        uploadMutation.mutate(formData, {
          onSuccess: () => {
            setUploadModal(false);
            toast.success(t('messages.success'), {
              description: t('resource.messages.upload_success', 'File uploaded')
            });
            refetch();
          },
          onError
        });
        return;
      }

      const formData = buildResourceUploadFormData(files, options, 'files');
      batchUploadMutation.mutate(formData, {
        onSuccess: (result: ResourceBatchUploadResult) => {
          const total = result.total_files || files.length;
          const success = result.success_count ?? result.files?.length ?? 0;
          const failed = result.failure_count ?? total - success;

          setUploadModal(false);
          if (failed > 0) {
            toast.warning(t('messages.warning', 'Warning'), {
              description: t(
                'resource.messages.upload_partial',
                '{{success}}/{{total}} files uploaded. {{failed}} failed.',
                { success, total, failed }
              )
            });
          } else {
            toast.success(t('messages.success'), {
              description: t(
                'resource.messages.upload_many_success',
                '{{success}} files uploaded',
                { success }
              )
            });
          }
          refetch();
        },
        onError
      });
    },
    [batchUploadMutation, onError, refetch, t, toast, uploadMutation]
  );

  const handleCloseUpload = useCallback(() => {
    if (uploading) return;
    setUploadModal(false);
  }, [uploading]);

  const handleConfirm = useCallback(
    handleFormSubmit((data: any) => handleUpdate(data)),
    [handleFormSubmit, handleUpdate]
  );

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={t('resource.title', 'Resource Manager')}
        topbarLeft={topbarLeftSection({ handleUpload })}
        topbarRight={[]}
        columns={tableColumns({ handleView, handleDelete })}
        data={data?.items || []}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        viewComponent={record => <ResourceViewer record={record} />}
        editComponent={() => (
          <ResourceEditorForm onSubmit={handleConfirm} control={formControl} errors={formErrors} />
        )}
        type={viewType}
        record={selectedRecord}
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />

      <Modal
        isOpen={uploadModal}
        onCancel={handleCloseUpload}
        title={t('resource.upload.title', 'Upload Files')}
        className='max-w-3xl'
      >
        <UploadForm
          onUpload={handleFileUpload}
          onCancel={handleCloseUpload}
          uploading={uploading}
          usage={usage}
        />
      </Modal>

      <AlertDialog
        title={t('resource.dialogs.delete_title', 'Delete File')}
        description={t(
          'resource.dialogs.delete_description',
          'Are you sure you want to delete this file? This action cannot be undone.'
        )}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel', 'Cancel')}
        confirmText={t('actions.delete', 'Delete')}
        onCancel={() => setDeleteDialog({ open: false, file: null })}
        onConfirm={confirmDelete}
      />
    </>
  );
};
