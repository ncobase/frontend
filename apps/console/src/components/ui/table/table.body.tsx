import React, { type ReactNode, useEffect, useState, useMemo } from 'react';

import { TableCell } from './table.cell';
import { useTable } from './table.context';
import { TableRow } from './table.row';

import { Checkbox } from '@/components/ui/forms';

export interface ITableBodyProps<T = any> {
  className?: string;
  data: T[];
  expandComponent?: React.ReactNode | ((_item: T) => React.ReactNode);
  maxTreeLevel?: number;
}

export const TableBody: React.FC<ITableBodyProps> = ({
  className,
  data,
  expandComponent,
  maxTreeLevel
}) => {
  const {
    selected,
    selectedRows = [],
    columns = [],
    onSelectRow = (_row: any) => {},
    isAllExpanded
  } = useTable();

  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set());

  const isSelected = (record: any) => selectedRows.includes(record);

  const toggleExpand = (itemId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const allExpandableIds = useMemo(() => {
    const ids = new Set<string>();
    const addIds = (items: any[], level: number = 0) => {
      if (!items || !Array.isArray(items)) return;

      items.forEach(item => {
        if (item && item.id) {
          ids.add(item.id);
        }
        if (item && item.children && (maxTreeLevel === -1 || level < maxTreeLevel)) {
          addIds(item.children, level + 1);
        }
      });
    };
    addIds(data);
    return ids;
  }, [data, maxTreeLevel]);

  useEffect(() => {
    setExpandedRows(isAllExpanded ? allExpandableIds : new Set());
  }, [isAllExpanded, allExpandableIds]);

  const renderRow = (item: any, level: number = 0): ReactNode => {
    if (!item) return null;

    const itemId = item.id || JSON.stringify(item);
    const hasExpandComponent = Boolean(expandComponent);
    const isExpanded = expandedRows.has(itemId);
    const needsTreeColumn =
      (maxTreeLevel !== undefined && maxTreeLevel !== 0) || hasExpandComponent;

    return (
      <TableRow
        key={itemId}
        level={level}
        item={item}
        expandComponent={expandComponent}
        isExpanded={isExpanded}
        onToggleExpand={() => toggleExpand(itemId)}
        renderNestedRows={(children, nextLevel) =>
          maxTreeLevel === -1 || nextLevel <= maxTreeLevel
            ? children?.map(child => renderRow(child, nextLevel))
            : null
        }
        maxTreeLevel={maxTreeLevel}
      >
        {selected && (
          <TableCell key={`${itemId}-selection`} title='selection' record={item}>
            <Checkbox
              className='rounded-xs'
              checked={isSelected(item)}
              onCheckedChange={() => onSelectRow(item)}
            />
          </TableCell>
        )}
        {needsTreeColumn && (
          <TableCell
            key={`${itemId}-tree`}
            title='tree'
            record={item}
            className='w-0! [&>div]:px-0! [&>div]:pl-2!'
          />
        )}
        {columns?.map((column, index) => (
          <TableCell
            key={`${itemId}-${column.dataIndex || (typeof column.title === 'function' ? column.title(item) : column.title) || 'column'}-${index}`}
            {...column}
            record={item}
          />
        ))}
      </TableRow>
    );
  };

  const renderRows = (items: any[], level: number = 0): ReactNode => {
    return items?.map(item => renderRow(item, level));
  };

  return <tbody className={className}>{renderRows(data)}</tbody>;
};
