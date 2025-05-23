import { useState, useEffect } from 'react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from 'recharts';

import { Page } from '@/components/layout';

export const ECommerceDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  // Color palette
  const colors = {
    primary: '#4285F4',
    secondary: '#EA4335',
    success: '#34A853',
    warning: '#FBBC05',
    purple: '#9C27B0',
    cyan: '#00ACC1',
    orange: '#FF7043',
    lightGreen: '#8BC34A'
  };

  // Generate monthly sales data
  useEffect(() => {
    const generateSalesData = () => {
      const data = [];
      let date = new Date();
      const months = timeRange === 'year' ? 12 : timeRange === 'quarter' ? 3 : 1;
      const periods = timeRange === 'month' ? 30 : timeRange === 'week' ? 7 : months;

      // Go back to start of period
      if (timeRange === 'year' || timeRange === 'quarter') {
        date = new Date(date.getFullYear(), date.getMonth() - months + 1, 1);

        for (let i = 0; i < months; i++) {
          const month = new Date(date);
          month.setMonth(date.getMonth() + i);

          const sales = 50000 + Math.round(Math.random() * 30000);
          const orders = Math.round(sales / 120);
          const returns = Math.round(orders * (0.05 + Math.random() * 0.03));

          data.push({
            date: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            sales,
            orders,
            returns
          });
        }
      } else {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - periods + 1);

        for (let i = 0; i < periods; i++) {
          const day = new Date(date);
          day.setDate(date.getDate() + i);

          const dayOfWeek = day.getDay();
          // Weekend modifier
          const weekendModifier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.2 : 1;

          const sales = 1500 + Math.round(Math.random() * 1000 * weekendModifier);
          const orders = Math.round(sales / 120);
          const returns = Math.round(orders * (0.05 + Math.random() * 0.03));

          data.push({
            date: day.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              weekday: timeRange === 'week' ? 'short' : undefined
            }),
            sales,
            orders,
            returns
          });
        }
      }

      return data;
    };

    // Generate product category data
    const generateCategoryData = () => {
      return [
        { name: 'Electronics', value: 32, color: colors.primary },
        { name: 'Clothing', value: 27, color: colors.secondary },
        { name: 'Home & Kitchen', value: 18, color: colors.success },
        { name: 'Books', value: 12, color: colors.warning },
        { name: 'Beauty', value: 11, color: colors.purple }
      ];
    };

    // Generate device usage data
    const generateDeviceData = () => {
      return [
        { name: 'Desktop', value: 42, color: colors.primary },
        { name: 'Mobile', value: 48, color: colors.secondary },
        { name: 'Tablet', value: 10, color: colors.success }
      ];
    };

    // Generate customer data
    const generateCustomerData = () => {
      return [
        { name: 'New', value: 34, color: colors.primary },
        { name: 'Returning', value: 66, color: colors.success }
      ];
    };

    // Generate conversion data
    const generateConversionData = () => {
      const funnelSteps = ['Visits', 'Product Views', 'Add to Cart', 'Checkout', 'Purchase'];
      const data = [];

      let value = 100;

      for (let i = 0; i < funnelSteps.length; i++) {
        // Each step loses some percentage of users
        const dropoffRate = i === 0 ? 0 : i === 1 ? 0.3 : i === 2 ? 0.4 : i === 3 ? 0.2 : 0.1;

        value = Math.round(value * (1 - dropoffRate));

        data.push({
          name: funnelSteps[i],
          value,
          dropoffRate: i === 0 ? 0 : dropoffRate * 100
        });
      }

      return data;
    };

    // Generate top products data
    const generateProductData = () => {
      const products = [
        'Wireless Earbuds',
        'Smart Watch',
        'Bluetooth Speaker',
        'Laptop Backpack',
        'Phone Case',
        'USB-C Cable',
        'Fitness Tracker',
        'Power Bank',
        'Desk Lamp',
        'Keyboard'
      ];

      return products
        .map((product, index) => ({
          name: product,
          sales: Math.round(10000 - index * 800 + Math.random() * 800),
          units: Math.round(500 - index * 40 + Math.random() * 80)
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
    };

    // Generate hourly sales data
    const generateHourlyData = () => {
      const data = [];

      for (let hour = 0; hour < 24; hour++) {
        // Model a typical day with morning and evening peaks
        let modifier = 1;

        if (hour >= 8 && hour <= 11) {
          // Morning peak
          modifier = 1.5;
        } else if (hour >= 19 && hour <= 22) {
          // Evening peak
          modifier = 1.8;
        } else if (hour >= 1 && hour <= 5) {
          // Night lull
          modifier = 0.3;
        }

        const sales = Math.round((50 + Math.random() * 30) * modifier);
        const visitors = Math.round((220 + Math.random() * 100) * modifier);

        data.push({
          hour: hour.toString().padStart(2, '0') + ':00',
          sales,
          visitors
        });
      }

      return data;
    };

    setSalesData(generateSalesData());
    setCategoryData(generateCategoryData());
    setDeviceData(generateDeviceData());
    setCustomerData(generateCustomerData());
    setConversionData(generateConversionData());
    setProductData(generateProductData());
    setHourlyData(generateHourlyData());
  }, [timeRange]);

  // Calculate key metrics
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const totalReturns = salesData.reduce((sum, item) => sum + item.returns, 0);
  const returnRate = totalOrders > 0 ? (totalReturns / totalOrders) * 100 : 0;

  // Cart abandonment data
  const cartAbandonmentRate = 68;

  return (
    <Page title='E-Commerce Analytics Dashboard'>
      <div className='w-full'>
        <div className='mb-6 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-slate-800'>E-Commerce Analytics</h1>
          <div className='flex space-x-4'>
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className='bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500'
            >
              <option value='week'>Last 7 days</option>
              <option value='month'>Last 30 days</option>
              <option value='quarter'>Last quarter</option>
              <option value='year'>Last year</option>
            </select>
            <button className='bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700 shadow-xs'>
              Download Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {/* Total Sales Card */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-slate-500 font-medium'>Total Sales</p>
                <p className='text-2xl font-bold mt-1'>${totalSales.toLocaleString()}</p>
              </div>
              <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-blue-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
            <div className='flex items-center mt-4'>
              <span className='text-green-500 font-medium flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 10l7-7m0 0l7 7m-7-7v18'
                  />
                </svg>
                8.4%
              </span>
              <span className='text-slate-500 ml-2'>vs. previous period</span>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-slate-500 font-medium'>Total Orders</p>
                <p className='text-2xl font-bold mt-1'>{totalOrders.toLocaleString()}</p>
              </div>
              <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                  />
                </svg>
              </div>
            </div>
            <div className='flex items-center mt-4'>
              <span className='text-green-500 font-medium flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 10l7-7m0 0l7 7m-7-7v18'
                  />
                </svg>
                5.3%
              </span>
              <span className='text-slate-500 ml-2'>vs. previous period</span>
            </div>
          </div>

          {/* Average Order Value Card */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-slate-500 font-medium'>Avg. Order Value</p>
                <p className='text-2xl font-bold mt-1'>${(totalSales / totalOrders).toFixed(2)}</p>
              </div>
              <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-purple-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                  />
                </svg>
              </div>
            </div>
            <div className='flex items-center mt-4'>
              <span className='text-green-500 font-medium flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 10l7-7m0 0l7 7m-7-7v18'
                  />
                </svg>
                3.7%
              </span>
              <span className='text-slate-500 ml-2'>vs. previous period</span>
            </div>
          </div>

          {/* Return Rate Card */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-slate-500 font-medium'>Return Rate</p>
                <p className='text-2xl font-bold mt-1'>{returnRate.toFixed(1)}%</p>
              </div>
              <div className='w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-yellow-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z'
                  />
                </svg>
              </div>
            </div>
            <div className='flex items-center mt-4'>
              <span className='text-red-500 font-medium flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 14l-7 7m0 0l-7-7m7 7V3'
                  />
                </svg>
                0.8%
              </span>
              <span className='text-slate-500 ml-2'>vs. previous period</span>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className='grid lg:grid-cols-3 gap-6 mb-6'>
          {/* Sales Trend Chart */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200 lg:col-span-2'>
            <h2 className='text-lg font-semibold mb-4'>Sales Trend</h2>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id='colorSales' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor={colors.primary} stopOpacity={0.8} />
                      <stop offset='95%' stopColor={colors.primary} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
                  <XAxis
                    dataKey='date'
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value =>
                      `${value > 999 ? `${(value / 1000).toFixed(1)}k` : value}`
                    }
                  />
                  <Tooltip
                    formatter={value => [`${value.toLocaleString()}`, 'Sales']}
                    labelStyle={{ color: '#475569' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='sales'
                    stroke={colors.primary}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill='url(#colorSales)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <h2 className='text-lg font-semibold mb-4'>Sales by Category</h2>
            <div className='h-80 flex items-center justify-center'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx='50%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey='value'
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={value => [`${value}%`, '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Legend
                    layout='vertical'
                    verticalAlign='middle'
                    align='right'
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className='grid lg:grid-cols-3 gap-6 mb-6'>
          {/* Orders & Returns Chart */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200 lg:col-span-2'>
            <h2 className='text-lg font-semibold mb-4'>Orders & Returns</h2>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
                  <XAxis
                    dataKey='date'
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={value => [value.toLocaleString(), '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar name='Orders' dataKey='orders' fill={colors.success} radius={[4, 4, 0, 0]} />
                  <Bar
                    name='Returns'
                    dataKey='returns'
                    fill={colors.warning}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device & Customer Charts */}
          <div className='grid grid-rows-2 gap-6'>
            {/* Device Distribution */}
            <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
              <h2 className='text-lg font-semibold mb-4'>Traffic by Device</h2>
              <div className='h-32'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx='50%'
                      cy='50%'
                      innerRadius={25}
                      outerRadius={45}
                      dataKey='value'
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={value => [`${value}%`, '']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderColor: '#e2e8f0',
                        borderRadius: '0.375rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='grid grid-cols-3 mt-2'>
                {deviceData.map((item, index) => (
                  <div key={index} className='flex flex-col items-center'>
                    <div className='flex items-center'>
                      <div
                        className='w-3 h-3 rounded-full mr-1'
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className='text-slate-600'>{item.name}</span>
                    </div>
                    <span className='font-medium'>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Type */}
            <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
              <h2 className='text-lg font-semibold mb-4'>Customer Type</h2>
              <div className='h-32'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={customerData}
                      cx='50%'
                      cy='50%'
                      innerRadius={25}
                      outerRadius={45}
                      dataKey='value'
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                    >
                      {customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={value => [`${value}%`, '']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderColor: '#e2e8f0',
                        borderRadius: '0.375rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='grid grid-cols-2 mt-2'>
                {customerData.map((item, index) => (
                  <div key={index} className='flex flex-col items-center'>
                    <div className='flex items-center'>
                      <div
                        className='w-3 h-3 rounded-full mr-1'
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className='text-slate-600'>{item.name}</span>
                    </div>
                    <span className='font-medium'>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 3 */}
        <div className='grid lg:grid-cols-2 gap-6 mb-6'>
          {/* Conversion Funnel */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <h2 className='text-lg font-semibold mb-4'>Conversion Funnel</h2>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={conversionData}
                  layout='vertical'
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' horizontal={false} />
                  <XAxis type='number' domain={[0, 100]} />
                  <YAxis
                    dataKey='name'
                    type='category'
                    scale='band'
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={value => [`${value}%`, '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Bar dataKey='value' fill={colors.primary} radius={[0, 4, 4, 0]}>
                    {conversionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors.primary}
                        fillOpacity={1 - index * 0.15}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className='flex justify-center items-center mt-2'>
              <div className='bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Cart Abandonment Rate: {cartAbandonmentRate}%
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>Top Selling Products</h2>
              <button className='text-blue-600 hover:text-blue-800'>View All</button>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='bg-slate-50 text-slate-500 uppercase'>
                  <tr>
                    <th className='py-3 px-4 text-left rounded-tl-lg'>Product</th>
                    <th className='py-3 px-4 text-right'>Units Sold</th>
                    <th className='py-3 px-4 text-right rounded-tr-lg'>Revenue</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-200'>
                  {productData.map((product, index) => (
                    <tr key={index} className='hover:bg-slate-50'>
                      <td className='py-4 px-4'>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 bg-slate-200 rounded-md mr-3 flex items-center justify-center text-slate-500'>
                            #{index + 1}
                          </div>
                          <span className='font-medium text-slate-700'>{product.name}</span>
                        </div>
                      </td>
                      <td className='py-4 px-4 text-right font-medium'>
                        {product.units.toLocaleString()}
                      </td>
                      <td className='py-4 px-4 text-right font-medium'>
                        ${product.sales.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hourly Sales Chart */}
        <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200 mb-6'>
          <h2 className='text-lg font-semibold mb-4'>Hourly Activity</h2>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='hour'
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  yAxisId='left'
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  orientation='left'
                />
                <YAxis
                  yAxisId='right'
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  orientation='right'
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'sales' ? `${value}` : value,
                    name === 'sales' ? 'Sales' : 'Visitors'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.375rem'
                  }}
                />
                <Legend />
                <Line
                  yAxisId='left'
                  type='monotone'
                  dataKey='sales'
                  name='Sales ($)'
                  stroke={colors.primary}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId='right'
                  type='monotone'
                  dataKey='visitors'
                  name='Visitors'
                  stroke={colors.success}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Page>
  );
};
