import { useState, useMemo } from 'react';
import React from 'react';

import {
  Button,
  Icons,
  Alert,
  AlertDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  TableView,
  Modal,
  Tooltip
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend
} from 'recharts';

import { MetricCard, EmptyState } from '../components/shared';
import type { ExtensionMetrics } from '../extension.d';
import {
  useExtensionMetrics,
  useSystemMetrics,
  useComprehensiveMetrics,
  useDataMetrics,
  useEventsMetrics,
  useServiceDiscoveryMetrics,
  useHistoricalMetrics,
  useLatestMetrics,
  useRefreshCrossServices,
  useAutoRefresh
} from '../hooks';
import { formatValue, formatTimestamp, getTimeRangeOptions, getTimeRange, COLORS } from '../utils';

import { Page, Topbar } from '@/components/layout';

export const ExtensionMetricsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Get initial state from navigation
  const initialExtension = location.state?.extensionName;

  // Auto-refresh control
  const autoRefresh = useAutoRefresh(true);

  // Data hooks with proper types
  const {
    data: extensionMetrics,
    isLoading: extensionLoading,
    error
  } = useExtensionMetrics(autoRefresh.enabled);
  const { data: systemMetrics } = useSystemMetrics(autoRefresh.enabled);
  const { data: comprehensiveMetrics } = useComprehensiveMetrics(autoRefresh.enabled);
  const { data: dataMetrics } = useDataMetrics(autoRefresh.enabled);
  const { data: eventsMetrics } = useEventsMetrics(autoRefresh.enabled);
  const { data: serviceDiscoveryMetrics } = useServiceDiscoveryMetrics(autoRefresh.enabled);
  const refreshMutation = useRefreshCrossServices();

  // Local state
  const [selectedExtension, setSelectedExtension] = useState(initialExtension || 'all');
  const [activeTab, setActiveTab] = useState(initialExtension ? 'extensions' : 'comprehensive');
  const [refreshInterval, setRefreshInterval] = useState('5s');
  const [timeRange, setTimeRange] = useState('1h');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState('all');

  // Historical metrics and latest snapshots
  const historicalMutation = useHistoricalMetrics();
  const { data: latestMetrics } = useLatestMetrics(selectedExtension, 50, !!selectedExtension);

  // Update current time
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get extension list for dropdown
  const extensionList = useMemo(() => {
    if (!extensionMetrics?.extensions) return [];
    return Object.keys(extensionMetrics.extensions);
  }, [extensionMetrics]);

  // Calculate performance score helper
  const calculatePerformanceScore = (metrics: ExtensionMetrics): number => {
    let score = 100;
    if (metrics.init_time_ms > 100) {
      score -= Math.min(20, (metrics.init_time_ms / 100) * 10);
    }
    if (metrics.service_calls > 0) {
      const errorRate = metrics.service_errors / metrics.service_calls;
      score -= errorRate * 30;
    }
    score -= metrics.circuit_breaker_trips * 10;
    return Math.max(0, Math.round(score));
  };

  // Prepare comprehensive chart data
  const comprehensiveChartData = useMemo(() => {
    if (!comprehensiveMetrics?.details?.extensions?.extensions) return { performanceData: [] };

    const extensions = comprehensiveMetrics.details.extensions.extensions;
    const performanceData = Object.entries(extensions).map(([name, metrics]: [string, any]) => ({
      name,
      initTime: metrics.init_time_ms || 0,
      serviceCalls: metrics.service_calls || 0,
      serviceErrors: metrics.service_errors || 0,
      eventsPublished: metrics.events_published || 0,
      eventsReceived: metrics.events_received || 0,
      performance: calculatePerformanceScore(metrics)
    }));

    return { performanceData };
  }, [comprehensiveMetrics]);

  // Data layer summary
  const dataLayerSummary = useMemo(() => {
    if (!dataMetrics || dataMetrics.status === 'metrics_unavailable') {
      return {
        status: 'unavailable',
        message: 'Data metrics are currently unavailable',
        timestamp: dataMetrics?.timestamp || new Date().toISOString()
      };
    }
    return {
      status: 'available',
      data: dataMetrics,
      timestamp: dataMetrics.timestamp
    };
  }, [dataMetrics]);

  // Events summary
  const eventsSummary = useMemo(() => {
    if (!eventsMetrics) return null;

    return {
      dispatcher: eventsMetrics.dispatcher,
      extensionEvents: eventsMetrics.extensions,
      status: eventsMetrics.status,
      totalPublished: Object.values(eventsMetrics.extensions).reduce(
        (sum, ext) => sum + ext.published,
        0
      ),
      totalReceived: Object.values(eventsMetrics.extensions).reduce(
        (sum, ext) => sum + ext.received,
        0
      )
    };
  }, [eventsMetrics]);

  // Service discovery summary
  const serviceDiscoverySummary = useMemo(() => {
    if (!serviceDiscoveryMetrics) return null;

    return {
      hitRate: serviceDiscoveryMetrics.hit_rate || 0,
      cacheHits: serviceDiscoveryMetrics.cache_hits || 0,
      cacheMisses: serviceDiscoveryMetrics.cache_misses || 0,
      size: serviceDiscoveryMetrics.size || 0,
      status: serviceDiscoveryMetrics.status || 'unknown',
      isExpired: serviceDiscoveryMetrics.is_expired || false,
      registrations: serviceDiscoveryMetrics.registrations || 0,
      lookups: serviceDiscoveryMetrics.lookups || 0
    };
  }, [serviceDiscoveryMetrics]);

  // Event handlers
  const handleQueryHistorical = () => {
    if (!selectedExtension) return;

    const { start, end } = getTimeRange(timeRange);
    historicalMutation.mutate({
      extension: selectedExtension,
      start: start.toISOString(),
      end: end.toISOString(),
      aggregation: 'avg',
      interval: '5m'
    });
  };

  const handleViewSnapshot = (extensionName: string) => {
    setSelectedExtension(extensionName);
    setShowSnapshotModal(true);
  };

  const handleRefresh = () => {
    autoRefresh.setEnabled(true);
  };

  if (error) {
    return (
      <Page title={t('extensions.metrics.title', 'Extension Metrics')}>
        <Alert variant='destructive'>
          <Icons name='IconAlertTriangle' className='w-4 h-4' />
          <AlertDescription>
            Failed to load metrics. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </Page>
    );
  }

  return (
    <Page
      title={t('extensions.metrics.title', 'Extension Metrics')}
      topbar={
        <Topbar
          title='Extension Metrics'
          left={[
            <div className='text-muted-foreground text-xs flex space-x-4'>
              <span>Last updated: {currentTime.toLocaleString()}</span>
              {autoRefresh.enabled && (
                <div className='flex items-center gap-1'>
                  <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                  <span>Live updates every {refreshInterval}</span>
                </div>
              )}
            </div>
          ]}
          right={[
            <Select value={refreshInterval} onValueChange={setRefreshInterval}>
              <SelectTrigger className='w-20 py-1.5'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1s'>1s</SelectItem>
                <SelectItem value='5s'>5s</SelectItem>
                <SelectItem value='10s'>10s</SelectItem>
                <SelectItem value='30s'>30s</SelectItem>
              </SelectContent>
            </Select>,
            <Button
              onClick={autoRefresh.toggle}
              variant={autoRefresh.enabled ? 'primary' : 'outline-slate'}
              icon={autoRefresh.enabled ? 'IconPlayerPause' : 'IconPlayerPlay'}
              size='sm'
            >
              {autoRefresh.enabled ? 'Pause' : 'Resume'}
            </Button>,
            <Button
              onClick={handleRefresh}
              variant='outline-slate'
              icon='IconRefresh'
              disabled={extensionLoading}
              size='sm'
            >
              Refresh
            </Button>,
            <Button
              onClick={() => refreshMutation.mutate({})}
              variant='primary'
              icon='IconSettings'
              loading={refreshMutation.isPending}
              size='sm'
            >
              Refresh Services
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='w-full space-y-6'>
        {/* Quick Stats Overview */}
        <div className='grid md:grid-cols-5 gap-4'>
          <MetricCard
            title='System Memory'
            value={systemMetrics?.layers?.extension?.system?.memory_usage_mb || 0}
            unit='MB'
            icon='IconCpu'
            color={COLORS.primary}
            subtitle={`${systemMetrics?.layers?.extension?.system?.goroutine_count || 0} goroutines`}
          />

          <MetricCard
            title='Cache Hit Rate'
            value={serviceDiscoverySummary?.hitRate || 0}
            unit='%'
            icon='IconDatabase'
            color={COLORS.success}
            subtitle={`${serviceDiscoverySummary?.cacheHits || 0} hits`}
          />

          <MetricCard
            title='Total Extensions'
            value={Object.keys(extensionMetrics?.extensions || {}).length}
            icon='IconPackage'
            color={COLORS.warning}
            subtitle='Active in system'
          />

          <MetricCard
            title='Events'
            value={eventsSummary?.totalPublished || 0}
            icon='IconBell'
            color={COLORS.purple}
            subtitle='Total published'
            onClick={() => setShowEventsModal(true)}
          />

          <MetricCard
            title='Data Layer'
            value={dataLayerSummary.status === 'available' ? '✓' : '⚠'}
            icon='IconServer'
            color={dataLayerSummary.status === 'available' ? COLORS.success : COLORS.danger}
            subtitle={dataLayerSummary.status}
            onClick={() => setShowDataModal(true)}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='flex w-full p-1 bg-slate-100 rounded-lg mb-4'>
            <TabsTrigger
              value='comprehensive'
              className='flex-1 px-4 py-2 text-sm font-medium text-slate-600 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:text-primary-600'
            >
              Comprehensive
            </TabsTrigger>
            <TabsTrigger
              value='extensions'
              className='flex-1 px-4 py-2 text-sm font-medium text-slate-600 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:text-primary-600'
            >
              Extensions
            </TabsTrigger>
            <TabsTrigger
              value='system'
              className='flex-1 px-4 py-2 text-sm font-medium text-slate-600 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:text-primary-600'
            >
              System
            </TabsTrigger>
            <TabsTrigger
              value='events'
              className='flex-1 px-4 py-2 text-sm font-medium text-slate-600 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:text-primary-600'
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value='cache'
              className='flex-1 px-4 py-2 text-sm font-medium text-slate-600 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:text-primary-600'
            >
              Cache
            </TabsTrigger>
          </TabsList>

          <TabsContent value='comprehensive' className='space-y-6'>
            {/* Comprehensive Overview */}
            {comprehensiveMetrics ? (
              <>
                {/* Summary Cards */}
                <div className='grid md:grid-cols-3 gap-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>Active Extensions:</span>
                          <Badge variant='success'>
                            {comprehensiveMetrics.summary?.active_extensions || 0}
                          </Badge>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>Total Extensions:</span>
                          <span className='font-medium'>
                            {comprehensiveMetrics.summary?.total_extensions || 0}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>Data Layer:</span>
                          <Badge
                            variant={
                              comprehensiveMetrics.summary?.data_layer_status === 'healthy'
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {comprehensiveMetrics.summary?.data_layer_status || 'unknown'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Messaging Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>Available:</span>
                          <Badge
                            variant={
                              comprehensiveMetrics.summary?.messaging_status?.available
                                ? 'success'
                                : 'danger'
                            }
                          >
                            {comprehensiveMetrics.summary?.messaging_status?.available
                              ? 'Yes'
                              : 'No'}
                          </Badge>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>Kafka:</span>
                          <Badge
                            variant={
                              comprehensiveMetrics.summary?.messaging_status?.services?.kafka
                                ? 'success'
                                : 'outline'
                            }
                          >
                            {comprehensiveMetrics.summary?.messaging_status?.services?.kafka
                              ? 'Active'
                              : 'Inactive'}
                          </Badge>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>RabbitMQ:</span>
                          <Badge
                            variant={
                              comprehensiveMetrics.summary?.messaging_status?.services?.rabbitmq
                                ? 'success'
                                : 'outline'
                            }
                          >
                            {comprehensiveMetrics.summary?.messaging_status?.services?.rabbitmq
                              ? 'Active'
                              : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Service Discovery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>Hit Rate:</span>
                          <span className='font-medium'>
                            {serviceDiscoverySummary?.hitRate.toFixed(1) || 0}%
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>Cache Size:</span>
                          <span className='font-medium'>{serviceDiscoverySummary?.size || 0}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-slate-600'>Status:</span>
                          <Badge
                            variant={
                              serviceDiscoverySummary?.status === 'active' ? 'success' : 'warning'
                            }
                          >
                            {serviceDiscoverySummary?.status || 'unknown'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Chart */}
                {comprehensiveChartData.performanceData?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Extension Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='h-80'>
                        <ResponsiveContainer width='100%' height='100%'>
                          <BarChart data={comprehensiveChartData.performanceData.slice(0, 10)}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='name' />
                            <YAxis />
                            <ChartTooltip />
                            <Legend />
                            <Bar
                              dataKey='performance'
                              fill={COLORS.primary}
                              name='Performance Score'
                            />
                            <Bar
                              dataKey='serviceCalls'
                              fill={COLORS.success}
                              name='Service Calls'
                            />
                            <Bar dataKey='initTime' fill={COLORS.warning} name='Init Time (ms)' />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <EmptyState
                icon='IconActivity'
                title='Loading Comprehensive Metrics'
                description='Fetching comprehensive system metrics...'
              />
            )}
          </TabsContent>

          <TabsContent value='extensions' className='space-y-6'>
            {/* Extension Selection */}
            <div className='flex items-center gap-4'>
              <Select value={selectedExtension} onValueChange={setSelectedExtension}>
                <SelectTrigger className='w-48 py-1.5'>
                  <SelectValue placeholder='Select Extension' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Extensions</SelectItem>
                  {extensionList.map(name => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-32 py-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getTimeRangeOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleQueryHistorical}
                variant='primary'
                disabled={!selectedExtension || selectedExtension === 'all'}
                loading={historicalMutation.isPending}
              >
                Query Historical
              </Button>
            </div>

            {/* Extension Metrics Table */}
            {extensionMetrics?.extensions && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    Extension Metrics
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='outline-slate'
                        onClick={() => setShowSnapshotModal(true)}
                        disabled={!selectedExtension || selectedExtension === 'all'}
                      >
                        View Snapshots
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TableView
                    pageSize={10}
                    visibleControl
                    header={[
                      {
                        title: 'Extension',
                        dataIndex: 'name',
                        parser: (_, record) => (
                          <div className='flex items-center gap-2'>
                            <span className='font-medium'>{record.name}</span>
                            <Tooltip content='View latest snapshots'>
                              <Button
                                size='sm'
                                variant='outline-slate'
                                onClick={() => handleViewSnapshot(record.name)}
                                className='p-1'
                              >
                                <Icons name='IconEye' className='w-3 h-3' />
                              </Button>
                            </Tooltip>
                          </div>
                        )
                      },
                      {
                        title: 'Status',
                        dataIndex: 'status',
                        parser: value => (
                          <Badge variant={value === 'active' ? 'success' : 'warning'}>
                            {value}
                          </Badge>
                        )
                      },
                      {
                        title: 'Service Calls',
                        dataIndex: 'service_calls',
                        parser: value => formatValue(value)
                      },
                      {
                        title: 'Service Errors',
                        dataIndex: 'service_errors',
                        parser: value =>
                          value > 0 ? (
                            <span className='text-red-600 font-medium'>{value}</span>
                          ) : (
                            value
                          )
                      },
                      {
                        title: 'Events Published',
                        dataIndex: 'events_published',
                        parser: value => formatValue(value)
                      },
                      {
                        title: 'Events Received',
                        dataIndex: 'events_received',
                        parser: value => formatValue(value)
                      },
                      {
                        title: 'Init Time (ms)',
                        dataIndex: 'init_time_ms',
                        parser: value => `${value}ms`
                      },
                      {
                        title: 'Performance',
                        dataIndex: 'performance',
                        parser: (_, record) => {
                          const score = calculatePerformanceScore(record);
                          return (
                            <Badge
                              variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'}
                            >
                              {score}
                            </Badge>
                          );
                        }
                      }
                    ]}
                    data={Object.entries(extensionMetrics.extensions).map(([name, metrics]) => ({
                      id: name,
                      name,
                      status: metrics.status,
                      service_calls: metrics.service_calls,
                      service_errors: metrics.service_errors,
                      events_published: metrics.events_published,
                      events_received: metrics.events_received,
                      init_time_ms: metrics.init_time_ms,
                      circuit_breaker_trips: metrics.circuit_breaker_trips
                    }))}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='system' className='space-y-6'>
            {/* System Performance */}
            {systemMetrics?.layers?.extension?.system && (
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid md:grid-cols-3 gap-4'>
                    <div className='text-center p-4 bg-slate-50 rounded-lg'>
                      <div className='text-2xl font-bold text-blue-600'>
                        {Math.round(systemMetrics.layers.extension.system.memory_usage_mb)}MB
                      </div>
                      <div className='text-slate-600'>Memory Usage</div>
                      <div className='w-full bg-slate-200 rounded-full h-2 mt-2'>
                        <div
                          className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                          style={{
                            width: `${Math.min((systemMetrics.layers.extension.system.memory_usage_mb / 2048) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className='text-center p-4 bg-slate-50 rounded-lg'>
                      <div className='text-2xl font-bold text-green-600'>
                        {systemMetrics.layers.extension.system.goroutine_count}
                      </div>
                      <div className='text-slate-600'>Goroutines</div>
                      <div className='text-xs text-slate-500 mt-2'>Concurrent processes</div>
                    </div>
                    <div className='text-center p-4 bg-slate-50 rounded-lg'>
                      <div className='text-2xl font-bold text-orange-600'>
                        {systemMetrics.layers.extension.system.gc_cycles}
                      </div>
                      <div className='text-slate-600'>GC Cycles</div>
                      <div className='text-xs text-slate-500 mt-2'>Garbage collection runs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Storage Information */}
            {systemMetrics?.layers?.extension?.storage && (
              <Card>
                <CardHeader>
                  <CardTitle>Storage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid md:grid-cols-4 gap-4'>
                    <div className='text-center p-4 bg-slate-50 rounded-lg'>
                      <div className='text-xl font-bold text-blue-600'>
                        {systemMetrics.layers.extension.storage.type}
                      </div>
                      <div className='text-slate-600'>Storage Type</div>
                    </div>
                    <div className='text-center p-4 bg-slate-50 rounded-lg'>
                      <div className='text-xl font-bold text-green-600'>
                        {systemMetrics.layers.extension.storage.keys}
                      </div>
                      <div className='text-slate-600'>Total Keys</div>
                    </div>
                    <div className='text-center p-4 bg-slate-50 rounded-lg'>
                      <div className='text-xl font-bold text-orange-600'>
                        {formatValue(systemMetrics.layers.extension.storage.memory_mb, 'MB')}
                      </div>
                      <div className='text-slate-600'>Memory Usage</div>
                    </div>
                    <div className='text-center p-4 bg-slate-50 rounded-lg'>
                      <div className='text-xl font-bold text-purple-600'>
                        {systemMetrics.layers.extension.storage.retention}
                      </div>
                      <div className='text-slate-600'>Retention</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='events' className='space-y-6'>
            {/* Events Metrics */}
            {eventsSummary ? (
              <>
                {/* Event Dispatcher Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                      Event Dispatcher
                      <Button
                        size='sm'
                        variant='outline-slate'
                        onClick={() => setShowEventsModal(true)}
                        icon='IconEye'
                      >
                        View Details
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid md:grid-cols-5 gap-4'>
                      <div className='text-center p-4 bg-green-50 rounded-lg'>
                        <div className='text-2xl font-bold text-green-600'>
                          {eventsSummary.dispatcher.published || 0}
                        </div>
                        <div className='text-slate-600'>Published</div>
                      </div>
                      <div className='text-center p-4 bg-green-50 rounded-lg'>
                        <div className='text-2xl font-bold text-green-600'>
                          {eventsSummary.dispatcher.delivered || 0}
                        </div>
                        <div className='text-slate-600'>Delivered</div>
                      </div>
                      <div className='text-center p-4 bg-red-50 rounded-lg'>
                        <div className='text-2xl font-bold text-red-600'>
                          {eventsSummary.dispatcher.failed || 0}
                        </div>
                        <div className='text-slate-600'>Failed</div>
                      </div>
                      <div className='text-center p-4 bg-blue-50 rounded-lg'>
                        <div className='text-2xl font-bold text-blue-600'>
                          {eventsSummary.dispatcher.total_subscribers || 0}
                        </div>
                        <div className='text-slate-600'>Subscribers</div>
                      </div>
                      <div className='text-center p-4 bg-yellow-50 rounded-lg'>
                        <div className='text-2xl font-bold text-yellow-600'>
                          {Math.round(eventsSummary.dispatcher.success_rate || 0)}%
                        </div>
                        <div className='text-slate-600'>Success Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Extension Events Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Extension Event Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                          data={Object.entries(eventsSummary.extensionEvents)
                            .map(([name, data]) => ({
                              name,
                              published: data.published,
                              received: data.received
                            }))
                            .slice(0, 10)}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='name' />
                          <YAxis />
                          <ChartTooltip />
                          <Legend />
                          <Bar dataKey='published' fill={COLORS.primary} name='Published' />
                          <Bar dataKey='received' fill={COLORS.success} name='Received' />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <EmptyState
                icon='IconBell'
                title='No Event Data'
                description='Event metrics are not available.'
              />
            )}
          </TabsContent>

          <TabsContent value='cache' className='space-y-6'>
            {/* Service Discovery Cache */}
            {serviceDiscoverySummary ? (
              <>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <MetricCard
                    title='Hit Rate'
                    value={serviceDiscoverySummary.hitRate}
                    unit='%'
                    icon='IconTarget'
                    color={COLORS.success}
                    subtitle='Cache efficiency'
                  />
                  <MetricCard
                    title='Cache Hits'
                    value={serviceDiscoverySummary.cacheHits}
                    icon='IconCheck'
                    color={COLORS.primary}
                    subtitle='Successful lookups'
                  />
                  <MetricCard
                    title='Cache Misses'
                    value={serviceDiscoverySummary.cacheMisses}
                    icon='IconX'
                    color={COLORS.danger}
                    subtitle='Failed lookups'
                  />
                  <MetricCard
                    title='Cache Size'
                    value={serviceDiscoverySummary.size}
                    icon='IconDatabase'
                    color={COLORS.warning}
                    subtitle='Total entries'
                  />
                </div>

                {/* Cache Status Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cache Status Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div className='space-y-4'>
                        <div className='flex justify-between items-center'>
                          <span className='text-slate-600'>Status</span>
                          <Badge
                            variant={
                              serviceDiscoverySummary.status === 'active' ? 'success' : 'warning'
                            }
                          >
                            {serviceDiscoverySummary.status}
                          </Badge>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-slate-600'>Total Registrations</span>
                          <span className='font-medium'>
                            {serviceDiscoverySummary.registrations}
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-slate-600'>Total Lookups</span>
                          <span className='font-medium'>{serviceDiscoverySummary.lookups}</span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-slate-600'>Expired</span>
                          <Badge variant={serviceDiscoverySummary.isExpired ? 'danger' : 'success'}>
                            {serviceDiscoverySummary.isExpired ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className='font-medium text-slate-600 mb-3'>Hit Rate Visualization</h4>
                        <div className='w-full bg-slate-200 rounded-full h-4'>
                          <div
                            className='bg-green-500 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs text-white font-medium'
                            style={{ width: `${serviceDiscoverySummary.hitRate}%` }}
                          >
                            {serviceDiscoverySummary.hitRate.toFixed(1)}%
                          </div>
                        </div>
                        <div className='mt-2 text-sm text-slate-600'>
                          {serviceDiscoverySummary.hitRate >= 80
                            ? 'Excellent cache performance'
                            : serviceDiscoverySummary.hitRate >= 60
                              ? 'Good cache performance'
                              : 'Cache performance needs improvement'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <EmptyState
                icon='IconDatabase'
                title='No Cache Data'
                description='Cache metrics are not available.'
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {/* Snapshot Modal */}
        <Modal
          isOpen={showSnapshotModal}
          onChange={setShowSnapshotModal}
          title={`Latest Snapshots: ${selectedExtension}`}
          size='lg'
          footer={
            <div className='flex gap-2'>
              <Button variant='outline-slate' onClick={() => setShowSnapshotModal(false)}>
                Close
              </Button>
            </div>
          }
        >
          <SnapshotModalContent
            latestMetrics={latestMetrics}
            selectedMetricType={selectedMetricType}
            setSelectedMetricType={setSelectedMetricType}
          />
        </Modal>

        {/* Data Layer Modal */}
        <Modal
          isOpen={showDataModal}
          onChange={setShowDataModal}
          title='Data Layer Details'
          size='lg'
          footer={
            <div className='flex gap-2'>
              <Button variant='outline-slate' onClick={() => setShowDataModal(false)}>
                Close
              </Button>
            </div>
          }
        >
          <DataLayerModalContent dataLayerSummary={dataLayerSummary} />
        </Modal>

        {/* Events Modal */}
        <Modal
          isOpen={showEventsModal}
          onChange={setShowEventsModal}
          title='Events Details'
          size='lg'
          footer={
            <div className='flex gap-2'>
              <Button variant='outline-slate' onClick={() => setShowEventsModal(false)}>
                Close
              </Button>
            </div>
          }
        >
          <EventsModalContent eventsSummary={eventsSummary} />
        </Modal>
      </div>
    </Page>
  );
};

// Modal Content Components
const SnapshotModalContent = ({
  latestMetrics,
  selectedMetricType,
  setSelectedMetricType
}: any) => (
  <div className='space-y-4'>
    {/* Metric Type Filter */}
    <div className='flex items-center gap-4'>
      <span className='text-sm text-slate-600'>Filter by metric type:</span>
      <Select value={selectedMetricType} onValueChange={setSelectedMetricType}>
        <SelectTrigger className='w-48'>
          <SelectValue placeholder='All metric types' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Types</SelectItem>
          <SelectItem value='init_time'>Init Time</SelectItem>
          <SelectItem value='service_call'>Service Call</SelectItem>
          <SelectItem value='event_published'>Event Published</SelectItem>
          <SelectItem value='event_received'>Event Received</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Snapshots Table */}
    {latestMetrics?.snapshots ? (
      <TableView
        pageSize={15}
        visibleControl
        header={[
          {
            title: 'Metric Type',
            dataIndex: 'metric_type',
            parser: value => (
              <Badge variant='outline' className='font-mono text-xs'>
                {value}
              </Badge>
            )
          },
          {
            title: 'Value',
            dataIndex: 'value',
            parser: value => <span className='font-medium'>{formatValue(value)}</span>
          },
          {
            title: 'Labels',
            dataIndex: 'labels',
            parser: (value: any) => {
              let parsedValue = value;

              // Try to parse if value is JSON string
              if (typeof value === 'string') {
                try {
                  parsedValue = JSON.parse(value);
                } catch {
                  parsedValue = value;
                }
              }

              // Handle empty values
              if (
                !parsedValue ||
                (typeof parsedValue === 'object' && Object.keys(parsedValue).length === 0)
              ) {
                return '-';
              }

              // If parsedValue is not an object, return as is
              if (typeof parsedValue !== 'object') {
                return parsedValue;
              }

              return (
                <div className='flex flex-wrap gap-1'>
                  {Object.entries(parsedValue).map(([key, val]) => (
                    <Badge key={key} variant='outline' className='text-xs bg-blue-50'>
                      {key}: {String(val) || '-'}
                    </Badge>
                  ))}
                </div>
              );
            }
          },
          {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            parser: value => (
              <span className='text-sm text-slate-600'>{formatTimestamp(value, 'full')}</span>
            )
          }
        ]}
        data={latestMetrics.snapshots
          .filter(
            snapshot =>
              selectedMetricType === 'all' || snapshot.metric_type.includes(selectedMetricType)
          )
          .map((snapshot, index) => ({
            id: index,
            metric_type: snapshot.metric_type,
            value: snapshot.value,
            labels: snapshot.labels,
            timestamp: snapshot.timestamp
          }))}
      />
    ) : (
      <div className='text-center py-8'>
        <Icons name='IconLoader' className='w-6 h-6 animate-spin mx-auto mb-2' />
        <p className='text-slate-600'>Loading snapshots...</p>
      </div>
    )}

    {/* Snapshot Summary */}
    {latestMetrics && (
      <div className='mt-4 p-4 bg-slate-50 rounded-lg'>
        <div className='grid grid-cols-3 gap-4 text-center'>
          <div>
            <div className='text-lg font-bold text-blue-600'>{latestMetrics.count || 0}</div>
            <div className='text-sm text-slate-600'>Total Snapshots</div>
          </div>
          <div>
            <div className='text-lg font-bold text-green-600'>
              {new Set(latestMetrics.snapshots?.map(s => s.metric_type) || []).size}
            </div>
            <div className='text-sm text-slate-600'>Metric Types</div>
          </div>
          <div>
            <div className='text-lg font-bold text-orange-600'>
              {latestMetrics.snapshots?.[0]
                ? formatTimestamp(latestMetrics.snapshots[0].timestamp, 'time')
                : 'N/A'}
            </div>
            <div className='text-sm text-slate-600'>Latest Update</div>
          </div>
        </div>
      </div>
    )}
  </div>
);

const DataLayerModalContent = ({ dataLayerSummary }: any) => (
  <div className='space-y-4'>
    {dataLayerSummary.status === 'available' && dataLayerSummary.data ? (
      <div>
        <h4 className='font-medium text-slate-700 mb-3'>Data Layer Information</h4>
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconCheck' className='w-5 h-5 text-green-600' />
            <span className='font-medium text-green-800'>Data layer is operational</span>
          </div>
          <div className='text-sm text-green-700'>
            All data layer services are functioning normally.
          </div>
          <div className='mt-2 text-xs text-green-600'>
            Last updated: {formatTimestamp(dataLayerSummary.timestamp, 'full')}
          </div>
        </div>
      </div>
    ) : (
      <div>
        <h4 className='font-medium text-slate-700 mb-3'>Data Layer Status</h4>
        <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Icons name='IconAlertTriangle' className='w-5 h-5 text-orange-600' />
            <span className='font-medium text-orange-800'>Data metrics unavailable</span>
          </div>
          <div className='text-sm text-orange-700'>{dataLayerSummary.message}</div>
          <div className='mt-2 text-xs text-orange-600'>
            Last checked: {formatTimestamp(dataLayerSummary.timestamp, 'full')}
          </div>
        </div>
      </div>
    )}

    {/* Troubleshooting Section */}
    <div className='border-t pt-4'>
      <h4 className='font-medium text-slate-700 mb-3'>Troubleshooting</h4>
      <div className='space-y-2 text-sm text-slate-600'>
        <div className='flex items-start gap-2'>
          <Icons name='IconInfoCircle' className='w-4 h-4 mt-0.5 text-blue-500' />
          <span>Check database connectivity and ensure all required services are running.</span>
        </div>
        <div className='flex items-start gap-2'>
          <Icons name='IconInfoCircle' className='w-4 h-4 mt-0.5 text-blue-500' />
          <span>Verify that metrics collection is enabled in system configuration.</span>
        </div>
        <div className='flex items-start gap-2'>
          <Icons name='IconInfoCircle' className='w-4 h-4 mt-0.5 text-blue-500' />
          <span>Review system logs for any data layer related errors.</span>
        </div>
      </div>
    </div>

    {/* Status History */}
    <div className='border-t pt-4'>
      <h4 className='font-medium text-slate-700 mb-3'>Recent Status</h4>
      <div className='space-y-2'>
        <div className='flex items-center justify-between p-2 bg-slate-50 rounded'>
          <span className='text-sm'>Current Status</span>
          <Badge variant={dataLayerSummary.status === 'available' ? 'success' : 'warning'}>
            {dataLayerSummary.status}
          </Badge>
        </div>
        <div className='flex items-center justify-between p-2 bg-slate-50 rounded'>
          <span className='text-sm'>Last Update</span>
          <span className='text-sm font-medium'>
            {formatTimestamp(dataLayerSummary.timestamp, 'time')}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const EventsModalContent = ({ eventsSummary }: any) => (
  <div className='space-y-4'>
    {eventsSummary ? (
      <>
        {/* Dispatcher Details */}
        <div>
          <h4 className='font-medium text-slate-700 mb-3'>Event Dispatcher Details</h4>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Active Handlers:</span>
                <span className='font-medium'>{eventsSummary.dispatcher.active_handlers}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Events/Second:</span>
                <span className='font-medium'>{eventsSummary.dispatcher.events_per_second}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Total Published:</span>
                <span className='font-medium'>{eventsSummary.dispatcher.published}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Total Delivered:</span>
                <span className='font-medium'>{eventsSummary.dispatcher.delivered}</span>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Failed Events:</span>
                <span className='font-medium text-red-600'>{eventsSummary.dispatcher.failed}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Retries:</span>
                <span className='font-medium'>{eventsSummary.dispatcher.retries}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Success Rate:</span>
                <Badge
                  variant={eventsSummary.dispatcher.success_rate >= 95 ? 'success' : 'warning'}
                >
                  {eventsSummary.dispatcher.success_rate.toFixed(1)}%
                </Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Subscribers:</span>
                <span className='font-medium'>{eventsSummary.dispatcher.total_subscribers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extension Events Table */}
        <div className='border-t pt-4'>
          <h4 className='font-medium text-slate-700 mb-3'>Extension Events</h4>
          <TableView
            pageSize={10}
            visibleControl
            header={[
              {
                title: 'Extension',
                dataIndex: 'name',
                parser: value => <span className='font-medium'>{value}</span>
              },
              {
                title: 'Published',
                dataIndex: 'published',
                parser: value => (
                  <span className='text-blue-600 font-medium'>{formatValue(value)}</span>
                )
              },
              {
                title: 'Received',
                dataIndex: 'received',
                parser: value => (
                  <span className='text-green-600 font-medium'>{formatValue(value)}</span>
                )
              },
              {
                title: 'Activity Level',
                dataIndex: 'activity',
                parser: (_, record) => {
                  const total = record.published + record.received;
                  const level = total > 10 ? 'High' : total > 5 ? 'Medium' : 'Low';
                  const variant = total > 10 ? 'success' : total > 5 ? 'warning' : 'outline';
                  return <Badge variant={variant}>{level}</Badge>;
                }
              }
            ]}
            data={Object.entries(eventsSummary.extensionEvents).map(
              ([name, data]: [string, any]) => ({
                id: name,
                name,
                published: data.published,
                received: data.received
              })
            )}
          />
        </div>

        {/* Events Summary */}
        <div className='border-t pt-4'>
          <h4 className='font-medium text-slate-700 mb-3'>Events Summary</h4>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div className='p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>{eventsSummary.totalPublished}</div>
              <div className='text-sm text-slate-600'>Total Published</div>
            </div>
            <div className='p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>{eventsSummary.totalReceived}</div>
              <div className='text-sm text-slate-600'>Total Received</div>
            </div>
            <div className='p-4 bg-purple-50 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600'>
                {Object.keys(eventsSummary.extensionEvents).length}
              </div>
              <div className='text-sm text-slate-600'>Active Extensions</div>
            </div>
          </div>
        </div>

        {/* Last Event Time */}
        {eventsSummary.dispatcher.last_event_time &&
          eventsSummary.dispatcher.last_event_time !== '0001-01-01T00:00:00Z' && (
            <div className='border-t pt-4'>
              <div className='flex items-center justify-between p-3 bg-slate-50 rounded-lg'>
                <span className='text-slate-600'>Last Event Processed:</span>
                <span className='font-medium'>
                  {formatTimestamp(eventsSummary.dispatcher.last_event_time, 'full')}
                </span>
              </div>
            </div>
          )}
      </>
    ) : (
      <div className='text-center py-8'>
        <Icons name='IconBell' className='w-12 h-12 text-slate-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-slate-600 mb-2'>No Event Data</h3>
        <p className='text-slate-500'>Event metrics are currently not available.</p>
      </div>
    )}
  </div>
);

export default ExtensionMetricsPage;
