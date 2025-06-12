export interface Option {
  id?: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: string;
  autoload: boolean;
  category?: string;
  description?: string;
  validation?: string;
  is_secret?: boolean;
  environment_variable?: string;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
  space_id?: string;
}

export interface OptionBody {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: string;
  autoload?: boolean;
  category?: string;
  description?: string;
  validation?: string;
  is_secret?: boolean;
  environment_variable?: string;
  space_id?: string;
}

export interface OptionValidationResult {
  valid: boolean;
  error?: string;
}

// Option type
export type OptionType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export interface OptionTypeConfig {
  label: string;
  value: OptionType;
  description: string;
  example: string;
  validation: (_value: string) => boolean;
}

export const OPTION_TYPES: Record<OptionType, OptionTypeConfig> = {
  string: {
    label: 'String',
    value: 'string',
    description: 'Text value',
    example: 'Hello World',
    validation: () => true
  },
  number: {
    label: 'Number',
    value: 'number',
    description: 'Numeric value',
    example: '42',
    validation: (value: string) => !isNaN(Number(value))
  },
  boolean: {
    label: 'Boolean',
    value: 'boolean',
    description: 'True/false value',
    example: 'true',
    validation: (value: string) =>
      ['true', 'false', '1', '0', 'yes', 'no'].includes(value.toLowerCase())
  },
  object: {
    label: 'Object',
    value: 'object',
    description: 'JSON object',
    example: '{"key": "value"}',
    validation: (value: string) => {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
      } catch {
        return false;
      }
    }
  },
  array: {
    label: 'Array',
    value: 'array',
    description: 'JSON array',
    example: '["item1", "item2"]',
    validation: (value: string) => {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    }
  }
};
