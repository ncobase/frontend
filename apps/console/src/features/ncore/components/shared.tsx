import {
  Icons,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Tooltip
} from '@ncobase/react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend
} from 'recharts';

import type { ExtensionWithStatus, ChartDataPoint } from '../ncore';
import {
  getStatusVariant,
  formatValue,
  getHealthStatus,
  calculatePerformanceScore,
  COLORS
} from '../utils';

// Health Score Card Component
interface HealthScoreCardProps {
  score: number;
  total: number;
  active: number;
  onClick?: () => void;
}

export const HealthScoreCard = ({ score, total, active, onClick }: HealthScoreCardProps) => {
  const healthStatus = getHealthStatus(score);

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all duration-300 ${
        onClick ? 'hover:border-primary-300' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='flex items-center gap-4'>
          <div className='relative w-14 h-14'>
            <svg className='w-14 h-14 transform -rotate-90' viewBox='0 0 56 56'>
              <circle
                cx='28'
                cy='28'
                r='24'
                stroke='currentColor'
                strokeWidth='3'
                fill='none'
                className='text-slate-100'
              />
              <circle
                cx='28'
                cy='28'
                r='24'
                stroke={score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.danger}
                strokeWidth='3'
                fill='none'
                strokeDasharray={`${(score / 100) * 150.796} 150.796`}
                className='transition-all duration-500 ease-out'
              />
            </svg>
            <div className='absolute inset-0 flex items-center justify-center'>
              <Icons
                name={score >= 80 ? 'IconCheck' : score >= 60 ? 'IconAlertTriangle' : 'IconX'}
                className={`w-5 h-5 ${
                  score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}
              />
            </div>
          </div>

          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-medium text-slate-500'>System Health</p>
              <Badge variant={healthStatus.variant} className='text-[10px] px-1.5 py-0.5'>
                {healthStatus.label}
              </Badge>
            </div>
            <div className='flex items-baseline gap-2 mt-1'>
              <p className='text-2xl font-bold'>{score}%</p>
              <span className='text-xs text-slate-400'>
                {active}/{total} Active
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const MetricCard = ({
  title,
  value,
  unit,
  icon,
  color,
  subtitle,
  trend,
  onClick
}: MetricCardProps) => {
  const formattedValue = typeof value === 'number' ? formatValue(value, unit) : value;

  return (
    <Card
      className={`group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden ${
        onClick ? 'hover:border-primary-300' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className='relative p-4'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity' />
        <div className='relative flex items-start gap-3'>
          <div
            className='w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform'
            style={{ backgroundColor: `${color}15` }}
          >
            <Icons name={icon} className='w-5 h-5' style={{ color }} />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between'>
              <p className='text-xs font-medium text-slate-500'>{title}</p>
              {trend && (
                <div className='flex items-center gap-1.5'>
                  <Icons
                    name={trend.isPositive ? 'IconTrendingUp' : 'IconTrendingDown'}
                    className={`w-3 h-3 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
                  />
                  <span
                    className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {Math.abs(trend.value)}%
                  </span>
                  <span className='text-xs text-slate-400'>vs last</span>
                </div>
              )}
            </div>
            <div className='flex items-baseline gap-1 mt-0.5'>
              <p className='text-2xl font-bold truncate'>{formattedValue}</p>
              {unit && <span className='text-sm text-slate-400'>{unit}</span>}
            </div>
            {subtitle && <p className='text-xs text-slate-400 mt-0.5 truncate'>{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Status Distribution Chart
interface StatusChartProps {
  data: ChartDataPoint[];
  title: string;
  onClick?: () => void;
}

export const StatusChart = ({ data, title, onClick }: StatusChartProps) => {
  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all duration-300 ${
        onClick ? 'hover:border-primary-300 hover:scale-[1.02]' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center justify-between text-sm font-medium'>
          {title}
          <Icons name='IconExternalLink' className='w-3.5 h-3.5 text-slate-400 opacity-60' />
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='h-52'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={35}
                outerRadius={65}
                dataKey='value'
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className='hover:opacity-80 transition-opacity'
                  />
                ))}
              </Pie>
              <ChartTooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {onClick && (
          <div className='mt-2 text-center text-xs text-slate-400 hover:text-slate-600 transition-colors'>
            Click for detailed view
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Performance Bar Chart
interface PerformanceChartProps {
  data: Array<{
    name: string;
    memory?: number;
    cpu?: number;
    initTime?: number;
    score?: number;
  }>;
  title: string;
  onClick?: () => void;
}

export const PerformanceChart = ({ data, title, onClick }: PerformanceChartProps) => {
  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group ${
        onClick ? 'hover:border-primary-300 hover:scale-[1.01]' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center justify-between text-sm font-medium'>
          {title}
          <Icons
            name='IconExternalLink'
            className='w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-primary-500 transition-all'
          />
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='h-56'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data.slice(0, 8)} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray='2 4' stroke='#f1f5f9' />
              <XAxis
                dataKey='name'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <ChartTooltip
                cursor={{ fill: 'rgba(241,245,249,0.5)' }}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} iconSize={8} iconType='circle' />
              <Bar
                dataKey='memory'
                fill={COLORS.primary}
                name='Memory (MB)'
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey='initTime'
                fill={COLORS.success}
                name='Init Time (ms)'
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey='score'
                fill={COLORS.warning}
                name='Performance Score'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {onClick && (
          <div className='mt-2 text-center text-xs text-slate-400 group-hover:text-primary-500 transition-colors'>
            Click for detailed analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Extension Grid Item Component
interface ExtensionCardProps {
  extension: ExtensionWithStatus;
  onAction: (_action: string, _name: string) => void;
  onViewMetrics: (_name: string) => void;
}

export const ExtensionCard = ({ extension, onAction, onViewMetrics }: ExtensionCardProps) => {
  const performanceScore = extension.metrics ? calculatePerformanceScore(extension.metrics) : null;

  return (
    <Card
      className={`relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
        extension.currentStatus === 'error' ? 'bg-red-50/30' : 'bg-gradient-to-br from-slate-50/50'
      }`}
    >
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-2'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <CardTitle className='text-base font-medium truncate'>{extension.name}</CardTitle>
              <Badge
                variant={getStatusVariant(extension.currentStatus)}
                className='text-[10px] px-1.5 py-0.5'
              >
                {extension.currentStatus}
              </Badge>
            </div>
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
          <div className='flex items-center gap-1.5'>
            {extension.metrics && (
              <Tooltip
                content={`Init: ${extension.metrics.init_time_ms}ms, Calls: ${extension.metrics.service_calls}`}
              >
                <div className='flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100/80 text-[10px] text-slate-600'>
                  <Icons name='IconActivity' className='w-3 h-3' />
                  {extension.metrics.service_calls}
                </div>
              </Tooltip>
            )}
            {performanceScore !== null && (
              <Tooltip content={`Performance Score: ${performanceScore}/100`}>
                <div
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                    performanceScore >= 80
                      ? 'bg-green-50 text-green-600'
                      : performanceScore >= 60
                        ? 'bg-yellow-50 text-yellow-600'
                        : 'bg-red-50 text-red-600'
                  }`}
                >
                  <Icons name='IconTarget' className='w-3 h-3' />
                  {performanceScore}
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-2 pt-0'>
        {extension.description && (
          <p className='text-xs text-slate-600 line-clamp-2'>{extension.description}</p>
        )}

        {extension.currentStatus === 'error' && (
          <div className='text-[10px] text-red-600 p-1.5 bg-red-50/80 rounded border border-red-100/80'>
            <div className='flex items-center gap-1 font-medium'>
              <Icons name='IconAlertTriangle' className='w-3 h-3' />
              Error: Extension requires attention
            </div>
          </div>
        )}

        <div className='flex items-center justify-between pt-1'>
          <div className='flex items-center gap-1'>
            <Tooltip content='Load Extension'>
              <Button
                size='xs'
                variant={extension.currentStatus === 'active' ? 'primary' : 'outline-slate'}
                onClick={() => onAction('load', extension.name)}
                disabled={extension.currentStatus === 'active'}
              >
                <Icons name='IconPlayerPlayFilled' className='w-3.5 h-3.5' />
              </Button>
            </Tooltip>
            <Tooltip content='Unload Extension'>
              <Button
                size='xs'
                variant={extension.currentStatus === 'inactive' ? 'primary' : 'outline-slate'}
                onClick={() => onAction('unload', extension.name)}
                disabled={extension.currentStatus === 'inactive'}
              >
                <Icons name='IconPlayerPauseFilled' className='w-3.5 h-3.5' />
              </Button>
            </Tooltip>
            <Tooltip content='Reload Extension'>
              <Button
                size='xs'
                variant='outline-slate'
                onClick={() => onAction('reload', extension.name)}
                className='hover:bg-slate-50'
              >
                <Icons name='IconRefreshDot' className='w-3.5 h-3.5' />
              </Button>
            </Tooltip>
          </div>
          <Button
            size='xs'
            variant='outline-slate'
            onClick={() => onViewMetrics(extension.name)}
            className='text-[10px]'
          >
            View Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading State Component
export const LoadingCard = () => (
  <Card className='border border-slate-200/60'>
    <CardContent>
      <div className='animate-pulse space-y-4'>
        <div className='h-4 bg-slate-200 rounded w-3/4'></div>
        <div className='space-y-2'>
          <div className='h-3 bg-slate-200 rounded'></div>
          <div className='h-3 bg-slate-200 rounded w-5/6'></div>
        </div>
        <div className='flex gap-2'>
          <div className='h-8 bg-slate-200 rounded w-16'></div>
          <div className='h-8 bg-slate-200 rounded w-16'></div>
          <div className='h-8 bg-slate-200 rounded w-16'></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Empty State Component
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className='text-center py-12'>
    <Icons name={icon} className='w-16 h-16 text-slate-400 mx-auto mb-4' />
    <h3 className='text-lg font-medium text-slate-600 mb-2'>{title}</h3>
    <p className='text-slate-500 mb-4'>{description}</p>
    {action && (
      <Button variant='outline-slate' onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

// Quick Actions Component
interface QuickActionsProps {
  onRefresh: () => void;
  onViewHealth: () => void;
  onViewMetrics: () => void;
  onViewCollections: () => void;
  loading?: boolean;
}

export const QuickActions = ({
  onRefresh,
  onViewHealth,
  onViewMetrics,
  onViewCollections,
  loading
}: QuickActionsProps) => (
  <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3'>
    <div
      className='group p-4 bg-white rounded-xl border border-slate-200/60 hover:border-primary-300 hover:shadow-lg cursor-pointer transition-all duration-200 relative overflow-hidden'
      onClick={onViewHealth}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
      <div className='relative flex items-center gap-3'>
        <div className='w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center transform group-hover:scale-110 transition-transform'>
          <Icons name='IconHeart' className='w-6 h-6 text-green-600' />
        </div>
        <div>
          <div className='font-semibold text-slate-800'>System Health</div>
          <div className='text-sm text-slate-500'>View health dashboard</div>
        </div>
      </div>
    </div>

    <div
      className='group p-4 bg-white rounded-xl border border-slate-200/60 hover:border-primary-300 hover:shadow-lg cursor-pointer transition-all duration-200 relative overflow-hidden'
      onClick={onViewMetrics}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
      <div className='relative flex items-center gap-3'>
        <div className='w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center transform group-hover:scale-110 transition-transform'>
          <Icons name='IconActivity' className='w-6 h-6 text-blue-600' />
        </div>
        <div>
          <div className='font-semibold text-slate-800'>Metrics</div>
          <div className='text-sm text-slate-500'>View performance metrics</div>
        </div>
      </div>
    </div>

    <div
      className='group p-4 bg-white rounded-xl border border-slate-200/60 hover:border-primary-300 hover:shadow-lg cursor-pointer transition-all duration-200 relative overflow-hidden'
      onClick={onViewCollections}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
      <div className='relative flex items-center gap-3'>
        <div className='w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center transform group-hover:scale-110 transition-transform'>
          <Icons name='IconDatabase' className='w-6 h-6 text-purple-600' />
        </div>
        <div>
          <div className='font-semibold text-slate-800'>Collections</div>
          <div className='text-sm text-slate-500'>Browse metric data</div>
        </div>
      </div>
    </div>

    <div className='group p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-lg transition-all duration-200 relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
      <div className='relative flex items-center gap-3'>
        <div className='w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center transform group-hover:scale-110 transition-transform'>
          <Icons name='IconRefresh' className='w-6 h-6 text-orange-600' />
        </div>
        <div className='flex-1'>
          <div className='font-semibold text-slate-800'>Actions</div>
          <div className='text-sm text-slate-500'>System controls</div>
        </div>
        <Button
          size='sm'
          variant='outline-slate'
          onClick={onRefresh}
          disabled={loading}
          className='text-xs hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors'
        >
          <Icons name='IconRefresh' className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  </div>
);
