import { useState, useEffect } from 'react';

import {
  Button,
  Badge,
  Icons,
  Alert,
  AlertDescription,
  Progress,
  Card,
  CardContent,
  CardHeader,
  CardTitle
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
  Tooltip
} from 'recharts';

import {
  useSystemHealth,
  useDataHealth,
  useExtensionsHealth,
  useCircuitBreakersStatus
} from '../service';

import { Page, Topbar } from '@/components/layout';

export const ExtensionHealthPage = () => {
  const { t } = useTranslation();
  const {
    data: systemHealth,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth
  } = useSystemHealth();
  const { data: dataHealth, refetch: refetchData } = useDataHealth();
  const { data: extensionsHealth, refetch: refetchExtensions } = useExtensionsHealth();
  const { data: circuitBreakers, refetch: refetchCircuit } = useCircuitBreakersStatus();

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Color palette for charts
  const colors = {
    healthy: '#34A853',
    warning: '#FBBC05',
    error: '#EA4335',
    info: '#4285F4'
  };

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
  const getHealthScore = () => {
    if (!extensionsHealth?.summary) return 0;
    const { total, active } = extensionsHealth.summary;
    return total > 0 ? Math.round((active / total) * 100) : 100;
  };

  const getHealthStatus = (score: number) => {
    if (score >= 95) return { label: 'Excellent', variant: 'success' as const };
    if (score >= 80) return { label: 'Good', variant: 'success' as const };
    if (score >= 60) return { label: 'Degraded', variant: 'warning' as const };
    return { label: 'Critical', variant: 'danger' as const };
  };

  // Prepare chart data
  const extensionStatusData = extensionsHealth?.summary
    ? [
        { name: 'Active', value: extensionsHealth.summary.active, color: colors.healthy },
        { name: 'Error', value: extensionsHealth.summary.error, color: colors.error },
        { name: 'Other', value: extensionsHealth.summary.other, color: colors.warning }
      ].filter(item => item.value > 0)
    : [];

  const componentHealthData = systemHealth?.components
    ? Object.entries(systemHealth.components).map(([name, component]: [string, any]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        status: component.status,
        healthy: component.status === 'healthy' || component.status === 'enabled' ? 1 : 0
      }))
    : [];

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

  const healthScore = getHealthScore();
  const healthStatus = getHealthStatus(healthScore);

  return (
    <Page
      title={t('extensions.health.title', 'System Health')}
      topbar={
        <Topbar>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Icons name='IconActivity' className='w-4 h-4 text-slate-600' />
              <span className='text-sm text-slate-600'>Overall Health: {healthScore}%</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-slate-600'>Status</span>
              <Badge variant={healthStatus.variant}>{healthStatus.label}</Badge>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-slate-600'>Last Updated</span>
              <span className='text-sm text-slate-900'>{currentTime.toLocaleString()}</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? 'primary' : 'outline-slate'}
              icon={autoRefresh ? 'IconPlayerPause' : 'IconPlayerPlay'}
              size='sm'
            >
              {autoRefresh ? 'Pause' : 'Resume'}
            </Button>
            <Button
              onClick={refreshAll}
              variant='outline-slate'
              icon='IconRefresh'
              disabled={healthLoading}
              size='sm'
            >
              Refresh
            </Button>
          </div>
        </Topbar>
      }
    >
      <div className='w-full space-y-6'>
        {/* Health Overview Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Overall Health */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600'>Overall Health</p>
                  <p className='text-3xl font-bold mt-1'>{healthScore}%</p>
                </div>
                <div className='w-16 h-16 relative'>
                  <svg className='w-16 h-16 transform -rotate-90' viewBox='0 0 64 64'>
                    <circle
                      cx='32'
                      cy='32'
                      r='28'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='none'
                      className='text-slate-200'
                    />
                    <circle
                      cx='32'
                      cy='32'
                      r='28'
                      stroke={
                        healthScore >= 80
                          ? colors.healthy
                          : healthScore >= 60
                            ? colors.warning
                            : colors.error
                      }
                      strokeWidth='4'
                      fill='none'
                      strokeDasharray={`${(healthScore / 100) * 175.929} 175.929`}
                      className='transition-all duration-300'
                    />
                  </svg>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Icons
                      name={
                        healthScore >= 80
                          ? 'IconCheck'
                          : healthScore >= 60
                            ? 'IconAlertTriangle'
                            : 'IconX'
                      }
                      className={`w-6 h-6 ${healthScore >= 80 ? 'text-green-600' : healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}
                    />
                  </div>
                </div>
              </div>
              <div className='mt-4'>
                <Badge variant={healthStatus.variant}>{healthStatus.label}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Extensions Health */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600'>Extensions</p>
                  <p className='text-3xl font-bold mt-1'>
                    {extensionsHealth?.summary?.active || 0}
                    <span className='text-lg text-slate-500'>
                      /{extensionsHealth?.summary?.total || 0}
                    </span>
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                  <Icons name='IconPackage' className='w-6 h-6 text-blue-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center gap-2'>
                <Badge variant='success'>{extensionsHealth?.summary?.active || 0} Active</Badge>
                {(extensionsHealth?.summary?.error || 0) > 0 && (
                  <Badge variant='danger'>{extensionsHealth.summary.error} Error</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Layer Health */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600'>Data Layer</p>
                  <p className='text-3xl font-bold mt-1'>
                    {dataHealth?.status === 'healthy' ? '✓' : '⚠'}
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
                  <Icons name='IconDatabase' className='w-6 h-6 text-green-600' />
                </div>
              </div>
              <div className='mt-4'>
                <Badge variant={dataHealth?.status === 'healthy' ? 'success' : 'warning'}>
                  {dataHealth?.status || 'unknown'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Circuit Breakers */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600'>Circuit Breakers</p>
                  <p className='text-3xl font-bold mt-1'>
                    {circuitBreakers?.closed || 0}
                    <span className='text-lg text-slate-500'>/{circuitBreakers?.total || 0}</span>
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center'>
                  <Icons name='IconShield' className='w-6 h-6 text-purple-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center gap-2'>
                <Badge variant='success'>{circuitBreakers?.closed || 0} Closed</Badge>
                {(circuitBreakers?.open || 0) > 0 && (
                  <Badge variant='danger'>{circuitBreakers.open} Open</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Charts */}
        <div className='grid lg:grid-cols-2 gap-6'>
          {/* Extension Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Extension Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={extensionStatusData}
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      dataKey='value'
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {extensionStatusData.map((entry, index) => (
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
                      formatter={(value, _name) => [
                        value === 1 ? 'Healthy' : 'Unhealthy',
                        'Status'
                      ]}
                    />
                    <Bar dataKey='healthy' fill={colors.healthy} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Health Information */}
        <div className='grid gap-6'>
          {/* System Components */}
          <Card>
            <CardHeader>
              <CardTitle>System Components Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-slate-200/60'>
                  <thead className='bg-slate-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                        Component
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                        Details
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                        Last Check
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-slate-200/60'>
                    {Object.entries(systemHealth?.components || {}).map(
                      ([name, component]: [string, any]) => (
                        <tr key={name} className='hover:bg-slate-50'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3'>
                                <Icons
                                  name={getComponentIcon(name)}
                                  className='w-4 h-4 text-slate-600'
                                />
                              </div>
                              <div className='font-medium text-slate-900 capitalize'>{name}</div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <Badge variant={getComponentStatusVariant(component.status)}>
                              {component.status}
                            </Badge>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='text-sm text-slate-600'>
                              {formatComponentDetails(component)}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                            {new Date(systemHealth?.timestamp || '').toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Circuit Breakers Details */}
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
                        className={`p-4 rounded-lg border ${
                          breaker.state === 'closed'
                            ? 'border-green-200 bg-green-50'
                            : breaker.state === 'open'
                              ? 'border-red-200 bg-red-50'
                              : 'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <h4 className='font-medium'>{name}</h4>
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
                        <div className='space-y-1 text-sm'>
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
                          <div className='flex justify-between'>
                            <span className='text-slate-600'>Success Rate:</span>
                            <span className='font-medium'>
                              {breaker.requests > 0
                                ? Math.round((breaker.total_successes / breaker.requests) * 100)
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extension Health Details */}
          {extensionsHealth?.extensions && Object.keys(extensionsHealth.extensions).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Extension Health Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-2'>
                  {Object.entries(extensionsHealth.extensions).map(
                    ([name, status]: [string, any]) => (
                      <div
                        key={name}
                        className='flex items-center justify-between p-3 bg-slate-50 rounded-lg'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center'>
                            <Icons
                              name={
                                status === 'active'
                                  ? 'IconCheck'
                                  : status === 'error'
                                    ? 'IconX'
                                    : 'IconClock'
                              }
                              className={`w-3 h-3 ${
                                status === 'active'
                                  ? 'text-green-600'
                                  : status === 'error'
                                    ? 'text-red-600'
                                    : 'text-yellow-600'
                              }`}
                            />
                          </div>
                          <span className='font-medium'>{name}</span>
                        </div>
                        <Badge variant={getExtensionStatusVariant(status)}>{status}</Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-3 gap-6'>
              <div>
                <h4 className='font-medium text-slate-600 mb-2'>Overall Status</h4>
                <div className='flex items-center gap-2'>
                  <Progress
                    value={healthScore}
                    className='flex-1'
                    style={
                      {
                        '--progress-foreground':
                          healthScore >= 80
                            ? colors.healthy
                            : healthScore >= 60
                              ? colors.warning
                              : colors.error
                      } as React.CSSProperties
                    }
                  />
                  <span className='text-sm font-medium'>{healthScore}%</span>
                </div>
              </div>

              <div>
                <h4 className='font-medium text-slate-600 mb-2'>System Status</h4>
                <Badge
                  variant={systemHealth?.status === 'healthy' ? 'success' : 'warning'}
                  className='mb-2'
                >
                  {systemHealth?.status || 'unknown'}
                </Badge>
                <p className='text-sm text-slate-600'>
                  {systemHealth?.extensions || 0} extensions monitored
                </p>
              </div>

              <div>
                <h4 className='font-medium text-slate-600 mb-2'>Quick Actions</h4>
                <div className='flex gap-2'>
                  <Button size='sm' variant='outline-slate' onClick={refreshAll} icon='IconRefresh'>
                    Refresh All
                  </Button>
                  <Button
                    size='sm'
                    variant={autoRefresh ? 'primary' : 'outline-slate'}
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    icon={autoRefresh ? 'IconPlayerPause' : 'IconPlayerPlay'}
                  >
                    {autoRefresh ? 'Pause' : 'Start'} Auto-refresh
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

// Helper functions
const getComponentIcon = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'extensions':
      return 'IconPackage';
    case 'data':
      return 'IconDatabase';
    case 'metrics':
      return 'IconActivity';
    case 'service_discovery':
      return 'IconNetwork';
    default:
      return 'IconSettings';
  }
};

const getComponentStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'healthy':
    case 'enabled':
    case 'excellent':
    case 'good':
      return 'success' as const;
    case 'degraded':
    case 'warning':
      return 'warning' as const;
    case 'unhealthy':
    case 'disabled':
    case 'error':
      return 'danger' as const;
    default:
      return 'outline' as const;
  }
};

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

const formatComponentDetails = (component: any): string => {
  if (typeof component === 'string') return component;

  const details = [];
  if (component.total !== undefined) details.push(`Total: ${component.total}`);
  if (component.healthy !== undefined) details.push(`Healthy: ${component.healthy}`);
  if (component.rate !== undefined) details.push(`Rate: ${component.rate}%`);
  if (component.cache !== undefined) details.push(`Cache: ${component.cache.status}`);

  return details.join(' • ') || 'No details available';
};
