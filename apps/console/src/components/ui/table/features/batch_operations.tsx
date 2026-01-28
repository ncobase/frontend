import React from 'react';

import { useTable } from '../table.context';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';

export interface BatchOperation {
  label: string;
  icon?: string;
  // eslint-disable-next-line no-unused-vars
  action: (selectedRows: any[]) => void;
  // eslint-disable-next-line no-unused-vars
  isDisabled?: (selectedRows: any[]) => boolean;
}

export const BatchOperations: React.FC<{
  operations: BatchOperation[];
}> = ({ operations }) => {
  const { selectedRows } = useTable();
  const hasSelection = selectedRows && selectedRows.length > 0;

  if (!hasSelection) return null;

  return (
    <div className='flex items-center gap-2 p-2 bg-slate-50 border-b border-slate-200'>
      <span className='text-slate-500'>
        {selectedRows.length} {selectedRows.length === 1 ? 'row' : 'rows'} selected
      </span>

      <div className='h-4 border-r border-slate-300' />

      <div className='flex items-center gap-2'>
        {operations.map((operation, index) => {
          const isDisabled = operation.isDisabled ? operation.isDisabled(selectedRows) : false;

          return (
            <Button
              key={index}
              variant='unstyle'
              size='sm'
              disabled={isDisabled}
              onClick={() => operation.action(selectedRows)}
              className='flex items-center gap-1'
            >
              {operation.icon && <Icons name={operation.icon} size={16} />}
              {operation.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
