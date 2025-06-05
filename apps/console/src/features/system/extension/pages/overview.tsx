import { useState, useEffect, useMemo } from 'react';

import {
  Button,
  Badge,
  Icons,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { AnalyticsView, ExtensionsGrid, PerformanceView } from '../components/overflow';
import {
  useExtensions,
  useExtensionStatus,
  useSystemHealth,
  useMetrics,
  useLoadExtension,
  useUnloadExtension,
  useReloadExtension
} from '../service';

import { Page, Topbar } from '@/components/layout';
import { Search } from '@/components/search/search';

export const ExtensionOverviewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Real-time data with auto-refresh
  const {
    data: extensions,
    isLoading: extensionsLoading,
    error: extensionsError,
    refetch: refetchExtensions
  } = useExtensions();
  const { data: status, refetch: refetchStatus } = useExtensionStatus(true); // Auto-refresh enabled
  const { data: _health, refetch: refetchHealth } = useSystemHealth(true);
  const { data: metrics, refetch: refetchMetrics } = useMetrics(true);

  const loadMutation = useLoadExtension();
  const unloadMutation = useUnloadExtension();
  const reloadMutation = useReloadExtension();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // Real-time update interval
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      refetchStatus();
      refetchHealth();
      refetchMetrics();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [realTimeEnabled, refetchStatus, refetchHealth, refetchMetrics]);

  // Flatten and enrich extensions with status and metrics
  const flattenedExtensions = useMemo(() => {
    if (!extensions) return [];

    return Object.entries(extensions).flatMap(([group, types]) =>
      Object.entries(types).flatMap(([type, exts]) =>
        exts.map(ext => ({
          ...ext,
          group,
          type,
          currentStatus: status?.[ext.name] || { status: ext.status || 'unknown' },
          resourceUsage: metrics?.resource_usage?.[ext.name]
        }))
      )
    );
  }, [extensions, status, metrics]);

  // Filter extensions
  const filteredExtensions = useMemo(() => {
    return flattenedExtensions.filter(ext => {
      const matchesSearch =
        !searchTerm ||
        ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ext.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = !selectedGroup || ext.group === selectedGroup;
      const matchesType = !selectedType || ext.type === selectedType;
      const matchesStatus = !selectedStatus || ext.currentStatus.status === selectedStatus;

      return matchesSearch && matchesGroup && matchesType && matchesStatus;
    });
  }, [flattenedExtensions, searchTerm, selectedGroup, selectedType, selectedStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = flattenedExtensions.length;
    const active = flattenedExtensions.filter(ext => ext.currentStatus.status === 'active').length;
    const error = flattenedExtensions.filter(ext => ext.currentStatus.status === 'error').length;
    const inactive = flattenedExtensions.filter(ext =>
      ['inactive', 'disabled'].includes(ext.currentStatus.status)
    ).length;

    return {
      total,
      active,
      error,
      inactive,
      healthScore: total > 0 ? Math.round((active / total) * 100) : 100
    };
  }, [flattenedExtensions]);

  // Chart data
  const chartData = useMemo(() => {
    const statusData = [
      { name: 'Active', value: stats.active, color: '#34A853' },
      { name: 'Error', value: stats.error, color: '#EA4335' },
      { name: 'Inactive', value: stats.inactive, color: '#FBBC05' }
    ].filter(item => item.value > 0);

    const groupData = Object.entries(
      flattenedExtensions.reduce(
        (acc, ext) => {
          acc[ext.group] = (acc[ext.group] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      )
    ).map(([name, value]) => ({ name, value }));

    return { statusData, groupData };
  }, [stats, flattenedExtensions]);

  // Filter options
  const filterOptions = useMemo(() => {
    const groups = [...new Set(flattenedExtensions.map(ext => ext.group))];
    const types = [...new Set(flattenedExtensions.map(ext => ext.type))];
    const statuses = [...new Set(flattenedExtensions.map(ext => ext.currentStatus.status))];

    return { groups, types, statuses };
  }, [flattenedExtensions]);

  // Handle extension actions
  const handleAction = async (action: string, extensionName: string) => {
    try {
      switch (action) {
        case 'load':
          await loadMutation.mutateAsync(extensionName);
          break;
        case 'unload':
          await unloadMutation.mutateAsync(extensionName);
          break;
        case 'reload':
          await reloadMutation.mutateAsync(extensionName);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} extension:`, error);
    }
  };

  // Navigation helpers
  const goToMetrics = (collection?: string) => {
    navigate('/system/extensions/metrics', { state: { selectedCollection: collection } });
  };

  const goToHealth = () => {
    navigate('/system/extensions/health');
  };

  const goToCollections = (collection?: string) => {
    navigate('/system/extensions/collections', { state: { selectedCollection: collection } });
  };

  const getStatusBadge = (currentStatus: any) => {
    switch (currentStatus.status) {
      case 'active':
        return 'success';
      case 'inactive':
      case 'disabled':
        return 'warning';
      case 'error':
        return 'danger';
      case 'initializing':
      case 'maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
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

  // Handle Select group change
  const handleSelectedGroup = (value: string) => {
    if (value === 'all') {
      setSelectedGroup('');
      setSelectedType('');
      setSelectedStatus('');
    } else {
      setSelectedGroup(value);
      setSelectedType('');
      setSelectedStatus('');
    }
  };

  // // Handle Select type change
  // const handleSelectedType = (value: string) => {
  //   if (value === 'all') {
  //     setSelectedType('');
  //     setSelectedStatus('');
  //   } else {
  //     setSelectedType(value);
  //     setSelectedStatus('');
  //   }
  // };

  // Handle Select status change
  const handleSelectedStatus = (value: string) => {
    if (value === 'all') {
      setSelectedStatus('');
    } else {
      setSelectedStatus(value);
    }
  };

  return (
    <Page
      title={t('extensions.overview.title', 'Extensions Overview')}
      topbar={
        <Topbar>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full ${realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
              />
              <span className='text-sm text-slate-600'>
                {realTimeEnabled ? 'Live' : 'Paused'} • {stats.active}/{stats.total} Active
              </span>
            </div>
            <Search
              placeholder='Search extensions...'
              value={searchTerm}
              fieldClassName='border-slate-200/60 focus:border-primary-600 py-2'
              onSearch={setSearchTerm}
            />
            <Select value={selectedGroup} onValueChange={handleSelectedGroup}>
              <SelectTrigger className='w-32'>
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
            <Select value={selectedStatus} onValueChange={handleSelectedStatus}>
              <SelectTrigger className='w-32'>
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
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant={realTimeEnabled ? 'primary' : 'outline-slate'}
              icon={realTimeEnabled ? 'IconPlayerPause' : 'IconPlayerPlay'}
              onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            >
              {realTimeEnabled ? 'Pause' : 'Resume'} Live
            </Button>
            <Button
              size='sm'
              variant='outline-slate'
              icon='IconRefresh'
              onClick={() => {
                refetchExtensions();
                refetchStatus();
                refetchHealth();
              }}
              disabled={extensionsLoading}
            >
              Refresh
            </Button>
          </div>
        </Topbar>
      }
    >
      <div className='w-full space-y-6'>
        {/* Health Score Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card className='cursor-pointer hover:shadow-md transition-shadow' onClick={goToHealth}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600'>System Health</p>
                  <p className='text-3xl font-bold mt-1'>{stats.healthScore}%</p>
                </div>
                <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
                  <Icons name='IconHeart' className='w-6 h-6 text-green-600' />
                </div>
              </div>
              <div className='mt-4'>
                <Progress value={stats.healthScore} className='h-2' />
                <div className='flex items-center justify-between mt-2'>
                  <Badge
                    variant={
                      stats.healthScore >= 80
                        ? 'success'
                        : stats.healthScore >= 60
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {stats.healthScore >= 80
                      ? 'Healthy'
                      : stats.healthScore >= 60
                        ? 'Degraded'
                        : 'Critical'}
                  </Badge>
                  <span className='text-xs text-slate-500'>Click to view details</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className='cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => goToMetrics()}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600'>Active Extensions</p>
                  <p className='text-3xl font-bold mt-1'>{stats.active}</p>
                </div>
                <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                  <Icons name='IconPackage' className='w-6 h-6 text-blue-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <Badge variant='success'>{stats.active} Running</Badge>
                <span className='text-xs text-slate-500'>View metrics</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className='cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => goToCollections()}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600'>Metric Collections</p>
                  <p className='text-3xl font-bold mt-1'>
                    {metrics?.storage?.total_collections || 0}
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center'>
                  <Icons name='IconActivity' className='w-6 h-6 text-purple-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <Badge variant='outline'>{metrics?.storage?.total_metrics || 0} metrics</Badge>
                <span className='text-xs text-slate-500'>Explore data</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600'>Cache Hit Rate</p>
                  <p className='text-3xl font-bold mt-1'>
                    {Math.round(metrics?.service_cache?.hit_rate || 0)}%
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center'>
                  <Icons name='IconDatabase' className='w-6 h-6 text-orange-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <Badge
                  variant={metrics?.service_cache?.status === 'active' ? 'success' : 'warning'}
                >
                  {metrics?.service_cache?.status || 'unknown'}
                </Badge>
                <span className='text-xs text-slate-500'>
                  {metrics?.service_cache?.size || 0} entries
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue='extensions' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 gap-2 p-1 bg-slate-50 rounded-xl'>
            <TabsTrigger value='extensions' className='rounded-lg data-[state=active]:bg-white'>
              Extensions
            </TabsTrigger>
            <TabsTrigger value='analytics' className='rounded-lg data-[state=active]:bg-white'>
              Analytics
            </TabsTrigger>
            <TabsTrigger value='performance' className='rounded-lg data-[state=active]:bg-white'>
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value='extensions' className='space-y-6'>
            <ExtensionsGrid
              extensions={filteredExtensions}
              isLoading={extensionsLoading}
              onAction={handleAction}
              getStatusBadge={getStatusBadge}
              goToMetrics={goToMetrics}
            />
          </TabsContent>

          <TabsContent value='analytics' className='space-y-6'>
            <AnalyticsView
              chartData={chartData}
              stats={stats}
              goToHealth={goToHealth}
              goToMetrics={goToMetrics}
            />
          </TabsContent>

          <TabsContent value='performance' className='space-y-6'>
            <PerformanceView
              extensions={filteredExtensions}
              metrics={metrics}
              goToCollections={goToCollections}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
};
