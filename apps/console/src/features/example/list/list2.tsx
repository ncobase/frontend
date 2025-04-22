import { useState } from 'react';

import {
  Button,
  DatePicker,
  Icons,
  InputField,
  PaginationParams,
  SelectField,
  TableView,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { formatDateTime } from '@ncobase/utils';
import { Control, Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { QueryBar } from '@/components/curd/querybar';
import { Page, Topbar } from '@/components/layout';
import { useListMenus } from '@/features/system/menu/service';
import { parseStatus } from '@/lib/status';

type QueryFormParams = {
  code?: string;
  title?: string;
  status?: string;
  'date-range'?: string;
} & PaginationParams;

const queryFields = ({ queryControl }: { queryControl: Control<QueryFormParams, ExplicitAny> }) => [
  {
    name: 'code',
    label: '编号',
    component: (
      <Controller
        name='code'
        control={queryControl}
        defaultValue=''
        render={({ field }) => <InputField className='py-1.5' {...field} />}
      />
    )
  },
  {
    name: 'title',
    label: '名称',
    component: (
      <Controller
        name='title'
        control={queryControl}
        defaultValue=''
        render={({ field }) => <InputField className='py-1.5' {...field} />}
      />
    )
  },
  {
    name: 'status',
    label: '状态',
    component: (
      <Controller
        name='status'
        control={queryControl}
        defaultValue=''
        render={({ field }) => (
          <SelectField
            options={[
              { label: '全部', value: 'all' },
              { label: '启用', value: 'enabled' },
              { label: '禁用', value: 'disabled' }
            ]}
            className='[&>button]:py-1.5'
            {...field}
          />
        )}
      />
    )
  },
  {
    name: 'date-range',
    label: '范围',
    component: <DatePicker mode='range' className='py-1.5' />
  }
];

export const ListPage2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams] = useState({ limit: 20 });
  const { data } = useListMenus(queryParams);
  const records = data?.items || [];

  const { control: queryControl } = useForm<QueryFormParams>();

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
      <QueryBar queryFields={queryFields({ queryControl })} t={t} />
      <div className='flex-1 mt-4 overflow-y-auto'>
        <TableView
          pageSize={8}
          data={records}
          selected
          visibleControl
          header={[
            {
              title: '编号',
              accessorKey: 'id',
              parser: value => (
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
              accessorKey: 'name',
              icon: 'IconFlame'
            },
            {
              title: '别名',
              accessorKey: 'slug',
              icon: 'IconAffiliate'
            },
            {
              title: '路径',
              accessorKey: 'path',
              icon: 'IconRoute'
            },
            {
              title: '图标',
              accessorKey: 'icon',
              parser: value => <Icons name={value} size={16} />,
              icon: 'IconCategory'
            },
            {
              title: '状态',
              accessorKey: 'disabled',
              parser: value => {
                const status = parseStatus(!value);
                return typeof status === 'bigint' ? status.toString() : status;
              },
              icon: 'IconFlagCog'
            },
            {
              accessorKey: 'operation-column',
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
              accessorKey: 'id',
              parser: value => (
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
              accessorKey: 'name',
              icon: 'IconFlame'
            },
            {
              title: '别名',
              accessorKey: 'slug',
              icon: 'IconAffiliate'
            },
            {
              title: '路径',
              accessorKey: 'path',
              icon: 'IconRoute'
            },
            {
              title: '图标',
              accessorKey: 'icon',
              parser: value => <Icons name={value} size={16} />,
              icon: 'IconCategory'
            },
            {
              title: '状态',
              accessorKey: 'disabled',
              parser: value => {
                const status = parseStatus(!value);
                return typeof status === 'bigint' ? status.toString() : status;
              },
              icon: 'IconFlagCog'
            },
            {
              accessorKey: 'created_at',
              title: '创建时间',
              parser: value => formatDateTime(value),
              icon: 'IconCalendarMonth'
            },
            {
              title: '更新时间',
              accessorKey: 'updated_at',
              parser: value => formatDateTime(value),
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
