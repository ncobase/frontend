// Core extension types
export interface Extension {
  name: string;
  version: string;
  description?: string;
  type: 'module' | 'plugin';
  group: string;
  dependencies?: string[];
}

export interface ExtensionStatus {
  [extensionName: string]: 'active' | 'inactive' | 'error' | 'loading';
}

export interface ExtensionListResponse {
  [group: string]: {
    [type: string]: Extension[];
  };
}

// Metrics types
export interface ExtensionMetrics {
  name: string;
  load_time_ms: number;
  init_time_ms: number;
  loaded_at: string;
  initialized_at: string;
  status: string;
  service_calls: number;
  service_errors: number;
  events_published: number;
  events_received: number;
  circuit_breaker_trips: number;
}

export interface SystemMetrics {
  start_time: string;
  memory_usage_mb: number;
  goroutine_count: number;
  gc_cycles: number;
  services_registered: number;
  service_cache_hits: number;
  service_cache_misses: number;
}

export interface MetricsSnapshot {
  extension_name: string;
  metric_type: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface AggregatedMetrics {
  extension_name: string;
  metric_type: string;
  values: TimeSeriesPoint[];
  aggregation: string;
}

export interface MetricsResponse {
  enabled: boolean;
  timestamp: string;
  system: SystemMetrics;
  extensions: Record<string, ExtensionMetrics>;
  storage: StorageStats;
}

export interface StorageStats {
  type: string;
  total: number;
  keys: number;
  memory_mb: number;
  retention: string;
}

// Comprehensive metrics types
export interface ComprehensiveMetricsResponse {
  summary: {
    active_extensions: number;
    data_layer_status: string;
    messaging_status: {
      available: boolean;
      services: {
        kafka: boolean;
        rabbitmq: boolean;
      };
    };
    total_extensions: number;
  };
  details: {
    data: {
      status: string;
      timestamp: string;
    };
    events: EventsMetrics;
    extensions: MetricsResponse;
    service_discovery: ServiceDiscoveryMetrics;
  };
  timestamp: string;
}

// Events metrics types
export interface EventsMetrics {
  dispatcher: {
    active_handlers: number;
    delivered: number;
    events_per_second: number;
    failed: number;
    last_event_time: string;
    published: number;
    retries: number;
    success_rate: number;
    total_subscribers: number;
  };
  extensions: Record<
    string,
    {
      published: number;
      received: number;
    }
  >;
  status: string;
  timestamp: string;
}

// Service discovery metrics types
export interface ServiceDiscoveryMetrics {
  age_seconds: number;
  cache_hits: number;
  cache_misses: number;
  deregistrations: number;
  errors: number;
  evictions: number;
  health_checks: number;
  hit_rate: number;
  is_expired: boolean;
  last_update: string;
  lookups: number;
  registrations: number;
  size: number;
  status: string;
  ttl_seconds: number;
  updates: number;
}

// Data metrics types
export interface DataMetrics {
  status: 'metrics_available' | 'metrics_unavailable';
  timestamp: string;
  data?: any; // Additional data when available
}

// Health types
export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  extensions: number;
  components: Record<string, ComponentHealth>;
}

export interface ComponentHealth {
  status: string;
  [key: string]: any;
}

export interface DataHealth {
  status: string;
  timestamp: string;
  services: Record<string, ServiceHealth>;
}

export interface ServiceHealth {
  healthy: boolean;
  error?: string;
  response_ms?: number;
}

export interface CircuitBreaker {
  state: 'open' | 'closed' | 'half-open';
  requests: number;
  total_successes: number;
  total_failures: number;
}

export interface CircuitBreakerStatus {
  total: number;
  open: number;
  closed: number;
  breakers: Record<string, CircuitBreaker>;
}

// Query types
export interface QueryOptions {
  extension_name?: string;
  metric_type?: string;
  labels?: Record<string, string>;
  start_time: string;
  end_time: string;
  aggregation?: 'raw' | 'sum' | 'avg' | 'max' | 'min' | 'count';
  interval?: string;
  limit?: number;
}

export interface HistoricalMetricsResponse {
  query: QueryOptions;
  results: AggregatedMetrics[];
  count: number;
}

export interface LatestMetricsResponse {
  extension: string;
  limit: number;
  count: number;
  snapshots: MetricsSnapshot[];
}

// Action types
export interface ExtensionActionResponse {
  message: string;
  plugin?: string;
}

// UI State types
export interface FilterState {
  search: string;
  group: string;
  type: string;
  status: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface ExtensionWithStatus extends Extension {
  currentStatus: string;
  error?: string;
  metrics?: ExtensionMetrics;
}

// Constants
export const EXTENSION_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ERROR: 'error',
  LOADING: 'loading'
} as const;

export const METRIC_TYPES = {
  LOAD_TIME: 'load_time',
  INIT_TIME: 'init_time',
  SERVICE_CALL: 'service_call',
  EVENT_PUBLISHED: 'event_published',
  EVENT_RECEIVED: 'event_received',
  CIRCUIT_BREAKER_TRIP: 'circuit_breaker_trip',
  MEMORY_USAGE: 'memory_usage',
  GOROUTINE_COUNT: 'goroutine_count',
  GC_CYCLES: 'gc_cycles'
} as const;

export const AGGREGATION_TYPES = {
  RAW: 'raw',
  SUM: 'sum',
  AVG: 'avg',
  MAX: 'max',
  MIN: 'min',
  COUNT: 'count'
} as const;
