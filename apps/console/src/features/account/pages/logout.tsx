import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '@/features/account/context';

export const Logout = () => {
  const { updateTokens } = useAuthContext();
  const navigate = useNavigate();
  const queryCache = useQueryClient();

  useEffect(() => {
    updateTokens();
    queryCache.clear();
    navigate('/login');
  }, [updateTokens, queryCache]);

  return undefined;
};
