import { useState } from 'react';

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
  Tooltip
} from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Page, Topbar, TopbarProps } from '@/components/layout';
import { useListMenus } from '@/features/system/menu/service';
import { parseStatus } from '@/lib/status';

const QueryBar = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('cat1');
  const [selectedSubCategory, setSelectedSubCategory] = useState('sub1');

  const categories = [
    { id: 'cat1', name: '销售', subcategories: ['销售业绩', '客户满意度', '合同完成率'] },
    { id: 'cat2', name: '生产', subcategories: ['产品质量', '生产效率', '设备利用率'] },
    { id: 'cat3', name: '研发', subcategories: ['创新指标', '专利数量', '项目进度'] },
    { id: 'cat4', name: '人力', subcategories: ['员工满意度', '培训完成率', '人才保留率'] }
  ];

  const metrics = [
    { id: 'metric1', name: '销售额' },
    { id: 'metric2', name: '利润率' },
    { id: 'metric3', name: '市场份额' },
    { id: 'metric4', name: '客户数量' },
    { id: 'metric5', name: '增长率' }
  ];

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className='bg-white dark:bg-slate-800 shadow-xs flex-col grid rounded-md px-4 divide-y divide-slate-100 dark:divide-slate-700 relative'>
      <div className='py-4 flex items-center justify-start'>
        <div className='flex items-center text-slate-800 dark:text-slate-200'>类别：</div>
        <div className='flex-1 flex flex-wrap gap-4 pl-4'>
          {categories.map(cat => (
            <div key={cat.id} className='flex flex-col gap-2'>
              <Button
                variant={selectedCategory === cat.id ? 'primary' : 'unstyle'}
                onClick={() => setSelectedCategory(cat.id)}
                className='dark:text-slate-200 dark:hover:bg-slate-700'
              >
                {cat.name}
              </Button>
              {selectedCategory === cat.id && (
                <div className='flex gap-2 pl-4'>
                  {cat.subcategories.map((sub, idx) => (
                    <Button
                      key={idx}
                      variant={selectedSubCategory === `sub${idx}` ? 'outline' : 'unstyle'}
                      onClick={() => setSelectedSubCategory(`sub${idx}`)}
                      className='text-sm dark:text-slate-300'
                    >
                      {sub}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {isExpanded && (
        <>
          <div className='py-4 flex items-center justify-start'>
            <div className='flex items-center text-slate-800 dark:text-slate-200'>指标：</div>
            <div className='flex-1 flex gap-x-4 pl-4'>
              {metrics.map((metric, idx) => (
                <div key={idx} className='inline-flex'>
                  <Checkbox id={`metric-${idx}`} />
                  <Label htmlFor={`metric-${idx}`} className='pl-2 dark:text-slate-300'>
                    {metric.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className='py-4 flex items-center justify-start flex-wrap gap-y-4'>
            <div className='inline-flex mr-6'>
              <div className='flex items-center text-slate-800 dark:text-slate-200'>周期：</div>
              <div className='flex-1 flex gap-x-4 pl-4'>
                <Select defaultValue='month'>
                  <SelectTrigger className='py-1 bg-slate-50 dark:bg-slate-700'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='year'>年</SelectItem>
                    <SelectItem value='quarter'>季</SelectItem>
                    <SelectItem value='month'>月</SelectItem>
                    <SelectItem value='week'>周</SelectItem>
                    <SelectItem value='day'>日</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='inline-flex mr-6'>
              <div className='flex items-center text-slate-800 dark:text-slate-200'>日期：</div>
              <div className='flex-1 flex gap-x-4 pl-4'>
                <Select defaultValue='202305'>
                  <SelectTrigger className='py-1 bg-slate-50 dark:bg-slate-700'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='202401'>2024 - 01</SelectItem>
                    <SelectItem value='202312'>2023 - 12</SelectItem>
                    <SelectItem value='202311'>2023 - 11</SelectItem>
                    <SelectItem value='202310'>2023 - 10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='inline-flex mr-6'>
              <div className='flex items-center text-slate-800 dark:text-slate-200'>考核对象：</div>
              <div className='flex-1 flex gap-x-4 pl-4'>
                <Select defaultValue='dept1'>
                  <SelectTrigger className='py-1 bg-slate-50 dark:bg-slate-700'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='dept1'>销售部门</SelectItem>
                    <SelectItem value='dept2'>生产部门</SelectItem>
                    <SelectItem value='dept3'>研发部门</SelectItem>
                    <SelectItem value='dept4'>人力资源部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </>
      )}
      <Button
        variant='unstyle'
        size='ratio'
        className='absolute -bottom-2 left-1/2 -translate-x-1/2 z-9999 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 [&>svg]:stroke-slate-500 [&>svg]:hover:stroke-slate-600 dark:[&>svg]:stroke-slate-400 shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] rounded-full p-0.5 border border-transparent'
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
      <div className='bg-slate-100 dark:bg-gray-800 p-1 rounded-md flex items-center justify-between gap-x-2'>
        <Tooltip side='bottom' content='Card Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white dark:hover:bg-gray-700'
            onClick={() => navigate('/example/card')}
          >
            <Icons name='IconLayoutBoard' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='List Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white dark:hover:bg-gray-700'
            onClick={() => navigate('/example/list-2')}
          >
            <Icons name='IconTableColumn' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Card Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white dark:hover:bg-gray-700'
            onClick={() => navigate('/example/list-1')}
          >
            <Icons name='IconTable' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Full Screen'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white dark:hover:bg-gray-700'
          >
            <Icons name='IconArrowsMaximize' />
          </Button>
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
            dataIndex: 'id',
            parser: value => (
              <Button variant='link' size='sm' onClick={() => navigate(`/example/ui/form/viewer`)}>
                {value}
              </Button>
            ),
            icon: 'IconHash'
          },
          {
            title: 'Name',
            dataIndex: 'name',
            icon: 'IconFlame'
          },
          {
            title: 'Slug',
            dataIndex: 'slug',
            icon: 'IconAffiliate'
          },
          {
            title: 'Path',
            dataIndex: 'path',
            icon: 'IconRoute'
          },
          {
            title: 'Icon',
            dataIndex: 'icon',
            parser: value => <Icons name={value} size={16} />,
            icon: 'IconCategory'
          },
          {
            title: 'Status',
            dataIndex: 'disabled',
            parser: value => parseStatus(!value),
            icon: 'IconFlagCog'
          },
          {
            title: 'Created At',
            dataIndex: 'created_at',
            parser: value => formatDateTime(value),
            icon: 'IconCalendarMonth'
          },
          {
            title: 'Updated At',
            dataIndex: 'updated_at',
            parser: value => formatDateTime(value),
            icon: 'IconCalendarMonth'
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
    </Page>
  );
};
