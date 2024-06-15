import React from 'react';

import { cn } from '@ncobase/utils';

export const isActionColumn = (key: string = ''): boolean => {
  const actionKeys = ['actions', 'action', '操作', 'operation', 'operations'];
  return actionKeys.includes(key.toLowerCase());
};

interface ITableRowProps {
  className?: string;
  children?: React.ReactNode;
  index?: number;
}

export const TableRow: React.FC<ITableRowProps> = ({ className, children, index = 0 }) => {
  if (!children) return null;
  const classes = cn(
    'odd:bg-white even:bg-gray-50 [&>th]:font-medium [&>th]:text-slate-600 text-slate-500 font-normal',
    '[&>th:first-child]:sticky [&>th:first-child]:left-0 [&>th:first-child]:z-10 [&>th:last-child]:sticky [&>th:last-child]:right-0 [&>th:last-child]:z-10',
    '[&>td:first-child]:sticky [&>td:first-child]:left-0 [&>td:first-child]:z-10 [&>td:last-child]:sticky [&>td:last-child]:right-0 [&>td:last-child]:z-10',
    index % 2 === 0
      ? '[&>td:first-child]:bg-white [&>td:last-child]:bg-white'
      : '[&>td:first-child]:bg-gray-50 [&>td:last-child]:bg-gray-50',
    className
  );

  return <tr className={classes}>{children}</tr>;
};
