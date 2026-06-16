import { describe, expect, it } from 'vitest';

import type { ResourceRuntimePolicy, ResourceUsage } from './resource';
import { DEFAULT_RESOURCE_RUNTIME_POLICY } from './resource_policy';
import { getVersionUploadRejection } from './version_upload';

const file = (overrides: Partial<Pick<File, 'name' | 'size' | 'type'>> = {}) => ({
  name: 'document.pdf',
  size: 128,
  type: 'application/pdf',
  ...overrides
});

type PolicyOverrides = Partial<Omit<ResourceRuntimePolicy, 'upload' | 'quota'>> & {
  upload?: Partial<ResourceRuntimePolicy['upload']>;
  quota?: Partial<ResourceRuntimePolicy['quota']>;
};

const policy = (overrides: PolicyOverrides = {}): ResourceRuntimePolicy => ({
  ...DEFAULT_RESOURCE_RUNTIME_POLICY,
  ...overrides,
  upload: {
    ...DEFAULT_RESOURCE_RUNTIME_POLICY.upload,
    ...overrides.upload
  },
  quota: {
    ...DEFAULT_RESOURCE_RUNTIME_POLICY.quota,
    ...overrides.quota
  }
});

describe('version upload validation', () => {
  it('accepts a file that matches runtime policy and quota', () => {
    const usage: ResourceUsage = {
      usage: 100,
      quota: 1000,
      usage_percent: 10,
      file_count: 1
    };

    expect(getVersionUploadRejection(file(), policy(), usage)).toBeNull();
  });

  it('rejects empty version files', () => {
    expect(getVersionUploadRejection(file({ size: 0 }))).toEqual({ code: 'empty' });
  });

  it('rejects files larger than the configured upload limit', () => {
    expect(
      getVersionUploadRejection(file({ size: 2048 }), policy({ upload: { max_upload_size: 1024 } }))
    ).toEqual({ code: 'too_large', limitBytes: 1024 });
  });

  it('rejects files outside the configured type allowlist', () => {
    expect(
      getVersionUploadRejection(
        file({ name: 'archive.zip', type: 'application/zip' }),
        policy({ upload: { allowed_types: ['image/*'] } })
      )
    ).toEqual({ code: 'type' });
  });

  it('rejects files that exceed an enforced quota', () => {
    const usage: ResourceUsage = {
      usage: 900,
      quota: 1000,
      usage_percent: 90,
      file_count: 3
    };

    expect(getVersionUploadRejection(file({ size: 200 }), policy(), usage)).toEqual({
      code: 'quota',
      availableBytes: 100
    });
  });

  it('allows soft quota overage when enforcement is disabled', () => {
    const usage: ResourceUsage = {
      usage: 900,
      quota: 1000,
      usage_percent: 90,
      file_count: 3
    };

    expect(
      getVersionUploadRejection(
        file({ size: 200 }),
        policy({ quota: { enable_enforcement: false } }),
        usage
      )
    ).toBeNull();
  });
});
