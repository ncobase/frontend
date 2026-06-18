import type { MenuTree, NavigationMenus } from './layout.context';

const NAVIGATION_GROUPS = ['headers', 'sidebars', 'accounts', 'spaces'] as const;

const menuSignature = (menu: MenuTree): unknown[] => [
  menu.id || '',
  menu.name || '',
  menu.label || '',
  menu.slug || '',
  menu.type || '',
  menu.path || '',
  menu.target || '',
  menu.icon || '',
  menu.perms || '',
  menu.hidden === true,
  menu.disabled === true,
  menu.order ?? null,
  menu.parent_id || '',
  (menu.children || []).map(menuSignature)
];

const menuTreeSignature = (menus: MenuTree[] = []): string => {
  return JSON.stringify(menus.map(menuSignature));
};

export const areMenuTreesEqual = (left: MenuTree[] = [], right: MenuTree[] = []): boolean => {
  if (left === right) return true;
  if (left.length !== right.length) return false;

  return menuTreeSignature(left) === menuTreeSignature(right);
};

export const areNavigationMenusEqual = (left: NavigationMenus, right: NavigationMenus): boolean => {
  if (left === right) return true;

  return NAVIGATION_GROUPS.every(group => areMenuTreesEqual(left[group] || [], right[group] || []));
};

export const flattenNavigationMenus = (groups: NavigationMenus): MenuTree[] => {
  const flattened: MenuTree[] = [];

  NAVIGATION_GROUPS.forEach(group => {
    const menus = groups[group];
    if (Array.isArray(menus)) {
      flattened.push(...menus);
    }
  });

  return flattened;
};
