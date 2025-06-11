import React from 'react';

import { Icons, Badge, Card, FieldViewer, Section } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTaxonomy } from '../service';

import { useQueryUser } from '@/features/system/user/service';

export const TaxonomyViewerForm = ({ record }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryTaxonomy(record);
  const { data: parentData } = useQueryTaxonomy(data?.parent);
  const { data: creatorData } = useQueryUser(data?.created_by);
  const { data: updaterData } = useQueryUser(data?.updated_by);

  if (isLoading || !data || Object.keys(data).length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Icons name='IconLoader2' className='animate-spin' size={32} />
      </div>
    );
  }

  const getStatusBadge = (status: number) => {
    return status === 0 ? (
      <Badge variant='success' className='flex items-center gap-1'>
        <Icons name='IconCheck' size={12} />
        {t('common.enabled')}
      </Badge>
    ) : (
      <Badge variant='secondary' className='flex items-center gap-1'>
        <Icons name='IconX' size={12} />
        {t('common.disabled')}
      </Badge>
    );
  };

  return (
    <div className='space-y-6 max-w-4xl mx-auto p-6'>
      {/* Header */}
      <Card className='p-6'>
        <div className='flex items-start space-x-4 mb-6'>
          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'
            style={{ backgroundColor: data.color || '#3B82F6' }}
          >
            <Icons name={data.icon || 'IconFolder'} size={32} className='text-white' />
          </div>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>{data.name}</h1>
            <div className='flex flex-wrap gap-2 mb-4'>
              {getStatusBadge(data.status)}
              <Badge variant='primary' className='capitalize'>
                {data.type}
              </Badge>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <FieldViewer title={t('taxonomy.fields.id')} className='font-mono'>
                {data.id}
              </FieldViewer>
              <FieldViewer title={t('taxonomy.fields.slug')}>{data.slug || '-'}</FieldViewer>
              <FieldViewer title={t('taxonomy.fields.parent')}>
                {parentData?.name || data.parent || t('taxonomy.parent.none')}
              </FieldViewer>
            </div>
          </div>
        </div>
      </Card>

      {/* Description */}
      {data.description && (
        <Section
          title={t('taxonomy.fields.description')}
          icon='IconFileDescription'
          className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
        >
          <Card className='p-6'>
            <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{data.description}</p>
          </Card>
        </Section>
      )}

      {/* Appearance */}
      <Section
        title={t('taxonomy.section.appearance')}
        icon='IconPalette'
        className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
      >
        <Card className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <FieldViewer title={t('taxonomy.fields.color')}>
              <div className='flex items-center space-x-3'>
                <div
                  className='w-8 h-8 rounded-md border border-gray-300 shadow-sm'
                  style={{ backgroundColor: data.color || '#3B82F6' }}
                />
                <span className='font-mono text-sm'>{data.color || '#3B82F6'}</span>
              </div>
            </FieldViewer>
            <FieldViewer title={t('taxonomy.fields.icon')}>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center'>
                  <Icons name={data.icon || 'IconFolder'} size={16} />
                </div>
                <span className='font-mono text-sm'>{data.icon || 'IconFolder'}</span>
              </div>
            </FieldViewer>
          </div>

          {/* Media Preview */}
          {(data.cover || data.thumbnail) && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {data.cover && (
                <div>
                  <h4 className='font-medium mb-3'>{t('taxonomy.fields.cover')}</h4>
                  <img
                    src={data.cover}
                    alt={`Cover for ${data.name}`}
                    className='w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm'
                  />
                </div>
              )}
              {data.thumbnail && (
                <div>
                  <h4 className='font-medium mb-3'>{t('taxonomy.fields.thumbnail')}</h4>
                  <img
                    src={data.thumbnail}
                    alt={`Thumbnail for ${data.name}`}
                    className='w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm'
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      </Section>

      {/* SEO & Keywords */}
      {(data.keywords || data.url) && (
        <Section
          title={t('taxonomy.section.seo')}
          icon='IconSearch'
          className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
        >
          <Card className='p-6'>
            <div className='space-y-4'>
              {data.url && (
                <FieldViewer title={t('taxonomy.fields.url')}>
                  <a
                    href={data.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:text-blue-800 underline'
                  >
                    {data.url}
                    <Icons name='IconExternalLink' size={14} className='inline ml-1' />
                  </a>
                </FieldViewer>
              )}
              {data.keywords && (
                <FieldViewer title={t('taxonomy.fields.keywords')}>
                  <div className='flex flex-wrap gap-2'>
                    {data.keywords.split(',').map((keyword, index) => (
                      <Badge key={index} variant='secondary' className='text-xs'>
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                </FieldViewer>
              )}
            </div>
          </Card>
        </Section>
      )}

      {/* System Information */}
      <Section
        title={t('taxonomy.section.system')}
        icon='IconDatabase'
        className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
      >
        <Card className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <FieldViewer title={t('taxonomy.fields.created_by')}>
                {creatorData?.username || data.created_by || '-'}
              </FieldViewer>
              <FieldViewer title={t('taxonomy.fields.created_at')}>
                {formatDateTime(data.created_at)}
              </FieldViewer>
            </div>
            <div className='space-y-4'>
              <FieldViewer title={t('taxonomy.fields.updated_by')}>
                {updaterData?.username || data.updated_by || '-'}
              </FieldViewer>
              <FieldViewer title={t('taxonomy.fields.updated_at')}>
                {formatDateTime(data.updated_at)}
              </FieldViewer>
            </div>
          </div>
          <div className='mt-4'>
            <FieldViewer title={t('taxonomy.fields.space_id')}>{data.space_id}</FieldViewer>
          </div>
        </Card>
      </Section>

      {/* Extra Properties */}
      {data.extras && Object.keys(data.extras).length > 0 && (
        <Section
          title={t('taxonomy.section.extras')}
          icon='IconSettings'
          className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
        >
          <Card className='p-6'>
            <div className='bg-gray-50 rounded-lg p-4'>
              <pre className='text-sm text-gray-700 overflow-auto whitespace-pre-wrap'>
                {JSON.stringify(data.extras, null, 2)}
              </pre>
            </div>
          </Card>
        </Section>
      )}
    </div>
  );
};
