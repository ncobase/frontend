import { Badge, Section } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { ResourceFile } from '../resource';

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

const FieldItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className='space-y-1'>
    <dt className='text-xs text-slate-500 font-medium'>{label}</dt>
    <dd className='text-sm text-slate-900'>{value || '-'}</dd>
  </div>
);

export const ResourceViewer = ({ record }: { record: ResourceFile }) => {
  const { t } = useTranslation();

  if (!record) return null;

  const accessVariant: Record<string, 'success' | 'warning' | 'secondary'> = {
    public: 'success',
    private: 'warning',
    shared: 'secondary'
  };

  return (
    <div className='space-y-6 p-4'>
      {record.category === 'image' && record.download_url && (
        <div className='rounded-lg overflow-hidden border bg-slate-50'>
          <img
            src={record.download_url}
            alt={record.name}
            className='max-h-64 w-full object-contain'
          />
        </div>
      )}

      <div className='flex items-center gap-3'>
        <span className='text-lg font-semibold text-slate-900'>
          {record.original_name || record.name}
        </span>
        <Badge variant={accessVariant[record.access_level] || 'secondary'} size='xs'>
          {t(`resource.access.${record.access_level}`, record.access_level)}
        </Badge>
        {record.is_public && (
          <Badge variant='success' size='xs'>
            {t('resource.access.public', 'Public')}
          </Badge>
        )}
        {record.is_expired && (
          <Badge variant='danger' size='xs'>
            {t('resource.status.expired', 'Expired')}
          </Badge>
        )}
      </div>

      <Section title={t('resource.sections.file_info', 'File Information')} icon='IconFile'>
        <div className='grid grid-cols-2 gap-4'>
          <FieldItem label={t('resource.fields.name', 'Name')} value={record.name} />
          <FieldItem
            label={t('resource.fields.original_name', 'Original Name')}
            value={record.original_name}
          />
          <FieldItem
            label={t('resource.fields.type', 'Type')}
            value={<span className='font-mono text-xs'>{record.type}</span>}
          />
          <FieldItem
            label={t('resource.fields.size', 'Size')}
            value={formatFileSize(record.size)}
          />
          <FieldItem
            label={t('resource.fields.category', 'Category')}
            value={t(`resource.category.${record.category}`, record.category)}
          />
          <FieldItem label={t('resource.fields.storage', 'Storage')} value={record.storage} />
        </div>
      </Section>

      <Section title={t('resource.sections.details', 'Details')} icon='IconInfoCircle'>
        <div className='grid grid-cols-2 gap-4'>
          <FieldItem
            label={t('resource.fields.path', 'Path')}
            value={<span className='font-mono text-xs break-all'>{record.path}</span>}
          />
          <FieldItem
            label={t('resource.fields.hash', 'Hash')}
            value={<span className='font-mono text-xs break-all'>{record.hash}</span>}
          />
          <FieldItem
            label={t('resource.fields.created_at', 'Created')}
            value={
              record.created_at ? formatDateTime(new Date(record.created_at), 'dateTime') : '-'
            }
          />
          <FieldItem
            label={t('resource.fields.tags', 'Tags')}
            value={
              record.tags?.length ? (
                <div className='flex flex-wrap gap-1'>
                  {record.tags.map((tag: string) => (
                    <Badge key={tag} variant='outline' size='xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                '-'
              )
            }
          />
        </div>
      </Section>
    </div>
  );
};
