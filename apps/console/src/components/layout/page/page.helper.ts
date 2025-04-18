import { Menu, MenuTree } from '@/features/system/menu/menu';

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
 * @returns {MenuTree | null}
 */
export function findMenuBySlug(menu: MenuTree[], slug: string): MenuTree | null {
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
 * @returns {MenuTree[]}
 */
export function findMenuByParentId(menu: MenuTree[], parentId: string, type: string): MenuTree[] {
  if (!menu || !Array.isArray(menu) || menu.length === 0) {
    return [];
  }
  const recursiveSearch = (items: MenuTree[], parentId: string): MenuTree[] => {
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
 * @param menus List of menus to search through, is a tree structure.
 * @param url Current location URL path.
 * @param depth Current depth in the URL path. e.g. if the URL path is /a/b/c, the depth is 2.
 * @example
 * const menu = [
 *  {
 *    slug: 'home',
 *    children: [
 *      { slug: 'about' },
 *      { slug: 'contact' },
 *    ],
 *  },
 *  {
 *    slug: 'products',
 *    children: [
 *      {
 *        slug: 'electronics',
 *        children: [
 *          { slug: 'phones' },
 *          { slug: 'laptops' },
 *        ],
 *      },
 *      { slug: 'clothing' },
 *    ],
 *  },
 * ];
 *
 * console.log(getMenuByUrl(menu, '/home')); // should return { slug: 'home', children: [...] }
 * console.log(getMenuByUrl(menu, '/products/electronics', 0)); // should return { slug: 'products' }
 * console.log(getMenuByUrl(menu, '/products/electronics/phones', 1)); // should return { slug: 'electronics' }
 * console.log(getMenuByUrl(menu, '/products/electronics/phones', 2)); // should return { slug: 'phone' }
 * console.log(getMenuByUrl(menu, '/products/clothing')); // should return { slug: 'products' }
 * console.log(getMenuByUrl(menu, '/products/clothing', 1)); // should return { slug: 'clothing' }
 * console.log(getMenuByUrl(menu, '/products')); // should return { slug: 'products' }
 *
 * @returns {MenuTree | null}
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
    if (item.slug === currentSegment) {
      return item;
    }
    if (item.children) {
      const found = getMenuByUrl(item.children, url, depth);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
