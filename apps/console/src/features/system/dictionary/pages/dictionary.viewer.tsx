import React from 'react';

import { CodeHighlighter, FieldViewer } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';

import { useQueryDictionary } from '../service';

import { Dictionary } from '@/types';

export const DictionaryViewerPage = ({ record }: { record: Dictionary }) => {
  const { data = {} } = useQueryDictionary(record);

  return (
    <div className='grid grid-cols-2 gap-4 mt-4'>
      <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
        <span className='bg-orange-500 w-1 mr-2 h-full inline-block' />
        基本信息
      </div>
      <FieldViewer title='编号'>{data?.id}</FieldViewer>
      <FieldViewer title='名称'>{data?.name}</FieldViewer>
      <FieldViewer title='标识'>{data?.slug}</FieldViewer>
      <FieldViewer title='类型'>{data?.type}</FieldViewer>
      <FieldViewer title='值' className='col-span-full'>
        <CodeHighlighter>{data?.value}</CodeHighlighter>
      </FieldViewer>
      <FieldViewer title='描述' className='col-span-full'>
        {data?.description}
      </FieldViewer>
      <FieldViewer title='创建日期'>{formatDateTime(data.created_at)}</FieldViewer>
      <FieldViewer title='更新日期'>{formatDateTime(data.updated_at)}</FieldViewer>
    </div>
  );
};
