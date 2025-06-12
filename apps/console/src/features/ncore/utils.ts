import type {
  Extension,
  ExtensionWithStatus,
  ExtensionMetrics,
  ChartDataPoint,
  FilterState
} from './ncore';

// Color palette for charts and status indicators
export const COLORS = {
  primary: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  gray: '#6B7280',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  emerald: '#059669',
  orange: '#EA580C'
} as const;

export const STATUS_COLORS = {
  active: COLORS.success,
  inactive: COLORS.warning,
  error: COLORS.danger,
  loading: COLORS.info
} as const;

// Status badge variants
export function getStatusVariant(status: string) {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'healthy':
    case 'enabled':
      return 'success' as const;
    case 'inactive':
    case 'disabled':
    case 'degraded':
      return 'warning' as const;
    case 'error':
    case 'failed':
    case 'unhealthy':
      return 'danger' as const;
    case 'loading':
    case 'initializing':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
}

// Icon mapping for different components
export function getComponentIcon(name: string): string {
  switch (name.toLowerCase()) {
    case 'extensions':
    case 'extension':
      return 'IconPackage';
    case 'data':
    case 'database':
      return 'IconDatabase';
    case 'metrics':
    case 'metric':
      return 'IconActivity';
    case 'service_discovery':
    case 'discovery':
      return 'IconNetwork';
    case 'cache':
    case 'redis':
      return 'IconServer';
    case 'events':
    case 'messaging':
      return 'IconBell';
    case 'health':
      return 'IconHeart';
    case 'system':
      return 'IconCpu';
    case 'security':
      return 'IconShield';
    default:
      return 'IconSettings';
  }
}

