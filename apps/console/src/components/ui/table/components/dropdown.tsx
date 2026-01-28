import React from 'react';

import { Button } from '@/components/ui/button';
import { Dropdown, DropdownContent, DropdownTrigger } from '@/components/ui/dropdown';
import { Icons } from '@/components/ui/icon';

export const DropdownWrapper: React.FC<{
  icon: string;
  align?: 'end' | 'start' | 'center';
  alignOffset?: number;
  children: React.ReactNode;
}> = ({ icon, children, align = 'end', alignOffset = -10 }) => {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant='unstyle' size='ratio' className='p-1 outline-hidden'>
          <Icons name={icon} />
        </Button>
      </DropdownTrigger>
      <DropdownContent align={align} alignOffset={alignOffset}>
        {children}
      </DropdownContent>
    </Dropdown>
  );
};
