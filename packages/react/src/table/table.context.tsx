import React, { createContext, useContext, useEffect, useState } from 'react';

import { isArray, isUndefined } from '@ncobase/utils';

import { ITableHeaderCellProps } from './table.cell';
import { IPaginationProps } from './table.pagination';

export interface ITableContext<T = any> {
  data: T[];
  setData?: (data: T[]) => void;
  originalData?: T[];
  setOriginalData?: (data: T[]) => void;
  header?: ITableHeaderCellProps[];
  columns?: ITableHeaderCellProps[];
  setColumns?: (header: ITableHeaderCellProps[]) => void;
  toggleColumn?: (key: string) => void;
  paginated?: boolean;
  pageSize?: IPaginationProps['pageSize'];
  paginationTexts?: IPaginationProps['texts'];
  pageSizes?: IPaginationProps['pageSizes'];
  selected?: boolean;
  visibleControl?: boolean;
  className?: string;
  selectedRows?: T[];
  emptyDataLabel?: string;
  onSelectRow?: (row: T) => void;
  onSelectAllRows?: (rows: string | T[]) => void;
  actions?: {
    [key: string]: () => void;
  };
  filter?: {
    enabled: boolean;
    config: Record<string, { value?: T; sortOrder?: 'asc' | 'desc' | null }>;
  };
  setFilter?: (filter: ITableContext<T>['filter']) => void;
}

const defaultTableContext: ITableContext = {
  data: [],
  header: [],
  selectedRows: [],
  filter: {
    enabled: false,
    config: {}
  }
};

const TableContext = createContext<ITableContext>(defaultTableContext);

export const TableProvider: React.FC<{ value: ITableContext; children: React.ReactNode }> = ({
  value,
  children
}) => {
  const [columns, setColumns] = useState<ITableHeaderCellProps[]>(defaultTableContext.header);
  const [selectedRows, setSelectedRows] = useState<any[]>(defaultTableContext.selectedRows);
  const [filter, setFilter] = useState<ITableContext['filter']>(defaultTableContext.filter);

  useEffect(() => {
    if (value.header && value.header.length > 0) {
      setColumns(value.header);
    }
  }, [value.header]);

  const tableContextValue: ITableContext = {
    ...defaultTableContext,
    ...value,
    columns,
    setColumns,
    selectedRows,
    toggleColumn: (key: string) => {
      const newHeader = columns.map(column =>
        // column visible is a undefined value, set it to false
        // reason: if not set, visible will be undefined, and the default value will be true
        column.code === key
          ? { ...column, visible: isUndefined(column.visible) ? false : !column.visible }
          : column
      );
      setColumns(newHeader || []);
    },
    filter,
    setFilter,
    onSelectRow: (row: any) => {
      if (selectedRows?.includes(row)) {
        setSelectedRows(selectedRows.filter(r => r !== row));
      } else {
        setSelectedRows([...selectedRows, row]);
      }
    },
    onSelectAllRows: (rows: string | any[]) => {
      if (isArray(rows) && rows.length === 0) {
        setSelectedRows([]);
      } else {
        setSelectedRows(value.data);
      }
    }
  };

  return <TableContext.Provider value={tableContextValue}>{children}</TableContext.Provider>;
};

export const useTable = () => useContext(TableContext);
