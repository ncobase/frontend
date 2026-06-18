import { describe, expect, it } from 'vitest';

import { assertRequiredApiArray, assertRequiredApiValue } from './guards';

describe('API guards', () => {
  it('returns required values when they are present', () => {
    expect(assertRequiredApiValue('item-1', 'ID')).toBe('item-1');
    expect(assertRequiredApiValue(0, 'Order')).toBe(0);
  });

  it('rejects missing scalar values with the field label', () => {
    expect(() => assertRequiredApiValue(undefined, 'User ID')).toThrow('User ID is required');
    expect(() => assertRequiredApiValue(null, 'Space ID')).toThrow('Space ID is required');
    expect(() => assertRequiredApiValue('   ', 'Role ID')).toThrow('Role ID is required');
  });

  it('rejects empty arrays and missing array entries before API requests are built', () => {
    expect(() => assertRequiredApiArray([], 'Role IDs')).toThrow('Role IDs is required');
    expect(() => assertRequiredApiArray(['role-1', ''], 'Role IDs')).toThrow(
      'Role IDs[1] is required'
    );
  });
});
