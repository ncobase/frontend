import { isNumber } from './raw_type';

/**
 * 根据 Key 排序
 * @param key 排序 key
 * @param order asc / desc, 默认 asc
 */
export const sortByKey =
  (key: string, order: 'asc' | 'desc' = 'asc') =>
  (a: { [key: string]: unknown }, b: { [key: string]: unknown }) => {
    if (!key) {
      return 0;
    }

    const aValue = isNumber(a[key]) ? Number(a[key]) : String(a[key]);
    const bValue = isNumber(b[key]) ? Number(b[key]) : String(b[key]);

    if (aValue < bValue) {
      return order === 'desc' ? 1 : -1;
    }

    if (aValue > bValue) {
      return order === 'desc' ? -1 : 1;
    }

    // If both values are equal, use localeCompare for consistent sorting behavior
    return String(aValue).localeCompare(String(bValue));
  };
