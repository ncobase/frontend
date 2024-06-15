import React from 'react';

import { DropdownItem } from '../../dropdown';
import { Icons } from '../../icon';

import { DropdownWrapper } from './dropdown';

export const Actions = (props: any) => {
  const { actions = [], record } = props;
  return (
    <DropdownWrapper icon='IconDotsVertical'>
      {actions.map((action: any, index: number) => (
        <DropdownItem
          key={index}
          onClick={() => action?.onClick?.(record)}
          className='flex items-center space-x-2'
        >
          {action?.icon && <Icons name={action?.icon} className='-ml-0.5' />}
          <span>{action?.title || action?.name || action?.label}</span>
        </DropdownItem>
      ))}
    </DropdownWrapper>
  );
};
