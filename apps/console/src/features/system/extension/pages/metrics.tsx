import { useState, useEffect } from 'react';

import { Button, Badge, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import {
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
  Legend
} from 'recharts';

import { useMetrics, useRefreshCrossServices } from '../service';

import { Page } from '@/components/layout';

export const ExtensionMetricsPage = () => {
  const { t } = useTranslation();
  const { data: metrics, isLoading, error, refetch } = useMetrics();
  const refreshMutation = useRefreshCrossServices();

  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <Page title={t('extensions.metrics.title', 'Extension Metrics')}>
        <div className='flex justify-center items-center h-64'>
          <div className='text-lg text-slate-600'>Loading metrics...</div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title={t('extensions.metrics.title', 'Extension Metrics')}>
        <div className='flex justify-center items-center h-64'>
          <div className='text-lg text-red-600'>Failed to load metrics</div>
        </div>
      </Page>
    );
  }

  // Prepare chart data
  const extensionsByGroup = Object.entries(metrics?.extensions?.by_group || {}).map(
    ([name, value]) => ({
      name,
      value
    })
  );

  const extensionsByType = Object.entries(metrics?.extensions?.by_type || {}).map(
    ([name, value]) => ({
      name,
      value
    })
  );

  const messagingStatus = [
    {
      name: 'RabbitMQ',
      status: metrics?.messaging?.rabbitmq_connected ? 'Connected' : 'Disconnected',
      color: metrics?.messaging?.rabbitmq_connected ? colors.success : colors.secondary
    },
    {
      name: 'Kafka',
      status: metrics?.messaging?.kafka_connected ? 'Connected' : 'Disconnected',
      color: metrics?.messaging?.kafka_connected ? colors.success : colors.secondary
    },
    {
      name: 'Memory Fallback',
      status: metrics?.messaging?.memory_fallback ? 'Active' : 'Inactive',
      color: metrics?.messaging?.memory_fallback ? colors.warning : colors.success
    }
  ];

  return (
    <Page title={t('extensions.metrics.title', 'Extension Metrics')}>
      <div className='w-full'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-slate-800'>Extension System Metrics</h1>
            <p className='text-slate-500'>Last updated: {currentTime.toLocaleString()}</p>
          </div>
          <div className='flex gap-4'>
            <Button
              onClick={() => refetch()}
              variant='outline-slate'
              icon='IconRefresh'
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              onClick={() => refreshMutation.mutate({})}
              variant='primary'
              icon='IconSettings'
              loading={refreshMutation.isPending}
            >
              Refresh Cross Services
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {/* Total Extensions */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-slate-500 font-medium'>Total Extensions</p>
                <p className='text-2xl font-bold mt-1'>{metrics?.extensions?.total || 0}</p>
              </div>
              <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                <Icons name='IconPackage' className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <div className='flex items-center mt-4'>
              <Badge variant={metrics?.extensions?.initialized ? 'success' : 'danger'}>
                {metrics?.extensions?.initialized ? 'Initialized' : 'Not Initialized'}
              </Badge>
            </div>
          </div>

          {/* Circuit Breakers */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-slate-500 font-medium'>Circuit Breakers</p>
                <p className='text-2xl font-bold mt-1'>
                  {metrics?.extensions?.circuit_breakers || 0}
                </p>
              </div>
              <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center'>
                <Icons name='IconShield' className='w-6 h-6 text-orange-600' />
              </div>
            </div>
            <div className='text-slate-500 mt-4'>
              Cross Services: {metrics?.extensions?.cross_services || 0}
            </div>
          </div>

          {/* Event Success Rate */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-slate-500 font-medium'>Event Success Rate</p>
                <p className='text-2xl font-bold mt-1'>
                  {metrics?.events?.total?.success_rate || 0}%
                </p>
              </div>
              <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
                <Icons name='IconActivity' className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <div className='text-slate-500 mt-4'>
              Total Events: {metrics?.events?.total?.published || 0}
            </div>
          </div>

          {/* Cache Hit Rate */}
          <div className='bg-white p-4 rounded-lg shadow-xs border border-slate-200'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-slate-500 font-medium'>Cache Hit Rate</p>
                <p className='text-2xl font-bold mt-1'>{metrics?.service_cache?.hit_rate || 0}%</p>
              </div>
              <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
                <Icons name='IconDatabase' className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <div className='flex items-center mt-4'>
              <Badge variant={metrics?.service_cache?.status === 'active' ? 'success' : 'warning'}>
                {metrics?.service_cache?.status || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className='grid lg:grid-cols-3 gap-6 mb-6'>
          {/* Extensions by Group */}
          <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'>
            <h2 className='text-lg font-semibold mb-4'>Extensions by Group</h2>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={extensionsByGroup}
                    cx='50%'
                    cy='50%'
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey='value'
                  >
                    {extensionsByGroup.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Object.values(colors)[index % Object.values(colors).length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Extensions by Type */}
          <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'>
            <h2 className='text-lg font-semibold mb-4'>Extensions by Type</h2>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={extensionsByType}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='value' fill={colors.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Messaging Status */}
          <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'>
            <h2 className='text-lg font-semibold mb-4'>Messaging Status</h2>
            <div className='space-y-4'>
              {messagingStatus.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-slate-50 rounded-lg'
                >
                  <span className='font-medium'>{item.name}</span>
                  <Badge
                    variant={
                      item.status.includes('Connected') || item.status === 'Active'
                        ? 'success'
                        : 'danger'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
              <div className='mt-4 p-3 bg-slate-50 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Primary Transport</span>
                  <span className='text-slate-600'>{metrics?.messaging?.primary_transport}</span>
                </div>
                <div className='flex items-center justify-between mt-2'>
                  <span className='font-medium'>Overall Available</span>
                  <Badge variant={metrics?.messaging?.overall_available ? 'success' : 'danger'}>
                    {metrics?.messaging?.overall_available ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className='grid lg:grid-cols-2 gap-6 mb-6'>
          {/* Event Queue Metrics */}
          <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'>
            <h2 className='text-lg font-semibold mb-4'>Event Queue Performance</h2>
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-blue-600'>
                  {metrics?.events?.queue?.published || 0}
                </div>
                <div className='text-slate-600'>Published</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-green-600'>
                  {metrics?.events?.queue?.consumed || 0}
                </div>
                <div className='text-slate-600'>Consumed</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-orange-600'>
                  {metrics?.events?.queue?.publish_success_rate || 0}%
                </div>
                <div className='text-slate-600'>Publish Success</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-purple-600'>
                  {metrics?.events?.queue?.consume_success_rate || 0}%
                </div>
                <div className='text-slate-600'>Consume Success</div>
              </div>
            </div>
          </div>

          {/* Service Cache Stats */}
          <div className='bg-white rounded-lg p-4 shadow-xs border border-slate-200'>
            <h2 className='text-lg font-semibold mb-4'>Service Cache Statistics</h2>
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-blue-600'>
                  {metrics?.service_cache?.cache_hits || 0}
                </div>
                <div className='text-slate-600'>Cache Hits</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-red-600'>
                  {metrics?.service_cache?.cache_misses || 0}
                </div>
                <div className='text-slate-600'>Cache Misses</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-green-600'>
                  {metrics?.service_cache?.size || 0}
                </div>
                <div className='text-slate-600'>Cache Size</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-purple-600'>
                  {metrics?.service_cache?.ttl_seconds || 0}s
                </div>
                <div className='text-slate-600'>TTL</div>
              </div>
            </div>
            <div className='mt-4 p-3 bg-slate-50 rounded-lg'>
              <div className='flex items-center justify-between'>
                <span className='font-medium'>Cache Status</span>
                <Badge variant={metrics?.service_cache?.is_expired ? 'warning' : 'success'}>
                  {metrics?.service_cache?.is_expired ? 'Expired' : 'Active'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Table */}
        <div className='bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-200'>
            <h2 className='text-lg font-semibold'>System Status Overview</h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-slate-200'>
              <thead className='bg-slate-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Component
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Metrics
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-slate-200'>
                <tr>
                  <td className='px-6 py-4 whitespace-nowrap font-medium'>Extensions</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge variant={metrics?.extensions?.initialized ? 'success' : 'danger'}>
                      {metrics?.extensions?.initialized ? 'Initialized' : 'Not Initialized'}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    {metrics?.extensions?.total} total, {metrics?.extensions?.circuit_breakers}{' '}
                    breakers
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    {new Date(metrics?.timestamp || '').toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4 whitespace-nowrap font-medium'>Events</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge variant={metrics?.events?.status === 'active' ? 'success' : 'warning'}>
                      {metrics?.events?.status || 'Unknown'}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    {metrics?.events?.total?.success_rate}% success rate
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    {new Date(metrics?.events?.timestamp || '').toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4 whitespace-nowrap font-medium'>Messaging</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge variant={metrics?.messaging?.overall_available ? 'success' : 'danger'}>
                      {metrics?.messaging?.overall_available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    Primary: {metrics?.messaging?.primary_transport}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    {new Date(metrics?.timestamp || '').toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4 whitespace-nowrap font-medium'>Service Cache</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge
                      variant={metrics?.service_cache?.status === 'active' ? 'success' : 'warning'}
                    >
                      {metrics?.service_cache?.status || 'Unknown'}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    {metrics?.service_cache?.hit_rate}% hit rate
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    {new Date(metrics?.service_cache?.last_update || '').toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Page>
  );
};
