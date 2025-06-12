import { useCallback, useEffect, useState } from 'react';

import { Modal, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { OptionsBulkImport } from '../components/bulk_import';
import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useOptionList } from '../hooks/useOptionList';
import { Option } from '../option';
import { useCreateOption, useDeleteOption, useUpdateOption } from '../service';

import { CreateOptionPage } from './create';
import { EditorOptionPage } from './editor';
import { OptionViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const OptionListPage = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; id: string }>();
  const { vmode } = useLayoutContext();

  const { data, fetchData, loading, refetch } = useOptionList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Option | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Option | null>(null);

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
  } = useForm<Option>();

  const createOptionMutation = useCreateOption();
  const updateOptionMutation = useUpdateOption();
  const deleteOptionMutation = useDeleteOption();

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
    fetchData({});
  };

  const handleView = useCallback(
    (record: Option | null, type: string) => {
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
    toast.success(t('messages.success'), {
      description: 'Operation completed successfully'
    });
  }, [handleClose, refetch, toast, t]);

  const handleCreate = useCallback(() => {
    setSelectedRecord(null);
    handleView(null, 'create');
  }, [handleView]);

  const handleDuplicate = useCallback(
    (record: Option) => {
      const duplicateRecord = {
        ...record,
        id: undefined,
        name: `${record.name}_copy_${Date.now()}`,
        created_at: undefined,
        updated_at: undefined
      };
      setSelectedRecord(duplicateRecord);
      handleView(duplicateRecord, 'create');
    },
    [handleView]
  );

  const handleDeleteClick = useCallback((record: Option) => {
    setDeleteTarget(record);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget?.id) {
      deleteOptionMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
          refetch();
          toast.success(t('messages.success'), {
            description: `Option "${deleteTarget.name}" deleted successfully`
          });
        },
        onError: error => {
          toast.error(t('messages.error'), {
            description: error['message'] || 'Failed to delete option'
          });
        }
      });
    }
  }, [deleteTarget, deleteOptionMutation, refetch, toast, t]);

  const handleFormCreate = useCallback(
    (data: Option) => {
      createOptionMutation.mutate(data, {
        onSuccess,
        onError: error => {
          toast.error(t('messages.error'), {
            description: error['message'] || 'Failed to create option'
          });
        }
      });
    },
    [createOptionMutation, onSuccess, toast, t]
  );

  const handleFormUpdate = useCallback(
    (data: Option) => {
      updateOptionMutation.mutate(
        { ...data, id: data.id! },
        {
          onSuccess,
          onError: error => {
            toast.error(t('messages.error'), {
              description: error['message'] || 'Failed to update option'
            });
          }
        }
      );
    },
    [updateOptionMutation, onSuccess, toast, t]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Option) => {
      return viewType === 'create' ? handleFormCreate(data) : handleFormUpdate(data);
    }),
    [handleFormSubmit, viewType, handleFormCreate, handleFormUpdate]
  );

  const tableConfig = {
    columns: tableColumns({
      handleView,
      handleDelete: handleDeleteClick,
      handleDuplicate
    }),
    topbarLeft: topbarLeftSection({
      setShowBulkImport,
      handleCreate
    }),
    topbarRight: topbarRightSection,
    title: t('system.option.title', 'System Options')
  };

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={tableConfig.title}
        topbarLeft={tableConfig.topbarLeft}
        topbarRight={tableConfig.topbarRight}
        columns={tableConfig.columns}
        data={data?.items || []}
        selected
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        createComponent={
          <CreateOptionPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <OptionViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
        )}
        editComponent={record => (
          <EditorOptionPage
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

      {/* Bulk Import Modal */}
      <Modal
        isOpen={showBulkImport}
        onCancel={() => setShowBulkImport(false)}
        title={t('options.bulk_import.title', 'Bulk Import Options')}
        className='max-w-4xl'
      >
        <OptionsBulkImport
          onSuccess={() => {
            setShowBulkImport(false);
            refetch();
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
        title='Delete Option'
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={handleDeleteConfirm}
        loading={deleteOptionMutation.isPending}
      >
        <div className='space-y-4'>
          <p>Are you sure you want to delete this option?</p>
          {deleteTarget && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='space-y-2'>
                <div>
                  <strong>Name:</strong> <code className='text-sm'>{deleteTarget.name}</code>
                </div>
                <div>
                  <strong>Type:</strong> <code className='text-sm'>{deleteTarget.type}</code>
                </div>
                <div>
                  <strong>Value:</strong>{' '}
                  <code className='text-sm break-all'>{deleteTarget.value}</code>
                </div>
              </div>
            </div>
          )}
          <p className='text-red-600 text-sm'>
            <strong>Warning:</strong> This action cannot be undone. The option will be permanently
            removed from the system.
          </p>
        </div>
      </Modal>
    </>
  );
};
