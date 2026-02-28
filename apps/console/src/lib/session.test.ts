import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  formatSessionDuration,
  formatSessionLocation,
  getBrowserName,
  getDeviceType,
  getOperatingSystem,
  getSessionRiskLevel,
  getSessionSecurityScore,
  isCurrentSession,
  isSessionExpired,
  sortSessionsByPriority
} from './session';

const now = new Date('2026-02-28T12:00:00Z').getTime();

const baseSession = {
  id: 'session-1',
  user_id: 'user-1',
  token_id: 'token-1',
  is_active: true
};

describe('session utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('detects device type correctly', () => {
    expect(getDeviceType()).toBe('unknown');
    expect(getDeviceType('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile')).toBe(
      'mobile'
    );
    expect(getDeviceType('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)')).toBe('tablet');
    expect(getDeviceType('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('desktop');
  });

  it('detects browser names including modern edge UA token', () => {
    expect(getBrowserName(undefined, { browser: 'CustomBrowser' })).toBe('CustomBrowser');
    expect(getBrowserName()).toBe('Unknown Browser');
    expect(getBrowserName('Mozilla/5.0 Chrome/120.0')).toBe('Chrome');
    expect(getBrowserName('Mozilla/5.0 Edg/120.0')).toBe('Edge');
  });

  it('detects operating systems in correct priority order', () => {
    expect(getOperatingSystem(undefined, { os: 'CustomOS' })).toBe('CustomOS');
    expect(getOperatingSystem()).toBe('Unknown OS');
    expect(
      getOperatingSystem('Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36')
    ).toBe('Android');
    expect(
      getOperatingSystem(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
      )
    ).toBe('iOS');
    expect(getOperatingSystem('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('Windows');
  });

  it('formats location with proper fallback order', () => {
    expect(
      formatSessionLocation({ ...baseSession, location: 'Shanghai', ip_address: '1.1.1.1' })
    ).toBe('Shanghai');
    expect(
      formatSessionLocation({ ...baseSession, location: 'Unknown', ip_address: '1.1.1.1' })
    ).toBe('1.1.1.1');
    expect(formatSessionLocation(baseSession)).toBe('Unknown Location');
  });

  it('detects current session and sorts sessions by priority', () => {
    const current = {
      ...baseSession,
      id: 'current',
      last_access_at: now - 1000,
      created_at: now - 2000
    };
    const activeOld = {
      ...baseSession,
      id: 'active-old',
      last_access_at: now - 100000,
      created_at: now - 100000
    };
    const inactive = { ...baseSession, id: 'inactive', is_active: false, created_at: now - 3000 };

    expect(isCurrentSession(current, 'current')).toBe(true);
    expect(isCurrentSession(activeOld)).toBe(true);
    expect(isCurrentSession(inactive)).toBe(false);

    const sorted = sortSessionsByPriority([inactive, activeOld, current], 'current');
    expect(sorted.map(item => item.id)).toEqual(['current', 'active-old', 'inactive']);
  });

  it('calculates security score and risk level', () => {
    const secure = {
      ...baseSession,
      last_access_at: now - 60 * 60 * 1000,
      device_info: { browser: 'Chrome' },
      login_method: 'email_code',
      location: 'Tokyo'
    };
    expect(getSessionSecurityScore(secure)).toBe(9);
    expect(getSessionRiskLevel(secure)).toBe('low');

    const expired = { ...baseSession, expires_at: now - 1 };
    expect(isSessionExpired(expired)).toBe(true);
    expect(getSessionRiskLevel(expired)).toBe('high');

    const weak = { ...baseSession, is_active: false };
    expect(getSessionRiskLevel(weak)).toBe('high');
  });

  it('formats session duration by age', () => {
    expect(formatSessionDuration({ ...baseSession })).toBe('Unknown');
    expect(
      formatSessionDuration({ ...baseSession, created_at: now - 2 * 24 * 60 * 60 * 1000 })
    ).toBe('2d 0h');
    expect(
      formatSessionDuration({ ...baseSession, created_at: now - (2 * 60 + 5) * 60 * 1000 })
    ).toBe('2h 5m');
    expect(formatSessionDuration({ ...baseSession, created_at: now - 5 * 60 * 1000 })).toBe('5m');
  });
});
