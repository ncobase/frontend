import { PasswordPolicy } from './account';

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  min_length: 8,
  require_uppercase: true,
  require_lowercase: true,
  require_numbers: true,
  require_symbols: false
};

export type PasswordPolicyIssue =
  | 'min_length'
  | 'require_uppercase'
  | 'require_lowercase'
  | 'require_numbers'
  | 'require_symbols';

export const normalizePasswordPolicy = (policy?: Partial<PasswordPolicy>): PasswordPolicy => ({
  min_length:
    Number(policy?.min_length) > 0
      ? Number(policy?.min_length)
      : DEFAULT_PASSWORD_POLICY.min_length,
  require_uppercase: policy?.require_uppercase ?? DEFAULT_PASSWORD_POLICY.require_uppercase,
  require_lowercase: policy?.require_lowercase ?? DEFAULT_PASSWORD_POLICY.require_lowercase,
  require_numbers: policy?.require_numbers ?? DEFAULT_PASSWORD_POLICY.require_numbers,
  require_symbols: policy?.require_symbols ?? DEFAULT_PASSWORD_POLICY.require_symbols
});

export const getPasswordPolicyIssues = (
  password: string,
  rawPolicy?: Partial<PasswordPolicy>
): PasswordPolicyIssue[] => {
  const policy = normalizePasswordPolicy(rawPolicy);
  const issues: PasswordPolicyIssue[] = [];

  if ([...password].length < policy.min_length) {
    issues.push('min_length');
  }
  if (policy.require_uppercase && !/[A-Z]/.test(password)) {
    issues.push('require_uppercase');
  }
  if (policy.require_lowercase && !/[a-z]/.test(password)) {
    issues.push('require_lowercase');
  }
  if (policy.require_numbers && !/[0-9]/.test(password)) {
    issues.push('require_numbers');
  }
  if (policy.require_symbols && !/[^A-Za-z0-9]/.test(password)) {
    issues.push('require_symbols');
  }

  return issues;
};

export const passwordMeetsPolicy = (
  password: string,
  rawPolicy?: Partial<PasswordPolicy>
): boolean => getPasswordPolicyIssues(password, rawPolicy).length === 0;
