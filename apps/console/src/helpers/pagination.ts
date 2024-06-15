export interface PaginationResult<T> {
  rs: T[];
  hasNextPage: boolean;
  nextCursor?: string;
}

export function paginateByCursor<T extends { id?: string }>(
  content: T[],
  cursor: string,
  limit: number
): PaginationResult<T> {
  const startIndex = content.findIndex(item => item.id === cursor);
  const endIndex = Math.min(startIndex + limit, content.length);
  const rs = content; // .slice(startIndex, endIndex);
  const hasNextPage = endIndex < content.length;
  const nextCursor = hasNextPage ? content[endIndex - 1]?.id : undefined;
  return {
    rs,
    hasNextPage,
    nextCursor
  };
}
