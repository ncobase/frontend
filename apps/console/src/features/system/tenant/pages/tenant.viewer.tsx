import React from 'react';

import { FieldViewer } from '@ncobase/react';
import { Tenant } from '@ncobase/types';
import { formatDateTime } from '@ncobase/utils';

import { useQueryTenant } from '../service';

import { parseStatus } from '@/helpers/status';

export const TenantViewerPage = ({ record }: { record: Tenant }) => {
  const { data = {} } = useQueryTenant(record.id);

  return (
    <div className='grid grid-cols-2 gap-4 mt-4'>
      <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
        <span className='bg-orange-500 w-1 mr-2 h-full inline-block' />
        基本信息
      </div>
      <FieldViewer title='编号'>{data?.id}</FieldViewer>
      <FieldViewer title='名称'>{data?.name}</FieldViewer>
      <FieldViewer title='类型'>{data?.type}</FieldViewer>
      <FieldViewer title='标识'>{data?.slug}</FieldViewer>
      <FieldViewer title='URL'>{data?.url}</FieldViewer>
      <FieldViewer title='Logo'>{data?.logo}</FieldViewer>
      <FieldViewer title='Logo alt'>{data?.logo_alt}</FieldViewer>
      <FieldViewer title='标题'>{data?.title}</FieldViewer>
      <FieldViewer title='描述' className='col-span-full'>
        {data?.description}
      </FieldViewer>
      <FieldViewer title='关键字' className='col-span-full'>
        {data?.keywords}
      </FieldViewer>
      <FieldViewer title='版权' className='col-span-full'>
        {data?.copyright}
      </FieldViewer>
      <FieldViewer title='是否禁用'>{parseStatus(!data.disabled)}</FieldViewer>
      <FieldViewer title='到期时间'>{formatDateTime(data.expired_at)}</FieldViewer>
      <FieldViewer title='创建时间'>{formatDateTime(data.created_at)}</FieldViewer>
      <FieldViewer title='更新时间'>{formatDateTime(data.updated_at)}</FieldViewer>
      {/* {data?.extra && (
       <>
       <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
       <span className='bg-orange-500 w-1 mr-2 h-full inline-block' />
       扩展信息
       </div>
       <FieldViewer title='扩展信息' className='col-span-full'>
       {JSON.stringify(profile.extra)}
       </FieldViewer>
       </>
       )} */}
    </div>
  );
};
