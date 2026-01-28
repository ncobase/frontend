import React, { useEffect, useMemo, useState, useCallback } from 'react';

import { cleanJsonValues, cn } from '@ncobase/utils';

import { EmptyData } from './components/empty';
import { BatchOperation, BatchOperations } from './features/batch_operations';
import { GlobalSearch } from './features/global_search';
import { ImportExportFeature } from './features/import_export';
import { KeyboardNavigation } from './features/keyboard_navigation';
import { type ITableBodyProps, TableBody } from './table.body';
import { type ITableContext, TableProvider, FilterConfig } from './table.context';
import { TableHeader } from './table.header';
import { Pagination } from './table.pagination';

export interface PaginationParams {
  children?: boolean;
  cursor?: string | null;
  limit?: number;
  direction?: 'forward' | 'backward';
  filter?: Record<string, any>;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  cursor?: string;
  next_cursor?: string;
  prev_cursor?: string;
  has_next?: boolean;
  has_prev?: boolean;
}

export interface TableViewProps<T = any> extends Partial<ITableContext<T>> {
  data?: T[];
  className?: string;
  loading?: boolean;
  filter?: {
    enabled: boolean;
    config: Record<string, FilterConfig>;
  };
  expandComponent?: ITableBodyProps<T>['expandComponent'];
  maxTreeLevel?: ITableBodyProps<T>['maxTreeLevel'];
  enableEditing?: boolean;
  enableColumnResize?: boolean;
  enableRowHighlight?: boolean;
  enableColumnHighlight?: boolean;
  enableAdvancedFilters?: boolean;
  enableKeyboardNavigation?: boolean;
  showImportExport?: boolean;
  showGlobalSearch?: boolean;
  batchOperations?: BatchOperation[];
  onCellValueChange?: (_key: string, _value: any, _recordId: string) => void;
  onSelectRow?: (_row: T) => void;
  onSelectAllRows?: (_rows: T[]) => void;
}

