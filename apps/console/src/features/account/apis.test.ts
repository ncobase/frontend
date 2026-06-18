import { beforeEach, describe, expect, it, vi } from 'vitest';

import { accountApi, authApi } from './apis';

import { request } from '@/lib/api/request';

vi.mock('@/lib/api/request', () => ({
  request: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn()
  }
}));

describe('account APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads the public password policy', async () => {
    await accountApi.getPasswordPolicy();

    expect(request.get).toHaveBeenCalledWith('/password-policy');
  });

  it('updates the current account password through the trusted account endpoint', async () => {
    const payload = {
      old_password: 'OldPass1',
      new_password: 'NewPass1',
      confirm: 'NewPass1'
    };

    await accountApi.changePassword(payload);

    expect(request.put).toHaveBeenCalledWith('/account/password', payload);
  });

  it('requests and verifies registration codes through authorize endpoints', async () => {
    await authApi.sendCode('person@example.com');
    await authApi.verifyCode('A/B 123');

    expect(request.post).toHaveBeenCalledWith('/authorize/send', { email: 'person@example.com' });
    expect(request.get).toHaveBeenCalledWith('/authorize/A%2FB%20123');
  });

  it('sends the register token and password fields to backend registration', async () => {
    const payload = {
      username: 'person01',
      display_name: 'person01',
      email: 'person@example.com',
      password: 'StrongPass1',
      confirm_password: 'StrongPass1',
      register_token: 'register-token'
    };

    await authApi.register(payload);

    expect(request.post).toHaveBeenCalledWith('/register', payload);
  });

  it('verifies MFA login challenges through the dedicated login endpoint', async () => {
    const payload = {
      mfa_token: 'mfa-token',
      code: '123456'
    };

    await authApi.loginMFA(payload);

    expect(request.post).toHaveBeenCalledWith('/login/mfa', payload);
  });

  it('uses the current account 2FA management endpoints', async () => {
    await accountApi.getTwoFactorStatus();
    await accountApi.setupTwoFactor({ method: 'app' });
    await accountApi.verifyTwoFactor({ method: 'app', code: '123456' });
    await accountApi.disableTwoFactor({ password: 'StrongPass1', code: '123456' });
    await accountApi.getTwoFactorBackupCodes();
    await accountApi.regenerateTwoFactorBackupCodes({ method: 'app', code: '654321' });

    expect(request.get).toHaveBeenCalledWith('/account/2fa/status');
    expect(request.post).toHaveBeenCalledWith('/account/2fa/setup', { method: 'app' });
    expect(request.post).toHaveBeenCalledWith('/account/2fa/verify', {
      method: 'app',
      code: '123456'
    });
    expect(request.post).toHaveBeenCalledWith('/account/2fa/disable', {
      password: 'StrongPass1',
      code: '123456'
    });
    expect(request.get).toHaveBeenCalledWith('/account/2fa/backup-codes');
    expect(request.post).toHaveBeenCalledWith('/account/2fa/backup-codes/regenerate', {
      method: 'app',
      code: '654321'
    });
  });
});
