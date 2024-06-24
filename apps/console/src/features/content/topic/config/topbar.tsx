import React from 'react';

import { Button, DropdownControl, LayoutControl, ScreenControl } from '@/components/elements';

export const topbarLeftSection = (handleView: Function) => [
  <div className='rounded-md flex items-center justify-between gap-x-1'>
    <Button icon='IconPlus' onClick={() => handleView(null, 'create')} tooltip='Create' />
  </div>
];

export const topbarRightSection = [<DropdownControl />, <LayoutControl />, <ScreenControl />];
