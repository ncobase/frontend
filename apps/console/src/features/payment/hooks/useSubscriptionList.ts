import { useState, useCallback, useRef, useEffect } from 'react';

import { isEqual } from 'lodash';

import { SubscriptionQueryParams } from '../config/subscription/query';
import { useListSubscriptions } from '../service';

export const useSubscriptionList = (initialParams: SubscriptionQueryParams = { limit: 20 }) => {
  const [queryParams, setQueryParams] = useState<SubscriptionQueryParams>(initialParams);
  const lastParamsRef = useRef(initialParams);

  const { data, isLoading, error, refetch } = useListSubscriptions(queryParams);

  const fetchData = useCallback(
    async (newQueryParams: SubscriptionQueryParams) => {
      if (isEqual(newQueryParams, lastParamsRef.current)) return data;
      setQueryParams(prev => {
        const updated = { ...prev, ...newQueryParams };
        return isEqual(updated, prev) ? prev : updated;
      });
      lastParamsRef.current = { ...lastParamsRef.current, ...newQueryParams };
      return data;
    },
    [data]
  );

  useEffect(() => {
    lastParamsRef.current = queryParams;
  }, [queryParams]);

  return { data, queryParams, loading: isLoading, error, fetchData, refetch };
};
