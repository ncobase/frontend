import { useCallback, useEffect, useState } from 'react';

import { Badge, Icons, Modal } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { DictionaryImportExport } from '../components';
import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { Dictionary } from '../dictionary';
import { useDictionaryList } from '../hooks';
import { useCreateDictionary, useDeleteDictionary, useUpdateDictionary } from '../service';

import { CreateDictionaryPage } from './create';
import { EditorDictionaryPage } from './editor';
import { DictionaryViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';
import { usePermissions } from '@/features/account/permissions';

export const DictionaryListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const { vmode } = useLayoutContext();
  const { hasPermission } = usePermissions();
  const canManage = hasPermission('manage:dictionary') || hasPermission('manage:system');

  const { data, fetchData, loading, refetch } = useDictionaryList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<Dictionary | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    open: boolean;
    dictionary: Dictionary | null;
    valid: boolean;
    messages: string[];
    normalizedValue?: string;
  }>({
    open: false,
    dictionary: null,
    valid: false,
    messages: []
  });

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
  } = useForm<Dictionary>();

  const createDictionaryMutation = useCreateDictionary();
  const updateDictionaryMutation = useUpdateDictionary();
  const deleteDictionaryMutation = useDeleteDictionary();

  useEffect(() => {
    if (!canManage && (mode === 'create' || mode === 'edit')) {
      setViewType(undefined);
      if (vmode === 'flatten') {
        navigate('/system/dictionaries');
      }
      return;
    }

    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [canManage, mode, navigate, vmode]);

  const onQuery = handleQuerySubmit(async queryData => {
    await fetchData({ ...queryData, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
  };

  const handleView = useCallback(
    (record: Dictionary | null, type: string) => {
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
    (data: Dictionary) => {
      if (!canManage) return;
      createDictionaryMutation.mutate(data, { onSuccess });
    },
    [canManage, createDictionaryMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: Dictionary) => {
      if (!canManage) return;
      updateDictionaryMutation.mutate(data, { onSuccess });
    },
    [canManage, updateDictionaryMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: Dictionary) => {
      if (canManage && record.id) {
        deleteDictionaryMutation.mutate(record.id, { onSuccess });
      }
    },
    [canManage, deleteDictionaryMutation, onSuccess]
  );

  const handleValidate = useCallback(
    (record: Dictionary) => {
      const messages: string[] = [];
      let valid = true;
      let normalizedValue: string | undefined;
      const type = (record.type || '').toLowerCase();
      const rawValue = String(record.value ?? '').trim();

      const fail = (message: string) => {
        valid = false;
        messages.push(message);
      };

      try {
        if (!rawValue) {
          fail(t('dictionary.validation.empty_value', 'Value is empty'));
        } else if (type === 'enum') {
          const parsed = JSON.parse(rawValue);
          if (!Array.isArray(parsed) && (typeof parsed !== 'object' || parsed === null)) {
            fail(
              t('dictionary.validation.enum_shape', 'Enum value must be a JSON array or object')
            );
          } else if (Array.isArray(parsed)) {
            const invalidIndex = parsed.findIndex(
              item =>
                typeof item !== 'string' &&
                (typeof item !== 'object' || item === null || !('value' in item))
            );
            if (invalidIndex >= 0) {
              fail(
                t('dictionary.validation.enum_item', {
                  defaultValue: 'Enum item {{index}} must be a string or an object with value',
                  index: invalidIndex + 1
                })
              );
            }
          }
          normalizedValue = JSON.stringify(parsed, null, 2);
        } else if (type === 'object') {
          const parsed = JSON.parse(rawValue);
          if (Array.isArray(parsed) || typeof parsed !== 'object' || parsed === null) {
            fail(t('dictionary.validation.object_shape', 'Object value must be a JSON object'));
          }
          normalizedValue = JSON.stringify(parsed, null, 2);
        } else if (type === 'number') {
          if (!Number.isFinite(Number(rawValue))) {
            fail(t('dictionary.validation.number_value', 'Value must be a valid number'));
          }
        } else if (type === 'boolean') {
          if (!['true', 'false', '1', '0'].includes(rawValue.toLowerCase())) {
            fail(t('dictionary.validation.boolean_value', 'Value must be true, false, 1, or 0'));
          }
        } else {
          messages.push(
            t('dictionary.validation.scalar_value', 'Scalar value does not require JSON validation')
          );
        }
      } catch (error) {
        fail(error['message'] || t('dictionary.validation.invalid_json', 'Invalid JSON value'));
      }

      if (valid) {
        messages.unshift(t('dictionary.validation.valid', 'Dictionary value is valid'));
      }

      setValidationResult({
        open: true,
        dictionary: record,
        valid,
        messages,
        normalizedValue
      });
    },
    [t]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: Dictionary) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete, handleValidate, canManage }),
    topbarLeft: topbarLeftSection({ handleView, setShowImportExport, canManage }),
    topbarRight: topbarRightSection,
    title: t('system.dictionaries.title')
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
        selected={canManage}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        fetchData={fetchData}
        loading={loading}
        createComponent={
          <CreateDictionaryPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <DictionaryViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
        )}
        editComponent={record => (
          <EditorDictionaryPage
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
      {canManage && (
        <Modal
          isOpen={showImportExport}
          onCancel={() => setShowImportExport(false)}
          title={t('dictionary.import_export.title')}
          className='max-w-4xl'
        >
          <DictionaryImportExport />
        </Modal>
      )}
      <Modal
        isOpen={validationResult.open}
        onCancel={() =>
          setValidationResult({
            open: false,
            dictionary: null,
            valid: false,
            messages: []
          })
        }
        title={t('dictionary.validation.title', 'Dictionary Validation')}
        confirmText={t('actions.close', 'Close')}
        onConfirm={() =>
          setValidationResult({
            open: false,
            dictionary: null,
            valid: false,
            messages: []
          })
        }
        className='max-w-2xl'
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3'>
            <div className='min-w-0'>
              <div className='font-medium'>{validationResult.dictionary?.name}</div>
              <div className='font-mono text-xs text-slate-500'>
                {validationResult.dictionary?.slug}
              </div>
            </div>
            <Badge variant={validationResult.valid ? 'success' : 'danger'}>
              {validationResult.valid
                ? t('dictionary.validation.valid_status', 'Valid')
                : t('dictionary.validation.invalid_status', 'Invalid')}
            </Badge>
          </div>

          <div className='space-y-2'>
            {validationResult.messages.map((message, index) => (
              <div key={index} className='flex items-start gap-2 text-sm text-slate-700'>
                <Icons
                  name={validationResult.valid ? 'IconCircleCheck' : 'IconAlertCircle'}
                  size={16}
                  className={validationResult.valid ? 'text-green-600' : 'text-red-600'}
                />
                <span>{message}</span>
              </div>
            ))}
          </div>

          {validationResult.normalizedValue && (
            <pre className='max-h-64 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100'>
              {validationResult.normalizedValue}
            </pre>
          )}
        </div>
      </Modal>
    </>
  );
};
