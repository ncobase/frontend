import { useState } from 'react';

import {
  Button,
  DatePicker,
  Icons,
  InputField,
  PaginationParams,
  SelectField,
  TableView,
  Tooltip
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
        <Tooltip side='bottom' content='Create'>
          <Button
            variant='unstyle'
            size='ratio'
            className='border-0'
            onClick={() => navigate('/example/ui/form/create')}
          >
            <Icons name='IconPlus' />
          </Button>
        </Tooltip>
      </div>
    ],
    right: [
      <div className='rounded-md flex items-center justify-between gap-x-1'>
        <Tooltip side='bottom' content='Filter'>
          <Button variant='unstyle' size='ratio'>
            <Icons name='IconFilter' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Customized columns'>
          <Button variant='unstyle' size='ratio'>
            <Icons name='IconColumns' />
          </Button>
        </Tooltip>
      </div>,
      <div className='bg-slate-100 p-1 rounded-md flex items-center justify-between gap-x-2'>
        <Tooltip side='bottom' content='Card Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white'
            onClick={() => navigate('/example/card')}
          >
            <Icons name='IconLayoutBoard' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='List Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white'
            onClick={() => navigate('/example/list-2')}
          >
            <Icons name='IconTableColumn' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Card Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white'
            onClick={() => navigate('/example/list-1')}
          >
            <Icons name='IconTable' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Full Screen'>
          <Button variant='unstyle' size='ratio' className='p-1 hover:bg-white'>
            <Icons name='IconArrowsMaximize' />
          </Button>
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
              dataIndex: 'id',
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
              dataIndex: 'name',
              icon: 'IconFlame'
            },
            {
              title: '别名',
              dataIndex: 'slug',
              icon: 'IconAffiliate'
            },
            {
              title: '路径',
              dataIndex: 'path',
              icon: 'IconRoute'
            },
            {
              title: '图标',
              dataIndex: 'icon',
              parser: value => <Icons name={value} size={16} />,
              icon: 'IconCategory'
            },
            {
              title: '状态',
              dataIndex: 'disabled',
              parser: value => parseStatus(!value),
              icon: 'IconFlagCog'
            },
            {
              dataIndex: 'operation-column',
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
              dataIndex: 'id',
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
              dataIndex: 'name',
              icon: 'IconFlame'
            },
            {
              title: '别名',
              dataIndex: 'slug',
              icon: 'IconAffiliate'
            },
            {
              title: '路径',
              dataIndex: 'path',
              icon: 'IconRoute'
            },
            {
              title: '图标',
              dataIndex: 'icon',
              parser: value => <Icons name={value} size={16} />,
              icon: 'IconCategory'
            },
            {
              title: '状态',
              dataIndex: 'disabled',
              parser: value => parseStatus(!value),
              icon: 'IconFlagCog'
            },
            {
              dataIndex: 'created_at',
              title: '创建时间',
              parser: value => formatDateTime(value),
              icon: 'IconCalendarMonth'
            },
            {
              title: '更新时间',
              dataIndex: 'updated_at',
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
