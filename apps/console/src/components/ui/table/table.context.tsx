import React, { createContext, useContext, useEffect, useState } from 'react';

import { isArray, isUndefined } from '@ncobase/utils';
import { DateRange } from 'react-day-picker';

import type { BatchOperation } from './features/batch_operations';
import type { PaginationParams, PaginationResult } from './table';
import type { ITableHeaderCellProps } from './table.cell';
import type { IPaginationProps } from './table.pagination';

// Define proper filter config type
export interface FilterConfig {
  value?: string | string[];
  sortOrder?: 'asc' | 'desc' | null;
  selectedValues?: (string | number)[];
  dateRange?: DateRange;
  numberRange?: [number | null, number | null];
  advancedFilters?: Array<{
    column: string;
    operator: string;
    value: any;
    valueEnd?: any;
  }>;
  enabled?: boolean;
}

export interface ITableContext<T = any> {
  fetchData?: (_params: PaginationParams) => Promise<PaginationResult<T>>;
  loadData?: (_params: PaginationParams) => Promise<PaginationResult<T>>;
  internalData?: T[];
  setInternalData?: (_internalData: T[]) => void;
  originalData?: T[];
  setOriginalData?: (_data: T[]) => void;
  isBackendPagination?: boolean;
  header?: ITableHeaderCellProps[];
  columns?: ITableHeaderCellProps[];
  setColumns?: (_header: ITableHeaderCellProps[]) => void;
  toggleColumn?: (_key: string) => void;
  paginated?: boolean;
  pageSize?: number;
  paginationTexts?: IPaginationProps['texts'];
  pageSizes?: number[];
  selected?: boolean;
  visibleControl?: boolean;
  className?: string;
  selectedRows?: T[];
  emptyDataLabel?: string;
  noMoreDataLabel?: string;
  onSelectRow?: (_row: T) => void;
  onSelectAllRows?: (_rows: T[]) => void;
  actions?: Record<string, () => void>;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  isAllExpanded?: boolean;
  filter?: {
    enabled: boolean;
    config: Record<string, FilterConfig>;
  };
  setFilter?: (_filter: React.SetStateAction<ITableContext<T>['filter']>) => void;
  highlightedRow?: string | null;
  setHighlightedRow?: (_rowId: string | null) => void;
  highlightedColumn?: string | null;
  setHighlightedColumn?: (_columnKey: string | null) => void;
  columnWidths?: Record<string, number>;
  setColumnWidth?: (_columnKey: string, _width: number) => void;
  activeCell?: { rowId: string; colKey: string } | null;
  setActiveCell?: (_cell: { rowId: string; colKey: string } | null) => void;
  selectedCells?: Array<{ rowId: string; colKey: string }>;
  setSelectedCells?: (_cells: Array<{ rowId: string; colKey: string }>) => void;
  onCellValueChange?: (_key: string, _value: any, _recordId: string) => void;
  title?: string;
  // Feature flags
  enableEditing?: boolean;
  enableColumnResize?: boolean;
  enableRowHighlight?: boolean;
  enableColumnHighlight?: boolean;
  enableAdvancedFilters?: boolean;
  enableKeyboardNavigation?: boolean;
  showImportExport?: boolean;
  showGlobalSearch?: boolean;
  batchOperations?: BatchOperation[];
}

const defaultTableContext: ITableContext = {
  internalData: [],
  header: [],
  selectedRows: [],
  filter: {
    enabled: false,
    config: {}
  },
  // Default feature flags
  enableEditing: false,
  enableColumnResize: true,
  enableRowHighlight: true,
  enableColumnHighlight: true,
  enableAdvancedFilters: true,
  enableKeyboardNavigation: true,
  showImportExport: false,
  showGlobalSearch: false
};

const TableContext = createContext<ITableContext>(defaultTableContext);

