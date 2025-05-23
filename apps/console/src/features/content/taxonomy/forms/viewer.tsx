import { FieldViewer, Icons, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';

import { useQueryTaxonomy } from '../service';

import { useQueryUser } from '@/features/system/user/service';

export const TaxonomyViewerForms = ({ record }) => {
  const { data = {} } = useQueryTaxonomy(record);
  const { data: parentData } = useQueryTaxonomy(data?.parent);
  const { data: creatorData } = useQueryUser(data?.created_by);
  const { data: updaterData } = useQueryUser(data?.updated_by);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Icons name='IconLoader2' className='animate-spin' size={32} />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-8 mt-4'>
      {/* Basic Information */}
      <div className='bg-white rounded-lg shadow-xs p-6'>
        <div className='flex items-center mb-6'>
          <div
            className='w-8 h-8 rounded-md mr-3 flex items-center justify-center'
            style={{ backgroundColor: data.color || '#3B82F6' }}
          >
            <Icons name={data.icon || 'IconFolder'} size={20} color='#fff' />
          </div>
          <h1 className='text-2xl font-bold text-gray-800'>{data.name}</h1>
          <Badge variant={data.status === 0 ? 'success' : 'danger'} className='ml-3 px-2 py-1'>
            {data.status === 0 ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FieldViewer title='ID'>{data.id}</FieldViewer>
          <FieldViewer title='Slug'>{data.slug}</FieldViewer>
          <FieldViewer title='Type'>{data.type}</FieldViewer>
          <FieldViewer title='Parent'>
            {parentData?.name || data.parent || 'None (Root Level)'}
          </FieldViewer>
        </div>
      </div>

      {/* Appearance */}
      <div className='bg-white rounded-lg shadow-xs p-6'>
        <h2 className='text-lg font-semibold mb-4 flex items-center'>
          <Icons name='IconPalette' className='mr-2' />
          Appearance
        </h2>

        <div className='grid grid-cols-2 gap-4 mb-4'>
          <FieldViewer title='Color'>
            <div className='flex items-center'>
              <div
                className='w-5 h-5 rounded-xs mr-2'
                style={{ backgroundColor: data.color || '#3B82F6' }}
              ></div>
              {data.color || '-'}
            </div>
          </FieldViewer>
          <FieldViewer title='Icon'>
            <div className='flex items-center'>
              <Icons name={data.icon || 'IconFolder'} size={16} className='mr-2' />
              {data.icon || '-'}
            </div>
          </FieldViewer>
          <FieldViewer title='URL'>{data.url || '-'}</FieldViewer>
        </div>

        {/* Media Preview */}
        <div className='grid grid-cols-2 gap-4'>
          {data.cover && (
            <div>
              <h3 className='font-medium mb-2'>Cover Image</h3>
              <img
                src={data.cover}
                alt={`Cover for ${data.name}`}
                className='max-h-40 rounded-md shadow-xs'
              />
            </div>
          )}

          {data.thumbnail && (
            <div>
              <h3 className='font-medium mb-2'>Thumbnail</h3>
              <img
                src={data.thumbnail}
                alt={`Thumbnail for ${data.name}`}
                className='max-h-40 rounded-md shadow-xs'
              />
            </div>
          )}
        </div>
      </div>

      {/* SEO & Metadata */}
      <div className='bg-white rounded-lg shadow-xs p-6'>
        <h2 className='text-lg font-semibold mb-4 flex items-center'>
          <Icons name='IconSearch' className='mr-2' />
          SEO & Metadata
        </h2>

        <div className='grid grid-cols-1 gap-4'>
          <FieldViewer title='Keywords'>{data.keywords || '-'}</FieldViewer>
          <FieldViewer title='Description' className='col-span-full'>
            {data.description || '-'}
          </FieldViewer>
        </div>
      </div>

      {/* System Information */}
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

      {/* Extra Properties */}
      {data.extras && Object.keys(data.extras).length > 0 && (
        <div className='bg-white rounded-lg shadow-xs p-6'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <Icons name='IconSettings' className='mr-2' />
            Extra Properties
          </h2>

          <div className='border rounded-md p-4 bg-gray-50'>
            <pre className='overflow-auto whitespace-pre-wrap'>
              {JSON.stringify(data.extras, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
