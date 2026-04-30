import type { HTMLAttributes } from 'react';

import { Option } from '../option';

export const RUNTIME_OPTION_NAMES = [
  'system.frontend',
  'auth.token',
  'auth.session',
  'resource.upload',
  'resource.image',
  'resource.quota',
  'system.storage_policy',
  'system.email_policy'
] as const;

export type RuntimeOptionName = (typeof RUNTIME_OPTION_NAMES)[number];

export type RuntimeFieldKind = 'text' | 'duration' | 'number' | 'boolean' | 'select' | 'stringList';

export interface RuntimeFieldDefinition {
  key: string;
  label: string;
  kind: RuntimeFieldKind;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  options?: { label: string; value: string }[];
  disabledWhen?: (_value: RuntimeOptionValue) => boolean;
}

export interface RuntimeOptionDefinition {
  name: RuntimeOptionName;
  title: string;
  group: 'access' | 'auth' | 'resource' | 'policy';
  icon: string;
  description: string;
  impact: string[];
  defaultValue: RuntimeOptionValue;
  fields: RuntimeFieldDefinition[];
}

export type RuntimeOptionValue = Record<string, string | number | boolean | string[]>;

export interface RuntimeOptionDraft {
  option?: Option;
  value: RuntimeOptionValue;
  exists: boolean;
  parseError?: string;
}

export type RuntimeDraftMap = Record<RuntimeOptionName, RuntimeOptionDraft>;
export type RuntimeErrorMap = Partial<Record<RuntimeOptionName, string[]>>;

const storageChoices = [
  { label: 'Configured provider', value: 'configured' },
  { label: 'Local storage', value: 'local' },
  { label: 'S3 compatible', value: 's3' },
  { label: 'Tencent COS', value: 'cos' },
  { label: 'Aliyun OSS', value: 'oss' },
  { label: 'MinIO', value: 'minio' }
];

