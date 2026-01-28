import { useTranslation } from 'react-i18next';

import { ResourceQuota } from '../resource';

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

interface QuotaDisplayProps {
  quota: ResourceQuota | null | undefined;
}

export const QuotaDisplay = ({ quota }: QuotaDisplayProps) => {
  const { t } = useTranslation();

  if (!quota) return null;

  const percent = Math.min(quota.usage_percent, 100);
  const barColor = percent >= 90 ? 'bg-red-500' : percent >= 75 ? 'bg-orange-500' : 'bg-blue-500';

  return (
    <div className='bg-white border rounded-lg p-4'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm font-medium text-slate-700'>
          {t('resource.quota.storage', 'Storage')}
        </span>
        <span className='text-xs text-slate-500'>
          {formatBytes(quota.usage)} / {formatBytes(quota.quota)}
        </span>
      </div>
      <div className='w-full bg-slate-100 rounded-full h-2'>
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className='flex items-center justify-between mt-2'>
        <span className='text-xs text-slate-400'>
          {t('resource.quota.files', 'Files')}: {quota.file_count}
        </span>
        <span className='text-xs text-slate-400'>{percent.toFixed(1)}%</span>
      </div>
    </div>
  );
};
