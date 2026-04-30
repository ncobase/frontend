import { describe, expect, it } from 'vitest';

import { buildResourceRuntimePolicy, DEFAULT_RESOURCE_RUNTIME_POLICY } from './resource_policy';

describe('resource runtime policy', () => {
  it('builds defaults when runtime options are missing', () => {
    expect(buildResourceRuntimePolicy()).toEqual({
      ...DEFAULT_RESOURCE_RUNTIME_POLICY,
      errors: []
    });
  });

  it('parses persisted runtime option values', () => {
    const policy = buildResourceRuntimePolicy({
      'resource.upload': {
        name: 'resource.upload',
        type: 'object',
        autoload: true,
        value: JSON.stringify({
          max_upload_size: 1024,
          allowed_types: ['image/*', '.pdf'],
          default_storage: 's3'
        })
      },
      'system.storage_policy': {
        name: 'system.storage_policy',
        type: 'object',
        autoload: true,
        value: JSON.stringify({
          default_provider: 's3',
          allow_public_links: false,
          require_owner_scope: true,
          audit_downloads: false
        })
      }
    });

    expect(policy.upload.max_upload_size).toBe(1024);
    expect(policy.upload.allowed_types).toEqual(['image/*', '.pdf']);
    expect(policy.upload.default_storage).toBe('s3');
    expect(policy.storage.allow_public_links).toBe(false);
    expect(policy.storage.audit_downloads).toBe(false);
  });

  it('falls back to defaults and reports invalid JSON', () => {
    const policy = buildResourceRuntimePolicy({
      'resource.upload': {
        name: 'resource.upload',
        type: 'object',
        autoload: true,
        value: '{invalid'
      }
    });

    expect(policy.upload).toEqual(DEFAULT_RESOURCE_RUNTIME_POLICY.upload);
    expect(policy.errors?.[0]).toContain('resource.upload');
  });
});