export const TableView = <T extends Record<string, any> = any>({
  header = [],
  data: initialData = [],
  fetchData,
  loading: initialLoading = false,
  selected = false,
  paginated = false,
  pageSize: initialPageSize = 20,
  pageSizes = [5, 10, 20, 50, 100],
  paginationTexts,
  emptyDataLabel = 'No Data',
  className,
  expandComponent,
  maxTreeLevel,
  isAllExpanded = false,
  filter = { enabled: false, config: {} },
  enableEditing = false,
  enableColumnResize = false,
  enableRowHighlight = true,
  enableColumnHighlight = true,
  enableAdvancedFilters = false,
  enableKeyboardNavigation = false,
  showImportExport = false,
  showGlobalSearch = false,
  batchOperations = [],
  onCellValueChange,
  onSelectRow,
  onSelectAllRows,
  ...rest
}: TableViewProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(initialPageSize);
  const [internalData, setInternalData] = useState<T[]>(initialData);
  const [originalData, setOriginalData] = useState<T[]>(initialData);
  const [total, setTotal] = useState(initialData?.length || 0);
  const [loading, setLoading] = useState(initialLoading);
  const [currentFilter, setCurrentFilter] = useState<Record<string, FilterConfig>>(filter.config);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const isBackendPagination = useMemo(
    () => !!fetchData && !(initialData && initialData.length > 0),
    [fetchData, initialData]
  );

  const loadData = useCallback(
    async (params: PaginationParams): Promise<PaginationResult<T> | undefined> => {
      if (!isBackendPagination || !fetchData) return undefined;

      setLoading(true);
      try {
        const result = await fetchData(cleanJsonValues(params) as PaginationParams);
        if (!result) return undefined;

        setInternalData(result.items || []);
        setOriginalData(result.items || []);
        setTotal(result.total || 0);
        setNextCursor(result.next_cursor || null);
        setPrevCursor(result.prev_cursor || null);
        setHasNextPage(result.has_next || false);
        setHasPrevPage(result.has_prev || false);
        return result;
      } catch (error) {
        console.error('Error fetching data:', error);
        return {
          items: [],
          total: 0,
          has_next: false,
          has_prev: false
        };
      } finally {
        setLoading(false);
      }
    },
    [isBackendPagination, fetchData]
  );

  useEffect(() => {
    if (isBackendPagination && internalData.length === 0) {
      loadData({ limit: currentPageSize });
    } else if (!isBackendPagination && initialData) {
      setInternalData(initialData);
      setOriginalData(initialData);
      setTotal(initialData.length);
    }
  }, [isBackendPagination, currentPageSize, initialData, loadData, internalData.length]);

  useEffect(() => {
    if (initialData) {
      setInternalData(initialData);
      setOriginalData(initialData);
      setTotal(initialData.length);
    }
  }, [initialData]);

  const handleCellValueChange = useCallback(
    (key: string, value: any, recordId: string) => {
      if (!key || !recordId) return;

      if (onCellValueChange) {
        onCellValueChange(key, value, recordId);
      }

      if (enableEditing) {
        setInternalData(prevData =>
          prevData.map(item => {
            if (item['id'] === recordId) {
              return {
                ...item,
                [key]: value
              };
            }
            return item;
          })
        );
      }
    },
    [enableEditing, onCellValueChange]
  );

  const columnsWithEditing = useMemo(() => {
    if (!enableEditing) return header;

    return header.map(column => ({
      ...column,
      editable: column.dataIndex !== 'action'
    }));
  }, [header, enableEditing]);

  const handleFilter = useCallback(
    (newFilter: React.SetStateAction<Record<string, FilterConfig>>) => {
      setCurrentFilter(prev => {
        const updatedFilter = typeof newFilter === 'function' ? newFilter(prev) : newFilter;
        setCurrentPage(1);
        if (isBackendPagination) {
          loadData({ limit: currentPageSize, filter: updatedFilter });
        }
        return updatedFilter;
      });
    },
    [isBackendPagination, currentPageSize, loadData]
  );

  const handlePageChange = useCallback(
    async (newPage: number) => {
      if (isBackendPagination) {
        const direction = newPage > currentPage ? 'forward' : 'backward';
        const cursor = direction === 'forward' ? nextCursor : prevCursor;
        await loadData({
          cursor,
          limit: currentPageSize,
          direction,
          filter: currentFilter
        });
      }
      setCurrentPage(newPage);
    },
    [
      isBackendPagination,
      currentPage,
      nextCursor,
      prevCursor,
      currentPageSize,
      loadData,
      currentFilter
    ]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      setCurrentPageSize(newSize);
      setCurrentPage(1);
      if (isBackendPagination) {
        loadData({ limit: newSize });
      }
    },
    [isBackendPagination, loadData]
  );

  // Handle row selection with external callback support
  const handleRowSelection = useCallback(
    (row: T) => {
      if (!row) return;

      // Default internal selection logic - always update internal state
      const recursivelySelectChildren = (children: T[], selected: T[], select: boolean): T[] => {
        if (!children || !Array.isArray(children)) return selected;

        return children.reduce((acc, child: any) => {
          if (!child || !child.id) return acc;

          const isChildSelected = acc.some((r: any) => r.id === child.id);
          if (select && !isChildSelected) {
            acc.push(child);
          } else if (!select && isChildSelected) {
            acc = acc.filter((r: any) => r.id !== child.id);
          }
          if (child.children && child.children.length > 0) {
            acc = recursivelySelectChildren(child.children, acc, select);
          }
          return acc;
        }, selected);
      };

      setSelectedRows(prev => {
        const isSelected = prev.some((selectedRow: any) => selectedRow.id === (row as any).id);
        const updatedSelectedRows = isSelected
          ? prev.filter((selectedRow: any) => selectedRow.id !== (row as any).id)
          : [...prev, row];

        if ((row as any).children && (row as any).children.length > 0) {
          return recursivelySelectChildren((row as any).children, updatedSelectedRows, !isSelected);
        }
        return updatedSelectedRows;
      });

      // Call external handler after internal state update
      if (onSelectRow) {
        onSelectRow(row);
      }
    },
    [onSelectRow]
  );

  // Handle select all with external callback support
  const handleSelectAllRows = useCallback(
    (rows: T[]) => {
      // Always update internal state first
      setSelectedRows(rows);

      // Call external handler after internal state update
      if (onSelectAllRows) {
        onSelectAllRows(rows);
      }
    },
    [onSelectAllRows]
  );

  const filteredData = useMemo(() => {
    if (!isBackendPagination && filter?.enabled && currentFilter) {
      return internalData.filter(item => {
        return Object.entries(currentFilter).every(([key, config]) => {
          if (!config.enabled) return true;

          if (config.advancedFilters && config.advancedFilters.length > 0) {
            return config.advancedFilters.every(condition => {
              const itemValue = item[key];
              if (itemValue === undefined || itemValue === null) return true;

              switch (condition.operator) {
                case 'contains':
                  return String(itemValue)
                    .toLowerCase()
                    .includes(String(condition.value).toLowerCase());
                case 'equals':
                  return String(itemValue) === String(condition.value);
                case 'startsWith':
                  return String(itemValue)
                    .toLowerCase()
                    .startsWith(String(condition.value).toLowerCase());
                case 'endsWith':
                  return String(itemValue)
                    .toLowerCase()
                    .endsWith(String(condition.value).toLowerCase());
                case 'greaterThan':
                  return Number(itemValue) > Number(condition.value);
                case 'lessThan':
                  return Number(itemValue) < Number(condition.value);
                case 'between':
                  return (
                    Number(itemValue) >= Number(condition.value) &&
                    Number(itemValue) <= Number(condition.valueEnd || condition.value)
                  );
                case 'in': {
                  const valueList = String(condition.value)
                    .split(',')
                    .map(v => v.trim());
                  return valueList.includes(String(itemValue));
                }
                default:
                  return true;
              }
            });
          }

          if (config.value) {
            const itemValue = item[key];
            if (itemValue === undefined || itemValue === null) return false;
            const filterValue = config.value;
            if (Array.isArray(filterValue)) {
              return filterValue.some(val =>
                String(itemValue).toLowerCase().includes(String(val).toLowerCase())
              );
            }
            return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
          }
          return true;
        });
      });
    }
    return internalData;
  }, [internalData, filter, currentFilter, isBackendPagination]);

  const paginatedData = useMemo(() => {
    if (!isBackendPagination && paginated) {
      const startIndex = (currentPage - 1) * currentPageSize;
      return filteredData.slice(startIndex, startIndex + currentPageSize);
    }
    return filteredData;
  }, [filteredData, currentPage, currentPageSize, paginated, isBackendPagination]);

  const effectiveMaxTreeLevel = maxTreeLevel !== undefined ? maxTreeLevel : undefined;
  const effectiveExpandComponent = expandComponent || undefined;
  const needsTreeColumn =
    effectiveMaxTreeLevel !== undefined || effectiveExpandComponent !== undefined;

  const tableContextValue = useMemo(
    () => ({
      header: columnsWithEditing,
      internalData: filteredData,
      setInternalData,
      originalData,
      setOriginalData,
      isBackendPagination,
      selected,
      paginated,
      isAllExpanded: needsTreeColumn ? isAllExpanded : undefined,
      pageSize: currentPageSize,
      pageSizes,
      paginationTexts,
      emptyDataLabel,
      filter: {
        enabled: filter.enabled,
        config: currentFilter
      },
      setFilter: handleFilter,
      selectedRows,
      onSelectRow: handleRowSelection,
      onSelectAllRows: handleSelectAllRows,
      enableColumnResize,
      enableRowHighlight,
      enableColumnHighlight,
      enableAdvancedFilters,
      enableKeyboardNavigation,
      maxTreeLevel: effectiveMaxTreeLevel,
      expandComponent: effectiveExpandComponent,
      onCellValueChange: handleCellValueChange,
      ...rest
    }),
    [
      columnsWithEditing,
      filteredData,
      originalData,
      selected,
      paginated,
      isAllExpanded,
      currentPageSize,
      pageSizes,
      paginationTexts,
      emptyDataLabel,
      filter.enabled,
      currentFilter,
      handleFilter,
      selectedRows,
      handleRowSelection,
      handleSelectAllRows,
      rest,
      setInternalData,
      setOriginalData,
      isBackendPagination,
      effectiveMaxTreeLevel,
      effectiveExpandComponent,
      needsTreeColumn,
      enableColumnResize,
      enableRowHighlight,
      enableColumnHighlight,
      enableAdvancedFilters,
      enableKeyboardNavigation,
      handleCellValueChange
    ]
  );

  const classes = cn(
    'flex flex-col bg-white dark:bg-gray-800 rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]',
    className
  );
  const containerClasses = cn(classes, 'h-full max-h-full flex flex-col');

  if (loading && (!paginatedData || paginatedData.length === 0)) {
    return <EmptyData loading={loading} className={containerClasses} />;
  } else if (!paginatedData || paginatedData.length === 0) {
    return <EmptyData className={containerClasses} label={emptyDataLabel} />;
  }

  return (
    <TableProvider value={tableContextValue as ITableContext}>
      <div className={containerClasses}>
        {/* Toolbar */}
        {(showImportExport || showGlobalSearch || batchOperations.length > 0) && (
          <div className='flex-none border-b border-gray-100 dark:border-gray-800'>
            <div className='flex items-center justify-between p-3'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                  {rest.title || ''}
                </h3>
              </div>
              <div className='flex items-center gap-3'>
                {showGlobalSearch && <GlobalSearch />}
                {showImportExport && <ImportExportFeature />}
              </div>
            </div>
            {batchOperations.length > 0 && <BatchOperations operations={batchOperations} />}
          </div>
        )}

        {/* Single table with sticky header */}
        <div className='flex-1 overflow-auto'>
          <table className='w-full table-auto dark:bg-gray-900'>
            <TableHeader
              expandComponent={effectiveExpandComponent}
              maxTreeLevel={effectiveMaxTreeLevel}
            />
            <TableBody
              data={paginatedData}
              expandComponent={effectiveExpandComponent}
              maxTreeLevel={effectiveMaxTreeLevel}
            />
          </table>
        </div>

        {/* Pagination */}
        {paginated && (
          <Pagination
            totalItems={isBackendPagination ? total : filteredData.length}
            pageSize={currentPageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizes={pageSizes}
            texts={paginationTexts}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
          />
        )}
        {enableKeyboardNavigation && <KeyboardNavigation />}
      </div>
    </TableProvider>
  );
};
