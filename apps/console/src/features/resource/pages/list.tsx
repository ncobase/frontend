import { useCallback, useEffect, useMemo, useState } from 'react';

import { AlertDialog, Button, Modal, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { DeleteImpactPanel } from '../components/delete_impact_panel';
import { ShareDialog } from '../components/share_dialog';
import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection } from '../config/topbar';
import {
  fetchResourceDeleteImpact,
  ResourceDeleteImpact,
  summarizeResourceDeleteImpacts
} from '../delete_impact';
import { downloadResourceFile } from '../file_actions';
import { ResourceEditorForm } from '../forms/editor';
import { UploadForm } from '../forms/upload';
import { ResourceViewer } from '../forms/viewer';
import { useResourceList } from '../hooks';
import {
  ResourceBatchDeleteResult,
  ResourceBatchUploadResult,
  ResourceFile,
  ResourceUploadSubmission
} from '../resource';
import { useResourceRuntimePolicy } from '../resource_policy';
import {
  useBatchDelete,
  useBatchProcess,
  useBatchUploadResources,
  useDeleteResource,
  useGetUsage,
  useUpdateResource,
  useUploadResource
} from '../service';
import { buildResourceUploadFormData, normalizeResourceTags } from '../upload_payload';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

interface DeleteImpactState {
  loading: boolean;
  checked: boolean;
  impacts: ResourceDeleteImpact[];
}

const emptyDeleteImpactState = (): DeleteImpactState => ({
  loading: false,
  checked: false,
  impacts: []
});