// Format numeric values for display
export function formatValue(value: number, unit?: string): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }

  // Memory formatting
  if (unit === 'MB' || unit === 'memory') {
    if (value >= 1024) {
      return `${(value / 1024).toFixed(1)}GB`;
    }
    return `${value.toFixed(1)}MB`;
  }

  // Percentage formatting
  if (unit === '%' || unit === 'percent') {
    return `${value.toFixed(1)}%`;
  }

  // Duration formatting
  if (unit === 'ms' || unit === 'milliseconds') {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}s`;
    }
    return `${value}ms`;
  }

  // Large number formatting
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  // Default formatting
  if (value % 1 === 0) {
    return value.toString();
  }
  return value.toFixed(2);
}

// Calculate uptime from start time
export function formatUptime(startTime: string): string {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Calculate health score
export function calculateHealthScore(total: number, healthy: number): number {
  if (total === 0) return 100;
  return Math.round((healthy / total) * 100);
}

// Get health status label and variant
export function getHealthStatus(score: number) {
  if (score >= 95) return { label: 'Excellent', variant: 'success' as const };
  if (score >= 80) return { label: 'Good', variant: 'success' as const };
  if (score >= 60) return { label: 'Degraded', variant: 'warning' as const };
  return { label: 'Critical', variant: 'danger' as const };
}

// Transform extensions data for display
export function transformExtensionsData(
  extensions: Record<string, Record<string, Extension[]>>,
  status: Record<string, string>,
  metrics?: Record<string, ExtensionMetrics>
): ExtensionWithStatus[] {
  const result: ExtensionWithStatus[] = [];

  Object.entries(extensions).forEach(([group, types]) => {
    Object.entries(types).forEach(([type, exts]) => {
      exts.forEach(ext => {
        result.push({
          ...ext,
          group,
          type: type as 'module' | 'plugin',
          currentStatus: status[ext.name] || 'unknown',
          metrics: metrics?.[ext.name]
        });
      });
    });
  });

  return result;
}

// Filter extensions based on criteria
export function filterExtensions(
  extensions: ExtensionWithStatus[],
  filters: FilterState
): ExtensionWithStatus[] {
  return extensions.filter(ext => {
    const matchesSearch =
      !filters.search ||
      ext.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      ext.description?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesGroup = !filters.group || ext.group === filters.group;
    const matchesType = !filters.type || ext.type === filters.type;
    const matchesStatus = !filters.status || ext.currentStatus === filters.status;

    return matchesSearch && matchesGroup && matchesType && matchesStatus;
  });
}

// Calculate extension statistics
export function calculateExtensionStats(extensions: ExtensionWithStatus[]) {
  const total = extensions.length;
  const active = extensions.filter(ext => ext.currentStatus === 'active').length;
  const error = extensions.filter(ext => ext.currentStatus === 'error').length;
  const inactive = extensions.filter(ext =>
    ['inactive', 'disabled'].includes(ext.currentStatus)
  ).length;

  return {
    total,
    active,
    error,
    inactive,
    healthScore: calculateHealthScore(total, active)
  };
}

// Prepare chart data for status distribution
export function prepareStatusChartData(
  stats: ReturnType<typeof calculateExtensionStats>
): ChartDataPoint[] {
  return [
    { name: 'Active', value: stats.active, color: STATUS_COLORS.active },
    { name: 'Error', value: stats.error, color: STATUS_COLORS.error },
    { name: 'Inactive', value: stats.inactive, color: STATUS_COLORS.inactive }
  ].filter(item => item.value > 0);
}

// Prepare chart data for group distribution
export function prepareGroupChartData(extensions: ExtensionWithStatus[]): ChartDataPoint[] {
  const groupCounts = extensions.reduce(
    (acc, ext) => {
      acc[ext.group] = (acc[ext.group] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(groupCounts).map(([name, value]) => ({
    name,
    value,
    color: COLORS.primary
  }));
}

// Get unique filter options
export function getFilterOptions(extensions: ExtensionWithStatus[]) {
  const groups = [...new Set(extensions.map(ext => ext.group))];
  const types = [...new Set(extensions.map(ext => ext.type))];
  const statuses = [...new Set(extensions.map(ext => ext.currentStatus))];

  return { groups, types, statuses };
}

// Parse error message for display
export function parseErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error['message'];
  if (error?.error) return error.error;
  return 'Unknown error occurred';
}

// Format timestamp for display
export function formatTimestamp(
  timestamp: string,
  format: 'full' | 'short' | 'time' = 'full'
): string {
  const date = new Date(timestamp);

  if (format === 'time') {
    return date.toLocaleTimeString();
  }

  if (format === 'short') {
    return date.toLocaleDateString();
  }

  return date.toLocaleString();
}

// Calculate performance score for extensions
export function calculatePerformanceScore(metrics: ExtensionMetrics): number {
  let score = 100;

  // Penalize high init times (>100ms)
  if (metrics.init_time_ms > 100) {
    score -= Math.min(20, (metrics.init_time_ms / 100) * 10);
  }

  // Penalize service errors
  if (metrics.service_calls > 0) {
    const errorRate = metrics.service_errors / metrics.service_calls;
    score -= errorRate * 30;
  }

  // Penalize circuit breaker trips
  score -= metrics.circuit_breaker_trips * 10;

  return Math.max(0, Math.round(score));
}

// Generate time range options for queries
export function getTimeRangeOptions() {
  return [
    { label: '1 Hour', value: '1h', milliseconds: 60 * 60 * 1000 },
    { label: '6 Hours', value: '6h', milliseconds: 6 * 60 * 60 * 1000 },
    { label: '24 Hours', value: '24h', milliseconds: 24 * 60 * 60 * 1000 },
    { label: '7 Days', value: '7d', milliseconds: 7 * 24 * 60 * 60 * 1000 },
    { label: '30 Days', value: '30d', milliseconds: 30 * 24 * 60 * 60 * 1000 }
  ];
}

// Convert time range to start/end dates
export function getTimeRange(range: string) {
  const now = new Date();
  const option = getTimeRangeOptions().find(opt => opt.value === range);

  if (!option) {
    return {
      start: new Date(now.getTime() - 60 * 60 * 1000), // Default 1 hour
      end: now
    };
  }

  return {
    start: new Date(now.getTime() - option.milliseconds),
    end: now
  };
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Sort extensions by various criteria
export function sortExtensions(
  extensions: ExtensionWithStatus[],
  sortBy: 'name' | 'status' | 'group' | 'type' | 'performance',
  order: 'asc' | 'desc' = 'asc'
): ExtensionWithStatus[] {
  return [...extensions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'status':
        comparison = a.currentStatus.localeCompare(b.currentStatus);
        break;
      case 'group':
        comparison = a.group.localeCompare(b.group);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'performance':
        {
          const scoreA = a.metrics ? calculatePerformanceScore(a.metrics) : 0;
          const scoreB = b.metrics ? calculatePerformanceScore(b.metrics) : 0;
          comparison = scoreA - scoreB;
        }
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

// Check if extension is critical (system dependency)
export function isCriticalExtension(extension: ExtensionWithStatus): boolean {
  const criticalGroups = ['sys', 'default'];
  const criticalNames = ['auth', 'system', 'user', 'access'];

  return criticalGroups.includes(extension.group) || criticalNames.includes(extension.name);
}

// Generate export data for extensions
export function generateExportData(extensions: ExtensionWithStatus[]) {
  return extensions.map(ext => ({
    Name: ext.name,
    Version: ext.version,
    Group: ext.group,
    Type: ext.type,
    Status: ext.currentStatus,
    Description: ext.description || '',
    'Service Calls': ext.metrics?.service_calls || 0,
    'Service Errors': ext.metrics?.service_errors || 0,
    'Events Published': ext.metrics?.events_published || 0,
    'Events Received': ext.metrics?.events_received || 0,
    'Init Time (ms)': ext.metrics?.init_time_ms || 0,
    'Performance Score': ext.metrics ? calculatePerformanceScore(ext.metrics) : 0
  }));
}

// Validate extension name
export function validateExtensionName(name: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name);
}

// Get extension priority (for critical system extensions)
export function getExtensionPriority(extension: ExtensionWithStatus): number {
  if (isCriticalExtension(extension)) return 1;
  if (extension.group === 'sys') return 2;
  if (extension.type === 'module') return 3;
  return 4;
}

// Format bytes to human readable
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Get relative time string
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

// Create URL-safe slug
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      (cloned as any)[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  return obj;
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently ignore storage errors
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently ignore storage errors
    }
  }
};

// URL query parameter helpers
export const urlParams = {
  get: (key: string): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  set: (key: string, value: string): void => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  },

  remove: (key: string): void => {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  }
};
