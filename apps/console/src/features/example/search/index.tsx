import { useState, useEffect } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DatePicker,
  Icons,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableView
} from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Page, Topbar } from '@/components/layout';

const generateMockData = (count = 100) => {
  const statuses = ['活跃', '已归档', '已暂停', '已删除'];
  const types = ['项目', '任务', '需求', '问题', '风险'];
  const priorities = ['高', '中', '低'];
  const owners = ['张三', '李四', '王五', '赵六', '钱七', '孙八'];

  return Array(count)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      title: `示例项目 #${index + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      owner: owners[Math.floor(Math.random() * owners.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
    }));
};

export const AdvancedSearchExample = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    status: '',
    priority: '',
    owner: '',
    dateRange: null
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!data.length) return;

    setLoading(true);

    let results = [...data];

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(
        item =>
          item.title.toLowerCase().includes(keyword) || item.owner.toLowerCase().includes(keyword)
      );
    }

    if (filters.type) {
      results = results.filter(item => item.type === filters.type);
    }

    if (filters.status) {
      results = results.filter(item => item.status === filters.status);
    }

    if (filters.priority) {
      results = results.filter(item => item.priority === filters.priority);
    }

    if (filters.owner) {
      results = results.filter(item => item.owner === filters.owner);
    }

    if (filters.dateRange && filters.dateRange.from && filters.dateRange.to) {
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);

      results = results.filter(item => {
        const createdAt = new Date(item.createdAt);
        return createdAt >= fromDate && createdAt <= toDate;
      });
    }

    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setTimeout(() => {
      setFilteredData(results);
      setLoading(false);
    }, 300);
  }, [data, filters, sortConfig]);

  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      type: '',
      status: '',
      priority: '',
      owner: '',
      dateRange: null
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const topbarElement = {
    title: t('example.search.title'),
    right: [
      <Button variant='outline-slate' onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
        <Icons name={showAdvancedFilters ? 'IconChevronUp' : 'IconFilter'} className='mr-2' />
        {showAdvancedFilters
          ? t('example.search.hideFilters')
          : t('example.search.advancedFilters')}
      </Button>
    ]
  };

  const topbar = <Topbar {...topbarElement} />;

  return (
    <Page sidebar topbar={topbar}>
      <div className='p-4 space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>{t('example.search.heading')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col space-y-4'>
              <div className='flex space-x-2'>
                <div className='flex-1'>
                  <Input
                    type='text'
                    placeholder={t('example.search.searchPlaceholder')}
                    value={filters.keyword}
                    onChange={e => handleFilterChange('keyword', e.target.value)}
                    // @ts-expect-error
                    prefix={<Icons name='IconSearch' className='text-slate-400' />}
                  />
                </div>
                <Button
                  variant='primary'
                  onClick={() => handleFilterChange('keyword', filters.keyword)}
                >
                  {t('example.search.searchButton')}
                </Button>
                <Button variant='outline-slate' onClick={resetFilters}>
                  {t('example.search.resetFilters')}
                </Button>
              </div>

              {showAdvancedFilters && (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 pb-2 border-t border-b border-slate-200'>
                  <div className='space-y-2'>
                    <Label>{t('example.search.filter.projectType')}</Label>
                    <Select
                      value={filters.type}
                      onValueChange={value => handleFilterChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('example.search.filter.allTypes')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=''>{t('example.search.filter.allTypes')}</SelectItem>
                        <SelectItem value='项目'>项目</SelectItem>
                        <SelectItem value='任务'>任务</SelectItem>
                        <SelectItem value='需求'>需求</SelectItem>
                        <SelectItem value='问题'>问题</SelectItem>
                        <SelectItem value='风险'>风险</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label>{t('example.search.filter.status')}</Label>
                    <Select
                      value={filters.status}
                      onValueChange={value => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('example.search.filter.allStatuses')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=''>{t('example.search.filter.allStatuses')}</SelectItem>
                        <SelectItem value='活跃'>活跃</SelectItem>
                        <SelectItem value='已归档'>已归档</SelectItem>
                        <SelectItem value='已暂停'>已暂停</SelectItem>
                        <SelectItem value='已删除'>已删除</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label>{t('example.search.filter.priority')}</Label>
                    <Select
                      value={filters.priority}
                      onValueChange={value => handleFilterChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('example.search.filter.allPriorities')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=''>{t('example.search.filter.allPriorities')}</SelectItem>
                        <SelectItem value='高'>高</SelectItem>
                        <SelectItem value='中'>中</SelectItem>
                        <SelectItem value='低'>低</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label>{t('example.search.filter.owner')}</Label>
                    <Select
                      value={filters.owner}
                      onValueChange={value => handleFilterChange('owner', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('example.search.filter.allOwners')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=''>{t('example.search.filter.allOwners')}</SelectItem>
                        <SelectItem value='张三'>张三</SelectItem>
                        <SelectItem value='李四'>李四</SelectItem>
                        <SelectItem value='王五'>王五</SelectItem>
                        <SelectItem value='赵六'>赵六</SelectItem>
                        <SelectItem value='钱七'>钱七</SelectItem>
                        <SelectItem value='孙八'>孙八</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2 md:col-span-2'>
                    <Label>{t('example.search.filter.dateRange')}</Label>
                    <DatePicker
                      mode='range'
                      // @ts-expect-error
                      value={filters.dateRange}
                      onChange={value => handleFilterChange('dateRange', value)}
                    />
                  </div>
                </div>
              )}

              <div className='flex justify-between items-center'>
                <div>
                  {loading ? (
                    <span>{t('example.search.results.loading')}</span>
                  ) : (
                    <span>
                      {t('example.search.results.found', { count: filteredData.length })}
                      {data.length > 0
                        ? t('example.search.results.total', { total: data.length })
                        : ''}
                    </span>
                  )}
                </div>
                <div className='flex items-center space-x-2'>
                  <span>{t('example.search.sort.label')}:</span>
                  <Select
                    value={`${sortConfig.key}-${sortConfig.direction}`}
                    onValueChange={value => {
                      const [key, direction] = value.split('-');
                      setSortConfig({ key, direction });
                    }}
                  >
                    <SelectTrigger className='w-[200px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='createdAt-desc'>
                        {t('example.search.sort.createdNewest')}
                      </SelectItem>
                      <SelectItem value='createdAt-asc'>
                        {t('example.search.sort.createdOldest')}
                      </SelectItem>
                      <SelectItem value='updatedAt-desc'>
                        {t('example.search.sort.updatedNewest')}
                      </SelectItem>
                      <SelectItem value='updatedAt-asc'>
                        {t('example.search.sort.updatedOldest')}
                      </SelectItem>
                      <SelectItem value='title-asc'>{t('example.search.sort.nameAsc')}</SelectItem>
                      <SelectItem value='title-desc'>
                        {t('example.search.sort.nameDesc')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-0'>
            <TableView
              loading={loading}
              pageSize={10}
              data={filteredData}
              // @ts-expect-error
              onSortChange={handleSort}
              sortConfig={sortConfig}
              header={[
                {
                  title: t('example.search.table.projectName'),
                  accessorKey: 'title',
                  filter: 'sort',
                  parser: (value, _record) => {
                    if (filters.keyword && value) {
                      const regex = new RegExp(`(${filters.keyword})`, 'gi');
                      const parts = value.split(regex);
                      return (
                        <div>
                          {parts.map((part, i) =>
                            regex.test(part) ? (
                              <span key={i} className='bg-yellow-200 text-black'>
                                {part}
                              </span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </div>
                      );
                    }
                    return value;
                  }
                },
                {
                  title: t('example.search.table.type'),
                  accessorKey: 'type',
                  filter: 'sort'
                },
                {
                  title: t('example.search.table.status'),
                  accessorKey: 'status',
                  filter: 'sort',
                  parser: value => {
                    const colorMap = {
                      活跃: 'bg-green-100 text-green-800',
                      已归档: 'bg-gray-100 text-gray-800',
                      已暂停: 'bg-yellow-100 text-yellow-800',
                      已删除: 'bg-red-100 text-red-800'
                    };
                    return (
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${colorMap[value] || ''}`}
                      >
                        {value}
                      </span>
                    );
                  }
                },
                {
                  title: t('example.search.table.priority'),
                  accessorKey: 'priority',
                  filter: 'sort',
                  parser: value => {
                    const colorMap = {
                      高: 'bg-red-100 text-red-800',
                      中: 'bg-orange-100 text-orange-800',
                      低: 'bg-blue-100 text-blue-800'
                    };
                    return (
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${colorMap[value] || ''}`}
                      >
                        {value}
                      </span>
                    );
                  }
                },
                {
                  title: t('example.search.table.owner'),
                  accessorKey: 'owner',
                  filter: 'sort',
                  parser: value => {
                    if (filters.keyword && value) {
                      const regex = new RegExp(`(${filters.keyword})`, 'gi');
                      const parts = value.split(regex);
                      return (
                        <div>
                          {parts.map((part, i) =>
                            regex.test(part) ? (
                              <span key={i} className='bg-yellow-200 text-black'>
                                {part}
                              </span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </div>
                      );
                    }
                    return value;
                  }
                },
                {
                  title: t('example.search.table.createdAt'),
                  accessorKey: 'createdAt',
                  filter: 'sort',
                  parser: value => formatDateTime(value)
                },
                {
                  title: t('example.search.table.updatedAt'),
                  accessorKey: 'updatedAt',
                  filter: 'sort',
                  parser: value => formatDateTime(value)
                },
                {
                  title: t('example.search.table.operations'),
                  accessorKey: 'operation-column',
                  actions: [
                    {
                      title: t('actions.view'),
                      icon: 'IconEye',
                      onClick: () => console.log('view')
                    },
                    {
                      title: t('actions.edit'),
                      icon: 'IconPencil',
                      onClick: () => console.log('edit')
                    },
                    {
                      title: t('actions.delete'),
                      icon: 'IconTrash',
                      onClick: () => console.log('delete')
                    }
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>

        <div className='flex flex-wrap gap-2'>
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (key === 'dateRange' && !value.from)) return null;

            let displayValue = value;
            let displayKey = '';

            switch (key) {
              case 'keyword':
                displayKey = t('example.search.filters.keyword');
                break;
              case 'type':
                displayKey = t('example.search.filter.projectType');
                break;
              case 'status':
                displayKey = t('example.search.filter.status');
                break;
              case 'priority':
                displayKey = t('example.search.filter.priority');
                break;
              case 'owner':
                displayKey = t('example.search.filter.owner');
                break;
              case 'dateRange':
                displayKey = t('example.search.filter.dateRange');
                displayValue = `${formatDateTime(value.from).split(' ')[0]} - ${formatDateTime(value.to).split(' ')[0]}`;
                break;
              default:
                break;
            }

            if (!displayKey) return null;

            return (
              <div
                key={key}
                className='flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm'
              >
                <span>
                  {displayKey}: {displayValue}
                </span>
                <button
                  className='ml-2'
                  onClick={() => {
                    if (key === 'dateRange') {
                      handleFilterChange(key, null);
                    } else {
                      handleFilterChange(key, '');
                    }
                  }}
                >
                  <Icons name='IconX' size={14} />
                </button>
              </div>
            );
          })}

          {Object.values(filters).some(
            v => v && (typeof v === 'string' ? v.length > 0 : v !== null)
          ) && (
            <button className='text-sm text-blue-600 hover:text-blue-800' onClick={resetFilters}>
              {t('example.search.filters.clearAll')}
            </button>
          )}
        </div>
      </div>
    </Page>
  );
};
