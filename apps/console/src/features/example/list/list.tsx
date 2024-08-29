import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  Icons,
  Label,
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
import { Page, Topbar, TopbarProps } from '@/layout';

const QueryBar = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className='bg-white shadow-sm flex-col grid rounded-md px-4 divide-y divide-slate-100 relative'>
      <div className='py-4 flex items-center justify-start'>
        <div className='flex items-center text-slate-800'>类别：</div>
        <div className='flex-1 flex gap-x-4 pl-4'>
          <Button variant='primary'>类别</Button>
          <Button variant='unstyle'>类别类别类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
          <Button variant='unstyle'>类别</Button>
        </div>
      </div>
      {isExpanded ? (
        <>
          <div className='py-4 flex items-center justify-start'>
            <div className='flex items-center text-slate-800'>指标：</div>
            <div className='flex-1 flex gap-x-4 pl-4'>
              <div className='inline-flex'>
                <Checkbox id='hs-default-checkbox1' />
                <Label htmlFor='hs-default-checkbox1' className='ms-2'>
                  指标
                </Label>
              </div>
              <div className='inline-flex'>
                <Checkbox id='hs-default-checkbox2' defaultChecked />
                <Label htmlFor='hs-default-checkbox2' className='ms-2'>
                  指标
                </Label>
              </div>
              <div className='inline-flex'>
                <Checkbox id='hs-default-checkbox3' defaultChecked />
                <Label htmlFor='hs-default-checkbox3' className='ms-2'>
                  指标
                </Label>
              </div>
              <div className='inline-flex'>
                <Checkbox id='hs-default-checkbox4' />
                <Label htmlFor='hs-default-checkbox4' className='ms-2'>
                  指标
                </Label>
              </div>
              <div className='inline-flex'>
                <Checkbox id='hs-default-checkbox5' defaultChecked />
                <Label htmlFor='hs-default-checkbox5' className='ms-2'>
                  指标
                </Label>
              </div>
            </div>
          </div>
          <div className='py-4 flex items-center justify-start'>
            <div className='inline-flex mr-6'>
              <div className='flex items-center text-slate-800'>周期：</div>
              <div className='flex-1 flex gap-x-4 pl-4'>
                <Select defaultValue='month'>
                  <SelectTrigger className='py-1 bg-slate-50'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='year'>年</SelectItem>
                    <SelectItem value='month'>月</SelectItem>
                    <SelectItem value='day'>日</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='inline-flex mr-6'>
              <div className='flex items-center text-slate-800'>日期：</div>
              <div className='flex-1 flex gap-x-4 pl-4'>
                <Select defaultValue='202305'>
                  <SelectTrigger className='py-1 bg-slate-50'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='202401'>2024 - 01</SelectItem>
                    <SelectItem value='202305'>2023 - 05</SelectItem>
                    <SelectItem value='202206'>2022 - 06</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='inline-flex mr-6'>
              <div className='flex items-center text-slate-800'>考核对象：</div>
              <div className='flex-1 flex gap-x-4 pl-4'>
                <Select defaultValue='purchase1'>
                  <SelectTrigger className='py-1 bg-slate-50'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='sale1'>销售一组</SelectItem>
                    <SelectItem value='sale2'>销售二组</SelectItem>
                    <SelectItem value='purchase1'>采购一组</SelectItem>
                    <SelectItem value='purchase2'>采购二组</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <Button
        variant='unstyle'
        size='ratio'
        className='absolute -bottom-2 left-1/2 -translate-x-1/2 z-[9999] bg-white hover:bg-slate-50 [&>svg]:stroke-slate-500 hover:[&>svg]:stroke-slate-600 shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] rounded-full p-0.5 border border-transparent'
        title={t(isExpanded ? 'query.collapse' : 'query.expand')}
        onClick={toggleExpand}
      >
        <Icons name={isExpanded ? 'IconChevronUp' : 'IconChevronDown'} size={12} />
      </Button>
    </div>
  );
};

export const ListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams] = useState({ limit: 20 });
  const { data } = useListMenus(queryParams);
  const records = data?.items || [];

  const topbarElement: TopbarProps = {
    title: t('example.list1.title'),
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
      <TableView
        className='mt-4'
        data={records}
        selected
        visibleControl
        header={[
          {
            title: 'ID',
            code: 'id',
            parser: value => (
              <Button variant='link' size='sm' onClick={() => navigate(`/example/ui/form/viewer`)}>
                {value}
              </Button>
            ),
            icon: 'IconHash'
          },
          {
            title: 'Name',
            code: 'name',
            icon: 'IconFlame'
          },
          {
            title: 'Slug',
            code: 'slug',
            icon: 'IconAffiliate'
          },
          {
            title: 'Path',
            code: 'path',
            icon: 'IconRoute'
          },
          {
            title: 'Icon',
            code: 'icon',
            parser: value => <Icons name={value} size={16} />,
            icon: 'IconCategory'
          },
          {
            title: 'Status',
            code: 'disabled',
            parser: value => parseStatus(!value),
            icon: 'IconFlagCog'
          },
          {
            title: 'Created At',
            code: 'created_at',
            parser: value => formatDateTime(value),
            icon: 'IconCalendarMonth'
          },
          {
            title: 'Updated At',
            code: 'updated_at',
            parser: value => formatDateTime(value),
            icon: 'IconCalendarMonth'
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
    </Page>
  );
};
