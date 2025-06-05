import { useState } from 'react';

import { ChartContainer } from '@ncobase/charts';

export const EChartsExample = () => {
  const [theme, setTheme] = useState('light');

  // Sample data
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

  // Chart configuration
  const chartConfig = {
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

  // Line chart option
  const lineChartOption = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        return params
          .map(param => {
            return `${param.seriesName}: ${param.value}k`;
          })
          .join('<br/>');
      }
    },
    legend: {
      data: ['Sales', 'Revenue', 'Profit'],
      textStyle: {
        color: theme === 'light' ? '#333' : '#ddd'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: salesData.map(item => item.month),
      axisLine: {
        lineStyle: {
          color: theme === 'light' ? '#aaa' : '#555'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Amount (thousands)',
      axisLine: {
        lineStyle: {
          color: theme === 'light' ? '#aaa' : '#555'
        }
      }
    },
    series: [
      {
        name: 'Sales',
        type: 'line',
        smooth: true,
        data: salesData.map(item => item.sales),
        lineStyle: {
          color: 'var(--color-sales)'
        },
        itemStyle: {
          color: 'var(--color-sales)'
        }
      },
      {
        name: 'Revenue',
        type: 'line',
        smooth: true,
        data: salesData.map(item => item.revenue),
        lineStyle: {
          color: 'var(--color-revenue)'
        },
        itemStyle: {
          color: 'var(--color-revenue)'
        }
      },
      {
        name: 'Profit',
        type: 'line',
        smooth: true,
        data: salesData.map(item => item.profit),
        lineStyle: {
          color: 'var(--color-profit)'
        },
        itemStyle: {
          color: 'var(--color-profit)'
        }
      }
    ]
  };

  // Bar chart option
  const barChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow-sm'
      }
    },
    legend: {
      data: ['Sales', 'Revenue', 'Profit'],
      textStyle: {
        color: theme === 'light' ? '#333' : '#ddd'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: salesData.slice(0, 6).map(item => item.month),
      axisLine: {
        lineStyle: {
          color: theme === 'light' ? '#aaa' : '#555'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Amount (thousands)',
      axisLine: {
        lineStyle: {
          color: theme === 'light' ? '#aaa' : '#555'
        }
      }
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: salesData.slice(0, 6).map(item => item.sales),
        itemStyle: {
          color: 'var(--color-sales)'
        }
      },
      {
        name: 'Revenue',
        type: 'bar',
        data: salesData.slice(0, 6).map(item => item.revenue),
        itemStyle: {
          color: 'var(--color-revenue)'
        }
      },
      {
        name: 'Profit',
        type: 'bar',
        data: salesData.slice(0, 6).map(item => item.profit),
        itemStyle: {
          color: 'var(--color-profit)'
        }
      }
    ]
  };

  // Pie chart option
  const pieChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}k ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: theme === 'light' ? '#333' : '#ddd'
      }
    },
    series: [
      {
        name: 'Revenue Sources',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 510, name: 'Online Sales' },
          { value: 334, name: 'Store Sales' },
          { value: 220, name: 'Partner Sales' },
          { value: 147, name: 'Other' }
        ],
        itemStyle: {
          color: function (params) {
            const colorMap = {
              'Online Sales': 'var(--color-sales)',
              'Store Sales': 'var(--color-revenue)',
              'Partner Sales': 'var(--color-profit)',
              Other: theme === 'light' ? '#909399' : '#555'
            };
            return colorMap[params.name];
          }
        }
      }
    ]
  };

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    document.body.classList.toggle('dark');
  };

  // <Page title={t('example.analyze.title')}>
  // </Page>

  return (
    <div className={`w-full h-full ${theme}`} style={{ padding: '20px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <h1>ECharts Examples</h1>
        <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* ECharts Line Chart */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Monthly Performance</h2>
          <div className='h-80'>
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                // @ts-expect-error
                option: lineChartOption,
                settings: { renderer: 'canvas' }
              }}
            />
          </div>
        </div>

        {/* ECharts Bar Chart */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Half-Year Comparison</h2>
          <div className='h-80'>
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                // @ts-expect-error
                option: barChartOption,
                settings: { renderer: 'canvas' }
              }}
            />
          </div>
        </div>

        {/* ECharts Pie Chart */}
        <div
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '16px',
            gridColumn: '1 / span 2'
          }}
        >
          <h2>Revenue Distribution</h2>
          <div className='h-80'>
            <ChartContainer
              config={chartConfig}
              library='echarts'
              echartsProps={{
                // @ts-expect-error
                option: pieChartOption,
                settings: { renderer: 'canvas' }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
