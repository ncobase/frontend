import React from 'react';

import {
  AreaChart,
  BarChart,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icons,
  Label,
  LineChart,
  PieChart,
  RadarChart,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { useTranslation } from 'react-i18next';

import dataSeries from '@/assets/datas/ids.mjs';
import { filterDays, filterQuarters } from '@/helpers/enums/filter';
import { Page, Topbar } from '@/layout';

export const FilterBar = ({ ...rest }) => {
  const { t } = useTranslation();
  return (
    <Topbar {...rest}>
      <div className='rounded-md shadow-inner'>
        <Button
          variant='outline-slate'
          className='bg-white -ms-px rounded-none first:rounded-s-lg first:ms-0 last:rounded-e-lg shadow-sm'
        >
          {t('filter.last_24_hours')}
        </Button>
        <Button
          variant='primary'
          className='-ms-px rounded-none first:rounded-s-lg first:ms-0 last:rounded-e-lg shadow-sm border border-slate-200/65'
        >
          {t('filter.last_7_days')}
        </Button>
        <Button
          variant='outline-slate'
          className='bg-white -ms-px rounded-none first:rounded-s-lg first:ms-0 last:rounded-e-lg shadow-sm'
        >
          {t('filter.last_30_days')}
        </Button>
        <Button
          variant='outline-slate'
          className='bg-white -ms-px rounded-none first:rounded-s-lg first:ms-0 last:rounded-e-lg shadow-sm'
        >
          {t('filter.last_90_days')}
        </Button>
      </div>
      <div className='flex items-center gap-x-2'>
        <Button variant='outline-slate' className='shadow-sm'>
          <Icons name='IconCalendarMonth' />
          {t('filter.date')}
        </Button>
        <Button variant='outline-slate' className='shadow-sm'>
          <Icons name='IconFilter' />
          {t('filter.filter')}
        </Button>
      </div>
    </Topbar>
  );
};

export const AnalyzePage = ({ ...rest }) => {
  const { t } = useTranslation();
  let ts2 = 1484418600000;
  const dates = [];
  for (let i = 0; i < 120; i++) {
    ts2 = ts2 + 86400000;
    const innerArr = [ts2, dataSeries[1][i].value];
    dates.push(innerArr);
  }

  const [saleRange, setSaleRange] = React.useState('this_quarter');

  return (
    <Page sidebar title={t('example.analyze.title')} topbar={<FilterBar />} {...rest}>
      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader className='flex-row justify-between border-b border-slate-100'>
            <div className='inline-flex flex-col space-y-1.5'>
              <CardTitle className='text-lg'>
                1.2 {t('currency_units.hundred_million')} {t('currencies.cny')}
              </CardTitle>
              <CardDescription>
                {t(filterQuarters.find(item => item.value === saleRange)?.label)}{' '}
                {t('example.analyze.sales.title')}
              </CardDescription>
            </div>
            <div className='inline-flex gap-x-1 text-success-500'>
              12%
              <Icons name='IconArrowUp' stroke={2} className='stroke-success-500 mt-[1.5px]' />
            </div>
          </CardHeader>
          <CardContent className='px-0 pb-0'>
            <AreaChart
              height={170}
              options={{
                chart: {
                  type: 'area',
                  stacked: false,
                  zoom: {
                    enabled: false
                  },
                  toolbar: {
                    show: false
                  }
                },
                dataLabels: {
                  enabled: false
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                  }
                },
                yaxis: {
                  show: false
                },
                xaxis: {
                  type: 'datetime',
                  labels: {
                    show: false
                  },
                  axisBorder: {
                    show: false
                  },
                  axisTicks: {
                    show: false
                  }
                }
              }}
              series={[
                {
                  name: '销售额',
                  data: dates
                }
              ]}
            />
          </CardContent>
          <CardFooter className='justify-between'>
            <Select defaultValue={saleRange} onValueChange={setSaleRange}>
              <SelectTrigger className='w-auto border-none bg-transparent shadow-none px-0'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterQuarters.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {t(item.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant='slate'>
              用户报告 <Icons name='IconChevronRight' />
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className='flex-row justify-between border-b border-slate-100'>
            <div className='grid gap-4 grid-cols-2'>
              <div className='flex flex-col gap-y-2'>
                <Label className='flex gap-x-2'>
                  点击数
                  <span className='inline-flex text-danger-500 gap-x-0'>
                    5%
                    <Icons name='IconArrowUp' className='stroke-danger-500' />
                  </span>
                </Label>
                <div className='text-slate-700 text-xl leading-none font-bold'>42,3k</div>
              </div>
              <div className='flex flex-col gap-y-2'>
                <Label className='flex gap-x-2'>
                  单次点击成本
                  <span className='inline-flex text-success-500 gap-x-0'>
                    1%
                    <Icons name='IconArrowUp' className='stroke-success-500' />
                  </span>
                </Label>
                <div className='text-slate-700 text-xl leading-none font-bold'>¥1.2</div>
              </div>
            </div>
            <div>
              <Select defaultValue={filterDays[2].value}>
                <SelectTrigger className='w-auto border-none bg-transparent shadow-none px-0'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterDays.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      {t(item.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className='px-0 pb-0'>
            <LineChart
              height={180}
              options={{
                chart: {
                  type: 'line',
                  zoom: {
                    enabled: false
                  },
                  toolbar: {
                    show: false
                  }
                },
                dataLabels: {
                  enabled: false
                },
                stroke: {
                  width: [5, 7, 5],
                  curve: 'straight',
                  dashArray: [0, 8, 5]
                },
                legend: {
                  show: false,
                  tooltipHoverFormatter: function (val, opts) {
                    return (
                      val +
                      ' - <strong>' +
                      opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                      '</strong>'
                    );
                  }
                },
                markers: {
                  size: 0,
                  hover: {
                    sizeOffset: 0
                  }
                },
                yaxis: {
                  show: false
                },
                xaxis: {
                  categories: [
                    '01 Jan',
                    '02 Jan',
                    '03 Jan',
                    '04 Jan',
                    '05 Jan',
                    '06 Jan',
                    '07 Jan',
                    '08 Jan',
                    '09 Jan',
                    '10 Jan',
                    '11 Jan',
                    '12 Jan'
                  ],
                  labels: {
                    show: false
                  },
                  axisBorder: {
                    show: false
                  },
                  axisTicks: {
                    show: false
                  }
                },
                grid: {
                  borderColor: '#f1f1f1'
                }
              }}
              series={[
                {
                  name: '站点 A',
                  data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
                },
                {
                  name: '站点 B',
                  data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
                },
                {
                  name: '合计',
                  data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
                }
              ]}
            />
          </CardContent>
          <CardFooter className='justify-end'>
            <Button variant='primary'>查看报告</Button>
          </CardFooter>
        </Card>
      </div>
      <div className='mt-4 grid grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>甜甜圈饼图</CardTitle>
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant='unstyle' className='p-0'>
                  <Icons name='IconMenu' />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem>{t('actions.view')}</DropdownItem>
                <DropdownItem>{t('actions.edit')}</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </CardHeader>
          <CardContent className='px-6 pb-0'>
            <PieChart
              type='donut'
              options={{
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200
                      },
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }
                ],
                legend: { show: false }
              }}
              series={[44, 55, 41, 17, 15]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>物料配件销售</CardTitle>
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant='unstyle' className='p-0'>
                  <Icons name='IconMenu' />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem>{t('actions.view')}</DropdownItem>
                <DropdownItem>{t('actions.edit')}</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </CardHeader>
          <CardContent className='px-6 pb-0'>
            <BarChart
              series={[
                {
                  name: 'DDR5',
                  data: [44, 55, 41, 37, 22, 43, 21]
                },
                {
                  name: 'SSD M.2 NVMe',
                  data: [53, 32, 33, 52, 13, 43, 32]
                },
                {
                  name: 'SSD M.2 SATA',
                  data: [12, 17, 11, 9, 15, 11, 20]
                },
                {
                  name: 'Macbook M3 Max',
                  data: [9, 7, 5, 8, 6, 9, 4]
                },
                {
                  name: 'Macbook M1',
                  data: [25, 12, 19, 32, 25, 24, 10]
                }
              ]}
              options={{
                chart: {
                  type: 'bar',
                  stacked: true,
                  toolbar: { show: false }
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    dataLabels: {
                      total: {
                        enabled: true,
                        offsetX: 0,
                        style: {
                          fontSize: '0.8125rem',
                          fontWeight: 900
                        }
                      }
                    }
                  }
                },
                stroke: {
                  width: 1,
                  colors: ['#fff']
                },
                xaxis: {
                  categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
                  labels: {
                    // show: false,
                    formatter: function (val) {
                      return val + 'K';
                    }
                  }
                },
                yaxis: {
                  title: {
                    text: undefined
                  }
                },
                tooltip: {
                  y: {
                    formatter: function (val) {
                      return val + 'K';
                    }
                  }
                },
                fill: {
                  opacity: 1
                },
                legend: {
                  show: false,
                  position: 'top',
                  horizontalAlign: 'left',
                  offsetX: 40
                }
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>沪市行情</CardTitle>
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant='unstyle' className='p-0'>
                  <Icons name='IconMenu' />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem>{t('actions.view')}</DropdownItem>
                <DropdownItem>{t('actions.edit')}</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </CardHeader>
          <CardContent className='px-6 pb-0'>
            <AreaChart
              options={{
                chart: {
                  type: 'area',
                  stacked: false,
                  zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                  },
                  toolbar: {
                    show: false,
                    autoSelected: 'zoom'
                  }
                },
                dataLabels: {
                  enabled: false
                },
                markers: {
                  size: 0
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                  }
                },
                yaxis: {
                  labels: {
                    formatter: function (val) {
                      return (val / 1000000).toFixed(0);
                    }
                  },
                  title: {
                    text: 'Price'
                  }
                },
                xaxis: {
                  type: 'datetime'
                },
                tooltip: {
                  shared: false,
                  y: {
                    formatter: val => (val / 1000000).toFixed(0)
                  }
                }
              }}
              series={[
                {
                  name: 'Ncobase',
                  data: dates
                }
              ]}
            />
          </CardContent>
        </Card>
        <Card className='col-span-2'>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>曲线面积图</CardTitle>
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant='unstyle' className='p-0'>
                  <Icons name='IconMenu' />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem>{t('actions.view')}</DropdownItem>
                <DropdownItem>{t('actions.edit')}</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </CardHeader>
          <CardContent className='px-6 pb-0'>
            <AreaChart
              options={{
                chart: {
                  toolbar: {
                    show: false
                  }
                },
                xaxis: {
                  categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }
              }}
              series={[
                {
                  name: '系列-A',
                  data: [30, 40, 25, 50, 49, 21, 70, 51]
                },
                {
                  name: '系列-B',
                  data: [23, 12, 54, 61, 32, 56, 81, 19]
                }
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>多边形雷达图</CardTitle>
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant='unstyle' className='p-0'>
                  <Icons name='IconMenu' />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem>{t('actions.view')}</DropdownItem>
                <DropdownItem>{t('actions.edit')}</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </CardHeader>
          <CardContent className='px-6 pb-0'>
            <RadarChart
              series={[
                {
                  name: '系列 A',
                  data: [20, 100, 40, 30, 50, 80, 33]
                }
              ]}
              options={{
                chart: {
                  toolbar: {
                    show: false
                  }
                },
                dataLabels: {
                  enabled: true
                },
                plotOptions: {
                  radar: {
                    size: 140,
                    polygons: {
                      strokeColors: '#e9e9e9',
                      fill: {
                        colors: ['#f8f8f8', '#fff']
                      }
                    }
                  }
                },
                colors: ['#FF4560'],
                markers: {
                  size: 4,
                  colors: ['#fff'],
                  strokeColors: '#FF4560',
                  strokeWidth: 2
                },
                tooltip: {
                  y: {
                    formatter: (val: ExplicitAny) => val
                  }
                },
                xaxis: {
                  categories: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                  ]
                },
                yaxis: {
                  tickAmount: 7,
                  labels: {
                    formatter: ({ val, i }: ExplicitAny) => {
                      if (i % 2 === 0) {
                        return val;
                      } else {
                        return '';
                      }
                    }
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div className='mt-4 grid grid-cols-3 gap-4'>
        <Card className='col-span-full'>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>页面统计</CardTitle>
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant='unstyle' className='p-0'>
                  <Icons name='IconMenu' />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem>{t('actions.view')}</DropdownItem>
                <DropdownItem>{t('actions.edit')}</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </CardHeader>
          <CardContent className='px-6 pb-0'>
            <LineChart
              options={{
                chart: {
                  type: 'line',
                  zoom: {
                    enabled: false
                  },
                  toolbar: {
                    show: false
                  }
                },
                dataLabels: {
                  enabled: false
                },
                stroke: {
                  width: [5, 7, 5],
                  curve: 'straight',
                  dashArray: [0, 8, 5]
                },
                legend: {
                  tooltipHoverFormatter: function (val, opts) {
                    return (
                      val +
                      ' - <strong>' +
                      opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                      '</strong>'
                    );
                  }
                },
                markers: {
                  size: 0,
                  hover: {
                    sizeOffset: 6
                  }
                },
                xaxis: {
                  categories: [
                    '01 Jan',
                    '02 Jan',
                    '03 Jan',
                    '04 Jan',
                    '05 Jan',
                    '06 Jan',
                    '07 Jan',
                    '08 Jan',
                    '09 Jan',
                    '10 Jan',
                    '11 Jan',
                    '12 Jan'
                  ]
                },
                tooltip: {
                  y: [
                    {
                      title: {
                        formatter: function (val) {
                          return val + ' (分钟)';
                        }
                      }
                    },
                    {
                      title: {
                        formatter: function (val) {
                          return val + ' (次数)';
                        }
                      }
                    },
                    {
                      title: {
                        formatter: function (val) {
                          return val;
                        }
                      }
                    }
                  ]
                },
                grid: {
                  borderColor: '#f1f1f1'
                }
              }}
              series={[
                {
                  name: '会话持续时间',
                  data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
                },
                {
                  name: '页面浏览量',
                  data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
                },
                {
                  name: '总访问量',
                  data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
                }
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
