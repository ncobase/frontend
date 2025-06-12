import { useState, useEffect, useCallback } from 'react';

import {
  Modal,
  Button,
  InputField,
  SelectField,
  Textarea,
  Switch,
  Badge,
  Icons,
  useToastMessage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DateField,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  TableView,
  Progress
} from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { updateSpace } from '../apis';
import {
  useQuerySpaceSettings,
  useCreateSpaceSetting,
  useDeleteSpaceSetting,
  useQuerySpaceUsers,
  useQuerySpaceQuotas,
  useQueryBillingSummary
} from '../service';

interface SpaceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  space: any;
  initialTab?: string;
  onSuccess?: () => void;
  // Navigation callbacks
  onNavigateToQuotas?: (space: any) => void;
  onNavigateToBilling?: (space: any) => void;
  onNavigateToView?: (space: any) => void;
  onNavigateToEdit?: (space: any) => void;
}

export const SpaceSettings: React.FC<SpaceSettingsProps> = ({
  isOpen,
  onClose,
  space,
  initialTab = 'general',
  onSuccess,
  onNavigateToQuotas,
  onNavigateToBilling,
  onNavigateToView,
  onNavigateToEdit
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAddSetting, setShowAddSetting] = useState(false);

  // Update active tab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const {
    control: settingControl,
    handleSubmit: handleSettingSubmit,
    reset: resetSetting,
    formState: { errors: settingErrors }
  } = useForm();

  // Data queries
  const { data: spaceSettings, refetch: refetchSettings } = useQuerySpaceSettings(space?.id);
  const { data: spaceUsers } = useQuerySpaceUsers(space?.id);
  const { data: spaceQuotas } = useQuerySpaceQuotas(space?.id);
  const { data: billingSummary } = useQueryBillingSummary(space?.id);

  // Mutations
  const createSettingMutation = useCreateSpaceSetting();
  const deleteSettingMutation = useDeleteSpaceSetting();

  // Load space data when modal opens
  useEffect(() => {
    if (space && isOpen) {
      setValue('name', space.name);
      setValue('slug', space.slug);
      setValue('type', space.type);
      setValue('url', space.url);
      setValue('title', space.title);
      setValue('description', space.description);
      setValue('keywords', space.keywords);
      setValue('copyright', space.copyright);
      setValue('logo_alt', space.logo_alt);
      setValue('disabled', space.disabled);
      setValue('expired_at', space.expired_at);
      setValue('order', space.order);
    }
  }, [space, isOpen, setValue]);

  const onSubmit = useCallback(
    async data => {
      try {
        await updateSpace({ ...space, ...data });
        toast.success(t('messages.success'), {
          description: t('space.messages.update_success')
        });
        onSuccess?.();
        onClose();
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('space.messages.update_failed')
        });
      }
    },
    [space, toast, t, onSuccess, onClose]
  );

  const onSettingSubmit = useCallback(
    async data => {
      try {
        await createSettingMutation.mutateAsync({
          space_id: space.id,
          ...data
        });
        toast.success(t('messages.success'), {
          description: t('space.settings.setting_created')
        });
        setShowAddSetting(false);
        resetSetting();
        refetchSettings();
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('space.settings.setting_create_failed')
        });
      }
    },
    [space?.id, createSettingMutation, toast, t, resetSetting, refetchSettings]
  );

  const handleDeleteSetting = useCallback(
    async (settingId: string) => {
      try {
        await deleteSettingMutation.mutateAsync(settingId);
        toast.success(t('messages.success'), {
          description: t('space.settings.setting_deleted')
        });
        refetchSettings();
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('space.settings.setting_delete_failed')
        });
      }
    },
    [deleteSettingMutation, toast, t, refetchSettings]
  );

  if (!space) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onCancel={onClose}
        title={t('space.settings.title', 'Space Management')}
        description={`${t('space.settings.description')} "${space.name}"`}
        confirmText={t('actions.save')}
        onConfirm={handleSubmit(onSubmit)}
        className='max-w-6xl max-h-[90vh]'
      >
        <div className='space-y-6'>
          {/* Status Banner with navigation buttons */}
          <SpaceStatusBanner
            space={space}
            t={t}
            onNavigateToView={onNavigateToView}
            onNavigateToEdit={onNavigateToEdit}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='w-full justify-start mb-4'>
              <TabsTrigger value='general'>{t('space.settings.tabs.general')}</TabsTrigger>
              <TabsTrigger value='users'>{t('space.settings.tabs.users')}</TabsTrigger>
              <TabsTrigger value='quotas'>{t('space.settings.tabs.quotas')}</TabsTrigger>
              <TabsTrigger value='billing'>{t('space.settings.tabs.billing')}</TabsTrigger>
              <TabsTrigger value='custom'>{t('space.settings.tabs.custom')}</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value='general' className='space-y-4'>
              <GeneralSettingsTab control={control} errors={errors} t={t} />
            </TabsContent>

            {/* Users Management */}
            <TabsContent value='users' className='space-y-4'>
              <UsersManagementTab spaceId={space.id} users={spaceUsers} t={t} />
            </TabsContent>

            {/* Quotas Overview with navigation */}
            <TabsContent value='quotas' className='space-y-4'>
              <QuotasOverviewTab
                spaceId={space.id}
                quotas={spaceQuotas}
                t={t}
                onNavigateToQuotas={() => onNavigateToQuotas?.(space)}
              />
            </TabsContent>

            {/* Billing Overview with navigation */}
            <TabsContent value='billing' className='space-y-4'>
              <BillingOverviewTab
                spaceId={space.id}
                summary={billingSummary}
                t={t}
                onNavigateToBilling={() => onNavigateToBilling?.(space)}
              />
            </TabsContent>

            {/* Custom Settings */}
            <TabsContent value='custom' className='space-y-4'>
              <CustomSettingsTab
                settings={spaceSettings?.items || []}
                onDelete={handleDeleteSetting}
                onAdd={() => setShowAddSetting(true)}
                t={t}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Modal>

      {/* Add Custom Setting Modal */}
      <Modal
        isOpen={showAddSetting}
        onCancel={() => {
          setShowAddSetting(false);
          resetSetting();
        }}
        title={t('space.custom_settings.add_title')}
        confirmText={t('actions.create')}
        onConfirm={handleSettingSubmit(onSettingSubmit)}
        className='max-w-2xl'
      >
        <AddCustomSettingForm control={settingControl} errors={settingErrors} t={t} />
      </Modal>
    </>
  );
};

