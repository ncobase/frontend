import { useState } from 'react';

import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@ncobase/charts';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';

// Sample data for charts
const salesData = [
  { month: 'Jan', sales: 65, revenue: 55, profit: 28 },
  { month: 'Feb', sales: 59, revenue: 49, profit: 25 },
  { month: 'Mar', sales: 80, revenue: 64, profit: 36 },
  { month: 'Apr', sales: 81, revenue: 71, profit: 43 },
  { month: 'May', sales: 56, revenue: 44, profit: 29 },
  { month: 'Jun', sales: 55, revenue: 48, profit: 31 },
  { month: 'Jul', sales: 40, revenue: 38, profit: 22 },
  { month: 'Aug', sales: 72, revenue: 65, profit: 37 },
  { month: 'Sep', sales: 88, revenue: 76, profit: 41 },
  { month: 'Oct', sales: 67, revenue: 58, profit: 30 },
  { month: 'Nov', sales: 83, revenue: 73, profit: 38 },
  { month: 'Dec', sales: 91, revenue: 82, profit: 44 }
];

const productData = [
  { name: 'Product A', value: 35 },
  { name: 'Product B', value: 25 },
  { name: 'Product C', value: 20 },
  { name: 'Product D', value: 15 },
  { name: 'Other', value: 5 }
];

const performanceData = [
  { metric: 'Speed', valueA: 80, valueB: 90 },
  { metric: 'Quality', valueA: 95, valueB: 85 },
  { metric: 'Reliability', valueA: 70, valueB: 88 },
  { metric: 'Efficiency', valueA: 85, valueB: 75 },
  { metric: 'Support', valueA: 75, valueB: 92 }
];

