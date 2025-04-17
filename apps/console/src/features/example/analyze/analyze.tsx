import { useState } from 'react';

import { ChartContainer } from '@ncobase/charts';
import {
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  LineChart,
  Legend,
  Tooltip
} from 'recharts';

import dataSeries from '@/assets/datas/ids.mjs';
import { filterQuarters } from '@/helpers/enums/filter';
import { Page, Topbar } from '@/layout';

// Generate sample time series data for demonstration
const generateTimeSeriesData = () => {
  let ts = 1484418600000;
  const dates = [];
  for (let i = 0; i < 120; i++) {
    ts = ts + 86400000;
    const innerArr = [ts, dataSeries[1][i]?.value || Math.round(Math.random() * 100)];
    dates.push(innerArr);
  }
  return dates;
};

const sampleTimeSeriesData = generateTimeSeriesData();

// Chart configuration with direct color values
const chartConfig = {
  sales: {
    label: 'Sales',
    color: '#4285F4' // Blue
  },
  siteA: {
    label: 'Site A',
    color: '#4285F4' // Blue
  },
  siteB: {
    label: 'Site B',
    color: '#EA4335' // Red
  },
  total: {
    label: 'Total',
    color: '#34A853' // Green
  },
  ddr5: {
    label: 'DDR5',
    color: '#4285F4' // Blue
  },
  nvme: {
    label: 'SSD M.2 NVMe',
    color: '#EA4335' // Red
  },
  sata: {
    label: 'SSD M.2 SATA',
    color: '#34A853' // Green
  },
  m3Max: {
    label: 'Macbook M3 Max',
    color: '#FBBC05' // Yellow
  },
  m1: {
    label: 'Macbook M1',
    color: '#9C27B0' // Purple
  },
  seriesA: {
    label: 'Series A',
    color: '#4285F4' // Blue
  },
  seriesB: {
    label: 'Series B',
    color: '#EA4335' // Red
  },
  sessionDuration: {
    label: 'Session Duration',
    color: '#4285F4' // Blue
  },
  pageViews: {
    label: 'Page Views',
    color: '#EA4335' // Red
  },
  totalVisits: {
    label: 'Total Visits',
    color: '#34A853' // Green
  },
  radarA: {
    label: 'Series A',
    color: '#4285F4' // Blue
  },
  ncobase: {
    label: 'Ncobase',
    color: '#4285F4' // Blue
  },
  category1: {
    label: 'Category 1',
    color: '#4285F4' // Blue
  },
  category2: {
    label: 'Category 2',
    color: '#EA4335' // Red
  },
  category3: {
    label: 'Category 3',
    color: '#34A853' // Green
  },
  category4: {
    label: 'Category 4',
    color: '#FBBC05' // Yellow
  },
  category5: {
    label: 'Category 5',
    color: '#9C27B0' // Purple
  }
};

// Color palette for charts
const chartColors = [
  '#4285F4', // Blue
  '#EA4335', // Red
  '#34A853', // Green
  '#FBBC05', // Yellow
  '#9C27B0', // Purple
  '#00ACC1', // Cyan
  '#FF7043', // Deep Orange
  '#8BC34A' // Light Green
];

// Filter options
const timeFilters = [
  { id: 'last_24_hours', label: 'filter.last_24_hours', days: 1 },
  { id: 'last_7_days', label: 'filter.last_7_days', days: 7 },
  { id: 'last_30_days', label: 'filter.last_30_days', days: 30 },
  { id: 'last_90_days', label: 'filter.last_90_days', days: 90 }
];

export const FilterBar = ({ activeFilter, onFilterChange, ...rest }) => {
  const { t } = useTranslation();

  return (
    <Topbar {...rest}>
      {/* Filter buttons for different time ranges */}
      <div className='rounded-md shadow-inner'>
        {timeFilters.map(filter => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? 'primary' : 'outline-slate'}
            className={`${
              activeFilter === filter.id ? '' : 'bg-white'
            } -ms-px rounded-none first:rounded-s-lg first:ms-0 last:rounded-e-lg shadow-sm ${
              activeFilter === filter.id ? 'border border-slate-200/65' : ''
            }`}
            onClick={() => onFilterChange(filter.id)}
          >
            {t(filter.label)}
          </Button>
        ))}
      </div>
      {/* Filter options */}
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

