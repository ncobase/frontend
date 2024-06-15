import React from 'react';

import { Button, Container, Icons, ScrollView } from '@ncobase/react';

import { AvatarButton } from '@/components/avatar/avatar_button';
import { useAccount } from '@/features/account/service';
import { Page } from '@/layout';

export const Profile = () => {
  const { user, profile, isLoading } = useAccount();

  return (
    <Page title='Profile' className='p-0'>
      <ScrollView className='py-4'>
        <Container className='max-w-7xl bg-white'>
          <div className='p-6 pb-0 mb-6 bg-white rounded-xl shadow-sm'>
            <div className='flex items-center justify-start gap-x-4'>
              <div className='relative'>
                <AvatarButton
                  isLoading={isLoading}
                  className=' rounded-md size-32'
                  src={profile?.thumbnail}
                  title={profile?.display_name || user?.username || ''}
                  alt={profile?.display_name || user?.username || ''}
                />
              </div>
              <div>
                <span className='font-bold text-slate-800'>
                  {profile?.first_name?.concat(' ').concat(profile?.last_name || '')}
                </span>
                <div className='flex items-center justify-start gap-x-4 py-1'>
                  <Button
                    variant='unstyle'
                    className='px-0 py-1.5 [&>svg]:hover:stroke-success-500'
                  >
                    <Icons name='IconShieldCheck' className='stroke-slate-400/65' />
                  </Button>
                  <Button
                    variant='unstyle'
                    className='px-0 py-1.5 [&>svg]:hover:stroke-success-400'
                  >
                    <Icons name='IconMapPin' className='stroke-slate-400/65' />
                    <span className=' text-slate-400 text-gradient-hover'>{user?.phone}</span>
                  </Button>
                  <Button variant='unstyle' className='px-0 py-1.5 [&>svg]:hover:stroke-orange-400'>
                    <Icons name='IconAt' className='stroke-slate-400/65' />
                    <span className=' text-slate-400 text-gradient-hover'>{user?.email}</span>
                  </Button>
                  <Button
                    variant='unstyle'
                    className='px-0 py-1.5 [&>svg]:hover:stroke-primary-400'
                  >
                    <Icons name='IconPhoneCall' className='stroke-slate-400/65' />
                    <span className=' text-slate-400 text-gradient-hover'>{user?.phone}</span>
                  </Button>
                </div>
                <div className='flex items-center gap-x-4 mt-4'>
                  <div className='flex flex-col border border-dashed border-slate-300 px-6 py-1 rounded-xl text-slate-400 text-center gap-y-0.5'>
                    <span className='font-medium'>123</span>
                    <div>项目</div>
                  </div>
                  <div className='flex flex-col border border-dashed border-slate-300 px-6 py-1 rounded-xl text-slate-400 text-center gap-y-0.5'>
                    <span className='font-medium'>920,233.00</span>
                    <div>销售额</div>
                  </div>
                  <div className='flex flex-col border border-dashed border-slate-300 px-6 py-1 rounded-xl text-slate-400 text-center gap-y-0.5'>
                    <span className='font-medium'>320,233.00</span>
                    <div>呆账</div>
                  </div>
                  <div className='flex flex-col border border-dashed border-slate-300 px-6 py-1 rounded-xl text-slate-400 text-center gap-y-0.5'>
                    <span className='font-medium'>89%</span>
                    <div>成功率</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-10'>
              <button className='focus:ring-0 py-2 px-3 bg-transparent border-0 border-b-2 border-b-primary-500 text-primary-500 mr-5 hover:text-primary-500 cursor-pointer'>
                基本信息
              </button>
              <button className='focus:ring-0 py-2 px-3 bg-transparent border-0 border-b-2 border-b-transparent text-slate-500 mr-5 hover:text-primary-500 cursor-pointer'>
                支付信息
              </button>
              <button className='focus:ring-0 py-2 px-3 bg-transparent border-0 border-b-2 border-b-transparent text-slate-500 mr-5 hover:text-primary-500 cursor-pointer'>
                地址信息
              </button>
              <button className='focus:ring-0 py-2 px-3 bg-transparent border-0 border-b-2 border-b-transparent text-slate-500 mr-5 hover:text-primary-500 cursor-pointer'>
                设置
              </button>
            </div>
          </div>
          <div className='p-6 mb-6 bg-white rounded-xl shadow-sm'>
            <div className='grid gap-y-2 grid-cols-6 pb-5'>
              <div className='col-span-full'>
                <span className='block font-medium leading-6 text-slate-800'>显示名称</span>
                <div className='border-b border-slate-100 pt-2 pb-3 text-slate-600'>
                  {profile?.display_name}
                </div>
              </div>
              <div className='col-span-full'>
                <span className='block font-medium leading-6 text-slate-800'>简介</span>
                <div className='border-b border-slate-100 pt-2 pb-3 text-slate-600'>
                  {profile?.short_bio}
                </div>
              </div>
              <div className='col-span-3'>
                <span className='block font-medium leading-6 text-slate-800'>名</span>
                <div className='border-b border-slate-100 pt-2 pb-3 text-slate-600'>
                  {profile?.first_name}
                </div>
              </div>
              <div className='col-span-3'>
                <span className='block font-medium leading-6 text-slate-800'>姓</span>
                <div className='border-b border-slate-100 pt-2 pb-3 text-slate-600'>
                  {profile?.last_name}
                </div>
              </div>
              <div className='col-span-full'>
                <span className='block font-medium leading-6 text-slate-800'>语言</span>
                <div className='border-b border-slate-100 pt-2 pb-3 text-slate-600'>
                  {profile?.language}
                </div>
              </div>
              <div className='col-span-full'>
                <span className='block font-medium leading-6 text-slate-800'>关于</span>
                <div className='border-b border-slate-100 pt-2 pb-3 text-slate-600'>
                  {profile?.about || '-'}
                </div>
              </div>
              <div className='col-span-full'>
                <span className='block font-medium leading-6 text-slate-800'>职称</span>
                <div className='border-b border-slate-100 pt-2 pb-3 text-slate-600'>
                  {profile?.about || '架构师、项目/开发经理'}
                </div>
              </div>
              <div className='col-span-full'>
                <span className='block font-medium leading-6 text-slate-800'>权限</span>
                <div className='border-b border-slate-100 pt-2 pb-3 text-slate-600'>
                  {profile?.about || '日常办公、销售合同、部门人事'}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </ScrollView>
    </Page>
  );
};
