import React from 'react';

import { Button, FieldViewer } from '@ncobase/react';
import { User } from '@ncobase/types';
import { joinName, randomId } from '@ncobase/utils';

import { useQueryUser } from '../service';

export const UserViewerPage = ({ record }: { record: User }) => {
  const { data } = useQueryUser(record.id);

  const { user, profile } = data || {};

  return (
    <div className='grid grid-cols-2 gap-4 mt-4'>
      <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
        <span className='bg-orange-500 w-1 mr-2 h-full inline-block' />
        基本信息
      </div>
      <FieldViewer title='显示名称'>{profile?.display_name || user?.username}</FieldViewer>
      <FieldViewer title='姓名'>{joinName(profile?.first_name, profile?.last_name)}</FieldViewer>
      <FieldViewer title='简介' className='col-span-full'>
        {profile?.short_bio}
      </FieldViewer>
      <FieldViewer title='用户名'>{user?.username}</FieldViewer>
      <FieldViewer title='邮箱'>{user?.email}</FieldViewer>
      <FieldViewer title='电话'>{user?.phone}</FieldViewer>
      <FieldViewer title='语言'>{profile?.language}</FieldViewer>
      <FieldViewer title='关于' className='col-span-full'>
        {profile?.about}
      </FieldViewer>
      {profile?.links.length > 0 && (
        <FieldViewer title='社交网络' className='col-span-full'>
          {profile?.links?.map(link => (
            <Button variant='link' key={link.name}>
              {link.name}
            </Button>
          ))}
        </FieldViewer>
      )}
      {profile?.thumbnail && (
        <FieldViewer title='头像'>
          <img src={profile?.thumbnail} alt={profile?.display_name || user?.username} />
        </FieldViewer>
      )}
      <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4'>
        <span className='bg-orange-500 w-1 mr-2 h-full inline-block' />
        职务相关
      </div>
      <FieldViewer title='角色'>
        {[
          { id: randomId(), name: '架构师' },
          { id: randomId(), name: '项目/开发经理' }
        ]
          .map(item => item.name)
          .join('、')}
      </FieldViewer>
      <FieldViewer title='权限'>
        {[
          { id: randomId(), name: '日常办公' },
          { id: randomId(), name: '销售合同' },
          { id: randomId(), name: '部门人事' }
        ]
          .map(item => item.name)
          .join('、')}
      </FieldViewer>
      {profile?.extra && (
        <>
          <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
            <span className='bg-orange-500 w-1 mr-2 h-full inline-block' />
            扩展信息
          </div>
          <FieldViewer title='扩展信息' className='col-span-full'>
            {JSON.stringify(profile?.extra)}
          </FieldViewer>
        </>
      )}
    </div>
  );
};
