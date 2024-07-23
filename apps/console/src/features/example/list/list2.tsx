import React, { useState } from 'react';

import {
  Button,
  DatePicker,
  Icons,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableView,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useListMenus } from '@/features/system/menu/service';
import { parseStatus } from '@/helpers/status';
import { Page, Topbar } from '@/layout';

const QueryBar = () => {
  const { t } = useTranslation();
  return (
    <div className='flex bg-white shadow-sm -mx-4 -mt-4 p-4'>
      <div className='flex-1 items-center justify-between grid grid-cols-12 gap-x-4'>
        <div className='col-span-11 grid grid-cols-4 gap-4'>
          <div className='inline-flex items-center'>
            <div className='flex text-slate-800'>编号：</div>
            <div className='flex-1 gap-x-4 pl-4'>
              <Input id='code' className='bg-slate-50 py-1.5 w-full' />
            </div>
          </div>
          <div className='inline-flex items-center'>
            <div className='flex text-slate-800'>名称：</div>
            <div className='flex-1 gap-x-4 pl-4'>
              <Input id='title' className='bg-slate-50 py-1.5 w-full' />
            </div>
          </div>
          <div className='inline-flex items-center'>
            <div className='flex text-slate-800'>状态：</div>
            <div className='flex-1 gap-x-4 pl-4'>
              <Select defaultValue='all'>
                <SelectTrigger className='py-1.5 bg-slate-50' id='status'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>全部</SelectItem>
                  <SelectItem value='normal'>正常</SelectItem>
                  <SelectItem value='disabled'>已禁用</SelectItem>
                  <SelectItem value='done'>已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='inline-flex items-center'>
            <div className='flex text-slate-800'>范围：</div>
            <div className='flex-1 flex gap-x-4 pl-4'>
              <DatePicker mode='range' className='py-1.5' />
            </div>
          </div>
        </div>
        <div className='col-span-1 flex flex-row items-center justify-start gap-x-4 flex-wrap'>
          <Button>{t('query.search')}</Button>
          <Button variant='outline-slate'>{t('query.reset')}</Button>
        </div>
      </div>
    </div>
  );
};

export const ListPage2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams] = useState({ limit: 20 });
  const { data } = useListMenus(queryParams);
  const records = data?.items || [];

  const topbarElement = {
    title: t('example.list2.title'),
    left: [
      <div className='rounded-md flex items-center justify-between gap-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              onClick={() => navigate('/example/ui/form/create')}
            >
              <Icons name='IconPlus' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Create</TooltipContent>
        </Tooltip>
      </div>
    ],
    right: [
      <div className='rounded-md flex items-center justify-between gap-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='unstyle' size='ratio'>
              <Icons name='IconFilter' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Filter</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='unstyle' size='ratio'>
              <Icons name='IconColumns' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Customized columns</TooltipContent>
        </Tooltip>
      </div>,
      <div className='bg-slate-100 p-1 rounded-md flex items-center justify-between gap-x-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              className='p-1 hover:bg-white'
              onClick={() => navigate('/example/card')}
            >
              <Icons name='IconLayoutBoard' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Card Layout</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              className='p-1 hover:bg-white'
              onClick={() => navigate('/example/list-2')}
            >
              <Icons name='IconTableColumn' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>List Layout</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              className='p-1 hover:bg-white'
              onClick={() => navigate('/example/list-1')}
            >
              <Icons name='IconTable' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Card Layout</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='unstyle' size='ratio' className='p-1 hover:bg-white'>
              <Icons name='IconArrowsMaximize' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Full Screen</TooltipContent>
        </Tooltip>
      </div>
    ]
  };

  const topbar = <Topbar {...topbarElement} />;

  return (
    <Page sidebar topbar={topbar}>
      <QueryBar />
      <div className='flex-1 mt-4 overflow-auto'>
        <TableView
          pageSize={8}
          data={records}
          selected
          visibleControl
          header={[
            {
              title: '编号',
              code: 'id',
              parser: (value: string) => (
                <Button
                  variant='link'
                  size='sm'
                  onClick={() => navigate(`/example/ui/form/viewer`)}
                >
                  {value}
                </Button>
              ),
              icon: 'IconHash'
            },
            {
              title: '名称',
              code: 'name',
              icon: 'IconFlame'
            },
            {
              title: '别名',
              code: 'slug',
              icon: 'IconProgress'
            },
            {
              title: '路径',
              code: 'path',
              icon: 'IconRoute'
            },
            {
              title: '图标',
              code: 'icon',
              parser: (value: string) => <Icons name={value} size={16} />,
              icon: 'IconCategory'
            },
            {
              title: '状态',
              code: 'disabled',
              parser: (value: string) => parseStatus(!value),
              icon: 'IconFlagCog'
            },
            {
              code: 'operation-column',
              actions: [
                {
                  title: 'Edit',
                  icon: 'IconPencil',
                  onClick: () => navigate(`/example/ui/form/editor`)
                },
                {
                  title: 'Duplicate',
                  icon: 'IconCopy',
                  onClick: () => console.log('duplicate events')
                },
                {
                  title: t('actions.shared'),
                  icon: 'IconShare2',
                  onClick: () => console.log('share events')
                },
                {
                  title: 'Disable',
                  icon: 'IconCircleMinus',
                  onClick: () => console.log('disable events')
                },
                {
                  title: t('actions.delete'),
                  icon: 'IconTrash',
                  onClick: () => console.log('delete events')
                }
              ]
            }
          ]}
        />
      </div>
      <div className='mt-4'>
        <TableView
          paginated={false}
          data={records}
          selected
          visibleControl
          header={[
            {
              title: '编号',
              code: 'id',
              parser: (value: string) => (
                <Button
                  variant='link'
                  size='sm'
                  onClick={() => navigate(`/example/ui/form/viewer`)}
                >
                  {value}
                </Button>
              ),
              icon: 'IconHash'
            },
            {
              title: '名称',
              code: 'name',
              icon: 'IconFlame'
            },
            {
              title: '别名',
              code: 'slug',
              icon: 'IconProgress'
            },
            {
              title: '路径',
              code: 'path',
              icon: 'IconRoute'
            },
            {
              title: '图标',
              code: 'icon',
              parser: (value: string) => <Icons name={value} size={16} />,
              icon: 'IconCategory'
            },
            {
              title: '状态',
              code: 'disabled',
              parser: (value: string) => parseStatus(!value),
              icon: 'IconFlagCog'
            },
            {
              code: 'created_at',
              title: '创建时间',
              parser: (value: string) => formatDateTime(value),
              icon: 'IconCalendarMonth'
            },
            {
              title: '更新时间',
              code: 'updated_at',
              parser: (value: string) => formatDateTime(value),
              icon: 'IconCalendarMonth'
            },
            {
              title: 'operation-column',
              actions: [
                {
                  title: 'Edit',
                  icon: 'IconPencil',
                  onClick: () => navigate(`/example/ui/form/editor`)
                },
                {
                  title: 'Duplicate',
                  icon: 'IconCopy',
                  onClick: () => console.log('duplicate events')
                },
                {
                  title: t('actions.shared'),
                  icon: 'IconShare2',
                  onClick: () => console.log('share events')
                },
                {
                  title: 'Disable',
                  icon: 'IconCircleMinus',
                  onClick: () => console.log('disable events')
                },
                {
                  title: t('actions.delete'),
                  icon: 'IconTrash',
                  onClick: () => console.log('delete events')
                }
              ]
            }
          ]}
        />
      </div>
    </Page>
  );
};
