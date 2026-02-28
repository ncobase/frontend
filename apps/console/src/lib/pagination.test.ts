import { describe, expect, it } from 'vitest';

import { paginateByCursor } from './pagination';

interface Item {
  id: string;
  value: number;
}

const items: Item[] = [
  { id: 'a', value: 1 },
  { id: 'b', value: 2 },
  { id: 'c', value: 3 },
  { id: 'd', value: 4 }
];

describe('paginateByCursor', () => {
  it('returns empty result for empty items', () => {
    expect(paginateByCursor([], 0)).toEqual({ items: [], total: 0, has_next: false });
  });

  it('returns first page when cursor is not provided', () => {
    const result = paginateByCursor(items, 4, undefined, 2);
    expect(result).toEqual({
      items: items.slice(0, 2),
      total: 4,
      next: 'c',
      has_next: true
    });
  });

  it('returns next page after cursor', () => {
    const result = paginateByCursor(items, 4, 'b', 2);
    expect(result).toEqual({
      items: items.slice(2, 4),
      total: 4,
      next: undefined,
      has_next: false
    });
  });

  it('returns empty result when cursor does not exist', () => {
    const result = paginateByCursor(items, 4, 'missing', 2);
    expect(result).toEqual({
      items: [],
      total: 4,
      has_next: false
    });
  });

  it('returns empty result when cursor is at the end', () => {
    const result = paginateByCursor(items, 4, 'd', 2);
    expect(result).toEqual({
      items: [],
      total: 4,
      has_next: false
    });
  });
});