const failedDeleteImpact = (file: ResourceFile, error: unknown): ResourceDeleteImpact => ({
  file,
  mediaReferences: [],
  topicReferences: [],
  mediaReferenceTotal: 0,
  topicReferenceTotal: 0,
  mediaReferencesComplete: false,
  topicReferencesComplete: false,
  errors: [error instanceof Error ? error.message : 'Reference check failed']
});

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
  const [batchDeleteDialog, setBatchDeleteDialog] = useState<{
    open: boolean;
    files: ResourceFile[];
  }>({
    open: false,
    files: []
  });
  const [deleteImpact, setDeleteImpact] = useState<DeleteImpactState>(emptyDeleteImpactState);
  const [batchDeleteImpact, setBatchDeleteImpact] =
    useState<DeleteImpactState>(emptyDeleteImpactState);
  const [shareDialog, setShareDialog] = useState<{ open: boolean; file: ResourceFile | null }>({
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
  const batchDeleteMutation = useBatchDelete();
  const batchProcessMutation = useBatchProcess();
  const { data: policy, isLoading: policyLoading } = useResourceRuntimePolicy();
  const { data: usage } = useGetUsage(uploadModal);
  const uploading = uploadMutation.isPending || batchUploadMutation.isPending;
  const deleteImpactSummary = useMemo(
    () => summarizeResourceDeleteImpacts(deleteImpact.impacts),
    [deleteImpact.impacts]
  );
  const batchDeleteImpactSummary = useMemo(
    () => summarizeResourceDeleteImpacts(batchDeleteImpact.impacts),
    [batchDeleteImpact.impacts]
  );

  useEffect(() => {
    if (viewType !== 'edit' || !selectedRecord) return;

    formReset({
      ...selectedRecord,
      access_level: selectedRecord.access_level || 'private',
      is_public: selectedRecord.is_public ?? selectedRecord.access_level === 'public',
      tags: selectedRecord.tags?.join(', ') || ''
    });
  }, [formReset, selectedRecord, viewType]);

  useEffect(() => {
    if (!deleteDialog.open || !deleteDialog.file?.id) {
      setDeleteImpact(emptyDeleteImpactState());
      return;
    }

    let active = true;
    const file = deleteDialog.file;
    setDeleteImpact({ loading: true, checked: false, impacts: [] });

    fetchResourceDeleteImpact([file])
      .then(impacts => {
        if (!active) return;
        setDeleteImpact({ loading: false, checked: true, impacts });
      })
      .catch(error => {
        if (!active) return;
        setDeleteImpact({
          loading: false,
          checked: true,
          impacts: [failedDeleteImpact(file, error)]
        });
      });

    return () => {
      active = false;
    };
  }, [deleteDialog.file, deleteDialog.open]);

  useEffect(() => {
    if (!batchDeleteDialog.open || batchDeleteDialog.files.length === 0) {
      setBatchDeleteImpact(emptyDeleteImpactState());
      return;
    }

    let active = true;
    const files = batchDeleteDialog.files;
    setBatchDeleteImpact({ loading: true, checked: false, impacts: [] });

    fetchResourceDeleteImpact(files)
      .then(impacts => {
        if (!active) return;
        setBatchDeleteImpact({ loading: false, checked: true, impacts });
      })
      .catch(error => {
        if (!active) return;
        setBatchDeleteImpact({
          loading: false,
          checked: true,
          impacts: files.map(file => failedDeleteImpact(file, error))
        });
      });

    return () => {
      active = false;
    };
  }, [batchDeleteDialog.files, batchDeleteDialog.open]);

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
        description: error?.message || t('messages.unknown_error')
      });
    },
    [t, toast]
  );

  const handleUpdate = useCallback(
    (data: any) => {
      if (!selectedRecord?.id) return;

      const publicLinksAllowed = policy?.storage.allow_public_links !== false;
      const accessLevel =
        !publicLinksAllowed && data.access_level !== 'private' ? 'private' : data.access_level;
      const payload: ResourceFile = {
        ...selectedRecord,
        ...data,
        id: selectedRecord.id,
        access_level: accessLevel,
        is_public: publicLinksAllowed && accessLevel === 'public',
        tags: normalizeResourceTags(data.tags)
      };

      updateMutation.mutate(payload, {
        onSuccess: () => onSuccess(t('resource.messages.update_success', 'File updated')),
        onError
      });
    },
    [onError, onSuccess, policy?.storage.allow_public_links, selectedRecord, t, updateMutation]
  );

  const handleDelete = useCallback((record: ResourceFile) => {
    setDeleteDialog({ open: true, file: record });
  }, []);

  const handleShare = useCallback((record: ResourceFile) => {
    setShareDialog({ open: true, file: record });
  }, []);

  const handleDownload = useCallback(
    async (record: ResourceFile) => {
      try {
        await downloadResourceFile(record);
      } catch (error: any) {
        toast.error(t('messages.error'), {
          description: error?.message || t('messages.unknown_error')
        });
      }
    },
    [t, toast]
  );

  const openMediaReference = useCallback(
    (mediaId: string) => {
      setDeleteDialog({ open: false, file: null });
      setBatchDeleteDialog({ open: false, files: [] });
      navigate(`/content/media/${mediaId}`);
    },
    [navigate]
  );

  const openTopicReference = useCallback(
    (topicId: string) => {
      setDeleteDialog({ open: false, file: null });
      setBatchDeleteDialog({ open: false, files: [] });
      navigate(`/content/topics/${topicId}`);
    },
    [navigate]
  );

  const confirmDelete = useCallback(() => {
    if (!deleteDialog.file?.id) return;

    if (!deleteImpact.checked || deleteImpact.loading) {
      toast.warning(t('resource.references.loading', 'Checking references...'));
      return;
    }

    if (!deleteImpactSummary.canDelete) {
      toast.warning(t('resource.messages.delete_blocked', 'File is referenced'), {
        description:
          deleteImpactSummary.errorCount > 0
            ? t(
                'resource.messages.delete_check_failed',
                'Reference checks must complete before deleting this file.'
              )
            : t(
                'resource.messages.delete_blocked_description',
                'Remove CMS media references before deleting this file.'
              )
      });
      return;
    }

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
  }, [
    deleteDialog.file,
    deleteImpact.checked,
    deleteImpact.loading,
    deleteImpactSummary.canDelete,
    deleteImpactSummary.errorCount,
    deleteMutation,
    onSuccess,
    onError,
    t,
    toast
  ]);

  const confirmBatchDelete = useCallback(() => {
    const files = batchDeleteDialog.files;
    if (files.length === 0) return;

    if (!batchDeleteImpact.checked || batchDeleteImpact.loading) {
      toast.warning(t('resource.references.loading', 'Checking references...'));
      return;
    }

    if (!batchDeleteImpactSummary.canDelete) {
      toast.warning(t('resource.messages.delete_blocked', 'File is referenced'), {
        description:
          batchDeleteImpactSummary.errorCount > 0
            ? t(
                'resource.messages.batch_delete_check_failed',
                'Reference checks must complete before deleting selected files.'
              )
            : t(
                'resource.messages.batch_delete_blocked_description',
                '{{count}} selected files are referenced by CMS media or topics.',
                { count: batchDeleteImpactSummary.referencedFileCount }
              )
      });
      return;
    }

    batchDeleteMutation.mutate(
      files.map(file => file.id),
      {
        onSuccess: (result: ResourceBatchDeleteResult) => {
          const success = result?.success_count ?? result?.deleted_ids?.length ?? files.length;
          const failed = result?.failure_count ?? 0;
          setBatchDeleteDialog({ open: false, files: [] });
          if (failed > 0) {
            toast.warning(t('messages.warning', 'Warning'), {
              description: t(
                'resource.messages.batch_delete_partial',
                '{{success}} files deleted, {{failed}} failed.',
                { success, failed }
              )
            });
          } else {
            toast.success(t('messages.success'), {
              description: t('resource.messages.batch_delete_success', '{{count}} files deleted', {
                count: success
              })
            });
          }
          refetch();
        },
        onError: error => {
          setBatchDeleteDialog({ open: false, files: [] });
          onError(error);
        }
      }
    );
  }, [
    batchDeleteDialog.files,
    batchDeleteImpact.checked,
    batchDeleteImpact.loading,
    batchDeleteImpactSummary.canDelete,
    batchDeleteImpactSummary.errorCount,
    batchDeleteImpactSummary.referencedFileCount,
    batchDeleteMutation,
    onError,
    refetch,
    t,
    toast
  ]);

  const handleBatchProcess = useCallback(
    (records: ResourceFile[]) => {
      const imageFiles = records.filter(record => record.category === 'image');
      if (imageFiles.length === 0) {
        toast.warning(t('messages.warning', 'Warning'), {
          description: t('resource.batch.no_images', 'Select image files to process')
        });
        return;
      }

      const maxEdge = Math.min(
        policy?.image.max_image_width || 2048,
        policy?.image.max_image_height || 2048
      );
      batchProcessMutation.mutate(
        {
          ids: imageFiles.map(file => file.id),
          options: {
            create_thumbnail: policy?.image.enable_thumbnails ?? true,
            resize_image: false,
            max_width: policy?.image.default_thumbnail_width || Math.min(300, maxEdge),
            max_height: policy?.image.default_thumbnail_height || Math.min(300, maxEdge),
            compression_quality: policy?.image.compression_quality || 85
          }
        },
        {
          onSuccess: processed => {
            toast.success(t('messages.success'), {
              description: t(
                'resource.messages.batch_process_success',
                '{{count}} image files processed',
                { count: processed?.length || imageFiles.length }
              )
            });
            refetch();
          },
          onError
        }
      );
    },
    [batchProcessMutation, onError, policy?.image, refetch, t, toast]
  );

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

  const batchOperations = useMemo(
    () => [
      {
        label: t('resource.batch.process_images', 'Process images'),
        icon: 'IconPhotoCog',
        action: (rows: ResourceFile[]) => handleBatchProcess(rows),
        isDisabled: (rows: ResourceFile[]) =>
          batchProcessMutation.isPending ||
          !(policy?.image.enable_thumbnails ?? true) ||
          !rows.some(row => row.category === 'image')
      },
      {
        label: t('resource.batch.download_one', 'Download selected'),
        icon: 'IconDownload',
        action: (rows: ResourceFile[]) => {
          if (rows[0]) {
            handleDownload(rows[0]);
          }
        },
        isDisabled: (rows: ResourceFile[]) => rows.length !== 1
      },
      {
        label: t('resource.batch.delete', 'Delete'),
        icon: 'IconTrash',
        action: (rows: ResourceFile[]) => setBatchDeleteDialog({ open: true, files: rows }),
        isDisabled: () => batchDeleteMutation.isPending
      }
    ],
    [
      batchDeleteMutation.isPending,
      batchProcessMutation.isPending,
      handleBatchProcess,
      handleDownload,
      policy?.image.enable_thumbnails,
      t
    ]
  );

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={t('resource.title', 'Resource Manager')}
        topbarLeft={topbarLeftSection({ handleUpload })}
        topbarRight={[]}
        columns={tableColumns({ handleView, handleShare, handleDownload, handleDelete })}
        data={data?.items || []}
        selected
        batchOperations={batchOperations}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        viewComponent={record => <ResourceViewer record={record} />}
        editComponent={() => (
          <ResourceEditorForm
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
            policy={policy}
          />
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
          policy={policy}
          policyLoading={policyLoading}
        />
      </Modal>

      <AlertDialog
        title={t('resource.dialogs.delete_title', 'Delete File')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !prev.open }))}
        className='max-w-3xl'
        footer={
          <>
            <Button
              variant='outline-slate'
              onClick={() => setDeleteDialog({ open: false, file: null })}
              disabled={deleteMutation.isPending}
            >
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button
              variant='danger'
              onClick={confirmDelete}
              disabled={
                deleteMutation.isPending ||
                deleteImpact.loading ||
                !deleteImpact.checked ||
                !deleteImpactSummary.canDelete
              }
            >
              {deleteImpact.loading
                ? t('resource.references.checking', 'Checking...')
                : t('actions.delete', 'Delete')}
            </Button>
          </>
        }
      >
        <div className='space-y-4'>
          <p className='text-sm text-slate-600'>
            {t(
              'resource.dialogs.delete_description',
              'Are you sure you want to delete this file? This action cannot be undone.'
            )}
          </p>
          <DeleteImpactPanel
            impacts={deleteImpact.impacts}
            loading={deleteImpact.loading}
            onOpenMedia={openMediaReference}
            onOpenTopic={openTopicReference}
          />
        </div>
      </AlertDialog>

      <AlertDialog
        title={t('resource.dialogs.batch_delete_title', 'Delete Selected Files')}
        isOpen={batchDeleteDialog.open}
        onChange={() => setBatchDeleteDialog(prev => ({ ...prev, open: !prev.open }))}
        className='max-w-4xl'
        footer={
          <>
            <Button
              variant='outline-slate'
              onClick={() => setBatchDeleteDialog({ open: false, files: [] })}
              disabled={batchDeleteMutation.isPending}
            >
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button
              variant='danger'
              onClick={confirmBatchDelete}
              disabled={
                batchDeleteMutation.isPending ||
                batchDeleteImpact.loading ||
                !batchDeleteImpact.checked ||
                !batchDeleteImpactSummary.canDelete
              }
            >
              {batchDeleteImpact.loading
                ? t('resource.references.checking', 'Checking...')
                : t('actions.delete', 'Delete')}
            </Button>
          </>
        }
      >
        <div className='space-y-4'>
          <p className='text-sm text-slate-600'>
            {t(
              'resource.dialogs.batch_delete_description',
              'Delete {{count}} selected files? CMS media and topic references will be checked before deletion.',
              { count: batchDeleteDialog.files.length }
            )}
          </p>
          <DeleteImpactPanel
            impacts={batchDeleteImpact.impacts}
            loading={batchDeleteImpact.loading}
            onOpenMedia={openMediaReference}
            onOpenTopic={openTopicReference}
          />
        </div>
      </AlertDialog>

      <ShareDialog
        isOpen={shareDialog.open}
        file={shareDialog.file}
        onClose={() => setShareDialog({ open: false, file: null })}
        onSuccess={() => refetch()}
        policy={policy}
        policyLoading={policyLoading}
      />
    </>
  );
};
