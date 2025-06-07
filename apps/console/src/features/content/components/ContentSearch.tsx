import React, { useState, useCallback, useMemo } from 'react';

import { Icons, Button } from '@ncobase/react';
import { debounce } from 'lodash';

interface ContentSearchProps {
  onSearch: (_query: string, _filters: any) => void;
  placeholder?: string;
  showFilters?: boolean;
  filterOptions?: {
    statuses?: Array<{ label: string; value: any }>;
    types?: Array<{ label: string; value: any }>;
    categories?: Array<{ label: string; value: any }>;
  };
}

export const ContentSearch: React.FC<ContentSearchProps> = ({
  onSearch,
  placeholder = 'Search content...',
  showFilters = false,
  filterOptions = {}
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    category: '',
    dateRange: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchQuery: string, searchFilters: any) => {
        onSearch(searchQuery, searchFilters);
      }, 300),
    [onSearch]
  );

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      debouncedSearch(value, filters);
    },
    [filters, debouncedSearch]
  );

  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      debouncedSearch(query, newFilters);
    },
    [query, filters, debouncedSearch]
  );

  const clearFilters = useCallback(() => {
    setQuery('');
    setFilters({
      status: '',
      type: '',
      category: '',
      dateRange: ''
    });
    onSearch('', {});
  }, [onSearch]);

  const hasActiveFilters = query || Object.values(filters).some(Boolean);

  return (
    <div className='space-y-4'>
      {/* Main search bar */}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Icons name='IconSearch' className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          className='block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          placeholder={placeholder}
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
        />
        <div className='absolute inset-y-0 right-0 flex items-center'>
          {showFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`mr-1 ${showAdvanced ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Icons name='IconFilter' size={16} />
            </Button>
          )}
          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearFilters}
              className='mr-1 text-gray-400 hover:text-gray-600'
            >
              <Icons name='IconX' size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && showAdvanced && (
        <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Status filter */}
            {filterOptions.statuses && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                <select
                  value={filters.status}
                  onChange={e => handleFilterChange('status', e.target.value)}
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                >
                  <option value=''>All Statuses</option>
                  {filterOptions.statuses.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Type filter */}
            {filterOptions.types && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Type</label>
                <select
                  value={filters.type}
                  onChange={e => handleFilterChange('type', e.target.value)}
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                >
                  <option value=''>All Types</option>
                  {filterOptions.types.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category filter */}
            {filterOptions.categories && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                <select
                  value={filters.category}
                  onChange={e => handleFilterChange('category', e.target.value)}
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                >
                  <option value=''>All Categories</option>
                  {filterOptions.categories.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date range filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Date Range</label>
              <select
                value={filters.dateRange}
                onChange={e => handleFilterChange('dateRange', e.target.value)}
                className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              >
                <option value=''>All Time</option>
                <option value='today'>Today</option>
                <option value='week'>This Week</option>
                <option value='month'>This Month</option>
                <option value='quarter'>This Quarter</option>
                <option value='year'>This Year</option>
              </select>
            </div>
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className='flex flex-wrap gap-2 pt-2 border-t border-gray-200'>
              {query && (
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  Search: "{query}"
                  <button
                    onClick={() => handleQueryChange('')}
                    className='ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500'
                  >
                    <Icons name='IconX' size={12} />
                  </button>
                </span>
              )}

              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;

                const filterLabels = {
                  status: 'Status',
                  type: 'Type',
                  category: 'Category',
                  dateRange: 'Date'
                };

                return (
                  <span
                    key={key}
                    className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                  >
                    {filterLabels[key]}: {value}
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className='ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500'
                    >
                      <Icons name='IconX' size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
