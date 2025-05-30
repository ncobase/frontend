// Extension types and interfaces
export interface ExtensionMetadata {
  name: string;
  version: string;
  description?: string;
  type: string;
  group: string;
  dependencies?: string[];
}

export interface Extension {
  name: string;
  version: string;
  group: string;
  type: string;
  description?: string;
  dependencies?: string[];
  status?: string;
}

// Metrics structure
export interface ExtensionMetrics {
  timestamp: string;
  collections?: {
    [collectionName: string]: {
      name: string;
      metrics: MetricSnapshot[];
      last_updated: string;
    };
  };
  storage?: {
    status: string;
    total_collections: number;
    total_metrics: number;
    collections: {
      [name: string]: {
        metric_count: number;
        last_updated: string;
      };
    };
  };
  service_cache?: {
    status: string;
    size: number;
    ttl_seconds: number;
    last_update: string;
    cache_hits: number;
    cache_misses: number;
    hit_rate: number;
    updates: number;
    evictions: number;
    age_seconds: number;
    is_expired: boolean;
    registrations: number;
    deregistrations: number;
    lookups: number;
    health_checks: number;
    errors: number;
  };
  data_health?: {
    status: string;
    components: {
      [name: string]: any;
    };
  };
  data_stats?: any;
  security?: {
    sandbox_enabled: boolean;
    signature_required: boolean;
    trusted_sources: number;
    allowed_paths: number;
    blocked_extensions: number;
  };
  resource_usage?: {
    [pluginName: string]: PluginMetrics;
  };
  system?: {
    memory_usage_mb: number;
    goroutines: number;
    gc_cycles: number;
  };
}

export interface MetricSnapshot {
  name: string;
  type: string; // counter, gauge, histogram, summary
  value: any;
  labels?: { [key: string]: string };
  timestamp: string;
  help?: string;
  unit?: string;
}

export interface PluginMetrics {
  memory_usage_mb: number;
  cpu_usage_percent: number;
  load_time: string;
  init_time?: string;
  last_access: string;
}

export interface ExtensionStatus {
  [key: string]: {
    status: string;
    error?: string;
    uptime?: number;
  };
}

export interface ExtensionListResponse {
  [group: string]: {
    [type: string]: Extension[];
  };
}

export interface ExtensionActionResponse {
  message: string;
}

export interface HealthCheckResponse {
  status: string; // healthy, degraded, unhealthy
  timestamp: string;
  extensions: number;
  components: {
    [name: string]: {
      status: string;
      [key: string]: any;
    };
  };
}

export interface CircuitBreakerStatus {
  total: number;
  open: number;
  closed: number;
  breakers: {
    [name: string]: {
      state: string;
      requests: number;
      total_successes: number;
      total_failures: number;
    };
  };
}
