import { Icons } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';

import { Topic } from '../topic';

interface TableRowExpandProps {
  item: Topic;
}

export const TableRowExpandComponent: React.FC<TableRowExpandProps> = ({ item }) => {
  return (
    <div className='bg-gradient-to-r from-blue-50/20 to-indigo-50/50 p-6 rounded-b-lg border border-slate-200/60 transition-all duration-300'>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconHash' size={14} className='text-blue-500' />
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Topic ID
            </span>
          </div>
          <div className='font-mono text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors'>
            {item.id || 'N/A'}
          </div>
        </div>
        <div className='group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconSignature' size={14} className='text-green-500' />
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Name</span>
          </div>
          <div className='font-medium text-gray-800 group-hover:text-green-600 transition-colors truncate'>
            {item.name || 'Untitled'}
          </div>
        </div>
        <div className='group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconLink' size={14} className='text-purple-500' />
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Slug</span>
          </div>
          <div className='font-mono text-sm font-medium text-gray-800 group-hover:text-purple-600 transition-colors truncate'>
            {item.slug || 'no-slug'}
          </div>
        </div>

        <div className='group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconCategory' size={14} className='text-orange-500' />
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Taxonomy
            </span>
          </div>
          <div className='font-medium text-gray-800 group-hover:text-orange-600 transition-colors truncate'>
            {item.taxonomy || 'Uncategorized'}
          </div>
        </div>

        <div className='group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconCalendarEvent' size={14} className='text-red-500' />
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Released
            </span>
          </div>
          <div className='font-medium text-gray-800 group-hover:text-red-600 transition-colors'>
            {item.released ? formatDateTime(item.released).split(' ')[0] : 'Not set'}
          </div>
        </div>

        <div className='group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconBuilding' size={14} className='text-indigo-500' />
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Tenant
            </span>
          </div>
          <div className='font-mono text-xs font-medium text-gray-800 group-hover:text-indigo-600 transition-colors'>
            {item.tenant || 'Default'}
          </div>
        </div>

        <div className='group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconUser' size={14} className='text-cyan-500' />
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Creator
            </span>
          </div>
          <div className='font-medium text-gray-800 group-hover:text-cyan-600 transition-colors'>
            {item.created_by || 'Unknown'}
          </div>
        </div>

        <div className='group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconClock' size={14} className='text-pink-500' />
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Created
            </span>
          </div>
          <div className='font-medium text-gray-800 group-hover:text-pink-600 transition-colors'>
            {item.created_at ? formatDateTime(item.created_at).split(' ')[0] : 'Unknown'}
          </div>
        </div>
      </div>
      {item.content && (
        <div className='pt-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Icons name='IconFileText' size={16} className='text-blue-600' />
            <span className='font-medium text-gray-700'>Content Preview</span>
          </div>
          <div className='bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-200 transition-colors'>
            <div className='text-sm text-gray-600 leading-relaxed line-clamp-2'>
              {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}
              {item.content.length > 150 && (
                <span className='text-blue-500 font-medium ml-1 cursor-pointer hover:text-blue-600'>
                  ...read more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {item.thumbnail && (
        <div className='mt-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconPhoto' size={14} className='text-amber-500' />
            <span className='text-sm font-medium text-gray-700'>Thumbnail</span>
          </div>
          <div className='inline-block'>
            <img
              src={item.thumbnail}
              alt={item.title}
              className='h-16 w-24 object-cover rounded-lg border-2 border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer'
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
