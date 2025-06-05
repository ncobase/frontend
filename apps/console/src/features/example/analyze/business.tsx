import { useState, useEffect } from 'react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export const BusinessDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('last_30_days');
  const [theme, setTheme] = useState('light');

  // Color palette consistent
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

  // Chart configuration
  const chartConfig = {
    sales: {
      label: 'Sales',
      color: '#4285F4' // Blue
    },
    revenue: {
      label: 'Revenue',
      color: '#EA4335' // Red
    },
    profit: {
      label: 'Profit',
      color: '#34A853' // Green
    },
    visitors: {
      label: 'Visitors',
      color: '#FBBC05' // Yellow
    },
    users: {
      label: 'Users',
      color: '#9C27B0' // Purple
    },
    conversions: {
      label: 'Conversions',
      color: '#00ACC1' // Cyan
    }
  };

  // Filter options
  const timeFilters = [
    { id: 'last_7_days', label: 'Last 7 Days', days: 7 },
    { id: 'last_30_days', label: 'Last 30 Days', days: 30 },
    { id: 'last_90_days', label: 'Last 90 Days', days: 90 }
  ];

  // Sample data for time series
  const generateTimeSeriesData = days => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Generate realistic-looking data with some trends
      const baseValue = 100 + Math.floor(i * (3 + Math.random() * 2));
      const salesValue = baseValue + Math.floor(Math.random() * 20);
      const revenueValue = salesValue * (7 + Math.floor(Math.random() * 2));
      const profitValue = revenueValue * (0.2 + Math.random() * 0.1);

      data.push({
        date: formattedDate,
        sales: salesValue,
        revenue: revenueValue,
        profit: profitValue
      });
    }

    return data;
  };

  // Sample data for sales by region
  const salesByRegion = [
    { name: 'North America', value: 4200 },
    { name: 'Europe', value: 3800 },
    { name: 'Asia Pacific', value: 5100 },
    { name: 'Latin America', value: 2400 },
    { name: 'Middle East', value: 1800 }
  ];

  // Sample data for sales by channel
  const salesByChannel = [
    { name: 'Direct Sales', sales: 1200 },
    { name: 'Online Store', sales: 2400 },
    { name: 'Distributors', sales: 1800 },
    { name: 'Retail Partners', sales: 1600 },
    { name: 'Other', sales: 1000 }
  ];

  // Sample data for performance metrics
  const performanceData = [
    { metric: 'Visitors', current: 23500, previous: 21000 },
    { metric: 'Conversions', current: 1850, previous: 1720 },
    { metric: 'Avg Order Value', current: 128, previous: 115 },
    { metric: 'Revenue', current: 237000, previous: 198000 }
  ];

  // Generate filtered time series data based on selected filter
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  useEffect(() => {
    const days = timeFilters.find(f => f.id === activeFilter)?.days || 30;
    setTimeSeriesData(generateTimeSeriesData(days));
  }, [activeFilter]);

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Calculate metrics for KPI cards
  const getPerformanceChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };
  // <Page title='Business Analytics Dashboard'>
  // </Page>
  return (
    <div className={`w-full ${theme}`}>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Business Analytics</h1>
        <div className='flex items-center gap-4'>
          <div className='flex bg-slate-100 p-1 rounded-md'>
            {timeFilters.map(filter => (
              <button
                key={filter.id}
                className={`px-3 py-1.5 rounded-md ${
                  activeFilter === filter.id
                    ? 'bg-white shadow-xs text-blue-600'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <button
            className='px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-md'
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {performanceData.map(item => {
          const changePercent = getPerformanceChange(item.current, item.previous);
          const isPositive = parseFloat(changePercent) >= 0;

          return (
            <div
              key={item.metric}
              className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-slate-500 font-medium'>{item.metric}</h3>
                  <p className='text-2xl font-bold mt-1'>
                    {item.metric === 'Avg Order Value' ? '$' : ''}
                    {item.current.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`flex items-center font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                >
                  {isPositive ? '↑' : '↓'} {Math.abs(Number(changePercent))}%
                </div>
              </div>
              <div className='text-slate-400 mt-2'>
                vs previous period: {item.previous.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className='grid lg:grid-cols-2 gap-6 mb-6'>
        {/* Revenue Over Time */}
        <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'>
          <h2 className='text-lg font-semibold mb-2'>Revenue & Profit Trend</h2>
          <div className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke={theme === 'light' ? '#eee' : '#444'} />
                <XAxis
                  dataKey='date'
                  tick={{ fontSize: 12 }}
                  stroke={theme === 'light' ? '#999' : '#777'}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke={theme === 'light' ? '#999' : '#777'}
                  tickFormatter={value => `$${value / 1000}k`}
                />
                <Tooltip
                  formatter={value => ['$' + value.toLocaleString(), '']}
                  contentStyle={{
                    backgroundColor: theme === 'light' ? 'white' : '#333',
                    borderColor: theme === 'light' ? '#ccc' : '#555'
                  }}
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='revenue'
                  name='Revenue'
                  stroke={chartConfig.revenue.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type='monotone'
                  dataKey='profit'
                  name='Profit'
                  stroke={chartConfig.profit.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Region */}
        <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'>
          <h2 className='text-lg font-semibold mb-2'>Sales by Region</h2>
          <div className='h-72 flex items-center'>
            <ResponsiveContainer width='100%' height='80%'>
              <PieChart>
                <Pie
                  data={salesByRegion}
                  cx='50%'
                  cy='50%'
                  labelLine={true}
                  outerRadius={120}
                  fill='#8884d8'
                  dataKey='value'
                  nameKey='name'
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {salesByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => ['$' + value.toLocaleString(), 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Sales by Channel */}
        <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200 col-span-2'>
          <h2 className='text-lg font-semibold mb-2'>Sales by Channel</h2>
          <div className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={salesByChannel} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis tickFormatter={value => `$${value}`} />
                <Tooltip formatter={value => ['$' + value.toLocaleString(), 'Sales']} />
                <Legend />
                <Bar dataKey='sales' name='Sales' fill={chartConfig.sales.color}>
                  {salesByChannel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Notes */}
        <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'>
          <h2 className='text-lg font-semibold mb-4'>Recent Activity</h2>
          <div className='space-y-4'>
            <div className='border-l-4 border-blue-500 pl-3 py-1'>
              <p className='text-slate-600'>Sales team exceeded quarterly targets by 12%</p>
              <span className='text-slate-400'>Today, 9:45 AM</span>
            </div>
            <div className='border-l-4 border-green-500 pl-3 py-1'>
              <p className='text-slate-600'>New product launch generated $125k in first week</p>
              <span className='text-slate-400'>Yesterday, 2:30 PM</span>
            </div>
            <div className='border-l-4 border-yellow-500 pl-3 py-1'>
              <p className='text-slate-600'>APAC region continues strong growth trend</p>
              <span className='text-slate-400'>Apr 14, 10:15 AM</span>
            </div>
            <div className='border-l-4 border-purple-500 pl-3 py-1'>
              <p className='text-slate-600'>
                Marketing campaign results: 24% increase in site traffic
              </p>
              <span className='text-slate-400'>Apr 12, 4:45 PM</span>
            </div>
            <div className='border-l-4 border-red-500 pl-3 py-1'>
              <p className='text-slate-600'>Supply chain disruption resolved, production resumed</p>
              <span className='text-slate-400'>Apr 10, 1:20 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