export const RUNTIME_OPTION_DEFINITIONS: RuntimeOptionDefinition[] = [
  {
    name: 'system.frontend',
    title: 'Frontend entry points',
    group: 'access',
    icon: 'IconWorldWww',
    description: 'Public console URLs used by account and notification flows.',
    impact: ['Sign-in link in auth email', 'Sign-up link in registration flows'],
    defaultValue: {
      sign_in_url: 'http://localhost:3000/login',
      sign_up_url: 'http://localhost:3000/register'
    },
    fields: [
      {
        key: 'sign_in_url',
        label: 'Sign-in URL',
        kind: 'text',
        required: true,
        placeholder: 'https://console.example.com/login',
        inputMode: 'url'
      },
      {
        key: 'sign_up_url',
        label: 'Sign-up URL',
        kind: 'text',
        required: true,
        placeholder: 'https://console.example.com/register',
        inputMode: 'url'
      }
    ]
  },
  {
    name: 'auth.token',
    title: 'Auth token lifetime',
    group: 'auth',
    icon: 'IconKey',
    description: 'Token expiry policy used by login, refresh, registration, and MFA challenges.',
    impact: ['Access token expiration', 'Refresh token expiration', 'Registration and MFA links'],
    defaultValue: {
      access_token_expiry: '2h',
      refresh_token_expiry: '7d',
      register_token_expiry: '30m',
      mfa_token_expiry: '5m'
    },
    fields: [
      {
        key: 'access_token_expiry',
        label: 'Access token expiry',
        kind: 'duration',
        required: true,
        placeholder: '2h'
      },
      {
        key: 'refresh_token_expiry',
        label: 'Refresh token expiry',
        kind: 'duration',
        required: true,
        placeholder: '7d'
      },
      {
        key: 'register_token_expiry',
        label: 'Registration token expiry',
        kind: 'duration',
        required: true,
        placeholder: '30m'
      },
      {
        key: 'mfa_token_expiry',
        label: 'MFA token expiry',
        kind: 'duration',
        required: true,
        placeholder: '5m'
      }
    ]
  },
  {
    name: 'auth.session',
    title: 'Auth session policy',
    group: 'auth',
    icon: 'IconDeviceDesktop',
    description: 'Session count and cleanup rules used by auth session management.',
    impact: ['Concurrent session limit', 'Session cleanup schedule'],
    defaultValue: {
      max_sessions: 10,
      session_expiry: '7d',
      cleanup_interval: '1h'
    },
    fields: [
      {
        key: 'max_sessions',
        label: 'Max sessions per user',
        kind: 'number',
        required: true,
        min: 0,
        step: 1,
        inputMode: 'numeric'
      },
      {
        key: 'session_expiry',
        label: 'Session expiry',
        kind: 'duration',
        required: true,
        placeholder: '7d'
      },
      {
        key: 'cleanup_interval',
        label: 'Cleanup interval',
        kind: 'duration',
        required: true,
        placeholder: '1h'
      }
    ]
  },
  {
    name: 'resource.upload',
    title: 'Resource upload policy',
    group: 'resource',
    icon: 'IconUpload',
    description: 'Upload size, accepted file types, and default storage provider.',
    impact: ['Single and batch file upload validation', 'Default storage routing'],
    defaultValue: {
      max_upload_size: 5368709120,
      allowed_types: ['*'],
      default_storage: 'configured'
    },
    fields: [
      {
        key: 'max_upload_size',
        label: 'Max upload size in bytes',
        kind: 'number',
        required: true,
        min: 1,
        step: 1,
        inputMode: 'numeric'
      },
      {
        key: 'allowed_types',
        label: 'Allowed file types',
        kind: 'stringList',
        required: true,
        placeholder: '*, image/*, .pdf'
      },
      {
        key: 'default_storage',
        label: 'Default storage provider',
        kind: 'select',
        required: true,
        options: storageChoices
      }
    ]
  },
  {
    name: 'resource.image',
    title: 'Image processing policy',
    group: 'resource',
    icon: 'IconPhotoCog',
    description: 'Default image processing limits for upload and thumbnail workflows.',
    impact: ['Thumbnail generation', 'Image resizing limits', 'Compression quality'],
    defaultValue: {
      enable_thumbnails: true,
      default_thumbnail_width: 300,
      default_thumbnail_height: 300,
      enable_resizing: true,
      max_image_width: 2048,
      max_image_height: 2048,
      compression_quality: 85
    },
    fields: [
      {
        key: 'enable_thumbnails',
        label: 'Enable thumbnails',
        kind: 'boolean'
      },
      {
        key: 'default_thumbnail_width',
        label: 'Default thumbnail width',
        kind: 'number',
        required: true,
        min: 1,
        step: 1,
        inputMode: 'numeric'
      },
      {
        key: 'default_thumbnail_height',
        label: 'Default thumbnail height',
        kind: 'number',
        required: true,
        min: 1,
        step: 1,
        inputMode: 'numeric'
      },
      {
        key: 'enable_resizing',
        label: 'Enable resizing',
        kind: 'boolean'
      },
      {
        key: 'max_image_width',
        label: 'Max image width',
        kind: 'number',
        required: true,
        min: 1,
        step: 1,
        inputMode: 'numeric'
      },
      {
        key: 'max_image_height',
        label: 'Max image height',
        kind: 'number',
        required: true,
        min: 1,
        step: 1,
        inputMode: 'numeric'
      },
      {
        key: 'compression_quality',
        label: 'Compression quality',
        kind: 'number',
        required: true,
        min: 1,
        max: 100,
        step: 1,
        inputMode: 'numeric'
      }
    ]
  },
  {
    name: 'resource.quota',
    title: 'Resource quota policy',
    group: 'resource',
    icon: 'IconGauge',
    description: 'Default quota and enforcement behavior for resource storage usage.',
    impact: ['Quota reservation', 'Upload rejection when enforcement is enabled', 'Quota warnings'],
    defaultValue: {
      enable_quotas: true,
      enable_enforcement: true,
      default_quota: 10737418240,
      warning_threshold: 0.8,
      quota_check_interval: '24h'
    },
    fields: [
      {
        key: 'enable_quotas',
        label: 'Enable quotas',
        kind: 'boolean'
      },
      {
        key: 'enable_enforcement',
        label: 'Enforce quota limits',
        kind: 'boolean',
        disabledWhen: value => value.enable_quotas === false
      },
      {
        key: 'default_quota',
        label: 'Default quota in bytes',
        kind: 'number',
        required: true,
        min: 1,
        step: 1,
        inputMode: 'numeric'
      },
      {
        key: 'warning_threshold',
        label: 'Warning threshold',
        kind: 'number',
        required: true,
        min: 0.01,
        max: 1,
        step: 0.01,
        inputMode: 'decimal'
      },
      {
        key: 'quota_check_interval',
        label: 'Quota check interval',
        kind: 'duration',
        required: true,
        placeholder: '24h'
      }
    ]
  },
  {
    name: 'system.storage_policy',
    title: 'Storage access policy',
    group: 'policy',
    icon: 'IconShieldLock',
    description: 'Sharing, owner scope, and download audit behavior for stored resources.',
    impact: ['Public link creation', 'Owner-scoped storage paths', 'Download auditing'],
    defaultValue: {
      default_provider: 'configured',
      allow_public_links: true,
      require_owner_scope: true,
      audit_downloads: true
    },
    fields: [
      {
        key: 'default_provider',
        label: 'Default provider',
        kind: 'select',
        required: true,
        options: storageChoices
      },
      {
        key: 'allow_public_links',
        label: 'Allow public links',
        kind: 'boolean'
      },
      {
        key: 'require_owner_scope',
        label: 'Require owner-scoped paths',
        kind: 'boolean'
      },
      {
        key: 'audit_downloads',
        label: 'Audit downloads',
        kind: 'boolean'
      }
    ]
  },
  {
    name: 'system.email_policy',
    title: 'Email behavior policy',
    group: 'policy',
    icon: 'IconMailCog',
    description: 'Non-secret email behavior used by auth and user account flows.',
    impact: ['Auth email dispatch', 'Password reset email dispatch', 'Notification sender name'],
    defaultValue: {
      enabled: true,
      sender_name: 'System Admin',
      allow_auth_email: true,
      allow_password_reset: true,
      digest_frequency: 'daily'
    },
    fields: [
      {
        key: 'enabled',
        label: 'Enable email flows',
        kind: 'boolean'
      },
      {
        key: 'sender_name',
        label: 'Sender name',
        kind: 'text',
        required: true,
        placeholder: 'System Admin'
      },
      {
        key: 'allow_auth_email',
        label: 'Allow auth email',
        kind: 'boolean',
        disabledWhen: value => value.enabled === false
      },
      {
        key: 'allow_password_reset',
        label: 'Allow password reset',
        kind: 'boolean',
        disabledWhen: value => value.enabled === false
      },
      {
        key: 'digest_frequency',
        label: 'Digest frequency',
        kind: 'select',
        required: true,
        options: [
          { label: 'Hourly', value: 'hourly' },
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Monthly', value: 'monthly' }
        ]
      }
    ]
  }
];

