import React, { useState, useCallback } from 'react';

import { Button, Icons, InputField, SelectField, Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterOptions {
  types?: FilterOption[];
  statuses?: FilterOption[];
  categories?: FilterOption[];
  dateRanges?: FilterOption[];
  [key: string]: FilterOption[] | undefined;
}

interface ContentSearchProps {
  onSearch: (_query: string, _filters: Record<string, string>) => void;
  placeholder?: string;
  showFilters?: boolean;
  filterOptions?: FilterOptions;
  initialQuery?: string;
  initialFilters?: Record<string, string>;
}

export const ContentSearch: React.FC<ContentSearchProps> = ({
  onSearch,
  placeholder = 'Search...',
  showFilters = false,
  filterOptions = {},
  initialQuery = '',
  initialFilters = {}
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch(query, filters);
  }, [query, filters, onSearch]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setQuery('');
    onSearch('', {});
  }, [onSearch]);

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const newFilters = { ...filters };
      if (value && value !== 'all') {
        newFilters[key] = value;
      } else {
        delete newFilters[key];
      }
      setFilters(newFilters);
    },
    [filters]
  );

  const activeFiltersCount = Object.keys(filters).filter(key => filters[key]).length;

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200'>
      {/* Main Search Bar */}
      <div className='p-4'>
        <div className='flex items-center gap-3'>
          {/* Search Input */}
          <div className='flex-1'>
            <InputField
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              prependIcon='IconSearch'
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>

          {/* Filter Toggle */}
          {showFilters && (
            <Button
              variant='outline'
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 relative transition-all duration-200 hover:shadow-sm ${
                activeFiltersCount > 0
                  ? 'border-blue-300 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                  : 'dark:border-gray-600 dark:hover:border-gray-500'
              }`}
            >
              <Icons name='IconFilter' size={16} className='text-gray-600 dark:text-gray-300' />
              {t('common.filters')}
              {activeFiltersCount > 0 && (
                <Badge
                  variant='primary'
                  className='absolute -top-2 -right-2 min-w-[20px] h-5 text-xs animate-pulse'
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className='px-6 hover:shadow-md transition-shadow duration-200'
          >
            <Icons name='IconSearch' size={16} className='mr-2' />
            {t('actions.search')}
          </Button>

          {/* Clear Button */}
          {(query || activeFiltersCount > 0) && (
            <Button
              variant='outline'
              onClick={handleClearFilters}
              className='flex items-center gap-1 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/30 dark:hover:border-red-700 dark:border-gray-600 transition-colors duration-200'
            >
              <Icons name='IconX' size={14} />
              {t('actions.clear')}
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className='border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm'>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {/* Type Filter */}
            {filterOptions.types && (
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  {t('common.type')}
                </label>
                <SelectField
                  value={filters.types || ''}
                  onChange={value => handleFilterChange('types', value)}
                  placeholder={t('common.all_types')}
                  options={filterOptions.types}
                  allowClear
                  size='sm'
                />
              </div>
            )}

            {/* Status Filter */}
            {filterOptions.statuses && (
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  {t('common.status')}
                </label>
                <SelectField
                  value={filters.status || ''}
                  onChange={value => handleFilterChange('status', value)}
                  placeholder={t('common.all_statuses')}
                  options={filterOptions.statuses}
                  allowClear
                  size='sm'
                />
              </div>
            )}

            {/* Category Filter */}
            {filterOptions.categories && (
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  {t('common.category')}
                </label>
                <SelectField
                  value={filters.category || ''}
                  onChange={value => handleFilterChange('category', value)}
                  placeholder={t('common.all_categories')}
                  options={filterOptions.categories}
                  allowClear
                  size='sm'
                />
              </div>
            )}

            {/* Date Range Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                {t('common.date_range')}
              </label>
              <SelectField
                value={filters.date_range || ''}
                onChange={value => handleFilterChange('date_range', value)}
                placeholder={t('common.all')}
                options={[
                  { label: t('common.all'), value: 'all' },
                  { label: t('common.today'), value: 'today' },
                  { label: t('common.this_week'), value: 'week' },
                  { label: t('common.this_month'), value: 'month' },
                  { label: t('common.this_year'), value: 'year' }
                ]}
                allowClear
                size='sm'
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {t('common.active_filters')}:
                </span>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;

                  // Find the label for the value
                  const filterGroup = filterOptions[key + 's']; // types, statuses, etc.
                  const option = filterGroup?.find(opt => opt.value === value);
                  const label = option?.label || value;

                  return (
                    <Badge
                      key={key}
                      className='flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    >
                      <span className='text-xs font-medium'>{t(`common.${key}.${label}`)}</span>
                      <button
                        onClick={() => handleFilterChange(key, '')}
                        className='hover:bg-blue-100 dark:hover:bg-blue-800 rounded p-0.5 transition-colors duration-200'
                      >
                        <Icons name='IconX' size={12} />
                      </button>
                    </Badge>
                  );
                })}
                <Button
                  variant='ghost'
                  size='xs'
                  onClick={handleClearFilters}
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                >
                  {t('actions.clear_all')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