// Status Banner with navigation
const SpaceStatusBanner = ({ space, t, onNavigateToView, onNavigateToEdit }) => (
  <div
    className={`p-4 rounded-lg ${
      space.disabled ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
    }`}
  >
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-3'>
        <Icons
          name={space.disabled ? 'IconAlertTriangle' : 'IconCircleCheck'}
          className={space.disabled ? 'text-red-500' : 'text-green-500'}
        />
        <div>
          <div className='font-medium'>
            {space.disabled ? t('space.status.disabled') : t('space.status.active')}
          </div>
          <div className='text-sm text-slate-600'>
            {space.disabled
              ? t('space.status.disabled_description')
              : t('space.status.active_description')}
          </div>
        </div>
        {space.expired_at && space.expired_at > 0 && (
          <div className='text-sm text-slate-600'>
            {t('space.expires_at')}: {formatDateTime(space.expired_at, 'date')}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className='flex items-center space-x-2'>
        <Button variant='link' size='xs' onClick={() => onNavigateToView?.(space)}>
          {t('actions.view')}
        </Button>
        <Button variant='link' size='xs' onClick={() => onNavigateToEdit?.(space)}>
          {t('actions.edit')}
        </Button>
      </div>
    </div>
  </div>
);

// QuotasOverviewTab with navigation
const QuotasOverviewTab = ({ spaceId, quotas, t, onNavigateToQuotas }) => {
  const quotaList = quotas || [];

  return (
    <div className='space-y-6'>
      {/* Quota Summary with action button */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-2'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
              <Icons name='IconGauge' className='w-4 h-4 mr-2' />
              {t('space.quotas.total_quotas')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{quotaList.length}</div>
            <div className='text-xs text-slate-500 mt-1'>{t('space.quotas.configured_limits')}</div>
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
            <div className='text-xs text-slate-500 mt-1'>{t('space.quotas.over_limit')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation to full quotas management */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{t('space.quotas.overview')}</span>
            <Button size='sm' variant='outline-primary' onClick={onNavigateToQuotas}>
              <Icons name='IconArrowRight' className='w-4 h-4 mr-2' />
              {t('space.quotas.manage_all')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quotaList.length === 0 ? (
            <div className='text-center py-8 text-slate-500'>
              <Icons name='IconGauge' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
              {t('space.quotas.no_quotas')}
              <div className='mt-2'>
                <Button size='sm' variant='outline-primary' onClick={onNavigateToQuotas}>
                  {t('space.quotas.create_first')}
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-3'>
              {quotaList.slice(0, 3).map(quota => (
                <div
                  key={quota.id}
                  className='p-3 border border-slate-200/60 rounded hover:bg-slate-50'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <span className='font-medium'>{quota.quota_name}</span>
                    <Badge variant={quota.is_exceeded ? 'danger' : 'success'}>
                      {quota.is_exceeded ? t('space.quotas.exceeded') : t('space.quotas.active')}
                    </Badge>
                  </div>
                  <div className='space-y-1'>
                    <div className='flex justify-between text-sm'>
                      <span>
                        {quota.current_used} / {quota.max_value} {quota.unit}
                      </span>
                      <span>{quota.utilization_percent?.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={quota.utilization_percent}
                      className={`h-2 ${quota.is_exceeded ? 'bg-red-100' : 'bg-slate-100'}`}
                    />
                  </div>
                </div>
              ))}
              {quotaList.length > 3 && (
                <div className='text-center py-2'>
                  <Button size='sm' variant='outline-slate' onClick={onNavigateToQuotas}>
                    {t('space.quotas.view_all', 'View all {{count}} quotas', {
                      count: quotaList.length
                    })}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// BillingOverviewTab with navigation
const BillingOverviewTab = ({ spaceId, summary, t, onNavigateToBilling }) => (
  <div className='space-y-6'>
    {/* Billing Summary */}
    {summary && (
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 px-2'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {t('space.billing.total_amount')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>${summary.total_amount?.toFixed(2) || '0.00'}</div>
            <div className='text-xs text-slate-500 mt-1'>{summary.currency || 'USD'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {t('space.billing.paid_amount')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              ${summary.paid_amount?.toFixed(2) || '0.00'}
            </div>
            <div className='text-xs text-slate-500 mt-1'>{summary.paid_invoices || 0} invoices</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {t('space.billing.pending_amount')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>
              ${summary.pending_amount?.toFixed(2) || '0.00'}
            </div>
            <div className='text-xs text-slate-500 mt-1'>
              {(summary.total_invoices || 0) - (summary.paid_invoices || 0)} pending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {t('space.billing.overdue_amount')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              ${summary.overdue_amount?.toFixed(2) || '0.00'}
            </div>
            <div className='text-xs text-slate-500 mt-1'>
              {summary.overdue_invoices || 0} overdue
            </div>
          </CardContent>
        </Card>
      </div>
    )}

    {/* Quick Actions with navigation */}
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>{t('space.billing.quick_actions')}</span>
          <Button size='sm' variant='outline-primary' onClick={onNavigateToBilling}>
            <Icons name='IconArrowRight' className='w-4 h-4 mr-2' />
            {t('space.billing.manage_all')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 px-2'>
          <Button
            variant='outline-primary'
            className='h-auto p-4 flex flex-col items-start'
            onClick={onNavigateToBilling}
          >
            <Icons name='IconPlus' className='w-5 h-5 mb-2' />
            <div className='text-left'>
              <div className='font-medium'>{t('space.billing.create_invoice')}</div>
              <div className='text-xs text-slate-500'>{t('space.billing.create_invoice_desc')}</div>
            </div>
          </Button>

          <Button
            variant='outline-success'
            className='h-auto p-4 flex flex-col items-start'
            onClick={onNavigateToBilling}
          >
            <Icons name='IconCreditCard' className='w-5 h-5 mb-2' />
            <div className='text-left'>
              <div className='font-medium'>{t('space.billing.record_payment')}</div>
              <div className='text-xs text-slate-500'>{t('space.billing.record_payment_desc')}</div>
            </div>
          </Button>

          <Button
            variant='outline-slate'
            className='h-auto p-4 flex flex-col items-start'
            onClick={onNavigateToBilling}
          >
            <Icons name='IconFileText' className='w-5 h-5 mb-2' />
            <div className='text-left'>
              <div className='font-medium'>{t('space.billing.view_history')}</div>
              <div className='text-xs text-slate-500'>{t('space.billing.view_history_desc')}</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// General Settings Tab (same as before)
const GeneralSettingsTab = ({ control, errors, t }) => (
  <div className='grid grid-cols-2 gap-4'>
    <Controller
      name='name'
      control={control}
      rules={{ required: t('forms.input_required') }}
      render={({ field }) => (
        <InputField
          label={t('space.fields.name')}
          placeholder={t('space.placeholders.name')}
          error={errors.name?.message}
          {...field}
        />
      )}
    />

    <Controller
      name='slug'
      control={control}
      render={({ field }) => (
        <InputField
          label={t('space.fields.slug')}
          placeholder={t('space.placeholders.slug')}
          disabled
          description={t('space.slug_readonly_hint')}
          {...field}
        />
      )}
    />

    <Controller
      name='type'
      control={control}
      render={({ field }) => (
        <SelectField
          label={t('space.fields.type')}
          options={[
            { label: t('common.types.private'), value: 'private' },
            { label: t('common.types.public'), value: 'public' },
            { label: t('common.types.internal'), value: 'internal' },
            { label: t('common.types.external'), value: 'external' },
            { label: t('common.types.other'), value: 'other' }
          ]}
          {...field}
        />
      )}
    />

    <Controller
      name='url'
      control={control}
      render={({ field }) => (
        <InputField
          label={t('space.fields.url')}
          placeholder={t('space.placeholders.url')}
          {...field}
        />
      )}
    />

    <div className='col-span-2'>
      <Controller
        name='description'
        control={control}
        render={({ field }) => (
          <Textarea
            label={t('space.fields.description')}
            placeholder={t('space.placeholders.description')}
            rows={3}
            {...field}
          />
        )}
      />
    </div>

    <div className='flex items-center justify-between p-4 bg-slate-50 rounded-lg col-span-2'>
      <div>
        <div className='font-medium'>{t('space.access.status')}</div>
        <div className='text-sm text-slate-600'>{t('space.access.status_description')}</div>
      </div>
      <Controller
        name='disabled'
        control={control}
        render={({ field: { value, onChange } }) => (
          <Switch checked={!value} onCheckedChange={checked => onChange(!checked)} />
        )}
      />
    </div>

    <Controller
      name='expired_at'
      control={control}
      render={({ field }) => (
        <DateField
          label={t('space.fields.expired_at')}
          description={t('space.fields.expired_at_hint')}
          {...field}
        />
      )}
    />

    <Controller
      name='order'
      control={control}
      render={({ field }) => (
        <InputField
          type='number'
          label={t('space.fields.order')}
          placeholder='0'
          description={t('space.order_hint')}
          {...field}
        />
      )}
    />
  </div>
);

// Users Management Tab with TableView (same as before but with enhanced actions)
const UsersManagementTab = ({ spaceId, users, t }) => {
  const userList = users?.users || [];
  const userCount = userList.length;

  // Table columns configuration
  const userColumns = [
    {
      title: t('space.users.fields.username', 'Username'),
      dataIndex: 'username',
      icon: 'IconUser',
      parser: (value, record) => (
        <div className='flex items-center space-x-2'>
          <span className='font-medium'>{value}</span>
          {record.is_admin && (
            <Badge variant='warning' size='xs'>
              Admin
            </Badge>
          )}
        </div>
      )
    },
    {
      title: t('space.users.fields.email', 'Email'),
      dataIndex: 'email',
      icon: 'IconMail',
      parser: value => <span className='text-slate-600 truncate max-w-[200px]'>{value || '-'}</span>
    },
    {
      title: t('space.users.fields.roles', 'Roles'),
      dataIndex: 'role_ids',
      icon: 'IconUserCheck',
      parser: roleIds => {
        roleIds = roleIds ? JSON.parse(roleIds) : []; // Assuming roleIds is a JSON string
        if (!roleIds || roleIds.length === 0) {
          return <span className='text-slate-500'>No roles</span>;
        }
        return (
          <div className='flex flex-wrap gap-1'>
            {roleIds.slice(0, 2).map(roleId => (
              <Badge key={roleId} variant='outline-primary' size='sm'>
                {roleId}
              </Badge>
            ))}
            {roleIds.length > 2 && (
              <Badge variant='outline-slate' size='sm'>
                +{roleIds.length - 2}
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      title: t('space.users.fields.access_level', 'Access Level'),
      dataIndex: 'access_level',
      icon: 'IconShield',
      parser: value => {
        if (!value) return '-';
        const levelColors = {
          limited: 'bg-red-100 text-red-800',
          standard: 'bg-blue-100 text-blue-800',
          elevated: 'bg-purple-100 text-purple-800',
          admin: 'bg-orange-100 text-orange-800'
        };
        return (
          <Badge className={levelColors[value] || 'bg-slate-100'}>
            {t(`space.users.access_levels.${value}`)}
          </Badge>
        );
      }
    },
    {
      title: t('space.users.fields.status', 'Status'),
      dataIndex: 'is_active',
      icon: 'IconStatusChange',
      parser: value => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? t('space.users.status.active') : t('space.users.status.inactive')}
        </Badge>
      )
    },
    {
      title: t('space.users.fields.joined_at', 'Joined'),
      dataIndex: 'joined_at',
      icon: 'IconCalendarPlus',
      parser: value => (value ? formatDateTime(value, 'date') : '-')
    }
  ];

  return (
    <div className='space-y-6'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 px-2'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
              <Icons name='IconUsers' className='w-4 h-4 mr-2' />
              {t('space.users.total_users')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userCount}</div>
            <div className='text-xs text-slate-500 mt-1'>{t('space.users.total_assigned')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
              <Icons name='IconUserCheck' className='w-4 h-4 mr-2' />
              {t('space.users.active_count')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {userList.filter(u => u.is_active).length}
            </div>
            <div className='text-xs text-slate-500 mt-1'>{t('space.users.currently_active')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
              <Icons name='IconShield' className='w-4 h-4 mr-2' />
              {t('space.users.admin_count')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {userList.filter(u => u.access_level === 'admin').length}
            </div>
            <div className='text-xs text-slate-500 mt-1'>
              {t('space.users.administrator_level')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className='shadow-none hover:shadow-none'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{t('space.users.user_list', 'User List')}</span>
            <Button size='sm' variant='outline-primary'>
              <Icons name='IconPlus' className='w-4 h-4 mr-2' />
              {t('space.users.add_user')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {userCount === 0 ? (
            <div className='text-center py-8 text-slate-500'>
              <Icons name='IconUsers' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
              {t('space.users.no_users')}
              <div className='mt-2'>
                <Button size='sm' variant='outline-primary'>
                  <Icons name='IconPlus' className='w-4 h-4 mr-2' />
                  {t('space.users.add_first_user')}
                </Button>
              </div>
            </div>
          ) : (
            <TableView header={userColumns} data={userList} visibleControl={false} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Custom Settings Tab (same as previous implementation)
const CustomSettingsTab = ({ settings, onDelete, onAdd, t }) => {
  const settingsColumns = [
    {
      title: t('space.custom_settings.fields.name', 'Setting Name'),
      dataIndex: 'setting_name',
      icon: 'IconTag',
      parser: (value, record) => (
        <div>
          <div className='font-medium'>{value}</div>
          <div className='text-xs text-slate-500 font-mono bg-slate-100 px-1 rounded'>
            {record.setting_key}
          </div>
          {record.description && (
            <div className='text-xs text-slate-600 mt-1'>{record.description}</div>
          )}
        </div>
      )
    },
    {
      title: t('space.custom_settings.fields.type', 'Type'),
      dataIndex: 'setting_type',
      icon: 'IconCode',
      parser: value => {
        const typeColors = {
          string: 'bg-blue-100 text-blue-800',
          number: 'bg-green-100 text-green-800',
          boolean: 'bg-purple-100 text-purple-800',
          json: 'bg-orange-100 text-orange-800',
          array: 'bg-pink-100 text-pink-800'
        };
        return (
          <Badge className={typeColors[value] || 'bg-slate-100'} size='sm'>
            {value}
          </Badge>
        );
      }
    },
    {
      title: t('space.custom_settings.fields.scope', 'Scope'),
      dataIndex: 'scope',
      icon: 'IconTarget',
      parser: value => {
        const scopeColors = {
          system: 'bg-red-100 text-red-800',
          space: 'bg-blue-100 text-blue-800',
          user: 'bg-green-100 text-green-800',
          feature: 'bg-purple-100 text-purple-800'
        };
        return (
          <Badge className={scopeColors[value] || 'bg-slate-100'} size='sm'>
            {value}
          </Badge>
        );
      }
    },
    {
      title: t('space.custom_settings.fields.value', 'Value'),
      dataIndex: 'setting_value',
      icon: 'IconEdit',
      parser: (value, record) => (
        <div className='max-w-[200px]'>
          <div className='text-sm font-mono truncate'>{value || record.default_value || '-'}</div>
        </div>
      )
    },
    {
      title: t('space.custom_settings.fields.properties', 'Properties'),
      dataIndex: 'is_required',
      icon: 'IconShield',
      parser: (_, record) => (
        <div className='flex flex-wrap gap-1'>
          {record.is_required && (
            <Badge variant='warning' size='xs'>
              Required
            </Badge>
          )}
          {record.is_readonly && (
            <Badge variant='secondary' size='xs'>
              Readonly
            </Badge>
          )}
          {record.is_public && (
            <Badge variant='success' size='xs'>
              Public
            </Badge>
          )}
        </div>
      )
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      parser: (_, record) => (
        <div className='flex items-center space-x-2'>
          {!record.is_readonly && (
            <>
              <Button variant='outline-primary' size='xs'>
                <Icons name='IconPencil' size={12} />
              </Button>
              <Button variant='outline-danger' size='xs' onClick={() => onDelete(record.id)}>
                <Icons name='IconTrash' size={12} />
              </Button>
            </>
          )}
          {record.is_readonly && (
            <Badge variant='secondary' size='xs'>
              System
            </Badge>
          )}
        </div>
      )
    }
  ];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='font-medium'>{t('space.custom_settings.title')}</h4>
          <p className='text-sm text-slate-600'>{t('space.custom_settings.description')}</p>
        </div>
        <Button onClick={onAdd} size='sm'>
          <Icons name='IconPlus' className='mr-2' />
          {t('space.custom_settings.add')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{t('space.custom_settings.list', 'Custom Settings')}</span>
            <Badge variant='outline-primary'>
              {settings.length} {t('space.custom_settings.total', 'total')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {!settings || settings.length === 0 ? (
            <div className='text-center py-8 text-slate-500'>
              <Icons name='IconSettings' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
              {t('space.custom_settings.no_settings')}
              <div className='mt-2'>
                <Button onClick={onAdd} size='sm' variant='outline-primary'>
                  <Icons name='IconPlus' className='mr-2' />
                  {t('space.custom_settings.add_first')}
                </Button>
              </div>
            </div>
          ) : (
            <TableView header={settingsColumns} data={settings} visibleControl={false} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Add Custom Setting Form (same as before)
const AddCustomSettingForm = ({ control, errors, t }) => (
  <div className='space-y-4'>
    <div className='grid grid-cols-2 gap-4'>
      <Controller
        name='setting_key'
        control={control}
        rules={{
          required: t('forms.input_required'),
          pattern: {
            value: /^[a-z0-9_]+$/,
            message: t('space.custom_settings.key_pattern')
          }
        }}
        render={({ field }) => (
          <InputField
            label={t('space.custom_settings.fields.key')}
            placeholder='setting_key'
            error={errors.setting_key?.message}
            description={t('space.custom_settings.key_hint')}
            {...field}
          />
        )}
      />

      <Controller
        name='setting_name'
        control={control}
        rules={{ required: t('forms.input_required') }}
        render={({ field }) => (
          <InputField
            label={t('space.custom_settings.fields.name')}
            placeholder='Setting Display Name'
            error={errors.setting_name?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='setting_type'
        control={control}
        rules={{ required: t('forms.select_required') }}
        render={({ field }) => (
          <SelectField
            label={t('space.custom_settings.fields.type')}
            options={[
              { label: 'String', value: 'string' },
              { label: 'Number', value: 'number' },
              { label: 'Boolean', value: 'boolean' },
              { label: 'JSON', value: 'json' },
              { label: 'Array', value: 'array' }
            ]}
            error={errors.setting_type?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='scope'
        control={control}
        rules={{ required: t('forms.select_required') }}
        render={({ field }) => (
          <SelectField
            label={t('space.custom_settings.fields.scope')}
            options={[
              { label: 'System', value: 'system' },
              { label: 'Space', value: 'space' },
              { label: 'User', value: 'user' },
              { label: 'Feature', value: 'feature' }
            ]}
            error={errors.scope?.message}
            {...field}
          />
        )}
      />
    </div>

    <div className='grid grid-cols-2 gap-4'>
      <Controller
        name='setting_value'
        control={control}
        render={({ field }) => (
          <InputField
            label={t('space.custom_settings.fields.value')}
            placeholder='Setting value'
            {...field}
          />
        )}
      />

      <Controller
        name='default_value'
        control={control}
        render={({ field }) => (
          <InputField
            label={t('space.custom_settings.fields.default')}
            placeholder='Default value'
            {...field}
          />
        )}
      />
    </div>

    <Controller
      name='description'
      control={control}
      render={({ field }) => (
        <Textarea
          label={t('space.custom_settings.fields.description')}
          placeholder='Describe this setting'
          rows={2}
          {...field}
        />
      )}
    />

    <div className='grid grid-cols-3 gap-4'>
      <Controller
        name='is_public'
        control={control}
        render={({ field: { value, onChange } }) => (
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={value}
              onChange={e => onChange(e.target.checked)}
              className='rounded border-slate-300'
            />
            <span className='text-sm'>{t('space.custom_settings.fields.public')}</span>
          </label>
        )}
      />

      <Controller
        name='is_required'
        control={control}
        render={({ field: { value, onChange } }) => (
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={value}
              onChange={e => onChange(e.target.checked)}
              className='rounded border-slate-300'
            />
            <span className='text-sm'>{t('space.custom_settings.fields.required')}</span>
          </label>
        )}
      />

      <Controller
        name='is_readonly'
        control={control}
        render={({ field: { value, onChange } }) => (
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={value}
              onChange={e => onChange(e.target.checked)}
              className='rounded border-slate-300'
            />
            <span className='text-sm'>{t('space.custom_settings.fields.readonly')}</span>
          </label>
        )}
      />
    </div>
  </div>
);