export const RUNTIME_OPTION_DEFINITION_BY_NAME = RUNTIME_OPTION_DEFINITIONS.reduce(
  (acc, definition) => {
    acc[definition.name] = definition;
    return acc;
  },
  {} as Record<RuntimeOptionName, RuntimeOptionDefinition>
);

export const RUNTIME_GROUPS = [
  { key: 'access', label: 'Access', icon: 'IconWorldWww' },
  { key: 'auth', label: 'Auth', icon: 'IconShield' },
  { key: 'resource', label: 'Resources', icon: 'IconDatabase' },
  { key: 'policy', label: 'Policies', icon: 'IconAdjustments' }
] as const;

const cloneValue = (value: RuntimeOptionValue): RuntimeOptionValue => {
  return JSON.parse(JSON.stringify(value));
};

const normalizeStringList = (value: RuntimeOptionValue[string]) => {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  return String(value || '')
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean);
};

const normalizeFieldValue = (
  field: RuntimeFieldDefinition,
  value: RuntimeOptionValue[string]
): RuntimeOptionValue[string] => {
  switch (field.kind) {
    case 'boolean':
      return value === true || value === 'true';
    case 'number':
      return typeof value === 'number' ? value : Number(value);
    case 'stringList':
      return normalizeStringList(value);
    case 'duration':
    case 'select':
    case 'text':
    default:
      return String(value ?? '').trim();
  }
};

