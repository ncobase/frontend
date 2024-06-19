import React, { useEffect, useState } from 'react';

import { cn, isBoolean, isNumber, isString } from '@ncobase/utils';

import { Icons } from '../icon';

import { Actions } from './components/actions';
import { ToggleColumn } from './components/toggle_column';
import { SortFilter } from './filters/sort';
import { useTable } from './table.context';
import { isActionColumn } from './table.row';

export interface ITableCellBaseProps<T = any> {
  /**
   * this column will be visible, default is true
   */
  visible?: boolean;
  /**
   * column title
   */
  title?: string;
  /**
   * column key
   */
  code?: string;
  /**
   * column value parser
   */
  parser?: T;
  /**
   * column icon
   */
  icon?: string;
  /**
   * column actions, last column will be actions
   */
  actions?: T[];
  className?: string;
  children?: React.ReactNode;
}

interface ITableCellProps extends ITableCellBaseProps {
  record?: any;
}

const TableCell: React.FC<ITableCellProps> = ({
  className,
  children,
  record,
  title,
  visible,
  code,
  parser,
  actions
}) => {
  if (isActionColumn(code) || isActionColumn(title)) {
    return <ActionCell record={record} actions={actions} />;
  }

  if (isBoolean(visible) && !visible) return null;

  const classes = cn(
    'h-11 min-w-8 after:absolute after:w-full border-b-[0.03125rem] border-gray-100 truncate',
    className
  );

  const tdAttributes = {
    title: isString(record?.[code]) || isNumber(record?.[code]) ? record[code] : undefined
  };

  return (
    <td className={classes} {...tdAttributes}>
      <div className='w-full h-full max-w-full px-3 py-2 flex items-center'>
        {children ? children : parser ? parser(record?.[code], record) : record?.[code]}
      </div>
    </td>
  );
};

const ActionCell: React.FC<ITableCellProps> = ({ actions = [], record }) => {
  return (
    <td className='h-11 min-w-8 after:absolute after:w-full border-b-[0.03125rem] border-gray-100 truncate'>
      <div className='w-full h-full inline-flex px-2 hover:[&>button]:bg-white [&>button]:p-2 [&>button]:rounded-full items-center justify-center'>
        <Actions record={record} actions={actions} />
      </div>
    </td>
  );
};

export interface ITableHeaderCellProps extends ITableCellBaseProps {
  filter?: 'sort' | 'toggle' | 'date' | 'date-range' | boolean;
}

const TableHeaderCell: React.FC<ITableHeaderCellProps> = ({
  visible,
  filter = 'sort', // TODO: implement filter
  title,
  code,
  icon,
  className,
  children
}) => {
  const { filter: filterState, setFilter, visibleControl } = useTable();
  const [filterValue, setFilterValue] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    if (filterState.config[code]?.value !== filterValue) {
      // @ts-expect-error
      setFilter(prevFilter => ({
        ...prevFilter,
        config: {
          ...prevFilter.config,
          [code]: {
            ...prevFilter.config[code],
            value: filterValue
          }
        }
      }));
    }
  }, [filterValue, code]);

  useEffect(() => {
    if (filterState.config[code]?.sortOrder !== sortOrder) {
      // @ts-expect-error
      setFilter(prevFilter => ({
        ...prevFilter,
        config: {
          ...prevFilter.config,
          [code]: {
            ...prevFilter.config[code],
            sortOrder
          }
        }
      }));
    }
  }, [sortOrder, code]);

  if (isBoolean(visible) && !visible) return null;

  const classes = 'bg-gray-50 text-start';

  if (isActionColumn(code) || isActionColumn(title)) {
    return (
      <th scope='col' className={cn(classes, className, 'text-center w-8')}>
        <div className='h-9 w-full flex items-center justify-between gap-x-1.5 px-3 py-2'>
          {visibleControl && <ToggleColumn />}
        </div>
      </th>
    );
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleSortChange = (order: 'asc' | 'desc' | null) => {
    setSortOrder(order);
  };

  return (
    <th scope='col' className={cn(classes, className)}>
      <div className='h-9 w-full flex cursor-pointer items-center justify-between gap-x-1.5 px-3 py-2'>
        <div className='flex items-center gap-x-1.5 break-keep'>
          {icon && <Icons name={icon} className='stroke-slate-400/65' size={14} />}
          {children ? children : title}
        </div>
        {filter && filter === 'sort' && (
          <SortFilter
            code={code}
            filterValue={filterValue}
            handleFilterChange={handleFilterChange}
            handleSortChange={handleSortChange}
          />
        )}
      </div>
    </th>
  );
};
export { TableCell, TableHeaderCell };