// Generate data based on selected time filter
const generateFilteredData = (baseData, filterDays) => {
  // Simulate filtered data by reducing the dataset size
  const factor = Math.max(1, Math.floor(baseData.length / filterDays));
  return baseData.filter((_, index) => index % factor === 0).slice(0, filterDays);
};

export const AnalyzePage = ({ ...rest }) => {
  const { t } = useTranslation();
  const [saleRange, setSaleRange] = useState('this_quarter');
  const [activeFilter, setActiveFilter] = useState('last_7_days');

  // Apply filter to data
  const filterDays = timeFilters.find(f => f.id === activeFilter)?.days || 7;

  // Filter time series data based on selected filter
  const filteredTimeSeriesData = generateFilteredData(sampleTimeSeriesData, filterDays);

  // Line chart data configuration - adjusted for filters
  const getFilteredLineData = days => {
    // Simulate different data for different time periods
    const multiplier = days / 30;
    return {
      categories: Array(days)
        .fill(0)
        .map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - i - 1));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
      series: [
        {
          name: 'siteA',
          data: Array(days)
            .fill(0)
            .map(() => Math.round(Math.random() * 50 * multiplier) + 5)
        },
        {
          name: 'siteB',
          data: Array(days)
            .fill(0)
            .map(() => Math.round(Math.random() * 60 * multiplier) + 10)
        },
        {
          name: 'total',
          data: Array(days)
            .fill(0)
            .map(() => Math.round(Math.random() * 100 * multiplier) + 20)
        }
      ]
    };
  };

  const lineChartData = getFilteredLineData(filterDays);

  // Pie chart data configuration
  const pieChartData = {
    series: [44, 55, 41, 17, 15],
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
  };

  // Bar chart data configuration - adjusted for filters
  const getFilteredBarData = days => {
    const years = Array(7)
      .fill(0)
      .map((_, i) => new Date().getFullYear() - 6 + i);
    // Simulate different data for different time periods
    const multiplier = days / 30;
    return {
      categories: years,
      series: [
        {
          name: 'ddr5',
          data: years.map(() => Math.round(Math.random() * 40 * multiplier) + 10)
        },
        {
          name: 'nvme',
          data: years.map(() => Math.round(Math.random() * 50 * multiplier) + 10)
        },
        {
          name: 'sata',
          data: years.map(() => Math.round(Math.random() * 20 * multiplier) + 5)
        },
        {
          name: 'm3Max',
          data: years.map(() => Math.round(Math.random() * 10 * multiplier) + 2)
        },
        {
          name: 'm1',
          data: years.map(() => Math.round(Math.random() * 25 * multiplier) + 5)
        }
      ]
    };
  };

  // Radar chart data configuration
  const radarChartData = {
    categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    series: [
      {
        name: 'radarA',
        data: [20, 100, 40, 30, 50, 80, 33]
      }
    ]
  };

  // Area chart data configuration - adjusted for filters
  const getFilteredAreaData = days => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Use a subset of days based on the filter
    const categories = Array(Math.min(days, 8))
      .fill(0)
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (Math.min(days, 8) - i - 1));
        return daysOfWeek[date.getDay()];
      });

    // Simulate different data for different time periods
    const multiplier = days / 30;

    return {
      categories,
      series: [
        {
          name: 'seriesA',
          data: categories.map(() => Math.round(Math.random() * 50 * multiplier) + 20)
        },
        {
          name: 'seriesB',
          data: categories.map(() => Math.round(Math.random() * 60 * multiplier) + 10)
        }
      ]
    };
  };

  const areaChartData = getFilteredAreaData(filterDays);

  // Page statistics data configuration - adjusted for filters
  const getFilteredPageStatsData = days => {
    // Generate categories based on filter days
    const categories = Array(Math.min(days, 12))
      .fill(0)
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (Math.min(days, 12) - i - 1));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

    // Simulate different data for different time periods
    const multiplier = days / 30;

    return {
      categories,
      series: [
        {
          name: 'sessionDuration',
          data: categories.map(() => Math.round(Math.random() * 40 * multiplier) + 5)
        },
        {
          name: 'pageViews',
          data: categories.map(() => Math.round(Math.random() * 50 * multiplier) + 10)
        },
        {
          name: 'totalVisits',
          data: categories.map(() => Math.round(Math.random() * 80 * multiplier) + 20)
        }
      ]
    };
  };

  const pageStatsData = getFilteredPageStatsData(filterDays);

  // Format filtered time series data for charts
  const formattedPageStatsData = pageStatsData.categories.map((category, index) => {
    const dataPoint = { name: category };
    pageStatsData.series.forEach(series => {
      dataPoint[series.name] = series.data[index];
    });
    return dataPoint;
  });

  return (
    <Page
      sidebar
      title={t('example.analyze.title')}
      topbar={<FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />}
      {...rest}
    >
      <div className='grid grid-cols-2 gap-4'>
        {/* Sales Card */}
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
          <CardContent className='p-6'>
            {/* Area chart using ECharts */}
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                option: {
                  grid: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                  },
                  xAxis: {
                    type: 'time',
                    show: false
                  },
                  yAxis: {
                    type: 'value',
                    show: false
                  },
                  series: [
                    {
                      type: 'line',
                      name: 'Sales',
                      showSymbol: false,
                      data: filteredTimeSeriesData,
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [
                            {
                              offset: 0,
                              color: '#4285F4BF' // Semi-transparent blue
                            },
                            {
                              offset: 1,
                              color: '#4285F400' // Transparent blue
                            }
                          ]
                        }
                      },
                      lineStyle: {
                        color: '#4285F4' // Blue
                      }
                    }
                  ],
                  tooltip: {
                    trigger: 'axis'
                  }
                }
              }}
              style={{ height: '170px' }}
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
              User Report <Icons name='IconChevronRight' />
            </Button>
          </CardFooter>
        </Card>

        {/* Clicks and Cost Card */}
        <Card>
          <CardHeader className='flex-row justify-between border-b border-slate-100'>
            <div className='grid gap-4 grid-cols-2'>
              <div className='flex flex-col gap-y-2'>
                <Label className='flex gap-x-2'>
                  Clicks
                  <span className='inline-flex text-danger-500 gap-x-0'>
                    5%
                    <Icons name='IconArrowUp' className='stroke-danger-500' />
                  </span>
                </Label>
                <div className='text-slate-700 text-xl leading-none font-bold'>42,3k</div>
              </div>
              <div className='flex flex-col gap-y-2'>
                <Label className='flex gap-x-2'>
                  Cost Per Click
                  <span className='inline-flex text-success-500 gap-x-0'>
                    1%
                    <Icons name='IconArrowUp' className='stroke-success-500' />
                  </span>
                </Label>
                <div className='text-slate-700 text-xl leading-none font-bold'>¥1.2</div>
              </div>
            </div>
            <div>
              <Select
                defaultValue={timeFilters[2].id}
                onValueChange={value => setActiveFilter(value)}
              >
                <SelectTrigger className='w-auto border-none bg-transparent shadow-none px-0'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeFilters.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {t(item.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className='p-6'>
            {/* Line chart using ECharts */}
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                option: {
                  grid: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5
                  },
                  xAxis: {
                    type: 'category',
                    data: lineChartData.categories,
                    show: false
                  },
                  yAxis: {
                    type: 'value',
                    show: false
                  },
                  series: lineChartData.series.map((item, index) => ({
                    type: 'line',
                    name: chartConfig[item.name]?.label || item.name,
                    data: item.data,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                      color:
                        chartConfig[item.name]?.color || chartColors[index % chartColors.length],
                      width: index === 1 ? 3 : 2,
                      type: index === 1 ? 'dashed' : 'solid'
                    }
                  })),
                  tooltip: {
                    trigger: 'axis'
                  }
                }
              }}
              style={{ height: '180px' }}
            />
          </CardContent>
          <CardFooter className='justify-end'>
            <Button variant='primary'>View Report</Button>
          </CardFooter>
        </Card>
      </div>
      <div className='mt-4 grid grid-cols-3 gap-4'>
        {/* Donut Chart Card */}
        <Card>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>Donut Chart</CardTitle>
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
          <CardContent className='p-6'>
            {/* Pie chart using ECharts */}
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                option: {
                  tooltip: {
                    trigger: 'item'
                  },
                  legend: {
                    show: false
                  },
                  series: [
                    {
                      type: 'pie',
                      radius: ['40%', '70%'],
                      avoidLabelOverlap: false,
                      itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                      },
                      label: {
                        show: false
                      },
                      emphasis: {
                        label: {
                          show: true,
                          fontSize: 14,
                          fontWeight: 'bold'
                        }
                      },
                      labelLine: {
                        show: false
                      },
                      data: pieChartData.series.map((value, index) => ({
                        value,
                        name: pieChartData.labels[index],
                        itemStyle: {
                          color:
                            chartConfig[`category${index + 1}`]?.color ||
                            chartColors[index % chartColors.length]
                        }
                      }))
                    }
                  ]
                }
              }}
              style={{ height: '300px' }}
            />
          </CardContent>
        </Card>
        {/* Bar Chart Card */}
        <Card>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>Material Sales</CardTitle>
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
          <CardContent>
            {/* Bar chart using ECharts */}
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                option: {
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    show: false
                  },
                  grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'value',
                    axisLabel: {
                      formatter: '{value}K'
                    }
                  },
                  yAxis: {
                    type: 'category',
                    data: getFilteredBarData(filterDays).categories
                  },
                  series: getFilteredBarData(filterDays).series.map((item, index) => ({
                    name: item.name,
                    type: 'bar',
                    stack: 'total',
                    label: {
                      show: false
                    },
                    emphasis: {
                      focus: 'series'
                    },
                    data: item.data,
                    itemStyle: {
                      color: chartColors[index % chartColors.length]
                    }
                  }))
                }
              }}
              style={{ height: '300px' }}
            />
          </CardContent>
        </Card>

        {/* Stock Market Chart Card */}
        <Card>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>Shanghai Market</CardTitle>
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
          <CardContent className='p-6'>
            {/* Area chart for stock data using ECharts */}
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                option: {
                  grid: {
                    left: 40,
                    right: 20,
                    top: 30,
                    bottom: 40
                  },
                  tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                      const date = new Date(params[0].value[0]).toLocaleDateString();
                      const value = params[0].value[1];
                      return `${date}: ${value}`;
                    }
                  },
                  xAxis: {
                    type: 'time'
                  },
                  yAxis: {
                    type: 'value',
                    axisLabel: {
                      formatter: function (value) {
                        return (value / 1000000).toFixed(0);
                      }
                    }
                  },
                  dataZoom: [
                    {
                      type: 'inside',
                      start: 0,
                      end: 100
                    }
                  ],
                  series: [
                    {
                      type: 'line',
                      name: 'Ncobase',
                      showSymbol: false,
                      data: filteredTimeSeriesData,
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [
                            {
                              offset: 0,
                              color: '#4285F4BF' // Semi-transparent blue
                            },
                            {
                              offset: 1,
                              color: '#4285F400' // Transparent blue
                            }
                          ]
                        }
                      },
                      lineStyle: {
                        color: '#4285F4' // Blue
                      }
                    }
                  ]
                }
              }}
              style={{ height: '300px' }}
            />
          </CardContent>
        </Card>

        {/* Area Chart (2-column span) */}
        <Card className='col-span-2'>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>Area Chart</CardTitle>
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
          <CardContent className='p-6'>
            {/* Area chart using ECharts */}
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                option: {
                  grid: {
                    left: 30,
                    right: 30,
                    top: 30,
                    bottom: 30
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: areaChartData.series.map(s => chartConfig[s.name]?.label || s.name)
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: areaChartData.categories
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: areaChartData.series.map((item, index) => ({
                    name: chartConfig[item.name]?.label || item.name,
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                      width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                      opacity: 0.8,
                      color:
                        chartConfig[item.name]?.color || chartColors[index % chartColors.length]
                    },
                    emphasis: {
                      focus: 'series'
                    },
                    data: item.data
                  }))
                }
              }}
              style={{ height: '300px' }}
            />
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>Polygon Radar Chart</CardTitle>
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
          <CardContent className='p-6'>
            {/* Radar chart using ECharts */}
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                option: {
                  tooltip: {
                    trigger: 'item'
                  },
                  radar: {
                    indicator: radarChartData.categories.map(name => ({ name, max: 100 })),
                    radius: '60%',
                    splitNumber: 4,
                    splitArea: {
                      areaStyle: {
                        color: ['#f8f8f8', '#fff'],
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowBlur: 10
                      }
                    },
                    axisLine: {
                      lineStyle: {
                        color: '#e9e9e9'
                      }
                    }
                  },
                  series: [
                    {
                      name: 'RadarChart',
                      type: 'radar',
                      data: radarChartData.series.map((item, index) => ({
                        value: item.data,
                        name: chartConfig[item.name]?.label || item.name,
                        areaStyle: {
                          color:
                            // eslint-disable-next-line no-constant-binary-expression
                            `${chartConfig[item.name]?.color}33` ||
                            `${chartColors[index % chartColors.length]}33` // 20% opacity
                        },
                        lineStyle: {
                          color:
                            chartConfig[item.name]?.color || chartColors[index % chartColors.length]
                        },
                        itemStyle: {
                          color:
                            chartConfig[item.name]?.color || chartColors[index % chartColors.length]
                        }
                      }))
                    }
                  ]
                }
              }}
              style={{ height: '300px' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Page Statistics (full width) */}
      <div className='mt-4 grid grid-cols-3 gap-4'>
        <Card className='col-span-full'>
          <CardHeader className='border-b border-slate-100 flex-row justify-between'>
            <CardTitle className='text-lg'>Page Statistics</CardTitle>
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
          <CardContent className='p-6'>
            {/* Fixed Recharts implementation with proper ResponsiveContainer */}
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={formattedPageStatsData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className='bg-white border border-gray-200 p-2 rounded shadow-md'>
                            <p className='font-bold'>{label}</p>
                            {payload.map((entry, index) => (
                              <p key={`item-${index}`} style={{ color: entry.color }}>
                                {chartConfig[entry.dataKey]?.label || entry.dataKey}: {entry.value}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    content={({ payload }) => {
                      return (
                        <div className='flex justify-center mt-4 gap-4'>
                          {payload.map((entry: any, index: number) => (
                            <div key={`item-${index}`} className='flex items-center'>
                              <div
                                style={{
                                  backgroundColor: entry.color,
                                  width: 10,
                                  height: 10,
                                  marginRight: 5
                                }}
                              />
                              <span>{chartConfig[entry?.dataKey]?.label || entry.dataKey}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />

                  {pageStatsData.series.map((item, index) => {
                    const strokeType = index === 1 ? '5 5' : index === 2 ? '3 3' : undefined;
                    return (
                      <Line
                        key={item.name}
                        type='monotone'
                        dataKey={item.name}
                        stroke={
                          chartConfig[item.name]?.color || chartColors[index % chartColors.length]
                        }
                        strokeDasharray={strokeType}
                        activeDot={{ r: 8 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