export const normalizeRuntimeValue = (
  definition: RuntimeOptionDefinition,
  value: RuntimeOptionValue
): RuntimeOptionValue => {
  return definition.fields.reduce((acc, field) => {
    const currentValue = value[field.key] ?? definition.defaultValue[field.key];
    acc[field.key] = normalizeFieldValue(field, currentValue);
    return acc;
  }, {} as RuntimeOptionValue);
};

const isPlainObject = (value: unknown): value is RuntimeOptionValue => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const parseRuntimeOptionValue = (
  definition: RuntimeOptionDefinition,
  option?: Option
): { value: RuntimeOptionValue; parseError?: string } => {
  if (!option?.value) {
    return { value: cloneValue(definition.defaultValue) };
  }

  try {
    const parsed = JSON.parse(option.value);
    if (!isPlainObject(parsed)) {
      return {
        value: cloneValue(definition.defaultValue),
        parseError: `${definition.name} must be a JSON object`
      };
    }
    return {
      value: normalizeRuntimeValue(definition, {
        ...definition.defaultValue,
        ...parsed
      } as RuntimeOptionValue)
    };
  } catch (error) {
    return {
      value: cloneValue(definition.defaultValue),
      parseError: error instanceof Error ? error.message : 'Invalid JSON'
    };
  }
};

const durationPattern =
  /^(?:\d+|\d+[dw]|(?:\d+(?:\.\d+)?(?:ns|us|ms|s|m|h))+)$|^(?:\d+(?:\.\d+)?(?:ns|us|ms|s|m|h))+(?:\d+(?:\.\d+)?(?:ns|us|ms|s|m|h))*$/;