export const TableProvider: React.FC<{ value: ITableContext; children: React.ReactNode }> = ({
  value,
  children
}) => {
  const [columns, setColumns] = useState<ITableHeaderCellProps[]>(value.header || []);
  const [selectedRows, setSelectedRows] = useState<any[]>(value.selectedRows || []);
  const [filter, setFilter] = useState<ITableContext['filter']>(
    value.filter || defaultTableContext.filter
  );
  const [isAllExpanded, setIsAllExpanded] = useState(value.isAllExpanded || false);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [highlightedColumn, setHighlightedColumn] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [activeCell, setActiveCell] = useState<{ rowId: string; colKey: string } | null>(null);
  const [selectedCells, setSelectedCells] = useState<Array<{ rowId: string; colKey: string }>>([]);

  // Feature flags with defaults if not provided
  const enableEditing = value.enableEditing ?? defaultTableContext.enableEditing;
  const enableColumnResize = value.enableColumnResize ?? defaultTableContext.enableColumnResize;
  const enableRowHighlight = value.enableRowHighlight ?? defaultTableContext.enableRowHighlight;
  const enableColumnHighlight =
    value.enableColumnHighlight ?? defaultTableContext.enableColumnHighlight;
  const enableAdvancedFilters =
    value.enableAdvancedFilters ?? defaultTableContext.enableAdvancedFilters;
  const enableKeyboardNavigation =
    value.enableKeyboardNavigation ?? defaultTableContext.enableKeyboardNavigation;

  useEffect(() => {
    if (value.header && value.header.length > 0) {
      setColumns(value.header);
    }
  }, [value.header]);

  const handleSetColumnWidth = (columnKey: string, width: number) => {
    if (!enableColumnResize) return;

    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: width
    }));
  };

  const handleSelectRow = (row: any) => {
    if (!row) return;

    const isSelected = selectedRows?.some(r => r.id === row.id);
    const updatedSelectedRows = isSelected
      ? selectedRows.filter(r => r.id !== row.id)
      : [...selectedRows, row];

    // Recursive selection for child rows
    const recursivelySelectChildren = (children: any[], selected: any[]): any[] => {
      if (!children || !Array.isArray(children)) return selected;

      return children.reduce((acc, child) => {
        if (!child) return acc;

        const isChildSelected = acc.some(r => r.id === child.id);
        if (isSelected && isChildSelected) {
          acc = acc.filter(r => r.id !== child.id);
        } else if (!isSelected && !isChildSelected) {
          acc.push(child);
        }
        if (child.children && child.children.length > 0) {
          acc = recursivelySelectChildren(child.children, acc);
        }
        return acc;
      }, selected);
    };

    let finalSelectedRows = updatedSelectedRows;
    if (row.children && row.children.length > 0) {
      finalSelectedRows = recursivelySelectChildren(row.children, updatedSelectedRows);
    }
    setSelectedRows(finalSelectedRows);
    if (value.onSelectRow) {
      value.onSelectRow(row);
    }
  };

  const handleSelectAllRows = (rows: any[] | string) => {
    const flattenRows = (data: any[]): any[] => {
      if (!data || !Array.isArray(data)) return [];

      return data.reduce((acc, item) => {
        if (!item) return acc;

        acc.push(item);
        if (item.children && item.children.length > 0) {
          acc = acc.concat(flattenRows(item.children));
        }
        return acc;
      }, []);
    };

    let finalSelectedRows: any[] = [];
    if (isArray(rows)) {
      if (rows.length === 0) {
        finalSelectedRows = [];
      } else {
        finalSelectedRows = flattenRows(rows as any[]);
      }
    } else if (value.internalData) {
      finalSelectedRows = value.internalData;
    }

    setSelectedRows(finalSelectedRows);

    if (value.onSelectAllRows && isArray(rows)) {
      value.onSelectAllRows(rows as any[]);
    }
  };

  const toggleColumn = (key: string) => {
    if (!key) return;

    const newHeader = columns.map(column =>
      // Set visible to false if undefined, otherwise toggle the current value
      column.dataIndex === key
        ? { ...column, visible: isUndefined(column.visible) ? false : !column.visible }
        : column
    );
    setColumns(newHeader);
  };

  const handleSetHighlightedRow = (rowId: string | null) => {
    if (!enableRowHighlight) return;
    setHighlightedRow(rowId);
  };

  const handleSetHighlightedColumn = (columnKey: string | null) => {
    if (!enableColumnHighlight) return;
    setHighlightedColumn(columnKey);
  };

  const handleSetActiveCell = (cell: { rowId: string; colKey: string } | null) => {
    if (!enableKeyboardNavigation) return;
    setActiveCell(cell);
  };

  const tableContextValue: ITableContext = {
    ...defaultTableContext,
    ...value,
    columns,
    setColumns,
    selectedRows,
    toggleColumn,
    filter,
    setFilter,
    onSelectRow: handleSelectRow,
    onSelectAllRows: handleSelectAllRows,
    onExpandAll: () => setIsAllExpanded(true),
    onCollapseAll: () => setIsAllExpanded(false),
    isAllExpanded,
    highlightedRow,
    setHighlightedRow: handleSetHighlightedRow,
    highlightedColumn,
    setHighlightedColumn: handleSetHighlightedColumn,
    columnWidths,
    setColumnWidth: handleSetColumnWidth,
    activeCell,
    setActiveCell: handleSetActiveCell,
    selectedCells,
    setSelectedCells: enableKeyboardNavigation ? setSelectedCells : undefined,
    // Feature flags
    enableEditing,
    enableColumnResize,
    enableRowHighlight,
    enableColumnHighlight,
    enableAdvancedFilters,
    enableKeyboardNavigation
  };

  return <TableContext.Provider value={tableContextValue}>{children}</TableContext.Provider>;
};

export const useTable = () => useContext(TableContext);
