import { useState } from 'react';

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  AreaChart
} from '@ncobase/charts';
import { rest } from 'lodash';
import { useTranslation } from 'react-i18next';
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

import { Page } from '@/layout';

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

// Format data for different chart libraries
const apexLineSeries = [
  {
    name: 'Sales',
    data: salesData.map(item => item.sales)
  },
  {
    name: 'Revenue',
    data: salesData.map(item => item.revenue)
  },
  {
    name: 'Profit',
    data: salesData.map(item => item.profit)
  }
];

const apexPieSeries = productData.map(item => item.value);

const apexRadarSeries = [
  {
    name: 'Product A',
    data: performanceData.map(item => item.valueA)
  },
  {
    name: 'Product B',
    data: performanceData.map(item => item.valueB)
  }
];

// Dashboard component
export const ChartDashboard = () => {
  const { t } = useTranslation();
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

  // ApexCharts options
  const lineChartOptions = {
    chart: {
      toolbar: { show: false }
    },
    xaxis: {
      categories: salesData.map(item => item.month)
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    yaxis: {
      title: {
        text: 'Amount (thousands)'
      }
    }
  };

  const barChartOptions = {
    chart: {
      toolbar: { show: false },
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%'
      }
    },
    xaxis: {
      categories: salesData.slice(0, 6).map(item => item.month)
    },
    yaxis: {
      title: {
        text: 'Amount (thousands)'
      }
    }
  };

  const pieChartOptions = {
    chart: {
      toolbar: { show: false }
    },
    labels: productData.map(item => item.name),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  const radarChartOptions = {
    chart: {
      toolbar: { show: false }
    },
    xaxis: {
      categories: performanceData.map(item => item.metric)
    },
    yaxis: {
      show: false
    }
  };

  const areaChartOptions = {
    chart: {
      toolbar: { show: false }
    },
    xaxis: {
      categories: salesData.map(item => item.month)
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    }
  };

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    document.body.classList.toggle('dark');
  };

  return (
    <Page title={t('example.analyze.title')} {...rest}>
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
          {/* ApexCharts Line Chart */}
          <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
            <h2>Monthly Performance (ApexCharts)</h2>
            <div>
              <ChartContainer config={salesConfig} library='apexcharts'>
                {/* @ts-expect-error */}
                <LineChart series={apexLineSeries} options={lineChartOptions} />
              </ChartContainer>
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

          {/* ApexCharts Pie Chart */}
          <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
            <h2>Product Distribution</h2>
            <ChartContainer config={productConfig} library='apexcharts'>
              <PieChart series={apexPieSeries} options={pieChartOptions} />
            </ChartContainer>
          </div>

          {/* ApexCharts Radar Chart */}
          <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
            <h2>Performance Comparison</h2>
            <ChartContainer config={performanceConfig} library='apexcharts'>
              <RadarChart series={apexRadarSeries} options={radarChartOptions} />
            </ChartContainer>
          </div>

          {/* ApexCharts Bar Chart */}
          <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
            <h2>Half-Year Comparison (ApexCharts)</h2>
            <ChartContainer config={salesConfig} library='apexcharts'>
              <BarChart
                series={apexLineSeries.map(series => ({
                  ...series,
                  data: series.data.slice(0, 6)
                }))}
                options={barChartOptions}
              />
            </ChartContainer>
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

          {/* ApexCharts Area Chart */}
          <div
            style={{
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              padding: '16px',
              gridColumn: '1 / span 3'
            }}
          >
            <h2>Trend Analysis</h2>
            <div>
              <ChartContainer config={salesConfig} library='apexcharts'>
                {/* @ts-expect-error */}
                <AreaChart series={apexLineSeries} options={areaChartOptions} />
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