export const parseDurationToSeconds = (value: string): number | null => {
  const normalized = String(value || '').trim();
  if (!normalized) return null;
  if (/^\d+$/.test(normalized)) return Number(normalized);
  if (/^\d+d$/.test(normalized)) return Number(normalized.slice(0, -1)) * 24 * 60 * 60;
  if (/^\d+w$/.test(normalized)) return Number(normalized.slice(0, -1)) * 7 * 24 * 60 * 60;

  const tokenPattern = /(\d+(?:\.\d+)?)(ns|us|ms|s|m|h)/g;
  let match: RegExpExecArray | null;
  let consumed = '';
  let seconds = 0;

  while ((match = tokenPattern.exec(normalized)) !== null) {
    consumed += match[0];
    const amount = Number(match[1]);
    const unit = match[2];
    if (unit === 'ns') {
      seconds += amount / 1_000_000_000;
    } else if (unit === 'us') {
      seconds += amount / 1_000_000;
    } else if (unit === 'ms') {
      seconds += amount / 1_000;
    } else if (unit === 's') {
      seconds += amount;
    } else if (unit === 'm') {
      seconds += amount * 60;
    } else if (unit === 'h') {
      seconds += amount * 60 * 60;
    }
  }

  return consumed === normalized && seconds > 0 ? seconds : null;
};

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export const validateRuntimeOption = (
  definition: RuntimeOptionDefinition,
  value: RuntimeOptionValue
): string[] => {
  const errors: string[] = [];
  const normalized = normalizeRuntimeValue(definition, value);

  definition.fields.forEach(field => {
    const rawValue = value[field.key];
    const fieldValue = normalized[field.key];

    if (field.required) {
      const missing =
        rawValue === undefined ||
        rawValue === null ||
        rawValue === '' ||
        (Array.isArray(rawValue) && rawValue.length === 0) ||
        (typeof rawValue === 'string' && rawValue.trim() === '');
      if (missing) {
        errors.push(`${field.label} is required`);
        return;
      }
    }

    if (field.kind === 'number') {
      const numericValue = Number(fieldValue);
      if (!Number.isFinite(numericValue)) {
        errors.push(`${field.label} must be a valid number`);
        return;
      }
      if (field.min !== undefined && numericValue < field.min) {
        errors.push(`${field.label} must be greater than or equal to ${field.min}`);
      }
      if (field.max !== undefined && numericValue > field.max) {
        errors.push(`${field.label} must be less than or equal to ${field.max}`);
      }
    }

    if (field.kind === 'duration') {
      const duration = String(fieldValue || '').trim();
      if (!durationPattern.test(duration) || parseDurationToSeconds(duration) === null) {
        errors.push(`${field.label} must use a valid duration such as 30m, 2h, 7d, or seconds`);
      }
    }

    if (field.kind === 'select') {
      const allowedValues = (field.options || []).map(option => option.value);
      if (!allowedValues.includes(String(fieldValue))) {
        errors.push(`${field.label} must be one of: ${allowedValues.join(', ')}`);
      }
    }

    if (field.kind === 'stringList' && Array.isArray(fieldValue)) {
      const hasInvalidItem = fieldValue.some(item => !String(item).trim());
      if (hasInvalidItem) {
        errors.push(`${field.label} cannot contain empty items`);
      }
    }
  });

  if (definition.name === 'system.frontend') {
    ['sign_in_url', 'sign_up_url'].forEach(key => {
      const url = String(normalized[key] || '').trim();
      if (url && !isValidUrl(url)) {
        const field = definition.fields.find(item => item.key === key);
        errors.push(`${field?.label || key} must be an HTTP or HTTPS URL`);
      }
    });
  }

  if (definition.name === 'auth.token') {
    const access = parseDurationToSeconds(String(normalized.access_token_expiry));
    const refresh = parseDurationToSeconds(String(normalized.refresh_token_expiry));
    if (access !== null && refresh !== null && access >= refresh) {
      errors.push('Access token expiry must be shorter than refresh token expiry');
    }
  }

  if (definition.name === 'auth.session') {
    const expiry = parseDurationToSeconds(String(normalized.session_expiry));
    const cleanup = parseDurationToSeconds(String(normalized.cleanup_interval));
    if (expiry !== null && cleanup !== null && cleanup > expiry) {
      errors.push('Cleanup interval must not be longer than session expiry');
    }
  }

  if (definition.name === 'resource.image') {
    const thumbWidth = Number(normalized.default_thumbnail_width);
    const thumbHeight = Number(normalized.default_thumbnail_height);
    const maxWidth = Number(normalized.max_image_width);
    const maxHeight = Number(normalized.max_image_height);
    if (thumbWidth > maxWidth) {
      errors.push('Default thumbnail width must not exceed max image width');
    }
    if (thumbHeight > maxHeight) {
      errors.push('Default thumbnail height must not exceed max image height');
    }
  }

  return errors;
};

export const buildRuntimeDrafts = (options: Partial<Record<RuntimeOptionName, Option>>) => {
  return RUNTIME_OPTION_DEFINITIONS.reduce((acc, definition) => {
    const option = options[definition.name];
    const parsed = parseRuntimeOptionValue(definition, option);
    acc[definition.name] = {
      option,
      value: parsed.value,
      exists: !!option,
      parseError: parsed.parseError
    };
    return acc;
  }, {} as RuntimeDraftMap);
};

export const buildRuntimeOptionPayload = (
  definition: RuntimeOptionDefinition,
  draft: RuntimeOptionDraft
): Option => {
  return {
    id: draft.option?.id,
    name: definition.name,
    type: 'object',
    value: JSON.stringify(normalizeRuntimeValue(definition, draft.value)),
    autoload: draft.option?.autoload ?? true
  };
};
