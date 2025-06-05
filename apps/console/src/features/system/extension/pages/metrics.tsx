import { useState, useEffect, useMemo } from 'react';

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
  SelectValue
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { CacheTab, MetricsOverviewTab, PerformanceTab, SystemTab } from '../components/metrics';
import { useMetrics, useMetricsByType, useRefreshCrossServices } from '../service';

import { Page } from '@/components/layout';

const getIntervalMs = (interval: string) => {
  switch (interval) {
    case '1s':
      return 1000;
    case '5s':
      return 5000;
    case '10s':
      return 10000;
    case '30s':
      return 30000;
    default:
      return 5000;
  }
};

export const ExtensionMetricsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Get initial state from navigation
  const initialCollection = location.state?.selectedCollection;

  const { data: metrics, isLoading, error, refetch } = useMetrics(true); // Real-time enabled
  const refreshMutation = useRefreshCrossServices();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedMetricType, setSelectedMetricType] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('5s');

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

  // Real-time updates with configurable interval
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalMs = getIntervalMs(refreshInterval);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      refetch();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval, refetch]);

  // Specific metric type data
  const { data: specificMetrics } = useMetricsByType(selectedMetricType, !!selectedMetricType);

  // Navigation functions
  const goToHealth = () => navigate('/system/extensions/health');
  const goToCollections = (collection?: string) => {
    navigate('/system/extensions/collections', { state: { selectedCollection: collection } });
  };
  const goToOverview = () => navigate('/system/extensions/overview');

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!metrics) return {};

    const extensionMetrics = Object.values(metrics.collections || {}).reduce(
      (acc, collection) => {
        collection.metrics.forEach(metric => {
          if (metric.labels?.extension) {
            const ext = metric.labels.extension;
            if (!acc[ext]) acc[ext] = { name: ext, count: 0, values: [] };
            acc[ext].count++;
            if (typeof metric.value === 'number') {
              acc[ext].values.push(metric.value);
            }
          }
        });
        return acc;
      },
      {} as Record<string, { name: string; count: number; values: number[] }>
    );

    const resourceUsage = metrics.resource_usage
      ? Object.entries(metrics.resource_usage).map(([name, usage]) => ({
          name,
          memory: usage.memory_usage_mb,
          cpu: usage.cpu_usage_percent,
          loadTime: parseFloat(usage.load_time?.replace(/[^\d.]/g, '') || '0')
        }))
      : [];

    // Cache performance over time
    const cacheData = metrics.service_cache
      ? [
          { name: 'Hit Rate', value: metrics.service_cache.hit_rate, target: 90 },
          { name: 'Size', value: metrics.service_cache.size, target: 1000 },
          { name: 'Age', value: metrics.service_cache.age_seconds / 60, target: 30 }
        ]
      : [];

    return {
      extensionMetrics: Object.values(extensionMetrics),
      resourceUsage,
      cacheData
    };
  }, [metrics]);

  // Alert thresholds
  const alerts = useMemo(() => {
    const alerts = [];

    if (metrics?.service_cache?.hit_rate < 70) {
      alerts.push({
        type: 'warning',
        message: `Low cache hit rate: ${Math.round(metrics.service_cache.hit_rate)}%`,
        action: () => goToCollections('cache')
      });
    }

    if (metrics?.system?.memory_usage_mb > 1000) {
      alerts.push({
        type: 'warning',
        message: `High memory usage: ${Math.round(metrics.system.memory_usage_mb)}MB`,
        action: () => goToCollections('system')
      });
    }

    if (metrics?.resource_usage) {
      const highCpuExtensions = Object.entries(metrics.resource_usage).filter(
        ([, usage]) => usage.cpu_usage_percent > 80
      );

      if (highCpuExtensions.length > 0) {
        alerts.push({
          type: 'error',
          message: `High CPU usage in ${highCpuExtensions.length} extension(s)`,
          action: () => goToCollections('extensions')
        });
      }
    }

    return alerts;
  }, [metrics]);

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

  if (isLoading) {
    return (
      <Page title={t('extensions.metrics.title', 'Extension Metrics')}>
        <div className='flex justify-center items-center h-64'>
          <div className='text-lg text-slate-600'>Loading metrics...</div>
        </div>
      </Page>
    );
  }

  return (
    <Page title={t('extensions.metrics.title', 'Extension Metrics')}>
      <div className='w-full space-y-6'>
        {/* Header with Navigation */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <div>
              <h1 className='text-2xl font-bold text-slate-800'>Extension System Metrics</h1>
              <div className='flex items-center gap-4 text-sm text-slate-500'>
                <span>Last updated: {currentTime.toLocaleString()}</span>
                {autoRefresh && (
                  <div className='flex items-center gap-1'>
                    <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                    <span>Live updates every {refreshInterval}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Select value={refreshInterval} onValueChange={setRefreshInterval}>
              <SelectTrigger className='w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1s'>1s</SelectItem>
                <SelectItem value='5s'>5s</SelectItem>
                <SelectItem value='10s'>10s</SelectItem>
                <SelectItem value='30s'>30s</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? 'primary' : 'outline-slate'}
              icon={autoRefresh ? 'IconPlayerPause' : 'IconPlayerPlay'}
              size='sm'
            >
              {autoRefresh ? 'Pause' : 'Resume'}
            </Button>
            <Button
              onClick={() => refetch()}
              variant='outline-slate'
              icon='IconRefresh'
              disabled={isLoading}
              size='sm'
            >
              Refresh
            </Button>
            <Button
              onClick={() => refreshMutation.mutate()}
              variant='primary'
              icon='IconSettings'
              loading={refreshMutation.isPending}
              size='sm'
            >
              Refresh Services
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className='space-y-2'>
            {alerts.map((alert, index) => (
              <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
                <Icons name='IconAlertTriangle' className='w-4 h-4' />
                <AlertDescription className='flex items-center justify-between'>
                  <span>{alert.message}</span>
                  <Button size='sm' variant='outline-slate' onClick={alert.action} className='ml-4'>
                    Investigate
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className='grid md:grid-cols-4 gap-4'>
          <div
            className='p-4 bg-white rounded-lg border border-slate-200/60 hover:border-primary-300 cursor-pointer transition-colors'
            onClick={goToHealth}
          >
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
                <Icons name='IconHeart' className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <div className='font-medium'>System Health</div>
                <div className='text-sm text-slate-500'>View health dashboard</div>
              </div>
            </div>
          </div>

          <div
            className='p-4 bg-white rounded-lg border border-slate-200/60 hover:border-primary-300 cursor-pointer transition-colors'
            onClick={() => goToCollections()}
          >
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                <Icons name='IconDatabase' className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <div className='font-medium'>Collections</div>
                <div className='text-sm text-slate-500'>Browse metric collections</div>
              </div>
            </div>
          </div>

          <div
            className='p-4 bg-white rounded-lg border border-slate-200/60 hover:border-primary-300 cursor-pointer transition-colors'
            onClick={() => goToCollections('performance')}
          >
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
                <Icons name='IconActivity' className='w-5 h-5 text-purple-600' />
              </div>
              <div>
                <div className='font-medium'>Performance</div>
                <div className='text-sm text-slate-500'>Resource usage details</div>
              </div>
            </div>
          </div>

          <div
            className='p-4 bg-white rounded-lg border border-slate-200/60 hover:border-primary-300 cursor-pointer transition-colors'
            onClick={() => goToCollections('cache')}
          >
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center'>
                <Icons name='IconCpu' className='w-5 h-5 text-orange-600' />
              </div>
              <div>
                <div className='font-medium'>Cache Stats</div>
                <div className='text-sm text-slate-500'>Cache performance metrics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='grid w-full grid-cols-4 gap-2 p-1 bg-slate-50 rounded-xl'>
            <TabsTrigger value='overview' className='rounded-lg data-[state=active]:bg-white'>
              Overview
            </TabsTrigger>
            <TabsTrigger value='performance' className='rounded-lg data-[state=active]:bg-white'>
              Performance
            </TabsTrigger>
            <TabsTrigger value='cache' className='rounded-lg data-[state=active]:bg-white'>
              Cache
            </TabsTrigger>
            <TabsTrigger value='system' className='rounded-lg data-[state=active]:bg-white'>
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <MetricsOverviewTab
              chartData={chartData}
              metrics={metrics}
              colors={colors}
              goToCollections={goToCollections}
              initialCollection={initialCollection}
            />
          </TabsContent>

          <TabsContent value='performance' className='space-y-6'>
            <PerformanceTab chartData={chartData} metrics={metrics} colors={colors} />
          </TabsContent>

          <TabsContent value='cache' className='space-y-6'>
            <CacheTab metrics={metrics} chartData={chartData} colors={colors} />
          </TabsContent>

          <TabsContent value='system' className='space-y-6'>
            <SystemTab metrics={metrics} colors={colors} />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
};
