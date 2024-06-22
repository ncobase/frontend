import React from 'react';

import { cn } from '@ncobase/utils';

interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  const classes = cn(
    'absolute top-0 right-0 bottom-0 left-0 z-[10000] flex items-center justify-center',
    className
  );

  return (
    <div className={classes}>
      <div className='animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid border-transparent'></div>
    </div>
  );
};
