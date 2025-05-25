import { useState, useCallback, useRef, useEffect } from 'react';

import { isEqual } from 'lodash';

import { QueryFormParams } from '../config/query';
import { OptionsList } from '../options';
import { useListOptions } from '../service';

export const useOptionsList = (initialParams: QueryFormParams = { limit: 20 }) => {
  const [queryParams, setQueryParams] = useState<QueryFormParams>(initialParams);
  const lastParamsRef = useRef(initialParams);

  const { data, isLoading, error, refetch } = useListOptions(queryParams);

  // Fetch data
  const fetchData = useCallback(
    async (newQueryParams: QueryFormParams) => {
      if (isEqual(newQueryParams, lastParamsRef.current)) {
        return data;
      }

      const mergedParams = { ...lastParamsRef.current, ...newQueryParams };

      setQueryParams(prevParams => {
        const updatedParams = { ...prevParams, ...newQueryParams };
        return isEqual(updatedParams, prevParams) ? prevParams : updatedParams;
      });

      lastParamsRef.current = mergedParams;
      return data;
    },
    [data]
  );

  useEffect(() => {
    lastParamsRef.current = queryParams;
  }, [queryParams]);

  return {
    data: data as OptionsList | undefined,
    queryParams,
    loading: isLoading,
    error,
    fetchData,
    refetch
  };
};
