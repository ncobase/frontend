import React, { CSSProperties, ReactNode } from 'react';

import { cn } from '@ncobase/utils';

interface ScrollViewProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const ScrollView: React.FC<ScrollViewProps> = ({ children, className, style }) => {
  return (
    <div className={cn('w-full h-full overflow-auto', className)} style={style}>
      {children}
    </div>
  );
};
