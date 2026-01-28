import { Icons } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useGetVersions } from '../service';

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '-';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

interface VersionHistoryProps {
  fileId: string;
}

export const VersionHistory = ({ fileId }: VersionHistoryProps) => {
  const { t } = useTranslation();
  const { data: versions, isLoading } = useGetVersions(fileId);

  if (isLoading) {
    return <div className='text-sm text-slate-400 py-4'>{t('common.loading', 'Loading...')}</div>;
  }

  if (!versions || !Array.isArray(versions) || versions.length === 0) {
    return (
      <div className='text-sm text-slate-400 py-4'>
        {t('resource.versions.empty', 'No version history')}
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <h4 className='text-sm font-medium text-slate-700'>
        {t('resource.versions.title', 'Version History')}
      </h4>
      <div className='divide-y'>
        {versions.map((version: any, index: number) => (
          <div key={version.id} className='flex items-center gap-3 py-2'>
            <div className='flex-shrink-0'>
              <Icons
                name={index === 0 ? 'IconCircleCheck' : 'IconCircle'}
                className={`w-4 h-4 ${index === 0 ? 'text-green-500' : 'text-slate-300'}`}
              />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm text-slate-700'>
                {t('resource.versions.version', 'Version')} {version.version}
              </p>
              <p className='text-xs text-slate-400'>
                {formatFileSize(version.size)}
                {version.created_at &&
                  ` · ${formatDateTime(new Date(version.created_at), 'dateTime')}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
