import { describe, expect, it } from 'vitest';

import {
  getPasswordPolicyIssues,
  normalizePasswordPolicy,
  passwordMeetsPolicy
} from './password_policy';

describe('account password policy', () => {
  it('normalizes missing policy fields with secure defaults', () => {
    expect(normalizePasswordPolicy({ min_length: 10 })).toEqual({
      min_length: 10,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false
    });
  });

  it('reports all unsatisfied requirements', () => {
    expect(
      getPasswordPolicyIssues('weak', {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: true
      })
    ).toEqual(['min_length', 'require_uppercase', 'require_numbers', 'require_symbols']);
  });

  it('accepts passwords that satisfy the active policy', () => {
    expect(passwordMeetsPolicy('StrongPass1')).toBe(true);
    expect(
      passwordMeetsPolicy('StrongPass1!', {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: true
      })
    ).toBe(true);
  });
});
