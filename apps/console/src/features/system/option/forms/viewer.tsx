import { CodeHighlighter, FieldViewer } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';

import { Option } from '../option.d';
import { useQueryOption } from '../service';

export const OptionViewerForms = ({ record }) => {
  const { data = {} as Option, isLoading } = useQueryOption(record);

  const renderValue = (value: string, type: string) => {
    if (!value) return <span className='text-gray-400'>No value</span>;

    if (['object', 'array'].includes(type)) {
      try {
        const formatted = JSON.stringify(JSON.parse(value), null, 2);
        return <CodeHighlighter language='json'>{formatted}</CodeHighlighter>;
      } catch {
        return <span className='font-mono text-sm text-red-600'>Invalid JSON</span>;
      }
    }

    if (type === 'boolean') {
      const boolValue = ['true', '1', 'yes'].includes(value.toLowerCase());
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            boolValue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {boolValue ? 'True' : 'False'}
        </span>
      );
    }

    return <span className='font-mono text-sm break-all'>{value}</span>;
  };

  const renderAutoload = (autoload: boolean) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          autoload ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {autoload ? 'Yes' : 'No'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className='p-8 text-center'>
        <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent'></div>
        <p className='mt-2 text-gray-600'>Loading option data...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6 mt-4'>
      {/* Basic Information Section */}
      <div className='bg-white border border-slate-200/60 rounded-lg p-6'>
        <div className='flex items-center text-slate-800 font-medium border-b border-slate-100 pb-4 mb-6'>
          <span className='bg-blue-500 w-1 mr-3 h-6 inline-block rounded' />
          Basic Information
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FieldViewer title='ID' className='font-mono text-sm'>
            {data?.id}
          </FieldViewer>
          <FieldViewer title='Name' className='font-semibold'>
            {data?.name}
          </FieldViewer>
          <FieldViewer title='Type'>
            <span className='px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium uppercase'>
              {data?.type}
            </span>
          </FieldViewer>
          <FieldViewer title='Auto Load'>{renderAutoload(data?.autoload)}</FieldViewer>
        </div>
      </div>

      {/* Value Section */}
      <div className='bg-white border border-slate-200/60 rounded-lg p-6'>
        <div className='flex items-center text-slate-800 font-medium border-b border-slate-100 pb-4 mb-6'>
          <span className='bg-green-500 w-1 mr-3 h-6 inline-block rounded' />
          Value
        </div>
        <FieldViewer title='Current Value'>{renderValue(data?.value, data?.type)}</FieldViewer>
      </div>

      {/* Metadata Section */}
      <div className='bg-white border border-slate-200/60 rounded-lg p-6'>
        <div className='flex items-center text-slate-800 font-medium border-b border-slate-100 pb-4 mb-6'>
          <span className='bg-gray-500 w-1 mr-3 h-6 inline-block rounded' />
          Metadata
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FieldViewer title='Created At'>{formatDateTime(data?.created_at)}</FieldViewer>
          <FieldViewer title='Updated At'>{formatDateTime(data?.updated_at)}</FieldViewer>
        </div>
      </div>
    </div>
  );
};
