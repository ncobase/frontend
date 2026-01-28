import { Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { QuotaDisplay } from '../components/quota_display';
import { useGetAdminStats, useGetQuota } from '../service';

import { Page, Topbar } from '@/components/layout';

const formatBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

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
      <div>
        <p className='text-sm text-slate-500'>{label}</p>
        <p className='text-xl font-semibold text-slate-900'>{value}</p>
      </div>
    </div>
  </div>
);

export const ResourceAdminPage = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetAdminStats();
  const { data: quota } = useGetQuota();

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
            value={stats?.storage_health || 'unknown'}
            color={stats?.storage_health === 'healthy' ? 'bg-green-500' : 'bg-orange-500'}
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {stats?.by_category && (
            <div className='bg-white rounded-lg border p-6'>
              <h3 className='text-sm font-medium text-slate-700 mb-4'>
                {t('resource.admin.by_category', 'Usage by Category')}
              </h3>
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
            </div>
          )}

          {stats?.by_storage && (
            <div className='bg-white rounded-lg border p-6'>
              <h3 className='text-sm font-medium text-slate-700 mb-4'>
                {t('resource.admin.by_storage', 'Usage by Storage')}
              </h3>
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
            </div>
          )}
        </div>

        <div className='max-w-md'>
          <h3 className='text-sm font-medium text-slate-700 mb-3'>
            {t('resource.admin.my_quota', 'My Quota')}
          </h3>
          <QuotaDisplay quota={quota} />
        </div>
      </div>
    </Page>
  );
};
