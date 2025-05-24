import { useState, useCallback, useRef, useEffect } from 'react';

import { isEqual } from 'lodash';

import { QueryFormParams } from '../config/query';
import { useListTaxonomies } from '../service';
import { Taxonomies } from '../taxonomy';

export const useTaxonomyList = (
  initialParams: QueryFormParams = {
    limit: 20,
    type: 'all',
    children: true
  }
) => {
  const [queryParams, setQueryParams] = useState<QueryFormParams>(initialParams);
  const lastParamsRef = useRef(initialParams);

  const { data, isLoading, error, refetch } = useListTaxonomies(queryParams);

  // Fetch data
  const fetchData = useCallback(
    async (newQueryParams: QueryFormParams) => {
      // Prevent unnecessary updates if params haven't changed
      if (isEqual(newQueryParams, lastParamsRef.current)) {
        return data;
      }

      const mergedParams = { ...lastParamsRef.current, ...newQueryParams };

      // Update params only if they actually changed
      setQueryParams(prevParams => {
        const updatedParams = { ...prevParams, ...newQueryParams };
        return isEqual(updatedParams, prevParams) ? prevParams : updatedParams;
      });

      lastParamsRef.current = mergedParams;
      return data;
    },
    [data]
  );

  // Update ref when queryParams change
  useEffect(() => {
    lastParamsRef.current = queryParams;
  }, [queryParams]);

  return {
    data: data as Taxonomies | undefined,
    queryParams,
    loading: isLoading,
    error,
    fetchData,
    refetch
  };
};
