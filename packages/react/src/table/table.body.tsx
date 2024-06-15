import React from 'react';

import { Checkbox } from '../forms';

import { TableCell } from './table.cell';
import { useTable } from './table.context';
import { TableRow } from './table.row';

interface ITableBodyProps<T = any> {
  className?: string;
  data: T[];
}

export const TableBody: React.FC<ITableBodyProps> = ({ className, data }) => {
  const { selected, selectedRows, columns = [], onSelectRow } = useTable();

  const isSelected = (record: any) => selectedRows.includes(record);

  return (
    <tbody className={className}>
      {data.map((item, index) => (
        <TableRow key={item.id || index} index={index}>
          {selected && (
            <TableCell key='selection' title='selection' record={item}>
              <Checkbox
                className='rounded-sm'
                checked={isSelected(item)}
                onCheckedChange={() => onSelectRow(item)}
              />
            </TableCell>
          )}
          {columns.map(column => (
            <TableCell key={column.code || column.title || 'default'} {...column} record={item} />
          ))}
        </TableRow>
      ))}
    </tbody>
  );
};
