import React, { useMemo, useState } from 'react';

import { cn } from '@ncobase/utils';

import { EmptyData } from './components/empty';
import { TableBody } from './table.body';
import { ITableContext, TableProvider } from './table.context';
import { TableHeader } from './table.header';
import { Pagination } from './table.pagination';

interface ITableProps<T = any> {
  className?: string;
  data: T[];
}

export const Table: React.FC<ITableProps> = ({ className, data }) => {
  const classes = cn(
    'divide-y divide-slate-100 border-0 w-full table-auto inline-table',
    className
  );

  return (
    <table className={classes}>
      <TableHeader />
      <TableBody data={data} />
    </table>
  );
};

export interface TableViewProps extends ITableContext {}

export const TableView: React.FC<TableViewProps> = ({
  header,
  data,
  selected,
  paginated,
  pageSize,
  pageSizes,
  paginationTexts,
  emptyDataLabel,
  className,
  filter = { enabled: false, config: {} },
  ...rest
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const filteredData = useMemo(() => {
    if (!filter?.enabled || !filter?.config) {
      return data;
    }

    return data.filter(item =>
      Object.entries(filter.config).every(([key, value]) => {
        const itemValue = item[key];
        return itemValue && itemValue.toString().includes(value.toString());
      })
    );
  }, [data, filter]);

  const tableContextValue = useMemo(
    () => ({
      header,
      data: filteredData,
      selected,
      paginated,
      pageSize: currentPageSize,
      pageSizes,
      paginationTexts,
      emptyDataLabel,
      filter,
      ...rest
    }),
    [
      header,
      filteredData,
      selected,
      paginated,
      currentPageSize,
      pageSizes,
      paginationTexts,
      emptyDataLabel,
      filter,
      rest
    ]
  );

  const classes = cn(
    'flex flex-col justify-between h-full bg-white rounded-md overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]',
    className
  );

  if (!filteredData.length) return <EmptyData className={classes} label={emptyDataLabel} />;

  if (!paginated) {
    return (
      <TableProvider value={tableContextValue}>
        <div className={classes}>
          <div className='flex-0 inline-flex overflow-auto'>
            <Table data={filteredData} />
          </div>
        </div>
      </TableProvider>
    );
  }

  const totalItems = filteredData.length;
  const clampedPageSize = Math.min(currentPageSize, totalItems);
  const lastItemIndex = currentPage * clampedPageSize;
  const firstItemIndex = lastItemIndex - clampedPageSize;
  const currentItems = filteredData.slice(firstItemIndex, lastItemIndex);

  return (
    <TableProvider value={tableContextValue}>
      <div className={classes}>
        <Table data={currentItems} />
        {paginated && (
          <Pagination
            totalItems={filteredData.length}
            pageSize={currentPageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={size => {
              setCurrentPageSize(size);
              setCurrentPage(1);
            }}
            pageSizes={pageSizes}
            texts={paginationTexts}
          />
        )}
      </div>
    </TableProvider>
  );
};
