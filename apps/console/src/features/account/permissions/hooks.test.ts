import { describe, expect, it } from 'vitest';

import { filterMenuTreeByAccess } from './menu_tree';

interface TestMenu {
  path: string;
  perms?: string;
  hidden?: boolean;
  children?: TestMenu[];
}

describe('filterMenuTreeByAccess', () => {
  it('keeps a parent menu when at least one child is accessible', () => {
    const menus: TestMenu[] = [
      {
        path: '/system',
        perms: 'read:system',
        children: [
          { path: '/system/roles', perms: 'read:roles' },
          { path: '/system/menus', perms: 'manage:menu' }
        ]
      }
    ];

    const filtered = filterMenuTreeByAccess(menus, menu => menu.perms === 'read:roles');

    expect(filtered).toEqual([
      {
        path: '/system',
        perms: 'read:system',
        children: [{ path: '/system/roles', perms: 'read:roles' }]
      }
    ]);
  });

  it('removes inaccessible branches and hidden parents', () => {
    const menus: TestMenu[] = [
      {
        path: '/hidden',
        hidden: true,
        children: [{ path: '/hidden/child', perms: 'read:roles' }]
      },
      {
        path: '/payment',
        perms: 'read:payments',
        children: [{ path: '/payment/logs', perms: 'admin:payments' }]
      }
    ];

    const filtered = filterMenuTreeByAccess(menus, menu => menu.perms === 'read:roles');

    expect(filtered).toEqual([]);
  });
});
