import React from 'react';

import { cn } from '@ncobase/utils';

import { Label } from '../../forms';
import { Icons } from '../../icon';

export const EmptyData = (props: any) => {
  const { label = 'No data', className } = props;
  const classes = cn(className, 'items-center justify-center flex flex-col');
  return (
    <div className={classes}>
      <Icons name='IconInbox' size={64} stroke={0.5} className='stroke-slate-400' />
      <Label className='text-slate-500'>{label}</Label>
    </div>
  );
};
