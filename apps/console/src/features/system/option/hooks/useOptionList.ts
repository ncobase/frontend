import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

import { isEqual } from 'lodash';

import { QueryFormParams } from '../config/query';
import { useListOption } from '../service';

export const useOptionList = (initialParams: QueryFormParams = { limit: 20 }) => {
  const [queryParams, setQueryParams] = useState<QueryFormParams>(initialParams);
  const lastParamsRef = useRef(initialParams);

  const { data, isLoading, error, refetch, isFetching } = useListOption(queryParams);

  // Memoized data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data]);

  // Fetch data with deduplication
  const fetchData = useCallback(
    async (newQueryParams: QueryFormParams) => {
      const mergedParams = { ...queryParams, ...newQueryParams };

      // Reset cursor when search params change (but not pagination params)
      const searchParamsChanged =
        mergedParams.name !== queryParams.name ||
        mergedParams.type !== queryParams.type ||
        mergedParams.autoload !== queryParams.autoload ||
        mergedParams.prefix !== queryParams.prefix;

      if (searchParamsChanged) {
        mergedParams.cursor = '';
      }

      if (isEqual(mergedParams, lastParamsRef.current)) {
        return memoizedData;
      }

      setQueryParams(mergedParams);
      lastParamsRef.current = mergedParams;

      return memoizedData;
    },
    [queryParams, memoizedData]
  );

  // Load more data for pagination
  const loadMore = useCallback(async () => {
    if (data?.next_cursor && data?.has_next_page) {
      await fetchData({ cursor: data.next_cursor });
    }
  }, [data?.next_cursor, data?.has_next_page, fetchData]);

  // Reset to first page
  const resetToFirstPage = useCallback(() => {
    setQueryParams(prev => ({ ...prev, cursor: '' }));
  }, []);

  useEffect(() => {
    lastParamsRef.current = queryParams;
  }, [queryParams]);

  return {
    data: memoizedData,
    queryParams,
    loading: isLoading,
    fetching: isFetching,
    error,
    fetchData,
    loadMore,
    resetToFirstPage,
    refetch,
    hasMore: data?.has_next_page || false,
    total: data?.total || 0
  };
};
