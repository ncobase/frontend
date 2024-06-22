import { isString } from './raw_type';

/**
 * Generic compare function for sorting items based on a key and order.
 * @param key Key to sort by.
 * @param order Sorting order ('asc' or 'desc').
 * @returns Comparison function.
 */
export function compareItems<T extends Record<string, any>>(key: keyof T, order: 'asc' | 'desc') {
  return (a: T, b: T): number => {
    const aValue = getValue(a[key]);
    const bValue = getValue(b[key]);

    if (aValue === bValue) {
      return 0;
    }

    return order === 'asc' ? (aValue < bValue ? -1 : 1) : aValue > bValue ? -1 : 1;
  };
}

/**
 * Generic function to sort a tree structure.
 * @param items List of items to sort.
 * @param key Key to sort by.
 * @param order Sorting order ('asc' or 'desc').
 * @param childrenKey Key that contains the children array (optional, default is 'children').
 * @returns Sorted items.
 */
export function sortTree<T extends Record<string, any>>(
  items: T[],
  key: keyof T,
  order: 'asc' | 'desc',
  childrenKey: keyof T = 'children'
): T[] {
  const sortedItems = [...items]; // Create a copy of items array
  sortedItems.sort(compareItems(key, order));

  // Recursively sort children of each item
  sortedItems.forEach(item => {
    const children = item[childrenKey];
    if (Array.isArray(children)) {
      item[childrenKey] = sortTree(children, key, order, childrenKey) as any;
    }
  });

  return sortedItems;
}

/**
 * Get comparable value for sorting.
 * @param value Value to be compared.
 * @returns Comparable value.
 */
function getValue(value: any): any {
  return isString(value) ? value.toLowerCase() : value;
}
