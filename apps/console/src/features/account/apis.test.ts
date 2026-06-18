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
});
