import { type ReactNode, useMemo, useState } from 'react';

import {
  Button,
  Icons,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  useToastMessage
} from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { QuotaDisplay } from '../components/quota_display';
import { type BatchCleanupResult, type OptimizeResult } from '../resource';
import { useResourceRuntimePolicy } from '../resource_policy';
import {
  useBatchCleanup,
  useGetAdminStats,
  useGetStorageHealth,
  useGetUsage,
  useListBatchJobs,
  useOptimizeStorage
} from '../service';
import { formatBytes, summarizeAllowedResourceTypes } from '../upload_payload';

import { Page, Topbar } from '@/components/layout';

const getErrorMessage = (error: unknown) => {
  if (!error) {
    return '';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const StatCard = ({
  icon,
  label,
  value,
  color,
  loading
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
  loading?: boolean;
}) => (
  <div className='bg-white rounded-lg border p-6'>
    <div className='flex items-center gap-3'>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icons name={icon} className='w-5 h-5 text-white' />
      </div>
      <div className='min-w-0'>
        <p className='text-sm text-slate-500'>{label}</p>
        {loading ? (
          <div className='mt-2 h-6 w-24 animate-pulse rounded bg-slate-100' />
        ) : (
          <p className='truncate text-xl font-semibold text-slate-900'>{value}</p>
        )}
      </div>
    </div>
  </div>
);

const Panel = ({
  title,
  icon,
  action,
  children
}: {
  title: string;
  icon: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <div className='bg-white rounded-lg border p-6'>
    <div className='mb-4 flex items-center justify-between gap-3'>
      <div className='flex min-w-0 items-center gap-2'>
        <Icons name={icon} className='h-5 w-5 shrink-0 text-slate-500' />
        <h3 className='truncate text-sm font-medium text-slate-700'>{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const Notice = ({
  icon,
  tone,
  title,
  description,
  action
}: {
  icon: string;
  tone: 'info' | 'warning' | 'error';
  title: string;
  description?: string;
  action?: ReactNode;
}) => {
  const toneClass = {
    info: 'border-blue-100 bg-blue-50 text-blue-700',
    warning: 'border-amber-100 bg-amber-50 text-amber-700',
    error: 'border-red-100 bg-red-50 text-red-700'
  }[tone];

  return (
    <div className={`rounded-lg border px-4 py-3 ${toneClass}`}>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex min-w-0 gap-2'>
          <Icons name={icon} className='mt-0.5 h-4 w-4 shrink-0' />
          <div className='min-w-0'>
            <p className='text-sm font-medium'>{title}</p>
            {description && <p className='mt-1 break-words text-xs opacity-80'>{description}</p>}
          </div>
        </div>
        {action}
      </div>
    </div>
  );
};

const MetricRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className='flex items-center justify-between gap-3'>
    <span className='text-sm text-slate-600'>{label}</span>
    <span className='max-w-56 truncate text-sm font-medium text-slate-900'>{value}</span>
  </div>
);

const LoadingRows = ({ rows = 3 }: { rows?: number }) => (
  <div className='space-y-3'>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className='flex items-center justify-between gap-4'>
        <div className='h-4 w-28 animate-pulse rounded bg-slate-100' />
        <div className='h-4 w-20 animate-pulse rounded bg-slate-100' />
      </div>
    ))}
  </div>
);

export const ResourceAdminPage = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const statsQuery = useGetAdminStats();
  const usageQuery = useGetUsage();
  const healthQuery = useGetStorageHealth();
  const policyQuery = useResourceRuntimePolicy();
  const jobsQuery = useListBatchJobs({ limit: 5 });
  const cleanupMutation = useBatchCleanup();
  const optimizeMutation = useOptimizeStorage();

  const [cleanupType, setCleanupType] = useState('expired');
  const [dryRun, setDryRun] = useState(true);
  const [maxItems, setMaxItems] = useState(100);
  const [lastCleanup, setLastCleanup] = useState<BatchCleanupResult | null>(null);
  const [lastOptimization, setLastOptimization] = useState<OptimizeResult | null>(null);

  const stats = statsQuery.data;
  const usage = usageQuery.data;
  const health = healthQuery.data;
  const policy = policyQuery.data;
  const jobs = jobsQuery.data?.jobs ?? [];

  const categoryEntries = useMemo<[string, number][]>(
    () =>
      Object.entries(stats?.by_category ?? {})
        .map(([category, size]): [string, number] => [category, Number(size) || 0])
        .filter(([, size]) => size > 0),
    [stats?.by_category]
  );
  const storageEntries = useMemo<[string, number][]>(
    () =>
      Object.entries(stats?.by_storage ?? {})
        .map(([storage, size]): [string, number] => [storage, Number(size) || 0])
        .filter(([, size]) => size > 0),
    [stats?.by_storage]
  );

  const reloadOverview = () => {
    void statsQuery.refetch();
    void healthQuery.refetch();
    void policyQuery.refetch();
  };

  const handleCleanup = () => {
    cleanupMutation.mutate(
      {
        type: cleanupType,
        dry_run: dryRun,
        max_items: Math.max(1, maxItems || 100)
      },
      {
        onSuccess: result => {
          setLastCleanup(result);
          toast.success(t('messages.success'), {
            description: dryRun
              ? t(
                  'resource.admin.cleanup_dry_run_done',
                  '{{count}} candidates found, {{size}} potential space',
                  {
                    count: result.items_found,
                    size: formatBytes(result.potential_space_freed || 0)
                  }
                )
              : t('resource.admin.cleanup_done', '{{count}} items cleaned, {{size}} freed', {
                  count: result.items_cleaned,
                  size: formatBytes(result.space_freed || 0)
                })
          });
        },
        onError: (error: any) => {
          toast.error(t('messages.error'), {
            description: error?.message || t('messages.unknown_error')
          });
        }
      }
    );
  };

  const handleOptimize = () => {
    optimizeMutation.mutate(undefined, {
      onSuccess: result => {
        setLastOptimization(result);
        toast.success(t('messages.success'), {
          description:
            result.mode === 'analysis'
              ? t(
                  'resource.admin.optimize_analysis_done',
                  '{{count}} duplicate candidates, {{size}} potential space',
                  {
                    count: result.potential_duplicate_files || 0,
                    size: formatBytes(result.potential_space_freed || 0)
                  }
                )
              : t('resource.admin.optimize_done', '{{count}} files deduplicated', {
                  count: result.deduplicated_files
                })
        });
      },
      onError: (error: any) => {
        toast.error(t('messages.error'), {
          description: error?.message || t('messages.unknown_error')
        });
      }
    });
  };

  const hasOverviewError = statsQuery.isError || healthQuery.isError || policyQuery.isError;
  const healthStatus = health?.status || stats?.storage_health || 'unknown';
  const healthColor =
    healthStatus === 'healthy'
      ? 'bg-green-500'
      : healthStatus === 'critical'
        ? 'bg-red-500'
        : 'bg-orange-500';

  return (
    <Page
      sidebar
      title={t('resource.admin.title', 'Storage Admin')}
      topbar={<Topbar title={t('resource.admin.title', 'Storage Admin')} />}
    >
      <div className='p-6 space-y-6'>
        {hasOverviewError && (
          <Notice
            icon='IconAlertTriangle'
            tone='error'
            title={t('resource.admin.overview_error', 'Storage overview failed to load')}
            description={
              getErrorMessage(statsQuery.error) ||
              getErrorMessage(healthQuery.error) ||
              getErrorMessage(policyQuery.error)
            }
            action={
              <Button variant='outline-primary' onClick={reloadOverview}>
                {t('actions.retry', 'Retry')}
              </Button>
            }
          />
        )}

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            icon='IconDatabase'
            label={t('resource.admin.total_size', 'Total Storage')}
            value={formatBytes(stats?.total_size || 0)}
            color='bg-blue-500'
            loading={statsQuery.isLoading}
          />
          <StatCard
            icon='IconFiles'
            label={t('resource.admin.total_files', 'Total Files')}
            value={String(stats?.total_files || 0)}
            color='bg-green-500'
            loading={statsQuery.isLoading}
          />
          <StatCard
            icon='IconUsers'
            label={t('resource.admin.total_users', 'Users')}
            value={String(stats?.total_users || 0)}
            color='bg-violet-500'
            loading={statsQuery.isLoading}
          />
          <StatCard
            icon='IconHeartbeat'
            label={t('resource.admin.health', 'Health')}
            value={healthStatus}
            color={healthColor}
            loading={healthQuery.isLoading}
          />
        </div>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
          <Panel title={t('resource.admin.runtime_policy', 'Runtime Policy')} icon='IconSettings'>
            {policyQuery.isLoading ? (
              <LoadingRows />
            ) : policyQuery.isError ? (
              <Notice
                icon='IconAlertCircle'
                tone='error'
                title={t('resource.admin.policy_error', 'Runtime policy unavailable')}
                description={getErrorMessage(policyQuery.error)}
                action={
                  <Button variant='outline-primary' onClick={() => void policyQuery.refetch()}>
                    {t('actions.retry', 'Retry')}
                  </Button>
                }
              />
            ) : (
              <div className='space-y-3'>
                <MetricRow
                  label={t('resource.policy.max_upload', 'Upload limit')}
                  value={formatBytes(policy?.upload.max_upload_size || 0)}
                />
                <MetricRow
                  label={t('resource.policy.allowed_types', 'Allowed types')}
                  value={summarizeAllowedResourceTypes(policy?.upload.allowed_types)}
                />
                <MetricRow
                  label={t('resource.policy.public_links', 'Public links')}
                  value={
                    policy?.storage.allow_public_links === false
                      ? t('common.disabled', 'Disabled')
                      : t('common.enabled', 'Enabled')
                  }
                />
                <MetricRow
                  label={t('resource.policy.quota_enforcement', 'Quota enforcement')}
                  value={
                    policy?.quota.enable_enforcement === false
                      ? t('common.disabled', 'Disabled')
                      : t('common.enabled', 'Enabled')
                  }
                />
                {!!policy?.errors?.length && (
                  <Notice
                    icon='IconAlertCircle'
                    tone='warning'
                    title={t('resource.admin.policy_warnings', 'Runtime policy has warnings')}
                    description={policy.errors.join('; ')}
                  />
                )}
              </div>
            )}
          </Panel>

          <Panel title={t('resource.admin.cleanup', 'Batch Cleanup')} icon='IconTrash'>
            <div className='space-y-4'>
              <Select value={cleanupType} onValueChange={setCleanupType}>
                <SelectTrigger className='w-full bg-white border-slate-200'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-white border-slate-200'>
                  <SelectItem value='expired'>
                    {t('resource.admin.cleanup_expired', 'Expired files')}
                  </SelectItem>
                  <SelectItem value='orphaned'>
                    {t('resource.admin.cleanup_orphaned', 'Orphaned files')}
                  </SelectItem>
                  <SelectItem value='duplicates'>
                    {t('resource.admin.cleanup_duplicates', 'Duplicate files')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className='grid grid-cols-2 gap-3'>
                <label className='space-y-1'>
                  <span className='text-xs font-medium text-slate-500'>
                    {t('resource.admin.max_items', 'Max items')}
                  </span>
                  <input
                    type='number'
                    min={1}
                    max={10000}
                    value={maxItems}
                    onChange={e => setMaxItems(Number(e.target.value) || 100)}
                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  />
                </label>
                <div className='flex items-end justify-between rounded-lg border border-slate-200 px-3 py-2'>
                  <span className='text-sm text-slate-600'>
                    {t('resource.admin.dry_run', 'Dry run')}
                  </span>
                  <Switch checked={dryRun} onCheckedChange={setDryRun} />
                </div>
              </div>
              <Button
                onClick={handleCleanup}
                isLoading={cleanupMutation.isPending}
                startIcon={<Icons name='IconPlayerPlay' />}
              >
                {dryRun
                  ? t('resource.admin.preview_cleanup', 'Preview cleanup')
                  : t('resource.admin.run_cleanup', 'Run cleanup')}
              </Button>
              {lastCleanup && (
                <div className='rounded-lg border border-slate-100 bg-slate-50 p-4'>
                  <div className='grid grid-cols-2 gap-3'>
                    <MetricRow
                      label={t('resource.admin.items_found', 'Found')}
                      value={lastCleanup.items_found}
                    />
                    <MetricRow
                      label={t('resource.admin.items_cleaned', 'Cleaned')}
                      value={lastCleanup.items_cleaned}
                    />
                    <MetricRow
                      label={t('resource.admin.potential_space', 'Potential')}
                      value={formatBytes(lastCleanup.potential_space_freed || 0)}
                    />
                    <MetricRow
                      label={t('resource.admin.space_freed', 'Freed')}
                      value={formatBytes(lastCleanup.space_freed || 0)}
                    />
                  </div>
                  {!!lastCleanup.errors?.length && (
                    <div className='mt-3'>
                      <Notice
                        icon='IconAlertTriangle'
                        tone='warning'
                        title={t('resource.admin.cleanup_partial', 'Cleanup completed with errors')}
                        description={lastCleanup.errors.slice(0, 3).join('; ')}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Panel>

          <Panel
            title={t('resource.admin.storage_operations', 'Storage Operations')}
            icon='IconTool'
          >
            <div className='space-y-4'>
              {healthQuery.isLoading ? (
                <LoadingRows />
              ) : (
                <div className='space-y-3'>
                  <MetricRow
                    label={t('resource.admin.used_space', 'Used space')}
                    value={formatBytes(health?.used_space || stats?.total_size || 0)}
                  />
                  <MetricRow
                    label={t('resource.admin.orphaned_files', 'Orphaned files')}
                    value={health?.orphaned_files || 0}
                  />
                  <MetricRow
                    label={t('resource.admin.corrupted_files', 'Corrupted files')}
                    value={health?.corrupted_files || 0}
                  />
                </div>
              )}
              <Button
                variant='outline-primary'
                onClick={handleOptimize}
                isLoading={optimizeMutation.isPending}
                startIcon={<Icons name='IconRefresh' />}
              >
                {t('resource.admin.analyze_storage', 'Analyze storage')}
              </Button>
              {lastOptimization && (
                <div className='rounded-lg border border-slate-100 bg-slate-50 p-4'>
                  <div className='space-y-3'>
                    <MetricRow
                      label={t('resource.admin.operation_mode', 'Mode')}
                      value={lastOptimization.mode || 'executed'}
                    />
                    <MetricRow
                      label={t('resource.admin.duplicate_candidates', 'Duplicate candidates')}
                      value={lastOptimization.potential_duplicate_files || 0}
                    />
                    <MetricRow
                      label={t('resource.admin.potential_space', 'Potential')}
                      value={formatBytes(lastOptimization.potential_space_freed || 0)}
                    />
                    <MetricRow
                      label={t('resource.admin.orphaned_files', 'Orphaned files')}
                      value={lastOptimization.orphaned_files || 0}
                    />
                  </div>
                </div>
              )}
              {!!health?.recommendations?.length && (
                <Notice
                  icon='IconInfoCircle'
                  tone='info'
                  title={t('resource.admin.health_recommendations', 'Health recommendations')}
                  description={health.recommendations.join('; ')}
                />
              )}
            </div>
          </Panel>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <Panel title={t('resource.admin.by_category', 'Usage by Category')} icon='IconCategory'>
            {statsQuery.isLoading ? (
              <LoadingRows />
            ) : categoryEntries.length ? (
              <div className='space-y-3'>
                {categoryEntries.map(([category, size]) => (
                  <MetricRow key={category} label={category} value={formatBytes(size)} />
                ))}
              </div>
            ) : (
              <div className='py-6 text-sm text-slate-400'>
                {t('resource.admin.no_category_usage', 'No category usage')}
              </div>
            )}
          </Panel>

          <Panel title={t('resource.admin.by_storage', 'Usage by Storage')} icon='IconCloud'>
            {statsQuery.isLoading ? (
              <LoadingRows />
            ) : storageEntries.length ? (
              <div className='space-y-3'>
                {storageEntries.map(([storage, size]) => (
                  <MetricRow key={storage} label={storage} value={formatBytes(size)} />
                ))}
              </div>
            ) : (
              <div className='py-6 text-sm text-slate-400'>
                {t('resource.admin.no_storage_usage', 'No storage usage')}
              </div>
            )}
          </Panel>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <Panel title={t('resource.admin.my_quota', 'My Quota')} icon='IconGauge'>
            {usageQuery.isLoading ? (
              <LoadingRows />
            ) : usageQuery.isError ? (
              <Notice
                icon='IconAlertCircle'
                tone='error'
                title={t('resource.admin.quota_error', 'Quota failed to load')}
                description={getErrorMessage(usageQuery.error)}
                action={
                  <Button variant='outline-primary' onClick={() => void usageQuery.refetch()}>
                    {t('actions.retry', 'Retry')}
                  </Button>
                }
              />
            ) : (
              <QuotaDisplay quota={usage} />
            )}
          </Panel>

          <Panel
            title={t('resource.admin.recent_jobs', 'Recent Batch Jobs')}
            icon='IconListDetails'
            action={
              <Button variant='outline-primary' onClick={() => void jobsQuery.refetch()}>
                <Icons name='IconRefresh' className='h-4 w-4' />
              </Button>
            }
          >
            {jobsQuery.isLoading ? (
              <LoadingRows />
            ) : jobsQuery.isError ? (
              <Notice
                icon='IconAlertCircle'
                tone='error'
                title={t('resource.admin.jobs_error', 'Batch jobs failed to load')}
                description={getErrorMessage(jobsQuery.error)}
              />
            ) : jobs.length ? (
              <div className='divide-y divide-slate-100'>
                {jobs.map(job => (
                  <div key={job.id} className='py-3'>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='min-w-0 truncate text-sm font-medium text-slate-700'>
                        {job.type}
                      </span>
                      <span className='shrink-0 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600'>
                        {job.status}
                      </span>
                    </div>
                    <div className='mt-2 grid grid-cols-3 gap-3 text-xs text-slate-500'>
                      <span>{job.progress}%</span>
                      <span>
                        {t('resource.admin.processed_count', '{{count}} processed', {
                          count: job.processed_count
                        })}
                      </span>
                      <span className='truncate text-right'>
                        {job.started_at
                          ? formatDateTime(new Date(job.started_at), 'dateTime')
                          : '-'}
                      </span>
                    </div>
                    {!!job.errors?.length && (
                      <p className='mt-2 truncate text-xs text-amber-600'>{job.errors[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-6 text-sm text-slate-400'>
                {t('resource.admin.no_jobs', 'No recent jobs')}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </Page>
  );
};
