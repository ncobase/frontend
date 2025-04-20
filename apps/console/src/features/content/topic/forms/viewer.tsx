import { FieldViewer, Icons, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import ReactMarkdown from 'react-markdown';

import { useQueryTaxonomy } from '../../taxonomy/service';
import { useQueryTopic } from '../service';

import { useQueryUser } from '@/features/system/user/service';

export const TopicViewerForms = ({ record }) => {
  const { data = {} } = useQueryTopic(record);
  const { data: taxonomyData } = useQueryTaxonomy(data?.taxonomy);
  const { data: creatorData } = useQueryUser(data?.created_by);
  const { data: updaterData } = useQueryUser(data?.updated_by);

  // Status badge styling
  const getStatusBadge = status => {
    switch (status) {
      case 0:
        return (
          <Badge variant='warning' className='px-2 py-1'>
            Draft
          </Badge>
        );
      case 1:
        return (
          <Badge variant='success' className='px-2 py-1'>
            Published
          </Badge>
        );
      case 2:
        return (
          <Badge variant='danger' className='px-2 py-1'>
            Archived
          </Badge>
        );
      default:
        return (
          <Badge variant='secondary' className='px-2 py-1'>
            Unknown
          </Badge>
        );
    }
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Icons name='IconLoader2' className='animate-spin' size={32} />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-8 mt-4'>
      {/* Title and Basic Info */}
      <div className='bg-white rounded-lg shadow-xs p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>{data.title}</h1>

        <div className='flex flex-wrap gap-2 mb-4'>
          {getStatusBadge(data.status)}

          {data.private && (
            <Badge variant='secondary' className='px-2 py-1'>
              Private
            </Badge>
          )}

          {data.markdown && (
            <Badge variant='primary' className='px-2 py-1'>
              Markdown
            </Badge>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FieldViewer title='ID'>{data.id}</FieldViewer>
          <FieldViewer title='Slug'>{data.slug}</FieldViewer>
          <FieldViewer title='Name'>{data.name}</FieldViewer>
          <FieldViewer title='Taxonomy'>{taxonomyData?.name || data.taxonomy || '-'}</FieldViewer>
          <FieldViewer title='Release Date'>{formatDateTime(data.released)}</FieldViewer>
        </div>
      </div>

      {/* Content */}
      <div className='bg-white rounded-lg shadow-xs p-6'>
        <h2 className='text-lg font-semibold mb-4 flex items-center'>
          <Icons name='IconFileText' className='mr-2' />
          Content
        </h2>

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

      {/* Meta Information */}
      <div className='bg-white rounded-lg shadow-xs p-6'>
        <h2 className='text-lg font-semibold mb-4 flex items-center'>
          <Icons name='IconInfoCircle' className='mr-2' />
          System Information
        </h2>

        <div className='grid grid-cols-2 gap-4'>
          <FieldViewer title='Created By'>
            {creatorData?.username || data.created_by || '-'}
          </FieldViewer>
          <FieldViewer title='Created At'>{formatDateTime(data.created_at)}</FieldViewer>
          <FieldViewer title='Updated By'>
            {updaterData?.username || data.updated_by || '-'}
          </FieldViewer>
          <FieldViewer title='Updated At'>{formatDateTime(data.updated_at)}</FieldViewer>
          <FieldViewer title='Tenant ID'>{data.tenant}</FieldViewer>
        </div>
      </div>

      {/* Thumbnail Preview */}
      {data.thumbnail && (
        <div className='bg-white rounded-lg shadow-xs p-6'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <Icons name='IconPhoto' className='mr-2' />
            Thumbnail
          </h2>

          <div className='flex justify-center'>
            <img src={data.thumbnail} alt={data.title} className='max-h-64 rounded-md shadow-xs' />
          </div>
        </div>
      )}
    </div>
  );
};
