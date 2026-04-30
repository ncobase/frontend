import { useCallback, useEffect, useMemo, useState } from 'react';

import { AlertDialog, Modal, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { ShareDialog } from '../components/share_dialog';
import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection } from '../config/topbar';
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
import { getMediaList } from '@/features/content/media/apis';
import { useListMedia } from '@/features/content/media/service';

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
  const [batchDeleteChecking, setBatchDeleteChecking] = useState(false);
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
  const { data: mediaReferences, isLoading: referencesLoading } = useListMedia(
    { resource_id: deleteDialog.file?.id, limit: 5 },
    deleteDialog.open && !!deleteDialog.file?.id
  );
  const uploading = uploadMutation.isPending || batchUploadMutation.isPending;
  const referenceCount = mediaReferences?.total || mediaReferences?.items?.length || 0;

  useEffect(() => {
    if (viewType !== 'edit' || !selectedRecord) return;

    formReset({
      ...selectedRecord,
      access_level: selectedRecord.access_level || 'private',
      is_public: selectedRecord.is_public ?? selectedRecord.access_level === 'public',
      tags: selectedRecord.tags?.join(', ') || ''
    });
  }, [formReset, selectedRecord, viewType]);

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

  const checkCmsReferences = useCallback(async (files: ResourceFile[]) => {
    const results = await Promise.all(
      files.map(async file => {
        const references = await getMediaList({ resource_id: file.id, limit: 1 });
        return {
          file,
          count: references?.total || references?.items?.length || 0
        };
      })
    );

    return results.filter(result => result.count > 0);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteDialog.file?.id) return;
    if (referenceCount > 0) {
      toast.warning(t('resource.messages.delete_blocked', 'File is referenced'), {
        description: t(
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
  }, [deleteDialog.file, deleteMutation, onSuccess, onError, referenceCount, t, toast]);

  const confirmBatchDelete = useCallback(async () => {
    const files = batchDeleteDialog.files;
    if (files.length === 0) return;

    setBatchDeleteChecking(true);
    try {
      const referenced = await checkCmsReferences(files);
      if (referenced.length > 0) {
        toast.warning(t('resource.messages.delete_blocked', 'File is referenced'), {
          description: t(
            'resource.messages.batch_delete_blocked_description',
            '{{count}} selected files are referenced by CMS media.',
            { count: referenced.length }
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
                description: t(
                  'resource.messages.batch_delete_success',
                  '{{count}} files deleted',
                  { count: success }
                )
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
    } catch (error: any) {
      toast.error(t('messages.error'), {
        description:
          error?.message || t('resource.references.check_failed', 'Reference check failed')
      });
    } finally {
      setBatchDeleteChecking(false);
    }
  }, [
    batchDeleteDialog.files,
    batchDeleteMutation,
    checkCmsReferences,
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
        isDisabled: () => batchDeleteMutation.isPending || batchDeleteChecking
      }
    ],
    [
      batchDeleteChecking,
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
        cancelText={t('actions.cancel', 'Cancel')}
        confirmText={t('actions.delete', 'Delete')}
        onCancel={() => setDeleteDialog({ open: false, file: null })}
        onConfirm={confirmDelete}
      >
        <div className='space-y-4'>
          <p className='text-sm text-slate-600'>
            {t(
              'resource.dialogs.delete_description',
              'Are you sure you want to delete this file? This action cannot be undone.'
            )}
          </p>

          {referencesLoading ? (
            <div className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500'>
              {t('resource.references.loading', 'Checking references...')}
            </div>
          ) : referenceCount > 0 ? (
            <div className='rounded-lg border border-orange-200 bg-orange-50 px-4 py-3'>
              <p className='text-sm font-medium text-orange-700'>
                {t('resource.references.found', '{{count}} CMS media item references this file', {
                  count: referenceCount
                })}
              </p>
              <div className='mt-2 space-y-1'>
                {(mediaReferences?.items || []).slice(0, 5).map((media: any) => (
                  <button
                    key={media.id}
                    type='button'
                    onClick={() => {
                      setDeleteDialog({ open: false, file: null });
                      navigate(`/content/media/${media.id}`);
                    }}
                    className='block w-full truncate text-left text-xs text-orange-700 underline-offset-2 hover:underline'
                  >
                    {media.title || media.id}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </AlertDialog>

      <AlertDialog
        title={t('resource.dialogs.batch_delete_title', 'Delete Selected Files')}
        isOpen={batchDeleteDialog.open}
        onChange={() => setBatchDeleteDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel', 'Cancel')}
        confirmText={t('actions.delete', 'Delete')}
        onCancel={() => setBatchDeleteDialog({ open: false, files: [] })}
        onConfirm={confirmBatchDelete}
      >
        <div className='space-y-4'>
          <p className='text-sm text-slate-600'>
            {t(
              'resource.dialogs.batch_delete_description',
              'Delete {{count}} selected files? CMS media references will be checked before deletion.',
              { count: batchDeleteDialog.files.length }
            )}
          </p>
          <div className='max-h-44 overflow-auto rounded-lg border border-slate-200 divide-y divide-slate-100'>
            {batchDeleteDialog.files.map(file => (
              <div key={file.id} className='px-3 py-2 text-sm text-slate-600'>
                <span className='block truncate'>{file.original_name || file.name}</span>
              </div>
            ))}
          </div>
          {(batchDeleteChecking || batchDeleteMutation.isPending) && (
            <div className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500'>
              {batchDeleteChecking
                ? t('resource.references.loading', 'Checking references...')
                : t('common.loading', 'Loading...')}
            </div>
          )}
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
