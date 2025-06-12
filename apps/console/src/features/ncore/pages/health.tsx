import { useState, useEffect, useMemo } from 'react';

import {
  Button,
  Badge,
  Icons,
  Alert,
  AlertDescription,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TableView,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Area,
  AreaChart
} from 'recharts';

import { HealthScoreCard, MetricCard } from '../components/shared';
import {
  useSystemHealth,
  useDataHealth,
  useExtensionsHealth,
  useCircuitBreakersStatus,
  useExtensionMetrics,
  useAutoRefresh
} from '../hooks';
import { getStatusVariant, getComponentIcon, formatTimestamp, COLORS } from '../utils';

import { Page, Topbar } from '@/components/layout';

export const ExtensionHealthPage = () => {
  const { t } = useTranslation();

  // Auto-refresh control
  const autoRefresh = useAutoRefresh(true);

  // Data hooks
  const {
    data: systemHealth,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth
  } = useSystemHealth(autoRefresh.enabled);

  const { data: dataHealth, refetch: refetchData } = useDataHealth();
  const { data: extensionsHealth, refetch: refetchExtensions } = useExtensionsHealth();
  const { data: circuitBreakers, refetch: refetchCircuit } = useCircuitBreakersStatus();
  const { data: extensionMetrics } = useExtensionMetrics(autoRefresh.enabled);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState('overview');

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshAll = () => {
    refetchHealth();
    refetchData();
    refetchExtensions();
    refetchCircuit();
  };

  // Calculate overall health score
  const healthMetrics = useMemo(() => {
    const totalExtensions = extensionsHealth?.summary?.total || 0;
    const activeExtensions = extensionsHealth?.summary?.active || 0;
    const errorExtensions = extensionsHealth?.summary?.error || 0;

    const healthScore =
      totalExtensions > 0 ? Math.round((activeExtensions / totalExtensions) * 100) : 100;

    const dataServicesHealthy = dataHealth?.services
      ? Object.values(dataHealth.services).filter(service => service.healthy).length
      : 0;
    const totalDataServices = dataHealth?.services ? Object.keys(dataHealth.services).length : 0;

    const circuitBreakersHealthy = circuitBreakers?.closed || 0;
    const totalCircuitBreakers = circuitBreakers?.total || 0;

    return {
      healthScore,
      totalExtensions,
      activeExtensions,
      errorExtensions,
      dataServicesHealthy,
      totalDataServices,
      circuitBreakersHealthy,
      totalCircuitBreakers
    };
  }, [extensionsHealth, dataHealth, circuitBreakers]);

  const getHealthStatus = (score: number) => {
    if (score >= 95)
      return { label: 'Excellent', variant: 'success' as const, color: COLORS.success };
    if (score >= 80) return { label: 'Good', variant: 'success' as const, color: COLORS.success };
    if (score >= 60)
      return { label: 'Degraded', variant: 'warning' as const, color: COLORS.warning };
    return { label: 'Critical', variant: 'danger' as const, color: COLORS.danger };
  };

  // Health trend data (mock for demonstration)
  const healthTrendData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        score: healthMetrics.healthScore + (Math.random() - 0.5) * 10,
        extensions: healthMetrics.activeExtensions + Math.floor((Math.random() - 0.5) * 4),
        services: healthMetrics.dataServicesHealthy
      };
    });
  }, [healthMetrics]);

  // Component health data
  const componentHealthData = useMemo(() => {
    if (!systemHealth?.components) return [];

    return Object.entries(systemHealth.components).map(([name, component]: [string, any]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      status: component.status,
      healthy: component.status === 'healthy' || component.status === 'enabled' ? 1 : 0,
      icon: getComponentIcon(name),
      details: formatComponentDetails(component)
    }));
  }, [systemHealth]);

  // Extension health distribution
  const extensionHealthData = useMemo(() => {
    if (!extensionsHealth?.summary) return [];

    return [
      { name: 'Active', value: healthMetrics.activeExtensions, color: COLORS.success },
      { name: 'Error', value: healthMetrics.errorExtensions, color: COLORS.danger },
      {
        name: 'Other',
        value:
          healthMetrics.totalExtensions -
          healthMetrics.activeExtensions -
          healthMetrics.errorExtensions,
        color: COLORS.warning
      }
    ].filter(item => item.value > 0);
  }, [healthMetrics]);

  // Performance metrics from extensions
  const performanceMetrics = useMemo(() => {
    if (!extensionMetrics?.extensions) return null;

    const extensions = Object.values(extensionMetrics.extensions);
    const avgInitTime =
      extensions.reduce((sum, ext) => sum + ext.init_time_ms, 0) / extensions.length;
    const totalServiceCalls = extensions.reduce((sum, ext) => sum + ext.service_calls, 0);
    const totalServiceErrors = extensions.reduce((sum, ext) => sum + ext.service_errors, 0);
    const errorRate = totalServiceCalls > 0 ? (totalServiceErrors / totalServiceCalls) * 100 : 0;

    return {
      avgInitTime: avgInitTime.toFixed(1),
      totalServiceCalls,
      totalServiceErrors,
      errorRate: errorRate.toFixed(2),
      memoryUsage: extensionMetrics.system?.memory_usage_mb || 0
    };
  }, [extensionMetrics]);

  const healthStatus = getHealthStatus(healthMetrics.healthScore);

  if (healthError) {
    return (
      <Page title={t('extensions.health.title', 'System Health')}>
        <Alert variant='destructive'>
          <Icons name='IconAlertTriangle' className='w-4 h-4' />
          <AlertDescription>
            Failed to load health data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </Page>
    );
  }

  return (
    <Page
      title={t('extensions.health.title', 'System Health')}
      topbar={
        <Topbar
          left={[
            <div className='flex items-center gap-6 px-2 py-1.5 backdrop-blur-sm'>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <div
                    className='w-3 h-3 rounded-full animate-pulse'
                    style={{ backgroundColor: healthStatus.color }}
                  />
                  <div
                    className='absolute -inset-1 rounded-full animate-ping opacity-20'
                    style={{ backgroundColor: healthStatus.color }}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent'>
                    Health Score: {healthMetrics.healthScore}%
                  </span>
                  <Badge variant={healthStatus.variant} className='shadow-sm'>
                    {healthStatus.label}
                  </Badge>
                </div>
              </div>
              <div className='h-5 w-px bg-slate-200' />
              <div className='flex items-center gap-2 text-sm text-slate-600 pr-2'>
                <Icons name='IconClock' className='w-4 h-4 text-slate-400' />
                <span className='font-medium'>Updated: {currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          ]}
          right={[
            <Button
              onClick={autoRefresh.toggle}
              variant={autoRefresh.enabled ? 'primary' : 'outline-slate'}
              icon={autoRefresh.enabled ? 'IconPlayerPause' : 'IconPlayerPlay'}
              size='sm'
              className={`
                transition-all duration-300 ease-in-out
                ${autoRefresh.enabled ? 'shadow-md hover:shadow-lg' : 'hover:bg-slate-50'}
              `}
            >
              {autoRefresh.enabled ? 'Pause' : 'Resume'} Auto-refresh
            </Button>,
            <Button
              onClick={refreshAll}
              variant='outline-slate'
              icon='IconRefresh'
              disabled={healthLoading}
              size='sm'
              className={`
                transition-all duration-300
                ${healthLoading ? 'opacity-50' : 'hover:bg-slate-50 hover:border-slate-300'}
              `}
            >
              Refresh All
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='w-full space-y-6'>
        {/* Health Overview Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-4'>
          <HealthScoreCard
            score={healthMetrics.healthScore}
            total={healthMetrics.totalExtensions}
            active={healthMetrics.activeExtensions}
          />

          <MetricCard
            title='Extensions'
            value={`${healthMetrics.activeExtensions}/${healthMetrics.totalExtensions}`}
            icon='IconPackage'
            color={COLORS.primary}
            subtitle='Active extensions'
            trend={{
              value: 2.5,
              isPositive: true
            }}
          />

          <MetricCard
            title='Data Services'
            value={`${healthMetrics.dataServicesHealthy}/${healthMetrics.totalDataServices}`}
            icon='IconDatabase'
            color={
              healthMetrics.dataServicesHealthy === healthMetrics.totalDataServices
                ? COLORS.success
                : COLORS.warning
            }
            subtitle='Healthy services'
          />

          <MetricCard
            title='Circuit Breakers'
            value={`${healthMetrics.circuitBreakersHealthy}/${healthMetrics.totalCircuitBreakers}`}
            icon='IconShield'
            color={COLORS.purple}
            subtitle='Closed breakers'
          />

          {performanceMetrics && (
            <MetricCard
              title='Error Rate'
              value={performanceMetrics.errorRate}
              unit='%'
              icon='IconAlertTriangle'
              color={parseFloat(performanceMetrics.errorRate) < 1 ? COLORS.success : COLORS.danger}
              subtitle='Service errors'
            />
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-4 gap-2 p-1 mb-4 bg-slate-50 rounded-xl'>
            <TabsTrigger value='overview' className='rounded-lg data-[state=active]:bg-white'>
              Overview
            </TabsTrigger>
            <TabsTrigger value='components' className='rounded-lg data-[state=active]:bg-white'>
              Components
            </TabsTrigger>
            <TabsTrigger value='extensions' className='rounded-lg data-[state=active]:bg-white'>
              Extensions
            </TabsTrigger>
            <TabsTrigger value='trends' className='rounded-lg data-[state=active]:bg-white'>
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            {/* Health Charts */}
            <div className='grid lg:grid-cols-2 gap-6'>
              {/* Extension Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Extension Health Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='h-64'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart>
                        <Pie
                          data={extensionHealthData}
                          cx='50%'
                          cy='50%'
                          outerRadius={80}
                          dataKey='value'
                          label={({ name, value, percent }) =>
                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                          }
                        >
                          {extensionHealthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Component Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Component Health Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='h-64'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart data={componentHealthData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip
                          formatter={value => [value === 1 ? 'Healthy' : 'Unhealthy', 'Status']}
                        />
                        <Bar
                          dataKey='healthy'
                          fill={COLORS.success}
                          radius={[4, 4, 0, 0]}
                          name='Health Status'
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            {performanceMetrics && (
              <div className='grid md:grid-cols-4 gap-4'>
                <Card>
                  <CardContent className='p-4 text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {performanceMetrics.avgInitTime}ms
                    </div>
                    <div className='text-sm text-slate-600'>Avg Init Time</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-4 text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {performanceMetrics.totalServiceCalls}
                    </div>
                    <div className='text-sm text-slate-600'>Service Calls</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-4 text-center'>
                    <div className='text-2xl font-bold text-red-600'>
                      {performanceMetrics.totalServiceErrors}
                    </div>
                    <div className='text-sm text-slate-600'>Service Errors</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-4 text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {performanceMetrics.memoryUsage}MB
                    </div>
                    <div className='text-sm text-slate-600'>Memory Usage</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value='components' className='space-y-6'>
            {/* System Components Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Components</CardTitle>
              </CardHeader>
              <CardContent>
                <TableView
                  pageSize={10}
                  visibleControl
                  header={[
                    {
                      title: 'Component',
                      dataIndex: 'component',
                      parser: (_, record) => (
                        <div className='flex items-center'>
                          <div className='flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3'>
                            <Icons name={record.icon} className='w-4 h-4 text-slate-600' />
                          </div>
                          <div className='font-medium text-slate-900'>{record.name}</div>
                        </div>
                      )
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      parser: (_, record) => (
                        <Badge variant={getStatusVariant(record.status)}>{record.status}</Badge>
                      )
                    },
                    {
                      title: 'Health',
                      dataIndex: 'healthy',
                      parser: value => (
                        <div className='flex items-center gap-2'>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              value ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <span className='text-sm'>{value ? 'Healthy' : 'Unhealthy'}</span>
                        </div>
                      )
                    },
                    {
                      title: 'Details',
                      dataIndex: 'details'
                    },
                    {
                      title: 'Last Check',
                      dataIndex: 'last_check',
                      parser: () => formatTimestamp(systemHealth?.timestamp || '', 'full')
                    }
                  ]}
                  data={componentHealthData}
                />
              </CardContent>
            </Card>

            {/* Data Services Health */}
            {dataHealth?.services && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Services Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <TableView
                    pageSize={5}
                    visibleControl
                    header={[
                      {
                        title: 'Service',
                        dataIndex: 'name',
                        parser: (_, record) => (
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3'>
                              <Icons
                                name={getComponentIcon(record.name)}
                                className='w-4 h-4 text-slate-600'
                              />
                            </div>
                            <div className='font-medium text-slate-900 capitalize'>
                              {record.name}
                            </div>
                          </div>
                        )
                      },
                      {
                        title: 'Status',
                        dataIndex: 'healthy',
                        parser: value => (
                          <Badge variant={value ? 'success' : 'danger'}>
                            {value ? 'Healthy' : 'Unhealthy'}
                          </Badge>
                        )
                      },
                      {
                        title: 'Response Time',
                        dataIndex: 'response_ms',
                        parser: value => (value ? `${value}ms` : '-')
                      },
                      {
                        title: 'Error',
                        dataIndex: 'error',
                        parser: value => value || '-'
                      }
                    ]}
                    data={Object.entries(dataHealth.services).map(
                      ([name, service]: [string, any]) => ({
                        id: name,
                        name,
                        ...service
                      })
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='extensions' className='space-y-6'>
            {/* Extension Health Details */}
            {extensionsHealth?.extensions &&
              Object.keys(extensionsHealth.extensions).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Extension Health Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TableView
                      pageSize={15}
                      visibleControl
                      header={[
                        {
                          title: 'Extension',
                          dataIndex: 'name',
                          parser: (_, record) => (
                            <div className='flex items-center gap-3'>
                              <div className='flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center'>
                                <Icons
                                  name={
                                    record.status === 'active'
                                      ? 'IconCheck'
                                      : record.status === 'error'
                                        ? 'IconX'
                                        : 'IconClock'
                                  }
                                  className={`w-3 h-3 ${
                                    record.status === 'active'
                                      ? 'text-green-600'
                                      : record.status === 'error'
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                                  }`}
                                />
                              </div>
                              <span className='font-medium'>{record.name}</span>
                            </div>
                          )
                        },
                        {
                          title: 'Status',
                          dataIndex: 'status',
                          parser: value => (
                            <Badge variant={getExtensionStatusVariant(value)}>{value}</Badge>
                          )
                        },
                        {
                          title: 'Health Score',
                          dataIndex: 'health_score',
                          parser: (_, record) => {
                            const score = calculateExtensionHealthScore(record.status);
                            return (
                              <div className='flex items-center gap-2'>
                                <div className='w-12 bg-slate-200 rounded-full h-2'>
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      score >= 80
                                        ? 'bg-green-500'
                                        : score >= 60
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                    }`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                                <span className='text-sm font-medium'>{score}%</span>
                              </div>
                            );
                          }
                        },
                        {
                          title: 'Health Check',
                          dataIndex: 'status',
                          parser: value => (
                            <div className='flex items-center gap-2'>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  value === 'active'
                                    ? 'bg-green-500'
                                    : value === 'error'
                                      ? 'bg-red-500'
                                      : 'bg-yellow-500'
                                }`}
                              />
                              <span className='text-sm text-slate-600'>
                                {value === 'active'
                                  ? 'Operational'
                                  : value === 'error'
                                    ? 'Needs attention'
                                    : 'Monitoring'}
                              </span>
                            </div>
                          )
                        },
                        {
                          title: 'Last Seen',
                          dataIndex: 'last_seen',
                          parser: () => (
                            <span className='text-sm text-slate-600'>
                              {formatTimestamp(new Date().toISOString(), 'time')}
                            </span>
                          )
                        }
                      ]}
                      data={Object.entries(extensionsHealth.extensions).map(
                        ([name, status]: [string, any]) => ({
                          id: name,
                          name,
                          status
                        })
                      )}
                    />
                  </CardContent>
                </Card>
              )}

            {/* Circuit Breakers Grid */}
            {circuitBreakers && circuitBreakers.total > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Circuit Breakers Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {Object.entries(circuitBreakers.breakers || {}).map(
                      ([name, breaker]: [string, any]) => (
                        <div
                          key={name}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            breaker.state === 'closed'
                              ? 'border-green-200 bg-green-50 hover:bg-green-100'
                              : breaker.state === 'open'
                                ? 'border-red-200 bg-red-50 hover:bg-red-100'
                                : 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                          }`}
                        >
                          <div className='flex items-center justify-between mb-3'>
                            <h4 className='font-medium text-slate-900'>{name}</h4>
                            <Badge
                              variant={
                                breaker.state === 'closed'
                                  ? 'success'
                                  : breaker.state === 'open'
                                    ? 'danger'
                                    : 'warning'
                              }
                            >
                              {breaker.state}
                            </Badge>
                          </div>
                          <div className='space-y-2 text-sm'>
                            <div className='flex justify-between'>
                              <span className='text-slate-600'>Requests:</span>
                              <span className='font-medium'>{breaker.requests}</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-slate-600'>Successes:</span>
                              <span className='font-medium text-green-600'>
                                {breaker.total_successes}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-slate-600'>Failures:</span>
                              <span className='font-medium text-red-600'>
                                {breaker.total_failures}
                              </span>
                            </div>
                            <div className='flex justify-between items-center'>
                              <span className='text-slate-600'>Success Rate:</span>
                              <div className='flex items-center gap-2'>
                                <div className='w-16 bg-slate-200 rounded-full h-1.5'>
                                  <div
                                    className='h-1.5 rounded-full bg-green-500 transition-all duration-300'
                                    style={{
                                      width: `${
                                        breaker.requests > 0
                                          ? (breaker.total_successes / breaker.requests) * 100
                                          : 0
                                      }%`
                                    }}
                                  />
                                </div>
                                <span className='text-xs font-medium'>
                                  {breaker.requests > 0
                                    ? Math.round((breaker.total_successes / breaker.requests) * 100)
                                    : 0}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='trends' className='space-y-6'>
            {/* Health Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Health Trends (24 Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart data={healthTrendData}>
                      <defs>
                        <linearGradient id='healthGradient' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor={COLORS.success} stopOpacity={0.8} />
                          <stop offset='95%' stopColor={COLORS.success} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='time' />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value, name) => [
                          `${Number(value).toFixed(1)}${name === 'score' ? '%' : ''}`,
                          name === 'score'
                            ? 'Health Score'
                            : name === 'extensions'
                              ? 'Active Extensions'
                              : 'Healthy Services'
                        ]}
                      />
                      <Area
                        type='monotone'
                        dataKey='score'
                        stroke={COLORS.success}
                        fillOpacity={1}
                        fill='url(#healthGradient)'
                        strokeWidth={2}
                      />
                      <Line
                        type='monotone'
                        dataKey='extensions'
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Health Alerts & Recommendations */}
            <div className='grid lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Icons name='IconAlertTriangle' className='w-5 h-5 text-orange-600' />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {healthMetrics.errorExtensions > 0 && (
                      <Alert>
                        <Icons name='IconAlertTriangle' className='w-4 h-4' />
                        <AlertDescription>
                          <strong>Extension Errors:</strong> {healthMetrics.errorExtensions}{' '}
                          extension(s) are in error state. Check logs and restart if necessary.
                        </AlertDescription>
                      </Alert>
                    )}

                    {circuitBreakers?.open > 0 && (
                      <Alert>
                        <Icons name='IconShield' className='w-4 h-4' />
                        <AlertDescription>
                          <strong>Circuit Breakers Open:</strong> {circuitBreakers.open} circuit
                          breaker(s) are open. Check service dependencies.
                        </AlertDescription>
                      </Alert>
                    )}

                    {dataHealth &&
                      Object.values(dataHealth.services).some(
                        (service: any) => !service.healthy
                      ) && (
                        <Alert>
                          <Icons name='IconDatabase' className='w-4 h-4' />
                          <AlertDescription>
                            <strong>Data Service Issues:</strong> Some data services are unhealthy.
                            Check database connectivity.
                          </AlertDescription>
                        </Alert>
                      )}

                    {healthMetrics.errorExtensions === 0 &&
                      circuitBreakers?.open === 0 &&
                      healthMetrics.dataServicesHealthy === healthMetrics.totalDataServices && (
                        <div className='text-center py-8'>
                          <Icons
                            name='IconCheck'
                            className='w-12 h-12 text-green-600 mx-auto mb-3'
                          />
                          <h3 className='text-lg font-medium text-green-800 mb-1'>
                            All Systems Healthy
                          </h3>
                          <p className='text-green-600'>No active alerts or issues detected.</p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Icons name='IconLightbulb' className='w-5 h-5 text-blue-600' />
                    Health Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {healthMetrics.healthScore < 90 && (
                      <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                        <div className='flex items-start gap-2'>
                          <Icons name='IconTrendingUp' className='w-4 h-4 text-blue-600 mt-0.5' />
                          <div className='text-sm'>
                            <div className='font-medium text-blue-800'>Improve Health Score</div>
                            <div className='text-blue-700'>
                              Consider restarting extensions in error state and monitoring resource
                              usage.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {performanceMetrics && parseFloat(performanceMetrics.errorRate) > 5 && (
                      <div className='p-3 bg-orange-50 rounded-lg border border-orange-200'>
                        <div className='flex items-start gap-2'>
                          <Icons
                            name='IconAlertCircle'
                            className='w-4 h-4 text-orange-600 mt-0.5'
                          />
                          <div className='text-sm'>
                            <div className='font-medium text-orange-800'>High Error Rate</div>
                            <div className='text-orange-700'>
                              Service error rate is {performanceMetrics.errorRate}%. Review API
                              endpoints and retry mechanisms.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='p-3 bg-green-50 rounded-lg border border-green-200'>
                      <div className='flex items-start gap-2'>
                        <Icons name='IconShield' className='w-4 h-4 text-green-600 mt-0.5' />
                        <div className='text-sm'>
                          <div className='font-medium text-green-800'>Regular Monitoring</div>
                          <div className='text-green-700'>
                            Enable auto-refresh to stay updated on system health status in
                            real-time.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='p-3 bg-purple-50 rounded-lg border border-purple-200'>
                      <div className='flex items-start gap-2'>
                        <Icons name='IconSettings' className='w-4 h-4 text-purple-600 mt-0.5' />
                        <div className='text-sm'>
                          <div className='font-medium text-purple-800'>Optimization</div>
                          <div className='text-purple-700'>
                            Review extension initialization times and consider lazy loading for
                            better performance.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-4 gap-4'>
              <Button
                variant='outline-slate'
                className='h-auto p-4 flex-col gap-2'
                onClick={refreshAll}
              >
                <Icons name='IconRefresh' className='w-6 h-6' />
                <span>Refresh All</span>
              </Button>

              <Button
                variant='outline-slate'
                className='h-auto p-4 flex-col gap-2'
                onClick={() => autoRefresh.toggle()}
              >
                <Icons
                  name={autoRefresh.enabled ? 'IconPlayerPause' : 'IconPlayerPlay'}
                  className='w-6 h-6'
                />
                <span>{autoRefresh.enabled ? 'Pause' : 'Start'} Auto-refresh</span>
              </Button>

              <Button
                variant='outline-slate'
                className='h-auto p-4 flex-col gap-2'
                onClick={() => window.open('/ncore/metrics', '_blank')}
              >
                <Icons name='IconActivity' className='w-6 h-6' />
                <span>View Metrics</span>
              </Button>

              <Button
                variant='outline-slate'
                className='h-auto p-4 flex-col gap-2'
                onClick={() => window.open('/ncore/collections', '_blank')}
              >
                <Icons name='IconDatabase' className='w-6 h-6' />
                <span>Browse Collections</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

// Helper functions
const getExtensionStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success' as const;
    case 'error':
      return 'danger' as const;
    case 'inactive':
    case 'disabled':
      return 'warning' as const;
    default:
      return 'outline' as const;
  }
};

const calculateExtensionHealthScore = (status: string): number => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 100;
    case 'inactive':
    case 'disabled':
      return 60;
    case 'error':
      return 20;
    default:
      return 50;
  }
};

const formatComponentDetails = (component: any): string => {
  if (typeof component === 'string') return component;

  const details = [];
  if (component.total !== undefined) details.push(`Total: ${component.total}`);
  if (component.healthy !== undefined) details.push(`Healthy: ${component.healthy}`);
  if (component.rate !== undefined) details.push(`Rate: ${component.rate}%`);
  if (component.cache !== undefined) details.push(`Cache: ${component.cache.status}`);

  return details.join(' • ') || 'No details available';
};

export default ExtensionHealthPage;
