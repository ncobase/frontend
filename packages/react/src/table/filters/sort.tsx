import React from 'react';

import { cn } from '@ncobase/utils';

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
  const { filter: filterState } = useTable();
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
        onClick={() => handleSortChange('asc')}
        className={cn(
          'flex items-center gap-x-1',
          filterState.config[code]?.sortOrder === 'asc' &&
            'bg-slate-50 text-slate-800 [&>svg]:stroke-slate-800'
        )}
      >
        <Icons name='IconSortAZ' className='stroke-slate-400' />
        升序
      </DropdownItem>
      <DropdownItem
        onClick={() => handleSortChange('desc')}
        className={cn(
          'flex items-center gap-x-1',
          filterState.config[code]?.sortOrder === 'desc' &&
            'bg-slate-50 text-slate-800 [&>svg]:stroke-slate-800'
        )}
      >
        <Icons name='IconSortZA' className='stroke-slate-400' />
        降序
      </DropdownItem>
      {filterState.config[code]?.sortOrder && (
        <DropdownItem onClick={() => handleSortChange(null)} className='flex items-center gap-x-1'>
          <Icons name='IconRestore' className='stroke-slate-400' />
          重置
        </DropdownItem>
      )}
    </DropdownWrapper>
  );
};
