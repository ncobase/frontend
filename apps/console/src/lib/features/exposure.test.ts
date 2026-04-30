import { describe, expect, it } from 'vitest';

import {
  filterMenuTreeByFeatureExposure,
  filterRoutesByFeatureExposure,
  isConsoleFeatureEnabled,
  parseFeatureFlag
} from './exposure';

describe('feature exposure', () => {
  it('parses explicit feature flags', () => {
    expect(parseFeatureFlag('true')).toBe(true);
    expect(parseFeatureFlag('1')).toBe(true);
    expect(parseFeatureFlag('enabled')).toBe(true);
    expect(parseFeatureFlag('false')).toBe(false);
    expect(parseFeatureFlag('0')).toBe(false);
    expect(parseFeatureFlag('disabled')).toBe(false);
    expect(parseFeatureFlag('unknown')).toBeUndefined();
  });

  it('enables development-only features outside production by default', () => {
    expect(isConsoleFeatureEnabled('builder', { MODE: 'development', PROD: false })).toBe(true);
    expect(isConsoleFeatureEnabled('example', { MODE: 'test', PROD: false })).toBe(true);
  });

  it('disables development-only features in production unless explicitly enabled', () => {
    expect(isConsoleFeatureEnabled('builder', { MODE: 'production', PROD: true })).toBe(false);
    expect(
      isConsoleFeatureEnabled('builder', {
        MODE: 'production',
        PROD: true,
        VITE_ENABLE_BUILDER_ROUTES: 'true'
      })
    ).toBe(true);
  });

  it('filters disabled routes in production', () => {
    const routes = [
      { path: '/dash/*' },
      { path: '/builder/*' },
      { path: '/example/*' },
      { path: '/system/*' }
    ];

    expect(filterRoutesByFeatureExposure(routes, { MODE: 'production', PROD: true })).toEqual([
      { path: '/dash/*' },
      { path: '/system/*' }
    ]);
  });

  it('filters disabled menu trees recursively', () => {
    interface TestMenu {
      path?: string;
      children?: TestMenu[];
    }

    const menus: TestMenu[] = [
      { path: '/dash', children: [] },
      { path: '/builder/form', children: [{ path: '/builder/feature' }] },
      { path: '/content', children: [{ path: '/content/topics' }, { path: '/example/card' }] }
    ];

    expect(filterMenuTreeByFeatureExposure(menus, { MODE: 'production', PROD: true })).toEqual([
      { path: '/dash', children: [] },
      { path: '/content', children: [{ path: '/content/topics' }] }
    ]);
  });

  it('removes empty non-clickable groups after child filtering', () => {
    interface TestMenu {
      path?: string;
      children?: TestMenu[];
    }

    const menus: TestMenu[] = [
      { path: '-', children: [{ path: '/example/card' }] },
      { path: '/content', children: [{ path: '/content/topics' }] }
    ];

    expect(filterMenuTreeByFeatureExposure(menus, { MODE: 'production', PROD: true })).toEqual([
      { path: '/content', children: [{ path: '/content/topics' }] }
    ]);
  });
});