// Dashboard component
export const ChartDashboard = () => {
  const [theme, setTheme] = useState('light');

  // Chart configurations
  const salesConfig = {
    sales: {
      label: 'Sales',
      theme: {
        light: '#1677ff',
        dark: '#177ddc'
      }
    },
    revenue: {
      label: 'Revenue',
      theme: {
        light: '#52c41a',
        dark: '#49aa19'
      }
    },
    profit: {
      label: 'Profit',
      theme: {
        light: '#faad14',
        dark: '#d89614'
      }
    }
  };

  const productConfig = {
    'product-a': {
      label: 'Product A',
      theme: {
        light: '#1677ff',
        dark: '#177ddc'
      }
    },
    'product-b': {
      label: 'Product B',
      theme: {
        light: '#52c41a',
        dark: '#49aa19'
      }
    },
    'product-c': {
      label: 'Product C',
      theme: {
        light: '#faad14',
        dark: '#d89614'
      }
    },
    'product-d': {
      label: 'Product D',
      theme: {
        light: '#ff4d4f',
        dark: '#a61d24'
      }
    },
    other: {
      label: 'Other',
      theme: {
        light: '#722ed1',
        dark: '#642ab5'
      }
    }
  };

  const performanceConfig = {
    'product-a': {
      label: 'Product A',
      theme: {
        light: '#1677ff',
        dark: '#177ddc'
      }
    },
    'product-b': {
      label: 'Product B',
      theme: {
        light: '#52c41a',
        dark: '#49aa19'
      }
    }
  };

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    document.body.classList.toggle('dark');
  };
  // <Page title={t('example.analyze.title')}>
  // </Page>
  return (
    <div className={`w-full ${theme}`} style={{ padding: '20px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <h1>Sales Analytics Dashboard</h1>
        <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* ECharts Line Chart */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Monthly Performance (ECharts)</h2>
          <div>
            <ChartContainer
              config={salesConfig}
              library='echarts'
              style={{ height: '350px' }}
              echartsProps={{
                option: {
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: ['Sales', 'Revenue', 'Profit']
                  },
                  xAxis: {
                    type: 'category',
                    data: salesData.map(item => item.month)
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      name: 'Sales',
                      type: 'line',
                      smooth: true,
                      data: salesData.map(item => item.sales),
                      lineStyle: {
                        color: salesConfig.sales.theme.light
                      }
                    },
                    {
                      name: 'Revenue',
                      type: 'line',
                      smooth: true,
                      data: salesData.map(item => item.revenue),
                      lineStyle: {
                        color: salesConfig.revenue.theme.light
                      }
                    },
                    {
                      name: 'Profit',
                      type: 'line',
                      smooth: true,
                      data: salesData.map(item => item.profit),
                      lineStyle: {
                        color: salesConfig.profit.theme.light
                      }
                    }
                  ]
                }
              }}
            />
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Monthly Performance (Recharts)</h2>
          <ChartContainer config={salesConfig} className='max-h-96'>
            <RechartsLineChart data={salesData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Line type='monotone' dataKey='sales' stroke='var(--color-sales)' />
              <Line type='monotone' dataKey='revenue' stroke='var(--color-revenue)' />
              <Line type='monotone' dataKey='profit' stroke='var(--color-profit)' />
            </RechartsLineChart>
          </ChartContainer>
        </div>

        {/* ECharts Pie Chart */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Product Distribution</h2>
          <ChartContainer
            config={productConfig}
            library='echarts'
            style={{ height: '350px' }}
            echartsProps={{
              option: {
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical',
                  left: 'left'
                },
                series: [
                  {
                    type: 'pie',
                    radius: '50%',
                    data: productData.map((item, index) => ({
                      value: item.value,
                      name: item.name,
                      itemStyle: {
                        color: Object.values(productConfig)[index].theme.light
                      }
                    })),
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }
            }}
          />
        </div>

        {/* ECharts Radar Chart */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Performance Comparison</h2>
          <ChartContainer
            config={performanceConfig}
            library='echarts'
            style={{ height: '350px' }}
            echartsProps={{
              option: {
                radar: {
                  indicator: performanceData.map(item => ({
                    name: item.metric,
                    max: 100
                  }))
                },
                series: [
                  {
                    type: 'radar',
                    data: [
                      {
                        value: performanceData.map(item => item.valueA),
                        name: 'Product A',
                        itemStyle: {
                          color: performanceConfig['product-a'].theme.light
                        }
                      },
                      {
                        value: performanceData.map(item => item.valueB),
                        name: 'Product B',
                        itemStyle: {
                          color: performanceConfig['product-b'].theme.light
                        }
                      }
                    ]
                  }
                ]
              }
            }}
          />
        </div>

        {/* ECharts Bar Chart */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Half-Year Comparison (ECharts)</h2>
          <ChartContainer
            config={salesConfig}
            library='echarts'
            style={{ height: '350px' }}
            echartsProps={{
              option: {
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['Sales', 'Revenue', 'Profit']
                },
                xAxis: {
                  type: 'category',
                  data: salesData.slice(0, 6).map(item => item.month)
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: 'Sales',
                    type: 'bar',
                    data: salesData.slice(0, 6).map(item => item.sales),
                    itemStyle: {
                      color: salesConfig.sales.theme.light
                    }
                  },
                  {
                    name: 'Revenue',
                    type: 'bar',
                    data: salesData.slice(0, 6).map(item => item.revenue),
                    itemStyle: {
                      color: salesConfig.revenue.theme.light
                    }
                  },
                  {
                    name: 'Profit',
                    type: 'bar',
                    data: salesData.slice(0, 6).map(item => item.profit),
                    itemStyle: {
                      color: salesConfig.profit.theme.light
                    }
                  }
                ]
              }
            }}
          />
        </div>

        {/* Recharts Bar Chart */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Half-Year Comparison (Recharts)</h2>
          <ChartContainer config={salesConfig} className='max-h-96'>
            <RechartsBarChart data={salesData.slice(0, 6)}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Bar dataKey='sales' fill='var(--color-sales)' />
              <Bar dataKey='revenue' fill='var(--color-revenue)' />
              <Bar dataKey='profit' fill='var(--color-profit)' />
            </RechartsBarChart>
          </ChartContainer>
        </div>

        {/* ECharts Area Chart */}
        <div
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '16px',
            gridColumn: '1 / span 3'
          }}
        >
          <h2>Trend Analysis</h2>
          <ChartContainer
            config={salesConfig}
            library='echarts'
            style={{ height: '400px' }}
            echartsProps={{
              option: {
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['Sales', 'Revenue', 'Profit']
                },
                xAxis: {
                  type: 'category',
                  data: salesData.map(item => item.month)
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: 'Sales',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    areaStyle: {},
                    data: salesData.map(item => item.sales),
                    itemStyle: {
                      color: salesConfig.sales.theme.light
                    }
                  },
                  {
                    name: 'Revenue',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    areaStyle: {},
                    data: salesData.map(item => item.revenue),
                    itemStyle: {
                      color: salesConfig.revenue.theme.light
                    }
                  },
                  {
                    name: 'Profit',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    areaStyle: {},
                    data: salesData.map(item => item.profit),
                    itemStyle: {
                      color: salesConfig.profit.theme.light
                    }
                  }
                ]
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
