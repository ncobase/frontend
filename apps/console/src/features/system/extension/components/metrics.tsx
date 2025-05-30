import { useEffect } from 'react';

import { Icons, Badge, Button } from '@ncobase/react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const MetricsOverviewTab = ({
  chartData,
  metrics,
  colors,
  goToCollections,
  initialCollection
}: {
  chartData: any;
  metrics: any;
  colors: any;
  goToCollections: (_collection?: string) => void;
  initialCollection?: string;
}) => {
  useEffect(() => {
    // If navigated from overview with specific collection, highlight it
    if (initialCollection) {
      // Could scroll to specific section or highlight
      console.log('Focusing on collection:', initialCollection);
    }
  }, [initialCollection]);

  return (
    <div className='grid lg:grid-cols-2 gap-6 pt-4'>
      {/* Extension Metrics Distribution */}
      <div
        className='bg-white rounded-lg p-6 border border-slate-200/60 hover:shadow-sm transition-shadow cursor-pointer'
        onClick={() => goToCollections('extensions')}
      >
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>Extension Metrics</h3>
          <Icons name='IconExternalLink' className='w-4 h-4 text-slate-400' />
        </div>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData.extensionMetrics}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='count' fill={colors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='mt-4 text-center text-sm text-slate-500'>
          Click to explore extension metrics in detail
        </div>
      </div>

      {/* Resource Usage Overview */}
      <div
        className='bg-white rounded-lg p-6 border border-slate-200/60 hover:shadow-sm transition-shadow cursor-pointer'
        onClick={() => goToCollections('performance')}
      >
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>Resource Usage</h3>
          <Icons name='IconExternalLink' className='w-4 h-4 text-slate-400' />
        </div>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData.resourceUsage?.slice(0, 8)}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='memory' fill={colors.primary} name='Memory (MB)' />
              <Bar dataKey='cpu' fill={colors.success} name='CPU (%)' />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='mt-4 text-center text-sm text-slate-500'>
          Click to view detailed performance analysis
        </div>
      </div>

      {/* System Status Summary */}
      <div className='lg:col-span-2 bg-white rounded-lg border border-slate-200/60 overflow-hidden'>
        <div className='px-6 py-4 border-b border-slate-200/60'>
          <h2 className='text-lg font-semibold'>System Status</h2>
        </div>
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
                  Key Metrics
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-slate-200/60'>
              <tr className='hover:bg-slate-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <Icons name='IconDatabase' className='w-5 h-5 text-blue-600 mr-2' />
                    <span className='font-medium'>Service Cache</span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <Badge
                    variant={metrics?.service_cache?.status === 'active' ? 'success' : 'warning'}
                  >
                    {metrics?.service_cache?.status || 'unknown'}
                  </Badge>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                  {Math.round(metrics?.service_cache?.hit_rate || 0)}% hit rate •{' '}
                  {metrics?.service_cache?.size || 0} entries
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <Button
                    size='sm'
                    variant='outline-slate'
                    onClick={() => goToCollections('cache')}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
              <tr className='hover:bg-slate-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <Icons name='IconActivity' className='w-5 h-5 text-green-600 mr-2' />
                    <span className='font-medium'>Data Layer</span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <Badge
                    variant={metrics?.data_health?.status === 'healthy' ? 'success' : 'warning'}
                  >
                    {metrics?.data_health?.status || 'unknown'}
                  </Badge>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                  {Object.keys(metrics?.data_health?.components || {}).length} components
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <Button size='sm' variant='outline-slate' onClick={() => goToCollections('data')}>
                    View Details
                  </Button>
                </td>
              </tr>
              {metrics?.system && (
                <tr className='hover:bg-slate-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <Icons name='IconCpu' className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>System</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge variant='success'>Running</Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                    {Math.round(metrics.system.memory_usage_mb)}MB RAM • {metrics.system.goroutines}{' '}
                    goroutines
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Button
                      size='sm'
                      variant='outline-slate'
                      onClick={() => goToCollections('system')}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const PerformanceTab = ({
  chartData,
  colors
}: {
  chartData: any;
  metrics: any;
  colors: any;
}) => {
  const topPerformers = chartData.resourceUsage?.slice(0, 10) || [];

  return (
    <div className='space-y-6'>
      {/* Performance Overview Cards */}
      <div className='grid md:grid-cols-3 gap-4'>
        <div className='bg-white p-6 rounded-lg border border-slate-200/60'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-500 font-medium'>Total Memory</p>
              <p className='text-3xl font-bold mt-1'>
                {topPerformers.reduce((sum, ext) => sum + (ext.memory || 0), 0).toFixed(1)}MB
              </p>
            </div>
            <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
              <Icons name='IconCpu' className='w-6 h-6 text-blue-600' />
            </div>
          </div>
          <div className='mt-4'>
            <Badge variant='outline'>{topPerformers.length} extensions tracked</Badge>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg border border-slate-200/60'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-500 font-medium'>Avg CPU Usage</p>
              <p className='text-3xl font-bold mt-1'>
                {topPerformers.length > 0
                  ? (
                      topPerformers.reduce((sum, ext) => sum + (ext.cpu || 0), 0) /
                      topPerformers.length
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
              <Icons name='IconActivity' className='w-6 h-6 text-green-600' />
            </div>
          </div>
          <div className='mt-4'>
            <Badge
              variant={
                topPerformers.some(ext => ext.cpu > 80)
                  ? 'danger'
                  : topPerformers.some(ext => ext.cpu > 60)
                    ? 'warning'
                    : 'success'
              }
            >
              {topPerformers.filter(ext => ext.cpu > 80).length > 0 ? 'High Load' : 'Normal'}
            </Badge>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg border border-slate-200/60'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-slate-500 font-medium'>Avg Load Time</p>
              <p className='text-3xl font-bold mt-1'>
                {topPerformers.length > 0
                  ? (
                      topPerformers.reduce((sum, ext) => sum + (ext.loadTime || 0), 0) /
                      topPerformers.length
                    ).toFixed(2)
                  : 0}
                s
              </p>
            </div>
            <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center'>
              <Icons name='IconClock' className='w-6 h-6 text-purple-600' />
            </div>
          </div>
          <div className='mt-4'>
            <Badge variant='outline'>Extension startup</Badge>
          </div>
        </div>
      </div>

      {/* Resource Usage Chart */}
      {topPerformers.length > 0 && (
        <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
          <h3 className='text-lg font-semibold mb-4'>Top Extensions by Resource Usage</h3>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={topPerformers}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(2) : value,
                    name
                  ]}
                />
                <Legend />
                <Bar dataKey='memory' fill={colors.primary} name='Memory (MB)' />
                <Bar dataKey='cpu' fill={colors.success} name='CPU (%)' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Performance Trends */}
      <div className='grid lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
          <h3 className='text-lg font-semibold mb-4'>Memory Usage Distribution</h3>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={topPerformers.slice(0, 6).map(ext => ({
                    name: ext.name,
                    value: ext.memory
                  }))}
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  dataKey='value'
                  label={({ name, value }) => `${name}: ${value?.toFixed(1)}MB`}
                >
                  {topPerformers.slice(0, 6).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(colors)[index % Object.values(colors).length] as string}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={value => [`${Number(value)?.toFixed(2)}MB`, 'Memory Usage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
          <h3 className='text-lg font-semibold mb-4'>Load Time Analysis</h3>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={topPerformers.slice(0, 8)} layout='horizontal'>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis dataKey='name' type='category' width={100} />
                <Tooltip formatter={value => [`${Number(value)?.toFixed(3)}s`, 'Load Time']} />
                <Bar dataKey='loadTime' fill={colors.orange} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Details Table */}
      {topPerformers.length > 0 && (
        <div className='bg-white rounded-lg border border-slate-200/60 overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-200/60'>
            <h3 className='text-lg font-semibold'>Performance Details</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-slate-200/60'>
              <thead className='bg-slate-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                    Extension
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                    Memory (MB)
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                    CPU (%)
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                    Load Time
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                    Performance Score
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-slate-200/60'>
                {topPerformers.map(ext => {
                  const perfScore = calculatePerformanceScore(ext);
                  return (
                    <tr key={ext.name} className='hover:bg-slate-50'>
                      <td className='px-4 py-4 whitespace-nowrap font-medium'>{ext.name}</td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                          <span className='font-mono'>{ext.memory?.toFixed(2)}</span>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              ext.memory > 100
                                ? 'bg-red-500'
                                : ext.memory > 50
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                          />
                        </div>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                          <span className='font-mono'>{ext.cpu?.toFixed(1)}</span>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              ext.cpu > 80
                                ? 'bg-red-500'
                                : ext.cpu > 60
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                          />
                        </div>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap font-mono'>
                        {ext.loadTime?.toFixed(3)}s
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <Badge
                          variant={
                            perfScore >= 80 ? 'success' : perfScore >= 60 ? 'warning' : 'danger'
                          }
                        >
                          {perfScore}/100
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export const CacheTab = ({
  metrics,
  chartData,
  colors
}: {
  metrics: any;
  chartData: any;
  colors: any;
}) => {
  const cache = metrics?.service_cache;

  if (!cache) {
    return (
      <div className='text-center py-12'>
        <Icons name='IconDatabase' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-slate-600 mb-2'>No Cache Data</h3>
        <p className='text-slate-500'>Cache information is not available.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Cache Performance Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-white p-4 rounded-lg border border-slate-200/60'>
          <div className='text-2xl font-bold text-blue-600'>{cache.cache_hits || 0}</div>
          <div className='text-slate-600'>Cache Hits</div>
          <div className='text-xs text-slate-500 mt-1'>
            Success rate: {Math.round(cache.hit_rate || 0)}%
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg border border-slate-200/60'>
          <div className='text-2xl font-bold text-red-600'>{cache.cache_misses || 0}</div>
          <div className='text-slate-600'>Cache Misses</div>
          <div className='text-xs text-slate-500 mt-1'>
            Miss rate: {Math.round(100 - (cache.hit_rate || 0))}%
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg border border-slate-200/60'>
          <div className='text-2xl font-bold text-green-600'>{cache.registrations || 0}</div>
          <div className='text-slate-600'>Registrations</div>
          <div className='text-xs text-slate-500 mt-1'>Service registrations</div>
        </div>
        <div className='bg-white p-4 rounded-lg border border-slate-200/60'>
          <div className='text-2xl font-bold text-orange-600'>{cache.size || 0}</div>
          <div className='text-slate-600'>Cache Size</div>
          <div className='text-xs text-slate-500 mt-1'>Total entries</div>
        </div>
      </div>

      {/* Cache Performance Chart */}
      <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
        <h3 className='text-lg font-semibold mb-4'>Cache Performance Metrics</h3>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData.cacheData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='value' fill={colors.primary} name='Current Value' />
              <Bar dataKey='target' fill={colors.success} name='Target Value' opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cache Details */}
      <div className='grid lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
          <h3 className='text-lg font-semibold mb-4'>Cache Configuration</h3>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span className='text-slate-600'>TTL (Time to Live)</span>
              <span className='font-medium'>{cache.ttl_seconds}s</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Cache Age</span>
              <span className='font-medium'>{Math.round(cache.age_seconds || 0)}s</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Status</span>
              <Badge variant={cache.status === 'active' ? 'success' : 'warning'}>
                {cache.status}
              </Badge>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Expired</span>
              <Badge variant={cache.is_expired ? 'danger' : 'success'}>
                {cache.is_expired ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
          <h3 className='text-lg font-semibold mb-4'>Cache Operations</h3>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Total Updates</span>
              <span className='font-medium'>{cache.updates || 0}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Evictions</span>
              <span className='font-medium'>{cache.evictions || 0}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Lookups</span>
              <span className='font-medium'>{cache.lookups || 0}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Health Checks</span>
              <span className='font-medium'>{cache.health_checks || 0}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Errors</span>
              <span className='font-medium text-red-600'>{cache.errors || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SystemTab = ({ metrics }: { metrics: any; colors: any }) => {
  const system = metrics?.system;
  const security = metrics?.security;

  return (
    <div className='space-y-6'>
      {/* System Performance */}
      {system && (
        <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
          <h3 className='text-lg font-semibold mb-4'>System Performance</h3>
          <div className='grid md:grid-cols-3 gap-4'>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>
                {Math.round(system.memory_usage_mb)}MB
              </div>
              <div className='text-slate-600'>Memory Usage</div>
              <div className='w-full bg-slate-200 rounded-full h-2 mt-2'>
                <div
                  className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${Math.min((system.memory_usage_mb / 2048) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>{system.goroutines}</div>
              <div className='text-slate-600'>Goroutines</div>
              <div className='text-xs text-slate-500 mt-2'>Concurrent processes</div>
            </div>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600'>{system.gc_cycles}</div>
              <div className='text-slate-600'>GC Cycles</div>
              <div className='text-xs text-slate-500 mt-2'>Garbage collection runs</div>
            </div>
          </div>
        </div>
      )}

      {/* Security Status */}
      {security && (
        <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
          <h3 className='text-lg font-semibold mb-4'>Security Status</h3>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <Icons name='IconShield' className='w-8 h-8 mx-auto mb-2 text-green-600' />
              <div className='font-medium'>Sandbox</div>
              <Badge variant={security.sandbox_enabled ? 'success' : 'warning'}>
                {security.sandbox_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-xl font-bold text-blue-600'>{security.trusted_sources}</div>
              <div className='text-slate-600'>Trusted Sources</div>
            </div>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-xl font-bold text-green-600'>{security.allowed_paths}</div>
              <div className='text-slate-600'>Allowed Paths</div>
            </div>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-xl font-bold text-red-600'>{security.blocked_extensions}</div>
              <div className='text-slate-600'>Blocked Extensions</div>
            </div>
          </div>
        </div>
      )}

      {/* Data Health Components */}
      {metrics?.data_health?.components && (
        <div className='bg-white rounded-lg p-6 border border-slate-200/60'>
          <h3 className='text-lg font-semibold mb-4'>Data Layer Components</h3>
          <div className='grid gap-3'>
            {Object.entries(metrics.data_health.components).map(
              ([name, component]: [string, any]) => (
                <div
                  key={name}
                  className='flex items-center justify-between p-3 bg-slate-50 rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center'>
                      <Icons
                        name={component.status === 'healthy' ? 'IconCheck' : 'IconAlertTriangle'}
                        className={`w-3 h-3 ${component.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'}`}
                      />
                    </div>
                    <span className='font-medium capitalize'>{name}</span>
                  </div>
                  <Badge variant={component.status === 'healthy' ? 'success' : 'warning'}>
                    {component.status}
                  </Badge>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate performance score
const calculatePerformanceScore = (ext: any): number => {
  let score = 100;

  // Memory penalty
  if (ext.memory > 100) score -= 20;
  else if (ext.memory > 50) score -= 10;

  // CPU penalty
  if (ext.cpu > 80) score -= 30;
  else if (ext.cpu > 60) score -= 15;

  // Load time penalty
  if (ext.loadTime > 5) score -= 20;
  else if (ext.loadTime > 2) score -= 10;

  return Math.max(score, 0);
};
