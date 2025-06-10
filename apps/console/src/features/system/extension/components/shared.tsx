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

import type { ExtensionWithStatus, ChartDataPoint } from '../extension.d';
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
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:border-primary-300' : ''}`}
      onClick={onClick}
    >
      <CardContent>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-slate-600'>System Health</p>
            <p className='text-3xl font-bold mt-1'>{score}%</p>
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
                stroke={score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.danger}
                strokeWidth='4'
                fill='none'
                strokeDasharray={`${(score / 100) * 175.929} 175.929`}
                className='transition-all duration-300'
              />
            </svg>
            <div className='absolute inset-0 flex items-center justify-center'>
              <Icons
                name={score >= 80 ? 'IconCheck' : score >= 60 ? 'IconAlertTriangle' : 'IconX'}
                className={`w-6 h-6 ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}
              />
            </div>
          </div>
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <Badge variant={healthStatus.variant}>{healthStatus.label}</Badge>
          <span className='text-sm text-slate-500'>
            {active}/{total} Active
          </span>
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
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:border-primary-300' : ''}`}
      onClick={onClick}
    >
      <CardContent>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-slate-600'>{title}</p>
            <p className='text-3xl font-bold mt-1'>
              {formattedValue}
              {unit && <span className='text-lg text-slate-500 ml-1'>{unit}</span>}
            </p>
            {subtitle && <p className='text-sm text-slate-500 mt-1'>{subtitle}</p>}
          </div>
          <div
            className='w-12 h-12 rounded-full flex items-center justify-center'
            style={{ backgroundColor: `${color}15` }}
          >
            <Icons name={icon} className='w-6 h-6' style={{ color }} />
          </div>
        </div>
        {trend && (
          <div className='mt-4 flex items-center gap-2'>
            <Icons
              name={trend.isPositive ? 'IconTrendingUp' : 'IconTrendingDown'}
              className={`w-4 h-4 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
            />
            <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend.value)}%
            </span>
            <span className='text-sm text-slate-500'>vs last period</span>
          </div>
        )}
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
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:border-primary-300' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          {title}
          <Icons name='IconExternalLink' className='w-4 h-4 text-slate-400' />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                outerRadius={80}
                dataKey='value'
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {onClick && (
          <div className='mt-4 text-center text-sm text-slate-500'>Click to view details</div>
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
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:border-primary-300' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          {title}
          <Icons name='IconExternalLink' className='w-4 h-4 text-slate-400' />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data.slice(0, 8)}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Bar dataKey='memory' fill={COLORS.primary} name='Memory (MB)' />
              <Bar dataKey='initTime' fill={COLORS.success} name='Init Time (ms)' />
              <Bar dataKey='score' fill={COLORS.warning} name='Performance Score' />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {onClick && (
          <div className='mt-4 text-center text-sm text-slate-500'>
            Click to view detailed analysis
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
      className={`border border-slate-200/60 hover:border-primary-100 hover:shadow-sm transition-all duration-200 ${
        extension.currentStatus === 'error' ? 'bg-red-50/30' : ''
      }`}
    >
      <CardHeader>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <CardTitle className='text-base font-medium truncate mb-1'>{extension.name}</CardTitle>
            <div className='flex items-center flex-wrap gap-2'>
              <Badge
                variant={getStatusVariant(extension.currentStatus)}
                className='text-xs font-medium'
              >
                {extension.currentStatus}
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
            {extension.metrics && (
              <Tooltip
                content={`Init: ${extension.metrics.init_time_ms}ms, Calls: ${extension.metrics.service_calls}`}
              >
                <div className='flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-600 cursor-help'>
                  <Icons name='IconActivity' className='w-3 h-3' />
                  <span>{extension.metrics.service_calls}</span>
                </div>
              </Tooltip>
            )}
            {performanceScore !== null && (
              <Tooltip content={`Performance Score: ${performanceScore}/100`}>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs cursor-help ${
                    performanceScore >= 80
                      ? 'bg-green-100 text-green-600'
                      : performanceScore >= 60
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                  }`}
                >
                  <Icons name='IconTarget' className='w-3 h-3' />
                  <span>{performanceScore}</span>
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

        {extension.currentStatus === 'error' && (
          <div className='text-xs text-red-600 p-2 bg-red-50 rounded-md border border-red-100'>
            <div className='flex items-center gap-1.5 font-medium mb-1'>
              <Icons name='IconAlertTriangle' className='w-3.5 h-3.5' />
              Error Status
            </div>
            Extension is in error state and requires attention
          </div>
        )}

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Tooltip content='Load Extension'>
              <Button
                size='sm'
                variant={extension.currentStatus === 'active' ? 'primary' : 'outline-slate'}
                onClick={() => onAction('load', extension.name)}
                disabled={extension.currentStatus === 'active'}
              >
                <Icons name='IconPlayerPlayFilled' className='w-4 h-4' />
              </Button>
            </Tooltip>
            <Tooltip content='Unload Extension'>
              <Button
                size='sm'
                variant={extension.currentStatus === 'inactive' ? 'primary' : 'outline-slate'}
                onClick={() => onAction('unload', extension.name)}
                disabled={extension.currentStatus === 'inactive'}
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
            onClick={() => onViewMetrics(extension.name)}
            className='text-xs'
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
  <div className='grid md:grid-cols-4 gap-4'>
    <div
      className='p-4 bg-white rounded-lg border border-slate-200/60 hover:border-primary-300 cursor-pointer transition-colors'
      onClick={onViewHealth}
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
      onClick={onViewMetrics}
    >
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
          <Icons name='IconActivity' className='w-5 h-5 text-blue-600' />
        </div>
        <div>
          <div className='font-medium'>Metrics Dashboard</div>
          <div className='text-sm text-slate-500'>View performance metrics</div>
        </div>
      </div>
    </div>

    <div
      className='p-4 bg-white rounded-lg border border-slate-200/60 hover:border-primary-300 cursor-pointer transition-colors'
      onClick={onViewCollections}
    >
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
          <Icons name='IconDatabase' className='w-5 h-5 text-purple-600' />
        </div>
        <div>
          <div className='font-medium'>Data Collections</div>
          <div className='text-sm text-slate-500'>Browse metric collections</div>
        </div>
      </div>
    </div>

    <div className='p-4 bg-white rounded-lg border border-slate-200/60'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center'>
          <Icons name='IconRefresh' className='w-5 h-5 text-orange-600' />
        </div>
        <div className='flex-1'>
          <div className='font-medium'>System Actions</div>
          <div className='text-sm text-slate-500'>Refresh and manage</div>
        </div>
        <Button
          size='sm'
          variant='outline-slate'
          onClick={onRefresh}
          disabled={loading}
          className='text-xs'
        >
          <Icons name='IconRefresh' className='w-4 h-4 mr-1' />
          Refresh
        </Button>
      </div>
    </div>
  </div>
);
