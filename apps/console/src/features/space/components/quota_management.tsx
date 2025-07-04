import { useState } from 'react';

import {
  Button,
  InputField,
  SelectField,
  Badge,
  Icons,
  useToastMessage,
  Modal,
  AlertDialog,
  Progress,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  TableView
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  useQuerySpaceQuotas,
  useCreateSpaceQuota,
  useUpdateSpaceQuota,
  useDeleteSpaceQuota,
  useUpdateQuotaUsage
} from '../service';

interface SpaceQuotaManagementProps {
  space: any;
  onNavigateToSettings?: (_space: any) => void;
}

export const SpaceQuotaManagement: React.FC<SpaceQuotaManagementProps> = ({
  space,
  onNavigateToSettings
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [showForm, setShowForm] = useState(false);
  const [editingQuota, setEditingQuota] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, quota: null });

  const { data: quotas, isLoading, refetch } = useQuerySpaceQuotas(space?.id);
  const createQuotaMutation = useCreateSpaceQuota();
  const updateQuotaMutation = useUpdateSpaceQuota();
  const deleteQuotaMutation = useDeleteSpaceQuota();
  const updateUsageMutation = useUpdateQuotaUsage();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const quotaList = quotas || [];

  // Quota table columns for TableView
  const quotaColumns = [
    {
      title: t('space.quotas.fields.quota_name', 'Name'),
      dataIndex: 'quota_name',
      icon: 'IconTag',
      parser: (value, record) => (
        <div>
          <div className='font-medium'>{value}</div>
          <div className='text-xs text-slate-500'>{record.description}</div>
        </div>
      )
    },
    {
      title: t('space.quotas.fields.quota_type', 'Type'),
      dataIndex: 'quota_type',
      icon: 'IconCategory',
      parser: value => (
        <Badge variant='outline-primary'>
          {t(`space.quotas.types.${value}`, { value: value })}
        </Badge>
      )
    },
    {
      title: t('space.quotas.fields.usage', 'Usage'),
      dataIndex: 'current_used',
      icon: 'IconGauge',
      parser: (value, record) => (
        <div className='space-y-2 min-w-[150px]'>
          <div className='flex justify-between text-sm'>
            <span>
              {value} / {record.max_value}
            </span>
            <span className='font-medium'>{record.utilization_percent?.toFixed(1)}%</span>
          </div>
          <Progress
            value={record.utilization_percent}
            className={`h-2 ${record.is_exceeded ? 'bg-red-100' : 'bg-slate-100'}`}
          />
          <div className='text-xs text-slate-500'>
            {record.unit} • {record.is_exceeded ? 'Over limit' : 'Within limit'}
          </div>
        </div>
      )
    },
    {
      title: t('space.quotas.fields.status', 'Status'),
      dataIndex: 'enabled',
      icon: 'IconStatusChange',
      parser: (value, record) => (
        <div className='space-y-1'>
          <Badge variant={record.is_exceeded ? 'danger' : value ? 'success' : 'secondary'}>
            {record.is_exceeded
              ? t('space.quotas.exceeded')
              : value
                ? t('space.quotas.active')
                : t('space.quotas.disabled')}
          </Badge>
          {record.is_exceeded && (
            <div className='text-xs text-red-600'>
              {t('space.quotas.over_by', 'Over by {{amount}}', {
                amount: record.current_used - record.max_value
              })}
            </div>
          )}
        </div>
      )
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      parser: (_, record) => (
        <div className='flex items-center space-x-1'>
          <Button
            variant='outline-primary'
            size='xs'
            onClick={() => handleEdit(record)}
            title={t('actions.edit')}
          >
            <Icons name='IconPencil' size={12} />
          </Button>
          <Button
            variant='outline-slate'
            size='xs'
            onClick={() => handleUsageUpdate(record.id, -1)}
            disabled={record.current_used <= 0}
            title={t('space.quotas.decrease_usage')}
          >
            <Icons name='IconMinus' size={12} />
          </Button>
          <Button
            variant='outline-slate'
            size='xs'
            onClick={() => handleUsageUpdate(record.id, 1)}
            title={t('space.quotas.increase_usage')}
          >
            <Icons name='IconPlus' size={12} />
          </Button>
          <Button
            variant='outline-danger'
            size='xs'
            onClick={() => handleDelete(record)}
            title={t('actions.delete')}
          >
            <Icons name='IconTrash' size={12} />
          </Button>
        </div>
      )
    }
  ];

  const handleCreate = () => {
    setEditingQuota(null);
    reset({
      space_id: space.id,
      quota_type: 'users',
      unit: 'count',
      enabled: true,
      max_value: 100,
      current_used: 0
    });
    setShowForm(true);
  };

  const handleEdit = (quota: any) => {
    setEditingQuota(quota);
    reset(quota);
    setShowForm(true);
  };

  const handleDelete = (quota: any) => {
    setDeleteDialog({ open: true, quota });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.quota) return;

    try {
      await deleteQuotaMutation.mutateAsync(deleteDialog.quota.id);
      toast.success(t('messages.success'), {
        description: t('space.quotas.delete_success')
      });
      setDeleteDialog({ open: false, quota: null });
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.quotas.delete_failed')
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingQuota) {
        await updateQuotaMutation.mutateAsync({ id: editingQuota.id, ...data });
        toast.success(t('messages.success'), {
          description: t('space.quotas.update_success')
        });
      } else {
        await createQuotaMutation.mutateAsync(data);
        toast.success(t('messages.success'), {
          description: t('space.quotas.create_success')
        });
      }

      setShowForm(false);
      reset();
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.quotas.save_failed')
      });
    }
  };

  const handleUsageUpdate = async (quotaId: string, delta: number) => {
    try {
      await updateUsageMutation.mutateAsync({
        space_id: space.id,
        quota_type: 'users', // This should be dynamic based on the quota
        delta
      });
      toast.success(t('messages.success'), {
        description: t('space.quotas.usage_updated')
      });
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.quotas.usage_update_failed')
      });
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header with navigation */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div>
            <h3 className='text-lg font-medium'>{t('space.quotas.title')}</h3>
            <p className='text-slate-600'>{t('space.quotas.description')}</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {onNavigateToSettings && (
            <Button variant='outline-slate' onClick={() => onNavigateToSettings(space)}>
              <Icons name='IconArrowLeft' className='mr-2' />
              {t('actions.go_back')}
            </Button>
          )}
          <Button onClick={handleCreate}>
            <Icons name='IconPlus' className='mr-2' />
            {t('space.quotas.add')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 px-2'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
              <Icons name='IconGauge' className='w-4 h-4 mr-2' />
              {t('space.quotas.total_quotas')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{quotaList.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
              <Icons name='IconCheckCircle' className='w-4 h-4 mr-2' />
              {t('space.quotas.active_quotas')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {quotaList.filter(q => q.enabled && !q.is_exceeded).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
              <Icons name='IconAlertTriangle' className='w-4 h-4 mr-2' />
              {t('space.quotas.exceeded_quotas')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {quotaList.filter(q => q.is_exceeded).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
              <Icons name='IconPause' className='w-4 h-4 mr-2' />
              {t('space.quotas.disabled_quotas')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-600'>
              {quotaList.filter(q => !q.enabled).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotas Table */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{t('space.quotas.quota_list', 'Quota Management')}</span>
            <Badge variant='outline-primary'>
              {quotaList.length} {t('space.quotas.total', 'total')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='text-center py-8'>
              <Icons name='IconLoader' className='animate-spin mx-auto mb-4' />
              {t('common.loading')}
            </div>
          ) : quotaList.length === 0 ? (
            <div className='text-center py-8 text-slate-500'>
              <Icons name='IconGauge' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
              {t('space.quotas.no_quotas')}
              <div className='mt-4'>
                <Button onClick={handleCreate} variant='outline-primary'>
                  <Icons name='IconPlus' className='mr-2' />
                  {t('space.quotas.create_first')}
                </Button>
              </div>
            </div>
          ) : (
            <TableView header={quotaColumns} data={quotaList} visibleControl={false} />
          )}
        </CardContent>
      </Card>

      {/* Quota Form Modal */}
      <Modal
        isOpen={showForm}
        onCancel={() => {
          setShowForm(false);
          reset();
        }}
        title={editingQuota ? t('space.quotas.edit_title') : t('space.quotas.create_title')}
        confirmText={editingQuota ? t('actions.update') : t('actions.create')}
        onConfirm={handleSubmit(onSubmit)}
        className='max-w-2xl'
      >
        <QuotaForm control={control} errors={errors} t={t} />
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        title={t('space.quotas.delete_confirm_title')}
        description={t('space.quotas.delete_confirm_description')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.delete')}
        onCancel={() => setDeleteDialog({ open: false, quota: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

const QuotaForm = ({ control, errors, t }) => (
  <div className='space-y-4'>
    <div className='grid grid-cols-2 gap-4'>
      <Controller
        name='quota_name'
        control={control}
        rules={{ required: t('forms.input_required') }}
        render={({ field }) => (
          <InputField
            label={t('space.quotas.fields.quota_name')}
            placeholder={t('space.quotas.placeholders.quota_name')}
            error={errors.quota_name?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='quota_type'
        control={control}
        rules={{ required: t('forms.select_required') }}
        render={({ field }) => (
          <SelectField
            label={t('space.quotas.fields.quota_type')}
            options={[
              { label: t('space.quotas.types.users'), value: 'users' },
              { label: t('space.quotas.types.storage'), value: 'storage' },
              { label: t('space.quotas.types.api_calls'), value: 'api_calls' },
              { label: t('space.quotas.types.projects'), value: 'projects' },
              { label: t('space.quotas.types.custom'), value: 'custom' }
            ]}
            error={errors.quota_type?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='max_value'
        control={control}
        rules={{
          required: t('forms.input_required'),
          min: { value: 1, message: 'Max value must be greater than 0' }
        }}
        render={({ field }) => (
          <InputField
            type='number'
            label={t('space.quotas.fields.max_value')}
            placeholder='100'
            error={errors.max_value?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='unit'
        control={control}
        rules={{ required: t('forms.select_required') }}
        render={({ field }) => (
          <SelectField
            label={t('space.quotas.fields.unit')}
            options={[
              { label: t('space.quotas.units.count'), value: 'count' },
              { label: t('space.quotas.units.bytes'), value: 'bytes' },
              { label: t('space.quotas.units.mb'), value: 'mb' },
              { label: t('space.quotas.units.gb'), value: 'gb' },
              { label: t('space.quotas.units.tb'), value: 'tb' }
            ]}
            error={errors.unit?.message}
            {...field}
          />
        )}
      />
    </div>

    <Controller
      name='description'
      control={control}
      render={({ field }) => (
        <InputField
          label={t('space.quotas.fields.description')}
          placeholder={t('space.quotas.placeholders.description')}
          {...field}
        />
      )}
    />

    <div className='flex items-center space-x-4'>
      <Controller
        name='enabled'
        control={control}
        render={({ field: { value, onChange } }) => (
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={value}
              onChange={e => onChange(e.target.checked)}
              className='rounded border-slate-300'
            />
            <span>{t('space.quotas.fields.enabled')}</span>
          </label>
        )}
      />
    </div>
  </div>
);
