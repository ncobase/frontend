import React from 'react';

import { cn, sortTree } from '@ncobase/utils';

import { DropdownItem } from '../../dropdown';
import { Input } from '../../forms';
import { Icons } from '../../icon';
import { DropdownWrapper } from '../components/dropdown';
import { useTable } from '../table.context';

export const SortFilter: React.FC<{
  code: string;
  filterValue: string;
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (order: 'asc' | 'desc' | null) => void;
}> = ({ code, filterValue, handleFilterChange, handleSortChange }) => {
  const { filter: filterState, data, setData, originalData } = useTable();

  const handleSort = (order: 'asc' | 'desc' | null) => {
    handleSortChange(order);
    if (order && setData) {
      const sortedData = sortTree(data, code as keyof (typeof data)[0], order);
      setData(sortedData);
    } else {
      setData(originalData);
    }
  };

  return (
    <DropdownWrapper icon='IconChevronDown'>
      <DropdownItem onSelect={event => event.preventDefault()} className='hover:bg-white hidden'>
        <Input
          type='text'
          value={filterValue}
          onChange={handleFilterChange}
          placeholder='Search...'
          className='max-w-28 py-1.5'
        />
      </DropdownItem>
      <DropdownItem
        onClick={() => handleSort('asc')}
        className={cn(
          'flex items-center gap-x-1 px-3.5',
          filterState?.config[code]?.sortOrder === 'asc' &&
            'bg-slate-50 text-slate-800 [&>svg]:stroke-slate-800'
        )}
      >
        <Icons name='IconSortAZ' className='stroke-slate-400' />
      </DropdownItem>
      <DropdownItem
        onClick={() => handleSort('desc')}
        className={cn(
          'flex items-center gap-x-1 px-3.5',
          filterState?.config[code]?.sortOrder === 'desc' &&
            'bg-slate-50 text-slate-800 [&>svg]:stroke-slate-800'
        )}
      >
        <Icons name='IconSortZA' className='stroke-slate-400' />
      </DropdownItem>
      {filterState?.config[code]?.sortOrder && (
        <DropdownItem onClick={() => handleSort(null)} className='flex items-center gap-x-1 px-3.5'>
          <Icons name='IconRestore' className='stroke-slate-400' />
        </DropdownItem>
      )}
    </DropdownWrapper>
  );
};
