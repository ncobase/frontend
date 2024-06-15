import { useCallback } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * useRedirectFromUrl
 * redirect from url
 * @param {string} defaultTo default redirect
 * @returns redirect
 */
export const useRedirectFromUrl = (defaultTo: string = '/') => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  return useCallback(() => {
    const decodedRedirect = decodeURIComponent(redirect);
    navigate(redirect ? decodedRedirect : defaultTo, { replace: true });
  }, [navigate, searchParams, defaultTo]);
};

/**
 * useRefreshPage
 * refresh page
 * @param {number} delta
 * @returns refresh page
 */
export const useRefreshPage = (delta: number = 0) => {
  const navigate = useNavigate();
  const refreshPage = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      navigate(delta);
    }
  };
  return refreshPage;
};
