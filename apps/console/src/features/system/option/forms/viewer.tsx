import { CodeHighlighter, FieldViewer } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';

import { useQueryOption } from '../service';

export const OptionViewerForms = ({ record }) => {
  const { data = {} } = useQueryOption(record);

  const renderValue = (value: string, type: string) => {
    if (['object', 'array'].includes(type)) {
      return <CodeHighlighter language='json'>{value}</CodeHighlighter>;
    }
    return <span className='font-mono text-sm'>{value}</span>;
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

  return (
    <div className='grid grid-cols-2 gap-4 mt-4'>
      <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
        <span className='bg-blue-500 w-1 mr-2 h-full inline-block' />
        Basic Information
      </div>
      <FieldViewer title='ID'>{data?.id}</FieldViewer>
      <FieldViewer title='Name'>{data?.name}</FieldViewer>
      <FieldViewer title='Type'>
        <span className='px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium'>
          {data?.type}
        </span>
      </FieldViewer>
      <FieldViewer title='Autoload'>{renderAutoload(data?.autoload)}</FieldViewer>
      <FieldViewer title='Value' className='col-span-full'>
        {renderValue(data?.value, data?.type)}
      </FieldViewer>
      <FieldViewer title='Created At'>{formatDateTime(data?.created_at)}</FieldViewer>
      <FieldViewer title='Updated At'>{formatDateTime(data?.updated_at)}</FieldViewer>
    </div>
  );
};
