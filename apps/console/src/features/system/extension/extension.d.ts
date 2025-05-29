// Extension types and interfaces
export interface Extension {
  name: string;
  version?: string;
  group: string;
  type: 'module' | 'plugin';
  status: 'active' | 'inactive' | 'error';
  description?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ExtensionMetrics {
  events: {
    memory: {
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
    queue: {
      consume_failed: number;
      consume_success_rate: number;
      consumed: number;
      failed: number;
      last_consume_time: string;
      last_publish_time: string;
      publish_success_rate: number;
      published: number;
      retries: number;
    };
    status: string;
    timestamp: string;
    total: {
      failed: number;
      published: number;
      success: number;
      success_rate: number;
    };
  };
  extensions: {
    by_group: Record<string, number>;
    by_status: Record<string, number>;
    by_type: Record<string, number>;
    circuit_breakers: number;
    cross_services: number;
    initialized: boolean;
    total: number;
  };
  messaging: {
    fallback_active: boolean;
    fallback_reason: string;
    kafka_connected: boolean;
    memory_fallback: boolean;
    overall_available: boolean;
    primary_transport: string;
    rabbitmq_connected: boolean;
  };
  service_cache: {
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
  };
  timestamp: string;
}

export interface ExtensionStatus {
  [key: string]: {
    name: string;
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

export interface ExtensionActionPayload {
  name: string;
}

export interface MetricType {
  id: string;
  label: string;
  description: string;
}
