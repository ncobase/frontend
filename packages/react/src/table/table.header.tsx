import React from 'react';

import { cn } from '@ncobase/utils';

import { Checkbox } from '../forms';

import { TableHeaderCell } from './table.cell';
import { useTable } from './table.context';
import { TableRow } from './table.row';

interface ITableHeaderProps {
  className?: string;
}

export const TableHeader: React.FC<ITableHeaderProps> = ({ className }) => {
  const { selected, columns = [], onSelectAllRows, selectedRows, data } = useTable();
  const classes = cn(
    'sticky top-0 left-0 z-50 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]',
    className
  );

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      onSelectAllRows([]);
    } else {
      onSelectAllRows(columns.map((h: any) => h.code));
    }
  };

  const isAllSelected = selectedRows.length === data.length;

  return (
    <thead className={classes}>
      <TableRow>
        {selected && (
          <TableHeaderCell key='selection' title='selection' filter={false} className='!w-4'>
            <Checkbox
              className='rounded-sm'
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
          </TableHeaderCell>
        )}
        {columns.map((props, index) => (
          <TableHeaderCell key={index} {...props} />
        ))}
      </TableRow>
    </thead>
  );
};
