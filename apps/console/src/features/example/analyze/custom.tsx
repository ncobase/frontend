import { forwardRef, useState } from 'react';

import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@ncobase/charts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Define a custom chart component that extends the @ncobase/charts functionality
export const GradientAreaChart = forwardRef(
  (
    { series, options, height, width = '100%', config = {}, categories = [], ...props }: any,
    ref
  ) => {
    return (
      <ChartContainer
        ref={ref}
        config={config}
        library='echarts'
        style={{ height, width }}
        echartsProps={{
          option: {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: series.map(s => s.name)
            },
            xAxis: {
              type: 'category',
              data: categories,
              boundaryGap: false
            },
            yAxis: {
              type: 'value'
            },
            series: series.map((seriesItem, index) => ({
              name: seriesItem.name,
              type: 'line',
              stack: 'Total',
              smooth: true,
              symbol: 'none',
              areaStyle: {
                opacity: 0.8,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color:
                        options?.series?.[index]?.color ||
                        config?.[seriesItem.name]?.theme?.light ||
                        '#1677ff'
                    },
                    {
                      offset: 1,
                      color: 'transparent'
                    }
                  ]
                }
              },
              lineStyle: {
                width: 2,
                color:
                  options?.series?.[index]?.color ||
                  config?.[seriesItem.name]?.theme?.light ||
                  '#1677ff'
              },
              data: seriesItem.data
            }))
          }
        }}
        {...props}
      />
    );
  }
);

GradientAreaChart.displayName = 'GradientAreaChart';

// Define a custom chart component using Recharts
export const CustomRechartsBarChart = forwardRef(
  (
    {
      data,
      config = {},
      height,
      width,
      barSize = 20,
      dataKeys = [],
      xAxisDataKey = 'name',
      stackId,
      ...props
    }: any,
    ref
  ) => {
    return (
      <ChartContainer ref={ref} config={config} height={height} width={width} {...props}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
          {dataKeys.map(key => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              barSize={barSize}
              stackId={stackId}
            />
          ))}
        </BarChart>
      </ChartContainer>
    );
  }
);

CustomRechartsBarChart.displayName = 'CustomRechartsBarChart';

// Example usage component
export const CustomChartExample = () => {
  const [theme, setTheme] = useState('light');

  // Sample data
  const timeSeriesData = [
    { date: '2023-01', value1: 4000, value2: 2400, value3: 1800 },
    { date: '2023-02', value1: 3000, value2: 1398, value3: 900 },
    { date: '2023-03', value1: 2000, value2: 9800, value3: 3800 },
    { date: '2023-04', value1: 2780, value2: 3908, value3: 1800 },
    { date: '2023-05', value1: 1890, value2: 4800, value3: 2300 },
    { date: '2023-06', value1: 2390, value2: 3800, value3: 1500 },
    { date: '2023-07', value1: 3490, value2: 4300, value3: 2200 },
    { date: '2023-08', value1: 4000, value2: 2400, value3: 1800 },
    { date: '2023-09', value1: 3000, value2: 1398, value3: 900 },
    { date: '2023-10', value1: 2000, value2: 9800, value3: 3800 },
    { date: '2023-11', value1: 2780, value2: 3908, value3: 1800 },
    { date: '2023-12', value1: 1890, value2: 4800, value3: 2300 }
  ];

  const barChartData = [
    { category: 'Category A', primary: 400, secondary: 240, tertiary: 180 },
    { category: 'Category B', primary: 300, secondary: 139, secondary2: 200, tertiary: 90 },
    { category: 'Category C', primary: 200, secondary: 980, tertiary: 380 },
    { category: 'Category D', primary: 278, secondary: 390, tertiary: 180 },
    { category: 'Category E', primary: 189, secondary: 480, tertiary: 230 }
  ];

  // Chart configurations
  const areaChartConfig = {
    value1: {
      label: 'Series 1',
      theme: {
        light: '#1677ff',
        dark: '#177ddc'
      }
    },
    value2: {
      label: 'Series 2',
      theme: {
        light: '#52c41a',
        dark: '#49aa19'
      }
    },
    value3: {
      label: 'Series 3',
      theme: {
        light: '#faad14',
        dark: '#d89614'
      }
    }
  };

  const barChartConfig = {
    primary: {
      label: 'Primary',
      theme: {
        light: '#1677ff',
        dark: '#177ddc'
      }
    },
    secondary: {
      label: 'Secondary',
      theme: {
        light: '#52c41a',
        dark: '#49aa19'
      }
    },
    tertiary: {
      label: 'Tertiary',
      theme: {
        light: '#faad14',
        dark: '#d89614'
      }
    }
  };

  // Format data for ECharts
  const areaSeries = [
    {
      name: 'Series 1',
      data: timeSeriesData.map(item => item.value1)
    },
    {
      name: 'Series 2',
      data: timeSeriesData.map(item => item.value2)
    },
    {
      name: 'Series 3',
      data: timeSeriesData.map(item => item.value3)
    }
  ];

  // ECharts options
  const areaOptions = {
    xaxis: {
      categories: timeSeriesData.map(item => item.date),
      labels: {
        style: {
          colors: theme === 'light' ? '#333' : '#ddd'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Values',
        style: {
          color: theme === 'light' ? '#666' : '#aaa'
        }
      },
      labels: {
        style: {
          colors: theme === 'light' ? '#333' : '#ddd'
        }
      }
    },
    tooltip: {
      x: {
        format: 'MM/yyyy'
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
        <h1>Custom Chart Components</h1>
        <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Custom Gradient Area Chart */}
        <div
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '16px',
            gridColumn: '1 / span 2'
          }}
        >
          <h2>Custom Gradient Area Chart</h2>
          <div style={{ height: '350px' }}>
            <GradientAreaChart
              config={areaChartConfig}
              series={areaSeries}
              options={areaOptions}
              categories={timeSeriesData.map(item => item.date)}
            />
          </div>
        </div>

        {/* Custom Recharts Bar Chart - Basic */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Custom Recharts Bar Chart</h2>
          <div style={{ height: '350px' }}>
            <CustomRechartsBarChart
              data={barChartData}
              config={barChartConfig}
              xAxisDataKey='category'
              dataKeys={['primary', 'secondary', 'tertiary']}
              barSize={30}
            />
          </div>
        </div>

        {/* Custom Recharts Bar Chart - Stacked */}
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
          <h2>Custom Stacked Bar Chart</h2>
          <div style={{ height: '350px' }}>
            <CustomRechartsBarChart
              data={barChartData}
              config={barChartConfig}
              xAxisDataKey='category'
              dataKeys={['primary', 'secondary', 'tertiary']}
              stackId='stack1'
              barSize={50}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          border: '1px solid #e8e8e8',
          borderRadius: '8px'
        }}
      >
        <h2>Implementation Details</h2>
        <p>
          The examples above demonstrate how to create custom chart components that leverage the
          @ncobase/charts. Key benefits include:
        </p>
        <ul>
          <li>Abstraction of common configuration patterns</li>
          <li>Consistent theming across different chart types</li>
          <li>Simplified API for complex chart configurations</li>
          <li>Reusable components across your application</li>
        </ul>
      </div>
    </div>
  );
};
