import { describe, expect, it } from 'vitest';

import type { MenuTree, NavigationMenus } from './layout.context';
import { areMenuTreesEqual, areNavigationMenusEqual, flattenNavigationMenus } from './menu.utils';

const menu = (overrides: Partial<MenuTree> = {}): MenuTree => ({
  id: 'menu-1',
  name: 'Dashboard',
  label: 'menu.dashboard',
  slug: 'dashboard',
  type: 'sidebar',
  path: '/dash',
  icon: 'IconDashboard',
  perms: 'read:dashboard',
  hidden: false,
  disabled: false,
  order: 1,
  children: [],
  ...overrides
});

const navigationMenus = (overrides: Partial<NavigationMenus> = {}): NavigationMenus => ({
  headers: [],
  sidebars: [menu()],
  accounts: [],
  spaces: [],
  ...overrides
});

describe('layout menu utilities', () => {
  it('treats equivalent menu trees with different object references as equal', () => {
    const left = [menu({ children: [menu({ id: 'child-1', path: '/dash/a' })] })];
    const right = [menu({ children: [menu({ id: 'child-1', path: '/dash/a' })] })];

    expect(left).not.toBe(right);
    expect(areMenuTreesEqual(left, right)).toBe(true);
  });

  it('detects render-relevant menu tree changes', () => {
    expect(areMenuTreesEqual([menu()], [menu({ path: '/dash/overview' })])).toBe(false);
    expect(areMenuTreesEqual([menu()], [menu({ disabled: true })])).toBe(false);
    expect(
      areMenuTreesEqual(
        [menu({ children: [menu({ id: 'child-1', label: 'menu.child' })] })],
        [menu({ children: [menu({ id: 'child-1', label: 'menu.changed' })] })]
      )
    ).toBe(false);
  });

  it('compares grouped navigation menus by group content', () => {
    expect(areNavigationMenusEqual(navigationMenus(), navigationMenus())).toBe(true);
    expect(
      areNavigationMenusEqual(
        navigationMenus(),
        navigationMenus({ accounts: [menu({ id: 'account-1', type: 'account' })] })
      )
    ).toBe(false);
  });

  it('flattens navigation groups in render order', () => {
    const flattened = flattenNavigationMenus({
      headers: [menu({ id: 'header-1', type: 'header' })],
      sidebars: [menu({ id: 'sidebar-1', type: 'sidebar' })],
      accounts: [menu({ id: 'account-1', type: 'account' })],
      spaces: [menu({ id: 'space-1', type: 'space' })]
    });

    expect(flattened.map(item => item.id)).toEqual([
      'header-1',
      'sidebar-1',
      'account-1',
      'space-1'
    ]);
  });
});
