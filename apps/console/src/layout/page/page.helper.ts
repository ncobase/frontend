import { Menu } from '@ncobase/types';

/**
 * check if menu is divider
 * @param link menu
 * @returns {boolean}
 */
export const isDividerLink = (link: Menu): boolean =>
  (link.name?.includes('divide') || link.slug?.includes('divide')) && link.path === '-';

/**
 * check if menu is group
 * @param link menu
 * @returns {boolean}
 */
export const isGroup = (link: Menu): boolean => link.slug?.includes('group') && link.path === '-';

/**
 * split path
 * @param path path
 * @returns {string[]}
 */
export const pathSplit = (path: string): string[] =>
  path.split('/').filter(part => part !== '') || [];

/**
 * Finds a menu item by its slug recursively.
 * @param menu List of menus to search through.
 * @param slug Slug of the menu item to find.
 * @returns {Menu | null}
 */
export function findMenuBySlug(menu: Menu[], slug: string): Menu | null {
  if (!menu || !Array.isArray(menu) || menu.length === 0) {
    return null;
  }
  for (const item of menu) {
    if (item && item.slug === slug) {
      return item;
    }
    if (item && item.children) {
      const found = findMenuBySlug(item.children, slug);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Finds menu items by parent ID recursively.
 * @param menu List of menus to search through.
 * @param parentId Parent ID of the menus to find.
 * @param type Menu type to filter by.
 * @returns {Menu[]}
 */
export function findMenuByParentId(menu: Menu[], parentId: string, type: string): Menu[] {
  if (!menu || !Array.isArray(menu) || menu.length === 0) {
    return [];
  }
  const recursiveSearch = (items: Menu[], parentId: string): Menu[] => {
    return items.flatMap(item =>
      item.id === parentId && item.children && Array.isArray(item.children)
        ? item.children.filter(child => child.type === type)
        : item.children
          ? recursiveSearch(item.children, parentId)
          : []
    );
  };
  return recursiveSearch(menu, parentId);
}

/**
 * Finds a menu item by its URL path.
 * @param menu List of menus to search through.
 * @param url Current location URL path.
 * @returns {Menu | null}
 */
export function getMenuByUrl(menu: Menu[], url: string): Menu | null {
  if (!menu || !Array.isArray(menu) || menu.length === 0 || !url) {
    return null;
  }
  const urlSegments = url.split('/').filter(segment => segment);
  const targetDepth = urlSegments.length - 2;
  let currentMenu = [...menu];
  for (let depth = 0; depth < targetDepth; depth++) {
    const segment = urlSegments[depth];
    const currentItem = findMenuBySlug(currentMenu, segment);
    if (!currentItem || !currentItem.children) {
      return null;
    }
    currentMenu = currentItem.children;
  }
  const lastSegment = urlSegments[targetDepth];
  const targetItem = findMenuBySlug(currentMenu, lastSegment);
  return targetItem || null;
}

/**
 * Compare function for sorting menus based on a key and order.
 * @param key Key to sort by.
 * @param order Sorting order ('asc' or 'desc').
 * @returns Comparison function.
 */
export function compareMenus(key: string, order: 'asc' | 'desc') {
  return (a: Menu, b: Menu): number => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === bValue) {
      const createdAtComparison =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return order === 'asc' ? createdAtComparison : -createdAtComparison;
    } else {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
  };
}

/**
 * Sorts menus recursively based on a key and order.
 * @param menus List of menus to sort.
 * @param key Key to sort by.
 * @param order Sorting order ('asc' or 'desc').
 * @returns Sorted menus.
 */
export function sortMenus(menus: Menu[], key: string, order: 'asc' | 'desc'): Menu[] {
  const sortedMenus = [...menus]; // Create a copy of menus array
  sortedMenus.sort(compareMenus(key, order));

  // Recursively sort children of each menu
  sortedMenus.forEach(menu => {
    if (menu.children?.length) {
      menu.children.sort(compareMenus(key, order));
      sortMenus(menu.children, key, order); // Recursive call for children
    }
  });

  return sortedMenus;
}
