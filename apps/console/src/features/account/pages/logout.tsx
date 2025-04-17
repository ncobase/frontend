import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { useAuthContext } from '@/features/account/context';
import { clearTenant } from '@/features/system/tenant/context';

export const Logout = () => {
  const { updateTokens } = useAuthContext();
  const navigate = useNavigate();
  const queryCache = useQueryClient();

  useEffect(() => {
    updateTokens();
    clearTenant();
    queryCache.clear();
    navigate('/login');
  }, [updateTokens, queryCache]);

  return undefined;
};
