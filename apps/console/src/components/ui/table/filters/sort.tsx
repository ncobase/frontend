import React from 'react';

import { cn, sortTree } from '@ncobase/utils';

import { DropdownWrapper } from '../components/dropdown';
import { useTable } from '../table.context';

import { DropdownItem } from '@/components/ui/dropdown';
import { Icons } from '@/components/ui/icon';

export interface SortFilterProps {
  dataIndex: string;
  filterValue: string;
  handleFilterChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (_order: 'asc' | 'desc' | null) => void;
}

export const SortFilter: React.FC<SortFilterProps> = ({ dataIndex, handleSortChange }) => {
  const { filter: filterState, internalData, setInternalData, originalData } = useTable();

  const handleSort = (order: 'asc' | 'desc' | null) => {
    // Call the parent handler
    handleSortChange(order);

    // Skip if there's no data to sort or no way to set it
    if (!internalData || !setInternalData) return;

    if (order) {
      // Create a safe version of internal data to sort
      const dataToSort = [...internalData];

      // Sort the data
      const sortedData = sortTree(dataToSort, dataIndex as keyof (typeof dataToSort)[0], order);

      setInternalData(sortedData);
    } else if (originalData) {
      // Reset to original data when clearing sort
      setInternalData([...originalData]);
    }
  };

  // Get current sort state from filter context
  const currentSortOrder = filterState?.config?.[dataIndex]?.sortOrder;

  return (
    <DropdownWrapper icon='IconChevronDown'>
      <DropdownItem
        onClick={() => handleSort('asc')}
        className={cn(
          'flex items-center gap-x-1 px-3.5',
          currentSortOrder === 'asc' &&
            'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 [&>svg]:stroke-slate-800 dark:[&>svg]:stroke-slate-200'
        )}
      >
        <Icons name='IconSortAZ' className='stroke-slate-400 dark:stroke-slate-500' />
      </DropdownItem>

      <DropdownItem
        onClick={() => handleSort('desc')}
        className={cn(
          'flex items-center gap-x-1 px-3.5',
          currentSortOrder === 'desc' &&
            'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 [&>svg]:stroke-slate-800 dark:[&>svg]:stroke-slate-200'
        )}
      >
        <Icons name='IconSortZA' className='stroke-slate-400 dark:stroke-slate-500' />
      </DropdownItem>

      {currentSortOrder && (
        <DropdownItem onClick={() => handleSort(null)} className='flex items-center gap-x-1 px-3.5'>
          <Icons name='IconRestore' className='stroke-slate-400 dark:stroke-slate-500' />
        </DropdownItem>
      )}
    </DropdownWrapper>
  );
};
