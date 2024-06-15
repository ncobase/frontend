import React from 'react';

import { Button, DropdownControl, LayoutControl, ScreenControl } from '@/components/elements';

export const topbarLeftSection = (handleDialogView: Function) => [
  <div className='rounded-md flex items-center justify-between gap-x-1'>
    <Button icon='IconPlus' onClick={() => handleDialogView(null, 'create')} tooltip='Create' />
  </div>
];

export const topbarRightSection = [<DropdownControl />, <LayoutControl />, <ScreenControl />];
