import type { PaginationResult } from '@ncobase/react';

export type AIRunMode = 'complete' | 'stream' | 'embed' | 'action' | string;
export type AIRunStatus = 'running' | 'succeeded' | 'failed' | 'canceled' | string;

export interface AIMessageInput {
  role: 'system' | 'user' | 'assistant' | string;
  content: string;
}

export interface AIResponseFormatInput {
  type: string;
  name?: string;
  description?: string;
  schema?: Record<string, any>;
  strict?: boolean;
}

export interface AIReasoningInput {
  effort?: string;
  budget_tokens?: number;
  include_thoughts?: boolean;
}

export interface AICompleteRequest {
  prompt?: string;
  messages?: AIMessageInput[];
  model?: string;
  max_output_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string[];
  response_format?: AIResponseFormatInput;
  reasoning?: AIReasoningInput;
  metadata?: Record<string, string>;
  action?: string;
}

export interface AICacheUsage {
  created_tokens: number;
  read_tokens: number;
}

export interface AIToolCall {
  id: string;
  type: string;
  name?: string;
  arguments?: any;
}

export interface AICompleteResponse {
  run_id: string;
  operation_id?: string;
  content: string;
  reasoning?: string;
  provider: string;
  model: string;
  finish_reason?: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  reasoning_tokens: number;
  cache_usage: AICacheUsage;
  tool_calls?: AIToolCall[];
  raw?: any;
}

export interface AIStreamStartResponse {
  run_id: string;
  operation_id?: string;
}

export interface AIStreamChunkResponse {
  run_id: string;
  content?: string;
  reasoning?: string;
  done: boolean;
  finish_reason?: string;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  reasoning_tokens?: number;
  cache_usage?: AICacheUsage;
  error?: string;
}

export interface AIEmbedRequest {
  input: string[];
  model?: string;
  input_type?: string;
  metadata?: Record<string, string>;
}

export interface AIEmbedResponse {
  run_id: string;
  provider?: string;
  model: string;
  embeddings: number[][];
  tokens_used: number;
}

export interface AIActionRequest {
  content?: string;
  instruction?: string;
  context?: Record<string, any>;
  language?: string;
  tone?: string;
  output_format?: string;
  model?: string;
  max_output_tokens?: number;
  temperature?: number;
}

export interface AIActionDescriptor {
  key: string;
  domain: string;
  name: string;
  description: string;
  output_type: string;
  permissions?: string[];
}

export interface AIActionResponse {
  run_id: string;
  action: string;
  content: string;
  json?: Record<string, any>;
  provider: string;
  model: string;
  total_tokens: number;
}

export interface AIProviderConfigStatus {
  name: string;
  env: string;
  present: boolean;
}

export interface AIProviderStatus {
  name: string;
  type: string;
  enabled: boolean;
  configured: boolean;
  base_url?: string;
  api_mode?: string;
  secrets?: AIProviderConfigStatus[];
  supports_authentication: boolean;
}

export interface AICircuitBreakerPolicy {
  max_failures: number;
  reset_seconds: number;
}

export interface AIPolicyConfig {
  enabled: boolean;
  allowed_actions?: string[];
  allowed_provider_types?: string[];
  max_prompt_chars: number;
  max_messages: number;
  max_input_items: number;
  max_output_tokens: number;
  timeout_seconds: number;
  retry: number;
  rate_limit_per_second: number;
  circuit_breaker: AICircuitBreakerPolicy;
  store_raw_output: boolean;
  require_configured_model: boolean;
}

export interface AISafetyConfig {
  redact_prompts: boolean;
  store_request_hash: boolean;
  max_error_chars: number;
  blocked_phrases?: string[];
  allow_system_prompts: boolean;
}

export interface AIStatsSnapshot {
  total_requests: number;
  success_requests: number;
  failed_requests: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cache_created_tokens: number;
  cache_read_tokens: number;
}

export interface AIStatusResponse {
  enabled: boolean;
  ready: boolean;
  configured: boolean;
  primary?: string;
  fallbacks?: string[];
  embedding_model?: string;
  providers: AIProviderStatus[];
  allowed_actions: string[];
  policy: AIPolicyConfig;
  safety: AISafetyConfig;
  stats: AIStatsSnapshot;
  message?: string;
}

export interface AIProviderHealth {
  name: string;
  type: string;
  healthy: boolean;
  error?: string;
  checked_at: number;
}

export interface AIRun {
  id: string;
  operation_id?: string;
  action?: string;
  mode: AIRunMode;
  status: AIRunStatus;
  provider?: string;
  model?: string;
  fallback_model?: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  reasoning_tokens: number;
  cache_created_tokens: number;
  cache_read_tokens: number;
  duration_ms: number;
  error_code?: string;
  error_message?: string;
  request_hash?: string;
  response_hash?: string;
  estimated_cost?: number;
  currency?: string;
  metadata?: Record<string, any>;
  space_id?: string;
  user_id?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: number;
  updated_at?: number;
}

export type AIRunListResponse = PaginationResult<AIRun>;

export interface AIRunQuery {
  action?: string;
  mode?: AIRunMode;
  status?: AIRunStatus;
  provider?: string;
  model?: string;
  user_id?: string;
  space_id?: string;
  start_date?: number;
  end_date?: number;
  cursor?: string;
  page_size?: number;
  limit?: number;
  direction?: 'forward' | 'backward';
}

export interface AIUsageQuery {
  action?: string;
  mode?: string;
  status?: string;
  provider?: string;
  model?: string;
  user_id?: string;
  space_id?: string;
  start_date?: number;
  end_date?: number;
}

export interface AIUsageBucket {
  runs: number;
  succeeded_runs: number;
  failed_runs: number;
  total_tokens: number;
  estimated_cost?: number;
}

export interface AIUsageSummary {
  total_runs: number;
  succeeded_runs: number;
  failed_runs: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  reasoning_tokens: number;
  cache_created_tokens: number;
  cache_read_tokens: number;
  duration_ms: number;
  estimated_cost?: number;
  currency?: string;
  by_provider: Record<string, AIUsageBucket>;
  by_action: Record<string, AIUsageBucket>;
  by_mode: Record<string, AIUsageBucket>;
}

export type AIModelsResponse = Record<string, string[]>;

export interface AIStreamHandlers {
  onStart?: (_payload: AIStreamStartResponse) => void;
  onChunk?: (_payload: AIStreamChunkResponse) => void;
  onRun?: (_payload: AIRun) => void;
  onError?: (_payload: AIStreamChunkResponse | { error: string; run_id?: string }) => void;
}
