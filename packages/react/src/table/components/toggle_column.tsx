import React from 'react';

import { isBoolean, isUndefined } from '@ncobase/utils';

import { DropdownCheckboxItem } from '../../dropdown';
import { useTable } from '../table.context';
import { isActionColumn } from '../table.row';

import { DropdownWrapper } from './dropdown';

export const ToggleColumn: React.FC = () => {
  const { columns, toggleColumn } = useTable();
  return (
    <DropdownWrapper icon='IconColumns' alignOffset={-12}>
      {columns.map((column, index) =>
        isActionColumn(column.code) || isActionColumn(column.title) ? null : (
          <DropdownCheckboxItem
            key={index}
            className='py-2'
            checked={isUndefined(column.visible) || (isBoolean(column.visible) && column.visible)}
            onCheckedChange={() => toggleColumn(column.code || '')}
          >
            {column.title}
          </DropdownCheckboxItem>
        )
      )}
    </DropdownWrapper>
  );
};
