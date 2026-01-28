import React from 'react';

import { isBoolean, isUndefined } from '@ncobase/utils';

import { useTable } from '../table.context';
import { isActionColumn } from '../table.row';

import { DropdownWrapper } from './dropdown';

import { DropdownCheckboxItem } from '@/components/ui/dropdown';

export const ToggleColumn: React.FC = () => {
  const { columns, toggleColumn } = useTable();
  return (
    <DropdownWrapper icon='IconColumns' alignOffset={-12}>
      {columns.map((column, index) =>
        isActionColumn(column.dataIndex) || isActionColumn(column.title) ? null : (
          <DropdownCheckboxItem
            key={index}
            checked={isUndefined(column.visible) || (isBoolean(column.visible) && column.visible)}
            onCheckedChange={() => toggleColumn(column.dataIndex || '')}
          >
            {typeof column.title === 'function' ? column.title({}) : column.title}
          </DropdownCheckboxItem>
        )
      )}
    </DropdownWrapper>
  );
};
