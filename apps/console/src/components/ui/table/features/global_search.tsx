import React, { useState, useEffect } from 'react';

import { useTable } from '../table.context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/forms';
import { Icons } from '@/components/ui/icon';

export const GlobalSearch: React.FC = () => {
  const { setInternalData, originalData } = useTable();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!searchTerm.trim()) {
      // If search is cleared, restore original data
      setInternalData(originalData);
      return;
    }

    // Perform search across all searchable fields
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filteredData = originalData.filter(item => {
      return Object.entries(item).some(([_key, value]) => {
        // Skip non-searchable values (like objects, arrays)
        if (
          value === null ||
          value === undefined ||
          typeof value === 'object' ||
          typeof value === 'function'
        ) {
          return false;
        }

        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });

    setInternalData(filteredData);
  }, [searchTerm, originalData, setInternalData]);

  return (
    <div className='flex items-center relative max-w-md'>
      <Icons name='IconSearch' className='absolute left-3 text-gray-400' size={16} />
      <Input
        type='text'
        placeholder='Search in table...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className='pl-9 pr-3 py-1.5'
      />
      {searchTerm && (
        <Button
          variant='unstyle'
          className='absolute right-0 text-gray-400 hover:text-gray-600'
          onClick={() => setSearchTerm('')}
        >
          <Icons name='IconX' size={14} />
        </Button>
      )}
    </div>
  );
};
