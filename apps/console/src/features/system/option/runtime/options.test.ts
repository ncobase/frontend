import { describe, expect, it } from 'vitest';

import {
  buildRuntimeDrafts,
  buildRuntimeOptionPayload,
  parseDurationToSeconds,
  RUNTIME_OPTION_DEFINITION_BY_NAME,
  validateRuntimeOption
} from './options';

describe('runtime option helpers', () => {
  it('fills missing runtime options from current defaults', () => {
    const drafts = buildRuntimeDrafts({});

    expect(drafts['auth.token'].exists).toBe(false);
    expect(drafts['auth.token'].value).toEqual({
      access_token_expiry: '2h',
      refresh_token_expiry: '7d',
      register_token_expiry: '30m',
      mfa_token_expiry: '5m'
    });
  });

  it('keeps defaults and reports parse errors for invalid stored JSON', () => {
    const drafts = buildRuntimeDrafts({
      'resource.upload': {
        id: 'option-1',
        name: 'resource.upload',
        type: 'object',
        value: '{broken',
        autoload: true
      }
    });

    expect(drafts['resource.upload'].exists).toBe(true);
    expect(drafts['resource.upload'].parseError).toBeTruthy();
    expect(drafts['resource.upload'].value.allowed_types).toEqual(['*']);
  });

  it('parses backend-compatible duration strings', () => {
    expect(parseDurationToSeconds('90')).toBe(90);
    expect(parseDurationToSeconds('30m')).toBe(1800);
    expect(parseDurationToSeconds('1h30m')).toBe(5400);
    expect(parseDurationToSeconds('7d')).toBe(604800);
    expect(parseDurationToSeconds('1w')).toBe(604800);
    expect(parseDurationToSeconds('bad')).toBeNull();
  });

  it('validates auth and frontend cross-field rules', () => {
    expect(
      validateRuntimeOption(RUNTIME_OPTION_DEFINITION_BY_NAME['system.frontend'], {
        sign_in_url: 'console.local/login',
        sign_up_url: 'https://console.example.com/register'
      })
    ).toContain('Sign-in URL must be an HTTP or HTTPS URL');

    expect(
      validateRuntimeOption(RUNTIME_OPTION_DEFINITION_BY_NAME['auth.token'], {
        access_token_expiry: '7d',
        refresh_token_expiry: '2h',
        register_token_expiry: '30m',
        mfa_token_expiry: '5m'
      })
    ).toContain('Access token expiry must be shorter than refresh token expiry');
  });

  it('validates resource processing relationships', () => {
    expect(
      validateRuntimeOption(RUNTIME_OPTION_DEFINITION_BY_NAME['resource.image'], {
        enable_thumbnails: true,
        default_thumbnail_width: 3000,
        default_thumbnail_height: 300,
        enable_resizing: true,
        max_image_width: 2048,
        max_image_height: 2048,
        compression_quality: 85
      })
    ).toContain('Default thumbnail width must not exceed max image width');
  });

  it('builds body-style option payloads for create or update', () => {
    const definition = RUNTIME_OPTION_DEFINITION_BY_NAME['resource.upload'];
    const payload = buildRuntimeOptionPayload(definition, {
      exists: false,
      value: {
        max_upload_size: '1048576',
        allowed_types: 'image/*, .pdf',
        default_storage: 'configured'
      }
    });

    expect(payload).toEqual({
      id: undefined,
      name: 'resource.upload',
      type: 'object',
      value: JSON.stringify({
        max_upload_size: 1048576,
        allowed_types: ['image/*', '.pdf'],
        default_storage: 'configured'
      }),
      autoload: true
    });
  });
});
