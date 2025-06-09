import React, { useState, useCallback, useMemo } from 'react';

import {
  Icons,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Card,
  CardContent,
  Tooltip,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Divider,
  Label,
  MultiSelect,
  DatePicker
} from '@ncobase/react';
import { debounce } from 'lodash';

interface ContentSearchProps {
  onSearch: (_query: string, _filters: any) => void;
  placeholder?: string;
  showFilters?: boolean;
  filterOptions?: {
    statuses?: Array<{ label: string; value: any }>;
    types?: Array<{ label: string; value: any }>;
    categories?: Array<{ label: string; value: any }>;
    authors?: Array<{ label: string; value: any }>;
    tags?: Array<{ label: string; value: any }>;
  };
  className?: string;
}

export const ContentSearch: React.FC<ContentSearchProps> = ({
  onSearch,
  placeholder = 'Search content...',
  showFilters = false,
  filterOptions = {},
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    category: '',
    authors: [] as string[],
    tags: [] as string[],
    dateRange: null as any,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
      const processedValue = value === 'all' ? '' : value;
      const newFilters = { ...filters, [key]: processedValue };
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
      authors: [],
      tags: [],
      dateRange: null,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    onSearch('', {});
    setShowAdvanced(false);
  }, [onSearch]);

  const hasActiveFilters =
    query ||
    Object.entries(filters).some(([key, value]) => {
      if (key === 'sortBy' && value === 'relevance') return false;
      if (key === 'sortOrder' && value === 'desc') return false;
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    });

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' && value === 'relevance') return false;
    if (key === 'sortOrder' && value === 'desc') return false;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  }).length;

  const getSortIcon = () => {
    if (filters.sortOrder === 'asc') return 'IconSortAscending';
    return 'IconSortDescending';
  };

  const quickFilters = [
    { label: 'Published', key: 'status', value: '1' },
    { label: 'Draft', key: 'status', value: '0' },
    { label: 'This Week', key: 'dateRange', value: 'week' },
    { label: 'This Month', key: 'dateRange', value: 'month' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main search section */}
      <div className='relative'>
        <div
          className={`flex items-center gap-3 transition-all duration-200 ${
            isSearchFocused ? 'scale-[1.02] transform' : ''
          }`}
        >
          {/* Search input */}
          <div className='relative flex-1 group'>
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                isSearchFocused ? 'text-primary-500' : 'text-gray-400'
              }`}
            >
              <Icons name='IconSearch' size={18} />
            </div>
            <Input
              type='text'
              className={`h-11 pl-11 pr-4 text-sm bg-white border transition-all duration-200 rounded-lg
                focus:shadow-sm focus:border-primary-500
                focus:ring-2 focus:ring-primary-100 ${
                  isSearchFocused ? 'border-primary-300' : 'border-gray-200'
                }`}
              placeholder={placeholder}
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
              >
                <Icons name='IconX' size={16} />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className='flex items-center gap-2'>
            {showFilters && (
              <Tooltip content='Advanced filters' side='bottom'>
                <Button
                  variant={showAdvanced ? 'primary' : 'outline'}
                  size='md'
                  className='h-11 px-4 relative'
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Icons name='IconFilter' size={16} />
                  {activeFilterCount > 0 && (
                    <Badge
                      variant='danger'
                      className='absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center'
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </Tooltip>
            )}

            <Dropdown>
              <DropdownTrigger asChild>
                <Tooltip content='Sort options' side='bottom'>
                  <Button variant='outline' size='md' className='h-11 px-4'>
                    <Icons name={getSortIcon()} size={16} />
                  </Button>
                </Tooltip>
              </DropdownTrigger>
              <DropdownContent align='end' className='w-48'>
                <div className='p-2'>
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                    Sort By
                  </Label>
                </div>
                <DropdownItem
                  onClick={() => handleFilterChange('sortBy', 'relevance')}
                  className={filters.sortBy === 'relevance' ? 'bg-primary-50' : ''}
                >
                  <Icons name='IconTarget' className='mr-2 h-4 w-4' />
                  Relevance
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleFilterChange('sortBy', 'date')}
                  className={filters.sortBy === 'date' ? 'bg-primary-50' : ''}
                >
                  <Icons name='IconCalendar' className='mr-2 h-4 w-4' />
                  Date
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleFilterChange('sortBy', 'title')}
                  className={filters.sortBy === 'title' ? 'bg-primary-50' : ''}
                >
                  <Icons name='IconSortAscending' className='mr-2 h-4 w-4' />
                  Title
                </DropdownItem>
                <Divider className='my-1' />
                <div className='p-2'>
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                    Order
                  </Label>
                </div>
                <DropdownItem
                  onClick={() => handleFilterChange('sortOrder', 'asc')}
                  className={filters.sortOrder === 'asc' ? 'bg-primary-50' : ''}
                >
                  <Icons name='IconSortAscending' className='mr-2 h-4 w-4' />
                  Ascending
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleFilterChange('sortOrder', 'desc')}
                  className={filters.sortOrder === 'desc' ? 'bg-primary-50' : ''}
                >
                  <Icons name='IconSortDescending' className='mr-2 h-4 w-4' />
                  Descending
                </DropdownItem>
              </DropdownContent>
            </Dropdown>

            {hasActiveFilters && (
              <Tooltip content='Clear all filters' side='bottom'>
                <Button
                  variant='outline'
                  size='md'
                  className='h-11 px-4 text-red-600 hover:text-red-700 hover:border-red-300'
                  onClick={clearFilters}
                >
                  <Icons name='IconX' size={16} />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Quick filters */}
        {showFilters && !showAdvanced && (
          <div className='flex flex-wrap gap-2 mt-3'>
            {quickFilters.map(filter => (
              <Button
                key={`${filter.key}-${filter.value}`}
                variant={filters[filter.key] === filter.value ? 'primary' : 'outline'}
                size='sm'
                className='h-8 px-3 text-xs'
                onClick={() => {
                  const newValue = filters[filter.key] === filter.value ? '' : filter.value;
                  handleFilterChange(filter.key, newValue);
                }}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced filters */}
      {showFilters && showAdvanced && (
        <Card className='bg-gray-50/50 hover:shadow-none border border-gray-100'>
          <CardContent className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {/* Status filter */}
              {filterOptions.statuses && (
                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-gray-700 flex items-center'>
                    <Icons name='IconCircle' className='mr-1 h-3 w-3' />
                    Status
                  </Label>
                  <Select
                    value={filters.status}
                    onValueChange={value => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className='h-9'>
                      <SelectValue placeholder='All Statuses' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Statuses</SelectItem>
                      {filterOptions.statuses.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Type filter */}
              {filterOptions.types && (
                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-gray-700 flex items-center'>
                    <Icons name='IconCategory' className='mr-1 h-3 w-3' />
                    Type
                  </Label>
                  <Select
                    value={filters.type}
                    onValueChange={value => handleFilterChange('type', value)}
                  >
                    <SelectTrigger className='h-9'>
                      <SelectValue placeholder='All Types' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Types</SelectItem>
                      {filterOptions.types.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Category filter */}
              {filterOptions.categories && (
                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-gray-700 flex items-center'>
                    <Icons name='IconFolder' className='mr-1 h-3 w-3' />
                    Category
                  </Label>
                  <Select
                    value={filters.category}
                    onValueChange={value => handleFilterChange('category', value)}
                  >
                    <SelectTrigger className='h-9'>
                      <SelectValue placeholder='All Categories' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Categories</SelectItem>
                      {filterOptions.categories.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Date range filter */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700 flex items-center'>
                  <Icons name='IconCalendar' className='mr-1 h-3 w-3' />
                  Date Range
                </Label>
                <Select
                  value={filters.dateRange || ''}
                  onValueChange={value => handleFilterChange('dateRange', value || null)}
                >
                  <SelectTrigger className='h-9'>
                    <SelectValue placeholder='All Time' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Time</SelectItem>
                    <SelectItem value='today'>Today</SelectItem>
                    <SelectItem value='week'>This Week</SelectItem>
                    <SelectItem value='month'>This Month</SelectItem>
                    <SelectItem value='quarter'>This Quarter</SelectItem>
                    <SelectItem value='year'>This Year</SelectItem>
                    <SelectItem value='custom'>Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Authors filter */}
              {filterOptions.authors && (
                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-gray-700 flex items-center'>
                    <Icons name='IconUsers' className='mr-1 h-3 w-3' />
                    Authors
                  </Label>
                  <MultiSelect
                    options={filterOptions.authors}
                    value={filters.authors}
                    onChange={value => handleFilterChange('authors', value)}
                    placeholder='Select authors'
                    className='h-9'
                  />
                </div>
              )}

              {/* Tags filter */}
              {filterOptions.tags && (
                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-gray-700 flex items-center'>
                    <Icons name='IconTags' className='mr-1 h-3 w-3' />
                    Tags
                  </Label>
                  <MultiSelect
                    options={filterOptions.tags}
                    value={filters.tags}
                    onChange={value => handleFilterChange('tags', value)}
                    placeholder='Select tags'
                    className='h-9'
                  />
                </div>
              )}
            </div>

            {/* Custom date range picker */}
            {filters.dateRange === 'custom' && (
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Custom Date Range
                </Label>
                <DatePicker
                  mode='range'
                  onChange={range => handleFilterChange('customDateRange', range)}
                  className='w-full max-w-md'
                />
              </div>
            )}

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className='mt-6 pt-4 border-t border-gray-100'>
                <div className='flex items-center justify-between mb-3'>
                  <Label className='text-sm font-medium text-gray-700'>Active Filters</Label>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={clearFilters}
                    className='text-red-600 hover:text-red-700 h-auto p-1'
                  >
                    Clear all
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {query && (
                    <Badge variant='primary' className='px-3 py-1 flex items-center gap-1'>
                      Search: "{query}"
                      <button
                        onClick={() => handleQueryChange('')}
                        className='ml-1 hover:bg-primary-600 rounded-full p-0.5 transition-colors'
                      >
                        <Icons name='IconX' size={12} />
                      </button>
                    </Badge>
                  )}

                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    if (
                      (key === 'sortBy' && value === 'relevance') ||
                      (key === 'sortOrder' && value === 'desc')
                    )
                      return null;

                    const filterLabels = {
                      status: 'Status',
                      type: 'Type',
                      category: 'Category',
                      dateRange: 'Date',
                      authors: 'Authors',
                      tags: 'Tags',
                      sortBy: 'Sort',
                      sortOrder: 'Order'
                    };

                    const displayValue = Array.isArray(value)
                      ? `${value.length} selected`
                      : String(value);

                    return (
                      <Badge
                        key={key}
                        variant='outline'
                        className='px-3 py-1 flex items-center gap-1 bg-gray-50 hover:bg-gray-100 transition-colors'
                      >
                        {filterLabels[key]}: {displayValue}
                        <button
                          onClick={() => handleFilterChange(key, Array.isArray(value) ? [] : '')}
                          className='ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors'
                        >
                          <Icons name='IconX' size={12} />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
