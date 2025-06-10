import { useState, useMemo } from 'react';

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
import { useNavigate } from 'react-router';

import {
  HealthScoreCard,
  MetricCard,
  StatusChart,
  PerformanceChart,
  ExtensionCard,
  LoadingCard,
  EmptyState,
  QuickActions
} from '../components/shared';
import type { FilterState } from '../extension.d';
import {
  useExtensions,
  useExtensionStatus,
  useExtensionMetrics,
  useSystemHealth,
  useLoadPlugin,
  useUnloadPlugin,
  useReloadPlugin,
  useAutoRefresh
} from '../hooks';
import {
  transformExtensionsData,
  filterExtensions,
  calculateExtensionStats,
  prepareStatusChartData,
  prepareGroupChartData,
  getFilterOptions,
  sortExtensions,
  debounce,
  COLORS,
  calculatePerformanceScore
} from '../utils';

import { Page, Topbar } from '@/components/layout';
import { Search } from '@/components/search/search';

export const ExtensionOverviewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Auto-refresh control
  const autoRefresh = useAutoRefresh(true);

  // Data hooks
  const {
    data: extensions,
    isLoading: extensionsLoading,
    error: extensionsError
  } = useExtensions();
  const { data: statusData } = useExtensionStatus(autoRefresh.enabled);
  const { data: metricsData } = useExtensionMetrics(autoRefresh.enabled);
  const { data: _healthData } = useSystemHealth(autoRefresh.enabled);

  // Mutations
  const loadMutation = useLoadPlugin();
  const unloadMutation = useUnloadPlugin();
  const reloadMutation = useReloadPlugin();

  // Local state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    group: '',
    type: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'group' | 'performance'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters(prev => ({ ...prev, search: value }));
      }, 300),
    []
  );

  // Transform and filter data
  const transformedExtensions = useMemo(() => {
    if (!extensions || !statusData) return [];

    return transformExtensionsData(extensions, statusData.extensions, metricsData?.extensions);
  }, [extensions, statusData, metricsData]);

  const filteredExtensions = useMemo(() => {
    const filtered = filterExtensions(transformedExtensions, filters);
    return sortExtensions(filtered, sortBy, sortOrder);
  }, [transformedExtensions, filters, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    return calculateExtensionStats(transformedExtensions);
  }, [transformedExtensions]);

  // Chart data
  const chartData = useMemo(() => {
    return {
      statusData: prepareStatusChartData(stats),
      groupData: prepareGroupChartData(transformedExtensions)
    };
  }, [stats, transformedExtensions]);

  // Performance data for charts
  const performanceData = useMemo(() => {
    return transformedExtensions
      .filter(ext => ext.metrics)
      .map(ext => ({
        name: ext.name,
        memory: 0, // Memory data not available in current API
        initTime: ext.metrics?.init_time_ms || 0,
        score: ext.metrics ? calculatePerformanceScore(ext.metrics) : 0,
        serviceCalls: ext.metrics?.service_calls || 0
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [transformedExtensions]);

  // Filter options
  const filterOptions = useMemo(() => {
    return getFilterOptions(transformedExtensions);
  }, [transformedExtensions]);

  // Event handlers
  const handleAction = async (action: string, name: string) => {
    try {
      switch (action) {
        case 'load':
          await loadMutation.mutateAsync(name);
          break;
        case 'unload':
          await unloadMutation.mutateAsync(name);
          break;
        case 'reload':
          await reloadMutation.mutateAsync(name);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} extension:`, error);
    }
  };

  const handleViewMetrics = (name: string) => {
    navigate('/system/extensions/metrics', { state: { extensionName: name } });
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    if (value === 'all') value = '';
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Navigation helpers
  const goToHealth = () => navigate('/system/extensions/health');
  const goToMetrics = () => navigate('/system/extensions/metrics');
  const goToCollections = () => navigate('/system/extensions/collections');

  // Refresh handler
  const handleRefresh = () => {
    // Trigger refresh through auto-refresh hook
    autoRefresh.setEnabled(true);
  };

  if (extensionsError) {
    return (
      <Page title={t('extensions.overview.title', 'Extensions Overview')}>
        <Alert variant='destructive'>
          <Icons name='IconAlertTriangle' className='w-4 h-4' />
          <AlertDescription>
            Failed to load extensions. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </Page>
    );
  }

  return (
    <Page
      title={t('extensions.overview.title', 'Extensions Overview')}
      topbar={
        <Topbar
          left={[
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div
                  className={`w-2 h-2 rounded-full ${
                    autoRefresh.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}
                />
                <span className='text-sm text-slate-600'>
                  {autoRefresh.enabled ? 'Live' : 'Paused'} • {stats.active}/{stats.total} Active
                </span>
              </div>
              <Search
                placeholder='Search extensions...'
                fieldClassName='border-slate-200/60 focus:border-primary-600 py-2'
                onSearch={debouncedSearch}
              />
              <Select
                value={filters.group}
                onValueChange={value => handleFilterChange('group', value)}
              >
                <SelectTrigger className='w-32 py-1.5'>
                  <SelectValue placeholder='All Groups' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Groups</SelectItem>
                  {filterOptions.groups.map(group => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={value => handleFilterChange('status', value)}
              >
                <SelectTrigger className='w-32 py-1.5'>
                  <SelectValue placeholder='All Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  {filterOptions.statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ]}
          right={[
            <Button
              size='sm'
              variant={autoRefresh.enabled ? 'primary' : 'outline-slate'}
              icon={autoRefresh.enabled ? 'IconPlayerPause' : 'IconPlayerPlay'}
              onClick={autoRefresh.toggle}
            >
              {autoRefresh.enabled ? 'Pause' : 'Resume'} Live
            </Button>,
            <Button
              size='sm'
              variant='outline-slate'
              icon='IconRefresh'
              onClick={handleRefresh}
              disabled={extensionsLoading}
            >
              Refresh
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='w-full space-y-6'>
        {/* Quick Actions */}
        <QuickActions
          onRefresh={handleRefresh}
          onViewHealth={goToHealth}
          onViewMetrics={goToMetrics}
          onViewCollections={goToCollections}
          loading={extensionsLoading}
        />

        {/* Health Score Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <HealthScoreCard
            score={stats.healthScore}
            total={stats.total}
            active={stats.active}
            onClick={goToHealth}
          />

          <MetricCard
            title='Active Extensions'
            value={stats.active}
            icon='IconPackage'
            color={COLORS.success}
            subtitle={`${stats.total} total extensions`}
            onClick={goToMetrics}
          />

          <MetricCard
            title='System Memory'
            value={metricsData?.system?.memory_usage_mb || 0}
            unit='MB'
            icon='IconCpu'
            color={COLORS.info}
            subtitle={`${metricsData?.system?.goroutine_count || 0} goroutines`}
          />

          <MetricCard
            title='Service Calls'
            value={Object.values(metricsData?.extensions || {}).reduce(
              (sum, ext) => sum + ext.service_calls,
              0
            )}
            icon='IconActivity'
            color={COLORS.purple}
            subtitle='Total across all extensions'
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue='extensions' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 gap-2 p-1 bg-slate-50 rounded-xl'>
            <TabsTrigger value='extensions' className='rounded-lg data-[state=active]:bg-white'>
              Extensions ({filteredExtensions.length})
            </TabsTrigger>
            <TabsTrigger value='analytics' className='rounded-lg data-[state=active]:bg-white'>
              Analytics
            </TabsTrigger>
            <TabsTrigger value='performance' className='rounded-lg data-[state=active]:bg-white'>
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value='extensions' className='space-y-6'>
            {/* Sort Controls */}
            <div className='flex items-center gap-4'>
              <span className='text-sm text-slate-600'>Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className='w-40 py-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='status'>Status</SelectItem>
                  <SelectItem value='group'>Group</SelectItem>
                  <SelectItem value='performance'>Performance</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size='sm'
                variant='outline-slate'
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                icon={sortOrder === 'asc' ? 'IconSortAscending' : 'IconSortDescending'}
              >
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </div>

            {/* Extensions Grid */}
            {extensionsLoading ? (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : filteredExtensions.length === 0 ? (
              <EmptyState
                icon='IconPackage'
                title='No Extensions Found'
                description='No extensions match the current filters.'
                action={{
                  label: 'Clear Filters',
                  onClick: () => setFilters({ search: '', group: '', type: '', status: '' })
                }}
              />
            ) : (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {filteredExtensions.map(extension => (
                  <ExtensionCard
                    key={extension.name}
                    extension={extension}
                    onAction={handleAction}
                    onViewMetrics={handleViewMetrics}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='analytics' className='space-y-6'>
            <div className='grid lg:grid-cols-2 gap-6'>
              <StatusChart
                data={chartData.statusData}
                title='Status Distribution'
                onClick={goToHealth}
              />

              <StatusChart
                data={chartData.groupData}
                title='Extensions by Group'
                onClick={goToMetrics}
              />
            </div>

            {/* System Statistics */}
            <div className='grid md:grid-cols-4 gap-4'>
              <div className='text-center p-4 bg-green-50 rounded-lg'>
                <div className='text-2xl font-bold text-green-600'>{stats.active}</div>
                <div className='text-slate-600'>Active Extensions</div>
                <div className='text-xs text-slate-500 mt-1'>
                  {((stats.active / stats.total) * 100).toFixed(1)}% of total
                </div>
              </div>
              <div className='text-center p-4 bg-red-50 rounded-lg'>
                <div className='text-2xl font-bold text-red-600'>{stats.error}</div>
                <div className='text-slate-600'>Error State</div>
                <div className='text-xs text-slate-500 mt-1'>
                  {stats.error > 0 ? 'Needs attention' : 'All good'}
                </div>
              </div>
              <div className='text-center p-4 bg-yellow-50 rounded-lg'>
                <div className='text-2xl font-bold text-yellow-600'>{stats.inactive}</div>
                <div className='text-slate-600'>Inactive</div>
                <div className='text-xs text-slate-500 mt-1'>Stopped or disabled</div>
              </div>
              <div className='text-center p-4 bg-blue-50 rounded-lg'>
                <div className='text-2xl font-bold text-blue-600'>{stats.total}</div>
                <div className='text-slate-600'>Total Extensions</div>
                <div className='text-xs text-slate-500 mt-1'>System capacity</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='performance' className='space-y-6'>
            {performanceData.length > 0 ? (
              <>
                <PerformanceChart
                  data={performanceData}
                  title='Top Extensions by Performance'
                  onClick={() => navigate('/system/extensions/metrics')}
                />

                {/* Performance Summary */}
                <div className='grid md:grid-cols-3 gap-4'>
                  <MetricCard
                    title='Avg Init Time'
                    value={
                      performanceData.reduce((sum, ext) => sum + ext.initTime, 0) /
                      performanceData.length
                    }
                    unit='ms'
                    icon='IconClock'
                    color={COLORS.warning}
                    subtitle='Extension initialization'
                  />
                  <MetricCard
                    title='Avg Performance Score'
                    value={
                      performanceData.reduce((sum, ext) => sum + ext.score, 0) /
                      performanceData.length
                    }
                    icon='IconTarget'
                    color={COLORS.success}
                    subtitle='Overall performance rating'
                  />
                  <MetricCard
                    title='Total Service Calls'
                    value={performanceData.reduce((sum, ext) => sum + ext.serviceCalls, 0)}
                    icon='IconActivity'
                    color={COLORS.info}
                    subtitle='Across all extensions'
                  />
                </div>
              </>
            ) : (
              <EmptyState
                icon='IconActivity'
                title='No Performance Data'
                description='Performance metrics are not available yet.'
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
};
