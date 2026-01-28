import { useState, useCallback, useRef, useEffect } from 'react';

import { isEqual } from 'lodash';

import { OrderQueryParams } from '../config/order/query';
import { useListOrders } from '../service';

export const useOrderList = (initialParams: OrderQueryParams = { limit: 20 }) => {
  const [queryParams, setQueryParams] = useState<OrderQueryParams>(initialParams);
  const lastParamsRef = useRef(initialParams);

  const { data, isLoading, error, refetch } = useListOrders(queryParams);

  const fetchData = useCallback(
    async (newQueryParams: OrderQueryParams) => {
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
