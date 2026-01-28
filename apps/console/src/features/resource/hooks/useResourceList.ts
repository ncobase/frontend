import { useState, useCallback, useRef, useEffect } from 'react';

import { isEqual } from 'lodash';

import { QueryFormParams } from '../config/query';
import { useListResources } from '../service';

export const useResourceList = (initialParams: QueryFormParams = { limit: 20 }) => {
  const [queryParams, setQueryParams] = useState<QueryFormParams>(initialParams);
  const lastParamsRef = useRef(initialParams);

  const { data, isLoading, error, refetch } = useListResources(queryParams);

  const fetchData = useCallback(
    async (newQueryParams: QueryFormParams) => {
      if (isEqual(newQueryParams, lastParamsRef.current)) {
        return data;
      }

      setQueryParams(prevParams => {
        const updatedParams = { ...prevParams, ...newQueryParams };
        return isEqual(updatedParams, prevParams) ? prevParams : updatedParams;
      });

      lastParamsRef.current = { ...lastParamsRef.current, ...newQueryParams };
      return data;
    },
    [data]
  );

  useEffect(() => {
    lastParamsRef.current = queryParams;
  }, [queryParams]);

  return {
    data,
    queryParams,
    loading: isLoading,
    error,
    fetchData,
    refetch
  };
};
