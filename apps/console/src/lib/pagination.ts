export interface PaginationResult<T> {
  items: T[];
  total: number;
  has_next: boolean;
  next?: string;
}

export const paginateByCursor = <T extends { id?: string }>(
  items: T[],
  total: number,
  cursor?: string,
  limit: number = 10
): PaginationResult<T> | undefined => {
  if (!items || items.length === 0) {
    return { items: [], total: 0, has_next: false };
  }

  const startIndex = cursor ? items.findIndex(item => item.id === cursor) + 1 : 0;
  const endIndex = Math.min(startIndex + limit, items.length);

  if (startIndex >= 0 && startIndex < items.length) {
    const paginatedItems = items.slice(startIndex, endIndex);
    const hasNext = endIndex < items.length;
    const next = hasNext ? items[endIndex]?.id : undefined;

    return { items: paginatedItems, total: total, next, has_next: hasNext };
  }

  return { items: [], total: 0, has_next: false };
};
