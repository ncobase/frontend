import { type ReactNode, useState } from 'react';

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

const StatCard = ({
  icon,
  label,
  value,
  color
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) => (
  <div className='bg-white rounded-lg border p-6'>
    <div className='flex items-center gap-3'>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icons name={icon} className='w-5 h-5 text-white' />
      </div>
      <div className='min-w-0'>
        <p className='text-sm text-slate-500'>{label}</p>
        <p className='truncate text-xl font-semibold text-slate-900'>{value}</p>
      </div>
    </div>
  </div>
);

const Panel = ({ title, icon, children }: { title: string; icon: string; children: ReactNode }) => (
  <div className='bg-white rounded-lg border p-6'>
    <div className='mb-4 flex items-center gap-2'>
      <Icons name={icon} className='h-5 w-5 text-slate-500' />
      <h3 className='text-sm font-medium text-slate-700'>{title}</h3>
    </div>
    {children}
  </div>
);

export const ResourceAdminPage = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const { data: stats } = useGetAdminStats();
  const { data: usage } = useGetUsage();
  const { data: health } = useGetStorageHealth();
  const { data: policy } = useResourceRuntimePolicy();
  const { data: jobs } = useListBatchJobs({ limit: 5 });
  const cleanupMutation = useBatchCleanup();
  const optimizeMutation = useOptimizeStorage();

  const [cleanupType, setCleanupType] = useState('expired');
  const [dryRun, setDryRun] = useState(true);
  const [maxItems, setMaxItems] = useState(100);

  const handleCleanup = () => {
    cleanupMutation.mutate(
      {
        type: cleanupType,
        dry_run: dryRun,
        max_items: Math.max(1, maxItems || 100)
      },
      {
        onSuccess: result => {
          toast.success(t('messages.success'), {
            description: dryRun
              ? t('resource.admin.cleanup_dry_run_done', '{{count}} items found', {
                  count: result.items_found
                })
              : t('resource.admin.cleanup_done', '{{count}} items cleaned', {
                  count: result.items_cleaned
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
        toast.success(t('messages.success'), {
          description: t('resource.admin.optimize_done', '{{count}} files deduplicated', {
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

  return (
    <Page
      sidebar
      title={t('resource.admin.title', 'Storage Admin')}
      topbar={<Topbar title={t('resource.admin.title', 'Storage Admin')} />}
    >
      <div className='p-6 space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            icon='IconDatabase'
            label={t('resource.admin.total_size', 'Total Storage')}
            value={formatBytes(stats?.total_size || 0)}
            color='bg-blue-500'
          />
          <StatCard
            icon='IconFiles'
            label={t('resource.admin.total_files', 'Total Files')}
            value={String(stats?.total_files || 0)}
            color='bg-green-500'
          />
          <StatCard
            icon='IconUsers'
            label={t('resource.admin.total_users', 'Users')}
            value={String(stats?.total_users || 0)}
            color='bg-purple-500'
          />
          <StatCard
            icon='IconHeartbeat'
            label={t('resource.admin.health', 'Health')}
            value={health?.status || stats?.storage_health || 'unknown'}
            color={health?.status === 'healthy' ? 'bg-green-500' : 'bg-orange-500'}
          />
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          <Panel title={t('resource.admin.runtime_policy', 'Runtime Policy')} icon='IconSettings'>
            <div className='space-y-3 text-sm text-slate-600'>
              <div className='flex justify-between gap-3'>
                <span>{t('resource.policy.max_upload', 'Upload limit')}</span>
                <span className='font-medium text-slate-900'>
                  {formatBytes(policy?.upload.max_upload_size || 0)}
                </span>
              </div>
              <div className='flex justify-between gap-3'>
                <span>{t('resource.policy.allowed_types', 'Allowed types')}</span>
                <span className='max-w-48 truncate font-medium text-slate-900'>
                  {summarizeAllowedResourceTypes(policy?.upload.allowed_types)}
                </span>
              </div>
              <div className='flex justify-between gap-3'>
                <span>{t('resource.policy.public_links', 'Public links')}</span>
                <span className='font-medium text-slate-900'>
                  {policy?.storage.allow_public_links === false
                    ? t('common.disabled', 'Disabled')
                    : t('common.enabled', 'Enabled')}
                </span>
              </div>
              <div className='flex justify-between gap-3'>
                <span>{t('resource.policy.quota_enforcement', 'Quota enforcement')}</span>
                <span className='font-medium text-slate-900'>
                  {policy?.quota.enable_enforcement === false
                    ? t('common.disabled', 'Disabled')
                    : t('common.enabled', 'Enabled')}
                </span>
              </div>
            </div>
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
            </div>
          </Panel>

          <Panel
            title={t('resource.admin.storage_operations', 'Storage Operations')}
            icon='IconTool'
          >
            <div className='space-y-4'>
              <div className='space-y-2 text-sm text-slate-600'>
                <div className='flex justify-between'>
                  <span>{t('resource.admin.used_space', 'Used space')}</span>
                  <span className='font-medium text-slate-900'>
                    {formatBytes(health?.used_space || stats?.total_size || 0)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>{t('resource.admin.orphaned_files', 'Orphaned files')}</span>
                  <span className='font-medium text-slate-900'>{health?.orphaned_files || 0}</span>
                </div>
                <div className='flex justify-between'>
                  <span>{t('resource.admin.corrupted_files', 'Corrupted files')}</span>
                  <span className='font-medium text-slate-900'>{health?.corrupted_files || 0}</span>
                </div>
              </div>
              <Button
                variant='outline-primary'
                onClick={handleOptimize}
                isLoading={optimizeMutation.isPending}
                startIcon={<Icons name='IconRefresh' />}
              >
                {t('resource.admin.optimize_storage', 'Optimize storage')}
              </Button>
            </div>
          </Panel>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {stats?.by_category && (
            <Panel title={t('resource.admin.by_category', 'Usage by Category')} icon='IconCategory'>
              <div className='space-y-3'>
                {Object.entries(stats.by_category).map(([category, size]) => (
                  <div key={category} className='flex items-center justify-between'>
                    <span className='text-sm text-slate-600 capitalize'>{category}</span>
                    <span className='text-sm font-medium text-slate-900'>
                      {formatBytes(size as number)}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {stats?.by_storage && (
            <Panel title={t('resource.admin.by_storage', 'Usage by Storage')} icon='IconCloud'>
              <div className='space-y-3'>
                {Object.entries(stats.by_storage).map(([storage, size]) => (
                  <div key={storage} className='flex items-center justify-between'>
                    <span className='text-sm text-slate-600 capitalize'>{storage}</span>
                    <span className='text-sm font-medium text-slate-900'>
                      {formatBytes(size as number)}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Panel title={t('resource.admin.my_quota', 'My Quota')} icon='IconGauge'>
            <QuotaDisplay quota={usage} />
          </Panel>

          <Panel
            title={t('resource.admin.recent_jobs', 'Recent Batch Jobs')}
            icon='IconListDetails'
          >
            {jobs?.jobs?.length ? (
              <div className='divide-y divide-slate-100'>
                {jobs.jobs.map(job => (
                  <div key={job.id} className='py-3'>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-sm font-medium text-slate-700'>{job.type}</span>
                      <span className='text-xs text-slate-500'>{job.status}</span>
                    </div>
                    <div className='mt-1 flex items-center justify-between text-xs text-slate-400'>
                      <span>{job.progress}%</span>
                      <span>
                        {job.started_at
                          ? formatDateTime(new Date(job.started_at), 'dateTime')
                          : '-'}
                      </span>
                    </div>
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
