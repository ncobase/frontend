import { useState } from 'react';

import {
  Button,
  Checkbox,
  Container,
  Icons,
  ScrollView,
  TableView,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Page } from '@/components/layout';
import { useListMenus } from '@/features/system/menu/service';
import { parseStatus } from '@/lib/status';

export const ViewerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams] = useState({ limit: 20 });
  const { data } = useListMenus(queryParams);
  const menus = data?.items || [];

  return (
    <Page layout={false}>
      <div className='h-16 shadow-xs bg-white sticky top-0 right-0 left-0'>
        <Container className='max-w-7xl'>
          <div className='flex items-center justify-center'>
            <div className='flex-1 flex items-center gap-x-4'>
              <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
                <Icons name='IconArrowLeft' />
              </Button>
              <div className='text-slate-600 font-medium'>查看表单</div>
            </div>
            <div className='flex gap-x-4'>
              <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
                {t('actions.cancel')}
              </Button>
              <Button size='sm'>{t('actions.submit')}</Button>
            </div>
          </div>
        </Container>
      </div>
      <ScrollView className='py-4'>
        <Container className='max-w-7xl'>
          <Tabs defaultValue='contracts'>
            <TabsList className='flex items-center justify-end gap-x-4'>
              <TabsTrigger
                value='contracts'
                className='data-[state=active]:border-primary-500 data-[state=active]:text-primary-500'
              >
                合同信息
              </TabsTrigger>
              <TabsTrigger
                value='material'
                className='data-[state=active]:border-red-500 data-[state=active]:text-red-500'
              >
                物料信息
              </TabsTrigger>
              <TabsTrigger
                value='customers'
                className='data-[state=active]:border-green-500 data-[state=active]:text-green-500'
              >
                客户信用
              </TabsTrigger>
            </TabsList>
            <TabsContent value='contracts' className='py-4'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Full name</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Email address</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>When is your event?</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>What type of event is it?</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <span className='text-slate-600 font-medium'>Full name</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Additional details</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <span className='text-slate-600 font-medium'>Full name</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Full name</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Additional details</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Full name</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Additional details</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Full name</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>Email address</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>When is your event?</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <span className='text-slate-600 font-medium'>What type of event is it?</span>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    Corporate event
                  </div>
                </div>
                <div className='col-span-full inline-flex items-center'>
                  <Checkbox defaultChecked disabled />
                  <label htmlFor='hs-default-checkbox' className='pl-2'>
                    Email me news and special offers
                  </label>
                </div>
              </div>
            </TabsContent>
            <TabsContent value='material' className='py-4'>
              <TableView
                className='mt-4'
                data={menus}
                pageSize={10}
                selected
                visibleControl
                header={[
                  {
                    title: 'ID',
                    accessorKey: 'id',
                    parser: value => (
                      <Button variant='link' size='sm' onClick={() => navigate(`viewer/${value}`)}>
                        {value}
                      </Button>
                    ),
                    icon: 'IconHash'
                  },
                  {
                    title: 'Name',
                    accessorKey: 'name',
                    icon: 'IconFlame'
                  },
                  {
                    title: 'Slug',
                    accessorKey: 'slug',
                    icon: 'IconAffiliate'
                  },
                  {
                    title: 'Path',
                    accessorKey: 'path',
                    icon: 'IconRoute'
                  },
                  {
                    title: 'Icon',
                    accessorKey: 'icon',
                    parser: value => <Icons name={value} size={16} />,
                    icon: 'IconCategory'
                  },
                  {
                    title: 'Status',
                    accessorKey: 'disabled',
                    parser: value => parseStatus(!value),
                    icon: 'IconFlagCog'
                  },
                  {
                    title: 'Created At',
                    accessorKey: 'created_at',
                    parser: value => formatDateTime(value),
                    icon: 'IconCalendarMonth'
                  }
                ]}
              />
            </TabsContent>
            <TabsContent value='customers' className='py-4'>
              Customer Content
            </TabsContent>
          </Tabs>
        </Container>
      </ScrollView>
    </Page>
  );
};
