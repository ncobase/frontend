import { FieldViewer } from '@ncobase/react';

import { useQueryOrg } from '../service';

import { parseStatus } from '@/lib/status';

export const OrgViewerForms = ({ record }) => {
  const { data = {} } = useQueryOrg(record);

  return (
    <div className='grid grid-cols-2 gap-4 mt-4'>
      <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
        <span className='bg-orange-500 w-1 mr-2 h-full inline-block' />
        基本信息
      </div>
      <FieldViewer title='编号'>{data?.id}</FieldViewer>
      <FieldViewer title='名称'>{data?.name}</FieldViewer>
      <FieldViewer title='父级'>{data?.parent_id}</FieldViewer>
      <FieldViewer title='是否禁用'>{parseStatus(!data.disabled)}</FieldViewer>
      <FieldViewer title='描述' className='col-span-full'>
        {data?.description}
      </FieldViewer>

      {data?.extras && (
        <>
          <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
            <span className='bg-orange-500 w-1 mr-2 h-full inline-block' />
            扩展信息
          </div>
          <FieldViewer title='扩展信息' className='col-span-full'>
            {JSON.stringify(data.extras)}
          </FieldViewer>
        </>
      )}
    </div>
  );
};
