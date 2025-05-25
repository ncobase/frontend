import { MenuTree } from '@/features/system/menu/menu';

/**
 * check if menu is divider
 */
export const isDividerLink = (link: Partial<MenuTree>): boolean =>
  (link.name?.includes('divide') || link.slug?.includes('divide')) && link.path === '-';

/**
 * check if menu is group
 */
export const isGroup = (link: Partial<MenuTree>): boolean =>
  link.slug?.includes('group') && link.path === '-';

/**
 * split path
 */
export const pathSplit = (path: string): string[] =>
  path.split('/').filter(part => part !== '') || [];

/**
 * Finds a menu item by its slug recursively in a hierarchical structure.
 */
export function findMenuBySlug(menus: MenuTree[], slug: string): MenuTree | null {
  if (!menus || !Array.isArray(menus) || menus.length === 0) {
    return null;
  }

  for (const item of menus) {
    if (item && item.slug === slug) {
      return item;
    }
    if (item && item.children) {
      const found = findMenuBySlug(item.children as MenuTree[], slug);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Finds menu items by parent ID recursively in a hierarchical structure.
 */
export function findMenuByParentId(menus: MenuTree[], parentId: string, type: string): MenuTree[] {
  if (!menus || !Array.isArray(menus) || menus.length === 0) {
    return [];
  }

  const recursiveSearch = (items: MenuTree[], parentId: string): MenuTree[] => {
    return items.flatMap(item => {
      if (item.id === parentId && item.children && Array.isArray(item.children)) {
        return (item.children as MenuTree[]).filter(child => child.type === type);
      }
      if (item.children) {
        return recursiveSearch(item.children as MenuTree[], parentId);
      }
      return [];
    });
  };

  return recursiveSearch(menus, parentId);
}

/**
 * Finds a menu item by its URL path in a hierarchical structure.
 * Enhanced to support deep nested menu structures with proper path matching.
 */
export function getMenuByUrl(menus: MenuTree[], url: string, depth: number = 0): MenuTree | null {
  if (!menus || !Array.isArray(menus) || menus.length === 0 || !url) {
    return null;
  }

  const urlSegments = url.split('/').filter(segment => segment);
  if (urlSegments.length <= depth) {
    return null;
  }

  const currentSegment = urlSegments[depth];

  for (const item of menus) {
    // Check if current item's path matches the URL segments
    if (item.path) {
      const itemPathSegments = item.path.split('/').filter(segment => segment);

      // Direct path match
      if (item.path === url) {
        return item;
      }

      // Partial path match for parent menus
      if (itemPathSegments.length > 0 && itemPathSegments[0] === currentSegment) {
        // If this is an exact match at current depth, return it
        if (depth === 0 && itemPathSegments.length === 1) {
          return item;
        }

        // If there are more segments to match, search in children
        if (item.children && depth < urlSegments.length - 1) {
          const found = getMenuByUrl(item.children as MenuTree[], url, depth + 1);
          if (found) {
            return found;
          }
        }

        // Return this item if it's a parent that contains the path
        if (url.startsWith(item.path)) {
          return item;
        }
      }
    }

    // Also check by slug for backward compatibility
    if (item.slug === currentSegment) {
      if (depth === urlSegments.length - 1) {
        return item;
      }
      if (item.children && depth < urlSegments.length - 1) {
        const found = getMenuByUrl(item.children as MenuTree[], url, depth + 1);
        if (found) {
          return found;
        }
      }
      return item;
    }

    // Search recursively in children
    if (item.children) {
      const found = getMenuByUrl(item.children as MenuTree[], url, depth);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Flattens a hierarchical menu tree into a single level array
 */
export function flattenMenuTree(menus: MenuTree[]): MenuTree[] {
  const flattened: MenuTree[] = [];

  function flatten(items: MenuTree[]) {
    for (const item of items) {
      flattened.push(item);
      if (item.children && Array.isArray(item.children)) {
        flatten(item.children as MenuTree[]);
      }
    }
  }

  flatten(menus);
  return flattened;
}

/**
 * Gets all parent menus for a given menu item
 */
export function getMenuParents(menus: MenuTree[], targetId: string): MenuTree[] {
  const parents: MenuTree[] = [];

  function findParents(items: MenuTree[], currentPath: MenuTree[]): boolean {
    for (const item of items) {
      const newPath = [...currentPath, item];

      if (item.id === targetId) {
        parents.push(...currentPath);
        return true;
      }

      if (item.children && Array.isArray(item.children)) {
        if (findParents(item.children as MenuTree[], newPath)) {
          return true;
        }
      }
    }
    return false;
  }

  findParents(menus, []);
  return parents;
}

/**
 * Searches for menus by name or label (case-insensitive)
 */
export function searchMenus(menus: MenuTree[], searchTerm: string): MenuTree[] {
  if (!searchTerm.trim()) return [];

  const term = searchTerm.toLowerCase();
  const matches: MenuTree[] = [];

  function search(items: MenuTree[]) {
    for (const item of items) {
      const name = (item.name || '').toLowerCase();
      const label = (item.label || '').toLowerCase();

      if (name.includes(term) || label.includes(term)) {
        matches.push(item);
      }

      if (item.children && Array.isArray(item.children)) {
        search(item.children as MenuTree[]);
      }
    }
  }

  search(menus);
  return matches;
}

/**
 * Gets the full path hierarchy for a menu item
 */
export function getMenuHierarchy(menus: MenuTree[], targetId: string): MenuTree[] {
  const hierarchy: MenuTree[] = [];

  function findHierarchy(items: MenuTree[], currentPath: MenuTree[]): boolean {
    for (const item of items) {
      const newPath = [...currentPath, item];

      if (item.id === targetId) {
        hierarchy.push(...newPath);
        return true;
      }

      if (item.children && Array.isArray(item.children)) {
        if (findHierarchy(item.children as MenuTree[], newPath)) {
          return true;
        }
      }
    }
    return false;
  }

  findHierarchy(menus, []);
  return hierarchy;
}

/**
 * Filters menus by type recursively
 */
export function filterMenusByType(menus: MenuTree[], type: string): MenuTree[] {
  return menus.filter(menu => {
    if (menu.type === type) return true;
    if (menu.children && Array.isArray(menu.children)) {
      const childrenOfType = filterMenusByType(menu.children as MenuTree[], type);
      if (childrenOfType.length > 0) {
        return { ...menu, children: childrenOfType };
      }
    }
    return false;
  });
}
