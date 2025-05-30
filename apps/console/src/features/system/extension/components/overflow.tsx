import { ChartTooltip } from '@ncobase/charts';
import {
  Icons,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  CardContent,
  Button,
  Tooltip
} from '@ncobase/react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Legend
} from 'recharts';

export const ExtensionsGrid = ({
  extensions,
  isLoading,
  onAction,
  getStatusBadge,
  goToMetrics
}: {
  extensions: any[];
  isLoading: boolean;
  onAction: (_action: string, _name: string) => void;
  getStatusBadge: (_status: any) => string;
  goToMetrics: (_collection?: string) => void;
}) => {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg text-slate-600'>Loading extensions...</div>
      </div>
    );
  }

  if (extensions.length === 0) {
    return (
      <div className='text-center py-12'>
        <Icons name='IconPackage' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-slate-600 mb-2'>No Extensions Found</h3>
        <p className='text-slate-500'>No extensions match the current filters.</p>
      </div>
    );
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {extensions.map(extension => (
        <Card
          key={extension.name}
          className={`border border-slate-200/60 hover:border-primary-100 hover:shadow-sm transition-all duration-200 ${
            extension.currentStatus.status === 'error' ? 'bg-red-50/30' : ''
          }`}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex-1 min-w-0'>
                <CardTitle className='text-base font-medium truncate mb-1'>
                  {extension.name}
                </CardTitle>
                <div className='flex items-center flex-wrap gap-2'>
                  <Badge
                    variant={getStatusBadge(extension.currentStatus)}
                    className='text-xs font-medium'
                  >
                    {extension.currentStatus.status}
                  </Badge>
                  <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                    <span className='font-medium'>{extension.group}</span>
                    <span>·</span>
                    <span>{extension.type}</span>
                    {extension.version && (
                      <>
                        <span>·</span>
                        <span className='font-medium'>v{extension.version}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-1'>
                {extension.resourceUsage && (
                  <Tooltip
                    content={`Memory: ${extension.resourceUsage.memory_usage_mb?.toFixed(1)}MB, CPU: ${extension.resourceUsage.cpu_usage_percent?.toFixed(1)}%`}
                  >
                    <div className='flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-600 cursor-help'>
                      <Icons name='IconCpu' className='w-3 h-3' />
                      <span>{extension.resourceUsage.memory_usage_mb?.toFixed(0)}MB</span>
                    </div>
                  </Tooltip>
                )}
                {extension.dependencies?.length > 0 && (
                  <Tooltip content={`Dependencies: ${extension.dependencies.join(', ')}`}>
                    <div className='flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-600 cursor-help'>
                      <Icons name='IconLink' className='w-3 h-3' />
                      <span>{extension.dependencies.length}</span>
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-3'>
            {extension.description && (
              <p className='text-sm text-slate-600 line-clamp-2'>{extension.description}</p>
            )}
            {extension.currentStatus?.error && (
              <div className='text-xs text-red-600 p-2 bg-red-50 rounded-md border border-red-100'>
                <div className='flex items-center gap-1.5 font-medium mb-1'>
                  <Icons name='IconAlertTriangle' className='w-3.5 h-3.5' />
                  Error
                </div>
                {extension.currentStatus.error}
              </div>
            )}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Tooltip content='Load Extension'>
                  <Button
                    size='sm'
                    variant={
                      extension.currentStatus.status === 'active' ? 'primary' : 'outline-slate'
                    }
                    onClick={() => onAction('load', extension.name)}
                    disabled={extension.currentStatus.status === 'active'}
                  >
                    <Icons name='IconPlayerPlayFilled' className='w-4 h-4' />
                  </Button>
                </Tooltip>
                <Tooltip content='Unload Extension'>
                  <Button
                    size='sm'
                    variant={
                      extension.currentStatus.status === 'inactive' ? 'primary' : 'outline-slate'
                    }
                    onClick={() => onAction('unload', extension.name)}
                    disabled={extension.currentStatus.status === 'inactive'}
                  >
                    <Icons name='IconPlayerPauseFilled' className='w-4 h-4' />
                  </Button>
                </Tooltip>
                <Tooltip content='Reload Extension'>
                  <Button
                    size='sm'
                    variant='outline-slate'
                    onClick={() => onAction('reload', extension.name)}
                    className='hover:bg-slate-100'
                  >
                    <Icons name='IconRefreshDot' className='w-4 h-4' />
                  </Button>
                </Tooltip>
              </div>
              <Button
                size='sm'
                variant='outline-slate'
                onClick={() => goToMetrics(extension.name)}
                className='text-xs'
              >
                View Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const AnalyticsView = ({
  chartData,
  stats,
  goToHealth,
  goToMetrics
}: {
  chartData: any;
  stats: any;
  goToHealth: () => void;
  goToMetrics: () => void;
}) => {
  return (
    <div className='grid lg:grid-cols-2 gap-6 pt-4'>
      {/* Status Distribution */}
      <Card className='cursor-pointer hover:shadow-md transition-shadow' onClick={goToHealth}>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={chartData.statusData}
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  dataKey='value'
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-4 text-center'>
            <p className='text-sm text-slate-500'>Click to view health details</p>
          </div>
        </CardContent>
      </Card>

      {/* Extensions by Group */}
      <Card className='cursor-pointer hover:shadow-md transition-shadow' onClick={goToMetrics}>
        <CardHeader>
          <CardTitle>Extensions by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData.groupData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey='value' fill='#4285F4' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-4 text-center'>
            <p className='text-sm text-slate-500'>Click to view detailed metrics</p>
          </div>
        </CardContent>
      </Card>

      {/* System Statistics */}
      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle>System Statistics</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export const PerformanceView = ({
  extensions,
  metrics,
  goToCollections
}: {
  extensions: any[];
  metrics: any;
  goToCollections: (_collection?: string) => void;
}) => {
  // Prepare performance data
  const performanceData = extensions
    .filter(ext => ext.resourceUsage)
    .map(ext => ({
      name: ext.name,
      memory: ext.resourceUsage.memory_usage_mb,
      cpu: ext.resourceUsage.cpu_usage_percent,
      status: ext.currentStatus.status
    }))
    .sort((a, b) => b.memory - a.memory)
    .slice(0, 10); // Top 10 by memory usage

  return (
    <div className='space-y-6 pt-4'>
      {/* Performance Overview */}
      <div className='grid md:grid-cols-3 gap-4'>
        <Card
          className='cursor-pointer hover:shadow-md transition-shadow'
          onClick={() => goToCollections('system')}
        >
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-slate-500 font-medium'>System Memory</p>
                <p className='text-3xl font-bold mt-1'>
                  {Math.round(metrics?.system?.memory_usage_mb || 0)}MB
                </p>
              </div>
              <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                <Icons name='IconCpu' className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <div className='mt-4'>
              <Badge variant='success'>{metrics?.system?.goroutines || 0} goroutines</Badge>
            </div>
          </CardContent>
        </Card>

        <Card
          className='cursor-pointer hover:shadow-md transition-shadow'
          onClick={() => goToCollections('cache')}
        >
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-slate-500 font-medium'>Cache Performance</p>
                <p className='text-3xl font-bold mt-1'>
                  {Math.round(metrics?.service_cache?.hit_rate || 0)}%
                </p>
              </div>
              <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
                <Icons name='IconDatabase' className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <div className='mt-4'>
              <Badge variant='outline'>{metrics?.service_cache?.cache_hits || 0} hits</Badge>
            </div>
          </CardContent>
        </Card>

        <Card
          className='cursor-pointer hover:shadow-md transition-shadow'
          onClick={() => goToCollections('extensions')}
        >
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-slate-500 font-medium'>Total Memory</p>
                <p className='text-3xl font-bold mt-1'>
                  {performanceData.reduce((sum, ext) => sum + (ext.memory || 0), 0).toFixed(1)}MB
                </p>
              </div>
              <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center'>
                <Icons name='IconActivity' className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <div className='mt-4'>
              <Badge variant='outline'>{performanceData.length} extensions tracked</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage Chart */}
      {performanceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Extensions by Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Bar dataKey='memory' fill='#4285F4' name='Memory (MB)' />
                  <Bar dataKey='cpu' fill='#34A853' name='CPU (%)' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Table */}
      {performanceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-slate-200/60'>
                <thead className='bg-slate-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Extension
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Status
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Memory (MB)
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      CPU (%)
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-slate-200/60'>
                  {performanceData.map((ext, _index) => (
                    <tr key={ext.name} className='hover:bg-slate-50'>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <div className='font-medium'>{ext.name}</div>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <Badge
                          variant={
                            ext.status === 'active'
                              ? 'success'
                              : ext.status === 'error'
                                ? 'danger'
                                : 'warning'
                          }
                        >
                          {ext.status}
                        </Badge>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                          <span className='font-mono'>{ext.memory?.toFixed(2)}</span>
                          <div
                            className='w-16 h-2 bg-slate-200 rounded-full overflow-hidden'
                            title={`${ext.memory?.toFixed(2)}MB`}
                          >
                            <div
                              className='h-full bg-blue-500 transition-all duration-300'
                              style={{
                                width: `${Math.min((ext.memory / Math.max(...performanceData.map(p => p.memory))) * 100, 100)}%`
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                          <span className='font-mono'>{ext.cpu?.toFixed(1)}</span>
                          <div
                            className='w-16 h-2 bg-slate-200 rounded-full overflow-hidden'
                            title={`${ext.cpu?.toFixed(1)}%`}
                          >
                            <div
                              className='h-full bg-green-500 transition-all duration-300'
                              style={{ width: `${Math.min(ext.cpu, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <Button
                          size='sm'
                          variant='outline-slate'
                          onClick={() => goToCollections(ext.name)}
                          className='text-xs'
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {performanceData.length === 0 && (
        <div className='text-center py-12'>
          <Icons name='IconActivity' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-slate-600 mb-2'>No Performance Data</h3>
          <p className='text-slate-500'>Resource usage information is not available.</p>
        </div>
      )}
    </div>
  );
};
