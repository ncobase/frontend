import { FieldViewer, Icons, Badge, Section } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import { useQueryTopic } from '../service';

import { getStatusBadge } from './form';

import { useQueryUser } from '@/features/system/user/service';

export const TopicViewerForm = ({ record }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryTopic(record);
  const { data: creatorData } = useQueryUser(data?.created_by);
  const { data: updaterData } = useQueryUser(data?.updated_by);

  if (isLoading || !data || Object.keys(data).length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Icons name='IconLoader2' className='animate-spin' size={32} />
      </div>
    );
  }

  // Get status badge
  const status = getStatusBadge(data.status, t);

  return (
    <div className='space-y-6 my-4'>
      {/* Basic Information Section */}
      <Section
        title={t('topic.section.basic_info', 'Basic Information')}
        icon='IconInfoCircle'
        className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
      >
        <div className='bg-white rounded-lg p-4'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>{data.title}</h1>

          <div className='flex flex-wrap gap-2 mb-4'>
            <Badge variant={status.variant as any} className='px-2 py-1'>
              {status.label}
            </Badge>

            {data.private && (
              <Badge variant='secondary' className='px-2 py-1'>
                {t('topic.labels.private', 'Private')}
              </Badge>
            )}

            {data.markdown && (
              <Badge variant='primary' className='px-2 py-1'>
                {t('topic.labels.markdown', 'Markdown')}
              </Badge>
            )}

            {data.temp && (
              <Badge variant='success' className='px-2 py-1'>
                {t('topic.labels.temporary', 'Temporary')}
              </Badge>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FieldViewer title={t('topic.fields.id', 'ID')}>{data.id}</FieldViewer>
            <FieldViewer title={t('topic.fields.name', 'Name')}>{data.name}</FieldViewer>
            <FieldViewer title={t('topic.fields.slug', 'Slug')}>{data.slug}</FieldViewer>
            <FieldViewer title={t('topic.fields.taxonomy', 'Taxonomy')}>
              {data.taxonomy?.name || data.taxonomy_id || '-'}
            </FieldViewer>
            <FieldViewer title={t('topic.fields.released', 'Release Date')}>
              {formatDateTime(data.released)}
            </FieldViewer>
          </div>
        </div>
      </Section>

      {/* Content Section */}
      <Section
        title={t('topic.section.content', 'Content')}
        icon='IconFileText'
        className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
      >
        <div className='bg-white rounded-lg p-4'>
          <div className='border rounded-md p-4 bg-gray-50'>
            {data.markdown ? (
              <div className='prose max-w-none'>
                <ReactMarkdown>{data.content || ''}</ReactMarkdown>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: data.content || '' }} />
            )}
          </div>
        </div>
      </Section>

      {/* Thumbnail Section (conditionally rendered) */}
      {data.thumbnail && (
        <Section
          title={t('topic.fields.thumbnail', 'Thumbnail')}
          icon='IconPhoto'
          className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
        >
          <div className='bg-white rounded-lg p-4'>
            <div className='flex justify-center'>
              <img
                src={data.thumbnail}
                alt={data.title}
                className='max-h-64 rounded-md shadow-xs object-contain'
              />
            </div>
          </div>
        </Section>
      )}

      {/* System Information Section */}
      <Section
        title={t('topic.section.system', 'System Information')}
        icon='IconDatabase'
        className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
      >
        <div className='bg-white rounded-lg p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FieldViewer title={t('topic.fields.created_by', 'Created By')}>
              {creatorData?.username || data.created_by || '-'}
            </FieldViewer>
            <FieldViewer title={t('topic.fields.created_at', 'Created At')}>
              {formatDateTime(data.created_at)}
            </FieldViewer>
            <FieldViewer title={t('topic.fields.updated_by', 'Updated By')}>
              {updaterData?.username || data.updated_by || '-'}
            </FieldViewer>
            <FieldViewer title={t('topic.fields.updated_at', 'Updated At')}>
              {formatDateTime(data.updated_at)}
            </FieldViewer>
            <FieldViewer title={t('topic.fields.space_id', 'Space ID')}>
              {data.space_id}
            </FieldViewer>
          </div>
        </div>
      </Section>
    </div>
  );
};
